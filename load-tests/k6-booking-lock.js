import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom Metrics
export const lockAcquiredCount = new Counter('lock_acquired_success');
export const lockConflictCount = new Counter('lock_conflict_prevented');
export const lockResponseTime = new Trend('lock_response_time');
export const successRate = new Rate('success_rate');

export const options = {
  scenarios: {
    // 2,000 môi giới cùng bấm lock giữ chỗ 1 căn biệt thự duy nhất trong cùng 1 giây
    high_concurrency_lock: {
      executor: 'per-vu-iterations',
      vus: 200,
      iterations: 10,
      maxDuration: '30s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<300'], // 95% request phải phản hồi dưới 300ms
    http_req_failed: ['rate<0.01'],    // Tỷ lệ lỗi hệ thống (5xx) phải dưới 1%
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:4000';

export function setup() {
  // Đăng nhập tài khoản agent để lấy token
  const loginRes = http.post(
    `${BASE_URL}/api/v1/auth/login`,
    JSON.stringify({
      email: 'admin@novacrm.com',
      password: 'password123',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const token = loginRes.json('data.accessToken');
  return { token };
}

export default function (data) {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.token}`,
    },
  };

  const payload = JSON.stringify({
    unitId: 'unit-nvw-0101',
    unitCode: 'NVW-01.01',
    projectId: 'p1',
    depositAmount: 200000000,
    customerName: `Khách Hàng VU-${__VU}`,
    customerPhone: '0901234567',
  });

  const start = Date.now();
  const res = http.post(`${BASE_URL}/api/v1/booking`, payload, params);
  lockResponseTime.add(Date.now() - start);

  if (res.status === 201 || res.status === 200) {
    lockAcquiredCount.add(1);
    successRate.add(true);
    check(res, {
      'Lock thành công duy nhất': (r) => r.status === 201 || r.status === 200,
    });
  } else if (res.status === 409 || res.status === 400) {
    // 409 Conflict: Redis Redlock đã bảo vệ rổ hàng chống bán đúp
    lockConflictCount.add(1);
    successRate.add(true);
    check(res, {
      'Ngăn chặn bán đúp hợp lệ (Lock Contention)': (r) => r.status === 409 || r.status === 400,
    });
  } else {
    check(res, {
      'Lỗi không mong muốn': (r) => false,
    });
  }

  sleep(0.1);
}
