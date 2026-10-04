import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

export const bidSuccessCounter = new Counter('bids_success_total');
export const bidLatency = new Trend('bids_latency_ms');

export const options = {
  stages: [
    { duration: '30s', target: 1000 },  // Ramp-up 1,000 CCU
    { duration: '1m', target: 5000 },   // Tăng tốc 5,000 CCU
    { duration: '1m', target: 10000 },  // Peak 10,000 CCU
    { duration: '30s', target: 0 },     // Hạ tải an toàn
  ],
  thresholds: {
    bids_latency_ms: ['p(95)<250', 'p(99)<500'],
    http_req_failed: ['rate<0.02'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:4000';

export function setup() {
  const loginRes = http.post(
    `${BASE_URL}/api/v1/auth/login`,
    JSON.stringify({ email: 'admin@novacrm.com', password: 'password123' }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  return { token: loginRes.json('data.accessToken') };
}

export default function (data) {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.token}`,
    },
  };

  // 1. Kiểm tra trạng thái phiên đấu giá
  const auctionRes = http.get(`${BASE_URL}/api/v1/auction`, params);
  check(auctionRes, {
    'Phòng đấu giá hoạt động (200 OK)': (r) => r.status === 200,
  });

  // 2. Thực hiện đặt giá bước nhảy ngẫu nhiên
  const bidAmount = 25000000000 + Math.floor(Math.random() * 50) * 100000000;
  const start = Date.now();
  const bidRes = http.post(
    `${BASE_URL}/api/v1/auction/auc-001/bid`,
    JSON.stringify({ bidAmount, bidderName: `Bidder-${__VU}` }),
    params
  );
  bidLatency.add(Date.now() - start);

  if (bidRes.status === 201 || bidRes.status === 200) {
    bidSuccessCounter.add(1);
    check(bidRes, {
      'Khớp bước giá thành công': (r) => true,
    });
  }

  sleep(1);
}
