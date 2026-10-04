import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

export const inventoryReadLatency = new Trend('inventory_read_latency_ms');

export const options = {
  stages: [
    { duration: '15s', target: 500 },
    { duration: '30s', target: 2000 },
    { duration: '1m', target: 5000 }, // 5,000 req/s reading inventory
    { duration: '15s', target: 0 },
  ],
  thresholds: {
    inventory_read_latency_ms: ['p(95)<50', 'p(99)<100'],
    http_req_failed: ['rate<0.005'],
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
      Authorization: `Bearer ${data.token}`,
    },
  };

  const start = Date.now();
  const res = http.get(`${BASE_URL}/api/v1/inventory`, params);
  inventoryReadLatency.add(Date.now() - start);

  check(res, {
    'Truy vấn rổ hàng 200 OK': (r) => r.status === 200,
    'Phản hồi nhanh dưới 50ms': () => Date.now() - start < 50,
  });

  sleep(0.05);
}
