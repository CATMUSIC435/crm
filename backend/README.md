# 🏢 NOVA CRM - Backend NestJS (Hexagonal Architecture)
### Enterprise PropTech & Real Estate Platform Backend Engine

[![NestJS 10](https://img.shields.io/badge/NestJS-10.4-e0234e?style=for-the-badge&logo=nestjs)](https://nestjs.org/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.2-2d3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16%20PostGIS-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Redis 7](https://img.shields.io/badge/Redis-7.0%20Redlock-dc382d?style=for-the-badge&logo=redis)](https://redis.io/)
[![Hexagonal Architecture](https://img.shields.io/badge/Architecture-Hexagonal%20Ports%20%26%20Adapters-6366f1?style=for-the-badge)](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software))

---

## 🌟 Giới Thiệu Tổng Quan

Hệ thống Backend **NOVA CRM** được thiết kế chuyên biệt theo **Kiến trúc Lục giác (Hexagonal Architecture / Ports & Adapters Pattern)**, phục vụ 36 phân hệ nghiệp vụ bất động sản của Frontend Next.js 16.

### 💎 Điểm Nhấn Kiến Trúc:
1. **Lõi Nghiệp Vụ Thuần Túy (Zero-Framework Domain):** Tầng `domain/` hoàn toàn độc lập với NestJS, Prisma hay Express. Mọi logic thẩm định booking, đếm ngược SLA 15 phút, tính toán bảng khấu hao vay 360 tháng và chia hoa hồng CTV đều là Pure TypeScript.
2. **Ports & Adapters Chuẩn Mực:**
   * **Inbound Ports (Use Cases):** Định nghĩa chức năng mà UI hay Webhook có thể kích hoạt (ví dụ: `CreateBookingUseCase`, `LockUnitPort`).
   * **Outbound Ports (Driven SPIs):** Các interface trừu tượng cho tầng cơ sở dữ liệu (`BookingRepositoryPort`), Khóa phân tán (`DistributedLockPort`), Cổng thanh toán VietQR (`PaymentGatewayPort`).
   * **Driving Adapters:** REST Controllers (Swagger OpenAPI), WebSocket Gateway (Live Auction thời gian thực).
   * **Driven Adapters:** Prisma PostgreSQL Adapter, Redis Redlock Adapter (chống tranh chấp lock căn ở mức microsecond).
3. **Chống Tranh Chấp Căn Hộ (Concurrency Control):** Tích hợp Redis Distributed Lock (`Redlock`) với TTL 5 giây khi nhận yêu cầu giữ chỗ, ngăn ngừa 100% tình trạng hai môi giới cùng lock 1 căn hộ tại cùng một giây.
4. **Đấu Giá BĐS Trực Tuyến Thời Gian Thực:** WebSocket Gateway `/ws/auction` phát âm thanh búa gõ và cập nhật bảng giá Live Bidding tức thời.
5. **Gạch Nợ Tự Động VietQR & Đếm Ngược SLA 15 Phút:** Tích hợp BullMQ background queue và đối soát biến động số dư ngân hàng qua Webhook.

---

## 📚 Tài Liệu Kỹ Thuật Theo Từng Giai Đoạn (Technical Docs)
Chi tiết kiến trúc, thiết kế CSDL, sơ đồ luồng và hướng dẫn chi tiết từng giai đoạn được lưu trữ riêng tại:
* 📘 [Tài Liệu Giai Đoạn 1: Nền Tảng Hexagonal & Core DB](./docs/PHASE_1_FOUNDATION_ARCH.md)
* ⚡ [Tài Liệu Giai Đoạn 2: Chu Trình Giao Dịch, Redlock, SLA 15p & VietQR IPN](./docs/PHASE_2_TRANSACTION_REALTIME.md)
* 📑 [Thư Mục Tổng Hợp Toàn Bộ Tài Liệu Kỹ Thuật](./docs/README.md)

---

## 📂 Cấu Trúc Thư Mục Hexagonal

```text
backend/
├── prisma/
│   ├── schema.prisma                  # Schema PostgreSQL toàn vẹn 8 phân hệ cốt lõi
│   └── seed.ts                        # Script nạp dữ liệu mẫu thực tế
│
├── src/
│   ├── app.module.ts                  # Root Module
│   ├── main.ts                        # Bootstrap ứng dụng, Swagger, Helmet, CORS
│   │
│   ├── common/                        # Thành phần dùng chung toàn hệ thống
│   │   ├── decorators/                # @CurrentUser, @Roles
│   │   ├── filters/                   # AllExceptionsFilter
│   │   ├── guards/                    # JwtAuthGuard, RolesGuard
│   │   └── interceptors/              # TransformResponseInterceptor
│   │
│   ├── config/                        # Cấu hình Redis & Distributed Lock
│   │   ├── redis.service.ts
│   │   └── redis.module.ts
│   │
│   ├── database/                      # Prisma Global Database Module
│   │   ├── prisma.service.ts
│   │   └── database.module.ts
│   │
│   └── modules/                       # Các Domain Hexagonal độc lập
│       ├── auth/                      # Xác thực JWT, 2FA, Hồ sơ cá nhân
│       ├── projects/                  # Quản lý đại dự án, USPs, Tọa độ GIS
│       ├── inventory/                 # Rổ hàng sơ đồ phân lô, Khóa căn hàng loạt
│       ├── booking/                   # Quy trình giữ chỗ 5 bước, Đếm ngược SLA 15p
│       ├── customers/                 # Hồ sơ khách hàng 360, Phân tầng VIP
│       ├── contracts/                 # Quản trị HĐMB, Ký số e-Sign SHA-256
│       └── auction/                   # Phòng Live Bidding, WebSocket Gateway
│
├── docker-compose.yml                 # PostgreSQL 16 (PostGIS), Redis 7, MinIO S3
├── package.json
└── tsconfig.json                      # Path Aliases (@domain/*, @application/*, @infrastructure/*)
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Môi Trường

### 1. Khởi động Hạ tầng Docker (PostgreSQL + Redis + MinIO)
Từ thư mục `backend/`, chạy lệnh:
```bash
docker compose up -d
```
Lệnh này sẽ khởi động:
* **PostgreSQL (kèm PostGIS):** Cổng `5432` (`user: novacrm`, `password: novacrm_password`, `db: novacrm_db`)
* **Redis 7:** Cổng `6379`
* **MinIO S3 Console:** Cổng `9001` (`user: minioadmin`, `password: minioadmin`)

### 2. Cài đặt Thư viện Dependencies
```bash
npm install
```

### 3. Sinh Client Prisma & Chạy Migration
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Nạp Dữ Liệu Mẫu Ban Đầu (Database Seeding)
```bash
npm run prisma:seed
```
*Tạo sẵn tài khoản Admin (`admin@novacrm.com` / `NovaCrm@2026`), Môi giới (`tuan.agent@novacrm.com`), 2 đại dự án (NovaWorld, The Global City), rổ hàng mẫu và phòng đấu giá.*

### 5. Chạy Máy Chủ Phát Triển (Development Server)
```bash
npm run start:dev
```
Hệ thống sẽ chạy tại:
* 🌐 **REST API Base URL:** `http://localhost:4000`
* 📑 **Tài Liệu Swagger OpenAPI:** `http://localhost:4000/api/docs`
* ⚡ **WebSocket Live Auction:** `ws://localhost:4000/ws/auction`

---

## 📡 Danh Mục API Endpoints Chính

| Phương thức | Đường dẫn API | Mô tả nghiệp vụ |
| :---: | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Đăng nhập cấp mã Access Token & Refresh Token |
| `POST` | `/api/v1/auth/register` | Đăng ký tài khoản chuyên viên môi giới |
| `GET` | `/api/v1/auth/profile` | Xem thông tin hồ sơ và vai trò của tài khoản đang đăng nhập |
| `GET` | `/api/v1/projects` | Danh sách các đại dự án, lọc theo tình trạng |
| `GET` | `/api/v1/projects/:id` | Chi tiết dự án, mặt bằng, tiện ích và phân tích đầu tư AI |
| `GET` | `/api/v1/inventory` | Ma trận rổ hàng phân lô, lọc 6 chiều (giá, loại hình, tầng) |
| `GET` | `/api/v1/inventory/stats` | Tỷ lệ hấp thụ rổ hàng và số lượng căn trống/booking/đã bán |
| `POST` | `/api/v1/inventory/batch-lock` | Khóa nội bộ hoặc Mở bán hàng loạt khi chọn checkbox |
| `POST` | `/api/v1/bookings` | Tạo phiếu booking & kích hoạt Redis Lock căn 15 phút |
| `GET` | `/api/v1/bookings` | Danh sách các phiếu booking cho bảng Kanban 5 cột |
| `PATCH`| `/api/v1/bookings/:id/approve` | Duyệt theo cấp bậc (Sale ➔ Quản lý ➔ GĐ Khối ➔ Kế toán) |
| `PATCH`| `/api/v1/bookings/:id/reject` | Từ chối hồ sơ booking và trả căn hộ về rổ hàng trống |
| `PATCH`| `/api/v1/bookings/:id/extend-sla` | Gia hạn thêm thời gian giữ chỗ (+30 phút) |
| `GET` | `/api/v1/customers` | Danh bạ khách hàng 360 độ, lọc theo hạng Kim Cương/VVIP/VIP |
| `GET` | `/api/v1/contracts` | Danh sách các hợp đồng cọc và HĐMB |
| `POST` | `/api/v1/contracts/:id/esign` | Ký số điện tử SHA-256 e-Sign hợp đồng |
| `GET` | `/api/v1/auctions` | Danh sách các phòng đấu giá BĐS trực tuyến |
| `WS` | `/ws/auction` (`place_bid`) | Gõ búa đặt giá Live Bidding thời gian thực |
