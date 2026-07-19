# Phân hệ: Dashboard Cá nhân

**ID Module:** `agent`
**Nhóm:** Dashboards
**Đường dẫn truy cập:** `/app/(dashboard)/agent`

## 1. Tổng quan
Bàn làm việc của nhân viên Sale. Theo dõi KPI cá nhân, doanh số cá nhân, dự tính hoa hồng và khách hàng cần chăm sóc.

## 2. Kiến trúc dữ liệu (Data Integration)
Module này đã được kết nối với hệ thống State Management tập trung thông qua `useStore` (Zustand). 
Nó loại bỏ các mock data cứng và ánh xạ dữ liệu trực tiếp từ các entity chính như `Customer`, `Project`, `InventoryItem`, `Contract`.

## 3. Các tính năng chính
- Tự động đồng bộ số liệu thời gian thực (Real-time synchronization).
- Áp dụng cấu trúc TypeScript nghiêm ngặt để đảm bảo Data Types.
- Thiết kế giao diện (UI) thân thiện với thiết bị di động (Mobile Responsive), không vỡ bảng.
