# 🚀 HƯỚNG DẪN KIỂM THỬ CHỊU TẢI (K6 STRESS & LOAD TESTING RUNBOOK)

Thư mục này chứa các kịch bản kiểm thử tải cao (Stress Testing & Concurrency Lock Contention) được xây dựng bằng công cụ tiêu chuẩn ngành **k6**.

---

## 📋 Danh Mục Kịch Bản Kiểm Thử

| Tệp tin | Mục tiêu tải | Nghiệp vụ kiểm thử | Chỉ số cam kết (SLA) |
| :--- | :---: | :--- | :---: |
| `k6-booking-lock.js` | **2,000 CCU** | Tranh chấp lock căn hộ đồng thời (`Redis Redlock`) | **Chống bán đúp 100%**, p95 < 300ms |
| `k6-auction-stress.js` | **10,000 CCU** | Phòng đấu giá trực tiếp Live Bidding & bước giá | **p95 < 250ms**, lỗi < 2% |
| `k6-inventory-matrix.js` | **5,000 req/s** | Đọc dữ liệu sơ đồ phân lô rổ hàng có Redis Cache | **p95 < 50ms**, lỗi < 0.5% |

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy k6

### Cách 1: Sử Dụng Docker (Không cần cài k6 vào máy)
```bash
# 1. Chạy bài kiểm thử tranh chấp lock căn hộ
docker run --rm -i --net="host" grafana/k6 run - < load-tests/k6-booking-lock.js

# 2. Chạy bài kiểm thử phòng đấu giá 10,000 CCU
docker run --rm -i --net="host" grafana/k6 run - < load-tests/k6-auction-stress.js

# 3. Chạy bài kiểm thử đọc rổ hàng phân lô cao tải
docker run --rm -i --net="host" grafana/k6 run - < load-tests/k6-inventory-matrix.js
```

### Cách 2: Chạy trực tiếp (Nếu đã cài k6 trên máy)
```powershell
# Cài đặt qua winget hoặc choco (Windows)
winget install k6 --source winget

# Thực thi kiểm thử
k6 run load-tests/k6-booking-lock.js
```
