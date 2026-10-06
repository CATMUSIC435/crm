const http = require('http');

async function testBackend() {
  console.log('--- 1. Đăng nhập lấy Bearer Token ---');
  const loginPayload = JSON.stringify({ email: 'admin@novacrm.com', password: 'password123' });
  const loginRes = await makeRequest({
    hostname: 'localhost',
    port: 4000,
    path: '/api/v1/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginPayload),
    },
  }, loginPayload);

  console.log('Login Status:', loginRes.statusCode);
  const loginData = JSON.parse(loginRes.body);
  const token = loginData.data?.accessToken || loginData.accessToken;
  console.log('Token acquired:', token ? token.substring(0, 20) + '...' : 'NONE');

  console.log('\n--- 2. Gọi GET /api/v1/customers/c1 ban đầu ---');
  const customerRes = await makeRequest({
    hostname: 'localhost',
    port: 4000,
    path: '/api/v1/customers/c1',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  console.log('GET Status:', customerRes.statusCode);
  const initialCustomer = JSON.parse(customerRes.body).data || JSON.parse(customerRes.body);
  console.log('Tên ban đầu:', initialCustomer.fullName, '| Email:', initialCustomer.email);

  console.log('\n--- 3. Gọi PATCH /api/v1/customers/c1 cập nhật vào PostgreSQL ---');
  const patchPayload = JSON.stringify({
    fullName: 'Nguyễn Văn Tuấn (Updated DB)',
    email: 'tuan.nguyen@investor.vn',
    rank: 'DIAMOND_VVIP',
    status: 'Đã giao dịch'
  });
  const patchRes = await makeRequest({
    hostname: 'localhost',
    port: 4000,
    path: '/api/v1/customers/c1',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(patchPayload),
      'Authorization': `Bearer ${token}`
    },
  }, patchPayload);
  console.log('PATCH Status:', patchRes.statusCode);
  console.log('PATCH Response:', patchRes.body);

  console.log('\n--- 4. Gọi lại GET /api/v1/customers/c1 để kiểm tra lưu trữ thực tế ---');
  const verifyRes = await makeRequest({
    hostname: 'localhost',
    port: 4000,
    path: '/api/v1/customers/c1',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const verifiedCustomer = JSON.parse(verifyRes.body).data || JSON.parse(verifyRes.body);
  console.log('Tên sau cập nhật:', verifiedCustomer.fullName, '| DB Đồng bộ:', verifiedCustomer.fullName === 'Nguyễn Văn Tuấn (Updated DB)');

  // Khôi phục lại tên ban đầu
  console.log('\n--- 5. Khôi phục lại tên chuẩn ---');
  const restorePayload = JSON.stringify({ fullName: 'Nguyễn Văn Tuấn' });
  await makeRequest({
    hostname: 'localhost',
    port: 4000,
    path: '/api/v1/customers/c1',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(restorePayload),
      'Authorization': `Bearer ${token}`
    },
  }, restorePayload);
  console.log('Đã khôi phục hoàn tất!');
}

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

testBackend().catch(console.error);
