import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Đang khởi tạo dữ liệu mẫu thực tế vào PostgreSQL (Seeding Database)...');

  // 1. Tạo Users mẫu với mật khẩu chuẩn 'password123'
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@novacrm.com' },
    update: { passwordHash, role: 'SUPER_ADMIN' },
    create: {
      id: 'usr-admin-001',
      email: 'admin@novacrm.com',
      passwordHash,
      fullName: 'Lê Hoàng Anh (Admin)',
      phone: '0901888999',
      role: 'SUPER_ADMIN',
      exp: 50000,
      level: 10,
    },
  });

  const director = await prisma.user.upsert({
    where: { email: 'director@novacrm.com' },
    update: { passwordHash, role: 'DIRECTOR' },
    create: {
      id: 'usr-director-002',
      email: 'director@novacrm.com',
      passwordHash,
      fullName: 'Trần Văn Giám Đốc',
      phone: '0902888999',
      role: 'DIRECTOR',
      exp: 30000,
      level: 8,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@novacrm.com' },
    update: { passwordHash, role: 'TEAM_LEADER' },
    create: {
      id: 'usr-manager-003',
      email: 'manager@novacrm.com',
      passwordHash,
      fullName: 'Nguyễn Văn Trưởng Phòng',
      phone: '0903888999',
      role: 'TEAM_LEADER',
      exp: 20000,
      level: 6,
    },
  });

  const accountant = await prisma.user.upsert({
    where: { email: 'accountant@novacrm.com' },
    update: { passwordHash, role: 'ACCOUNTANT' },
    create: {
      id: 'usr-accountant-005',
      email: 'accountant@novacrm.com',
      passwordHash,
      fullName: 'Hoàng Thị Kế Toán',
      phone: '0905888999',
      role: 'ACCOUNTANT',
      exp: 15000,
      level: 5,
    },
  });

  const agent = await prisma.user.upsert({
    where: { email: 'agent@novacrm.com' },
    update: { passwordHash, role: 'AGENT' },
    create: {
      id: 'usr-agent-004',
      email: 'agent@novacrm.com',
      passwordHash,
      fullName: 'Phạm Thị Thảo (Agent)',
      phone: '0904888999',
      role: 'AGENT',
      exp: 10000,
      level: 4,
    },
  });

  console.log('✅ Đã nạp 5 tài khoản phân quyền chuẩn RBAC!');

  // 2. Tạo Projects mẫu
  const p1 = await prisma.project.upsert({
    where: { code: 'P01' },
    update: {},
    create: {
      id: 'p1',
      code: 'P01',
      name: 'NovaWorld Phan Thiet',
      location: 'Tiến Thành, TP. Phan Thiết',
      developer: 'Tập đoàn Novaland',
      type: 'Đô thị du lịch nghỉ dưỡng biển',
      totalUnits: 10000,
      status: 'OPENING',
      targetRevenue: 80000000000000,
      actualRevenue: 18500000000000,
      thumbnail: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
      latitude: 10.8711,
      longitude: 107.9942,
      aiAnalysis: {
        rating: 'STRONG BUY',
        projectedROI: 14.5,
        riskScore: 'LOW',
        infrastructureBonus: 'Cao tốc Dầu Giây - Phan Thiết & Sân bay Phan Thiết',
      },
    },
  });

  const p2 = await prisma.project.upsert({
    where: { code: 'P02' },
    update: {},
    create: {
      id: 'p2',
      code: 'P02',
      name: 'Aqua City',
      location: 'Long Hưng, TP. Biên Hòa, Đồng Nai',
      developer: 'Tập đoàn Novaland',
      type: 'Đô thị sinh thái thông minh',
      totalUnits: 15000,
      status: 'HANDED_OVER',
      targetRevenue: 150000000000000,
      actualRevenue: 45000000000000,
      thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      latitude: 10.9022,
      longitude: 106.8433,
      aiAnalysis: {
        rating: 'BUY',
        projectedROI: 11.8,
        riskScore: 'LOW',
        infrastructureBonus: 'Hương Lộ 2 & Cầu Vàm Cái Sứt kết nối Cao tốc',
      },
    },
  });

  const p3 = await prisma.project.upsert({
    where: { code: 'P03' },
    update: {},
    create: {
      id: 'p3',
      code: 'P03',
      name: 'The Grand Manhattan',
      location: 'Cô Bắc - Cô Giang, Quận 1, TP.HCM',
      developer: 'Novaland',
      type: 'Tổ hợp Căn hộ - Thương mại hạng sang',
      totalUnits: 1000,
      status: 'UPCOMING',
      targetRevenue: 10000000000000,
      actualRevenue: 3500000000000,
      thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      latitude: 10.7626,
      longitude: 106.6952,
      aiAnalysis: {
        rating: 'STRONG BUY',
        projectedROI: 12.0,
        riskScore: 'LOW',
        infrastructureBonus: 'Vị trí lõi Trung tâm Quận 1 & Phố đi bộ Bùi Viện',
      },
    },
  });

  const p4 = await prisma.project.upsert({
    where: { code: 'P04' },
    update: {},
    create: {
      id: 'p4',
      code: 'P04',
      name: 'The Global City',
      location: 'An Phú, TP. Thủ Đức',
      developer: 'Masterise Homes',
      type: 'Nhà phố thương mại',
      totalUnits: 1800,
      status: 'OPENING',
      targetRevenue: 25000000000000,
      actualRevenue: 12000000000000,
      thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      latitude: 10.7938,
      longitude: 106.7656,
      aiAnalysis: {
        rating: 'STRONG BUY',
        projectedROI: 15.2,
        riskScore: 'LOW',
        infrastructureBonus: 'Trung tâm Downtown mới thiết kế bởi Foster+Partners',
      },
    },
  });

  console.log('✅ Đã nạp 4 đại dự án chủ lực!');

  // 3. Tạo Khách Hàng mẫu 360
  const c1 = await prisma.customer.upsert({
    where: { phone: '0901234567' },
    update: {},
    create: {
      id: 'c1',
      code: 'KH-001',
      fullName: 'Nguyễn Văn Tuấn',
      phone: '0901234567',
      email: 'tuan.nguyen@investor.vn',
      rank: 'DIAMOND_VVIP',
      totalRevenue: 25000000000,
      assignedToId: agent.id,
      status: 'ACTIVE',
    },
  });

  const c2 = await prisma.customer.upsert({
    where: { phone: '0912345678' },
    update: {},
    create: {
      id: 'c2',
      code: 'KH-002',
      fullName: 'Trần Thị Mai',
      phone: '0912345678',
      email: 'mai.tran@vng.com.vn',
      rank: 'PLATINUM_VIP',
      totalRevenue: 8500000000,
      assignedToId: agent.id,
      status: 'ACTIVE',
    },
  });

  const c3 = await prisma.customer.upsert({
    where: { phone: '0988777666' },
    update: {},
    create: {
      id: 'c3',
      code: 'KH-003',
      fullName: 'Lê Hoàng Nam',
      phone: '0988777666',
      email: 'nam.le@vietcap.com.vn',
      rank: 'POTENTIAL',
      totalRevenue: 12000000000,
      assignedToId: agent.id,
      status: 'ACTIVE',
    },
  });

  console.log('✅ Đã nạp 3 hồ sơ khách hàng VVIP 360!');

  // 4. Tạo Rổ Hàng Căn Hộ
  const u1 = await prisma.inventoryItem.upsert({
    where: { code: 'NVW-01.01' },
    update: {},
    create: {
      id: 'i1',
      code: 'NVW-01.01',
      projectId: p1.id,
      tower: 'Khu Florida 1',
      floor: 1,
      type: 'Biệt thự biển đơn lập',
      price: 15500000000,
      area: 250,
      status: 'AVAILABLE',
      bedrooms: 4,
      bathrooms: 4,
      direction: 'Đông Nam',
      view: 'Trực diện biển Phan Thiết',
      handoverStandard: 'Full nội thất',
      discountPolicy: 'Chiết khấu 3% cho khách VVIP',
    },
  });

  const u2 = await prisma.inventoryItem.upsert({
    where: { code: 'NVW-01.02' },
    update: {},
    create: {
      id: 'i2',
      code: 'NVW-01.02',
      projectId: p1.id,
      tower: 'Khu Florida 1',
      floor: 1,
      type: 'Biệt thự biển song lập',
      price: 12500000000,
      area: 180,
      status: 'AVAILABLE',
      bedrooms: 3,
      bathrooms: 3,
      direction: 'Đông',
      view: 'Công viên nội khu & Hồ bơi Lagoon',
      handoverStandard: 'Full nội thất',
      discountPolicy: 'Tặng gói sân Golf PGA 36 lỗ',
    },
  });

  const u3 = await prisma.inventoryItem.upsert({
    where: { code: 'AQC-05.12' },
    update: {},
    create: {
      id: 'i3',
      code: 'AQC-05.12',
      projectId: p2.id,
      tower: 'Phân khu The Suite',
      floor: 1,
      type: 'Nhà phố liền kề',
      price: 8200000000,
      area: 120,
      status: 'AVAILABLE',
      bedrooms: 3,
      bathrooms: 3,
      direction: 'Nam',
      view: 'Kênh đào nhân tạo',
      handoverStandard: 'Hoàn thiện thô',
      discountPolicy: 'Ân hạn nợ gốc 24 tháng',
    },
  });

  const u4 = await prisma.inventoryItem.upsert({
    where: { code: 'TGM-18.04' },
    update: {},
    create: {
      id: 'i4',
      code: 'TGM-18.04',
      projectId: p3.id,
      tower: 'Tháp Sapphire',
      floor: 18,
      type: 'Căn hộ hạng sang',
      price: 12000000000,
      area: 96,
      status: 'AVAILABLE',
      bedrooms: 2,
      bathrooms: 2,
      direction: 'Đông',
      view: 'Bến Bạch Đằng & Sông Sài Gòn',
      handoverStandard: 'Bàn giao Smarthome chuẩn Châu Âu',
      discountPolicy: 'Tặng chỗ đậu xe định danh trọn đời',
    },
  });

  console.log('✅ Đã nạp các căn hộ rổ hàng phân lô!');

  // 5. Tạo Phiếu Booking Mẫu
  await prisma.bookingTicket.upsert({
    where: { code: 'BK-1001' },
    update: {},
    create: {
      id: 'b1',
      code: 'BK-1001',
      customerId: c1.id,
      unitId: u1.id,
      projectId: p1.id,
      agentId: agent.id,
      depositAmount: 100000000,
      bookingType: 'Giữ chỗ có hoàn lại',
      stage: 'INIT_SALE',
      priority: 'high',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      approvalHistory: [
        {
          step: 'Khởi Tạo Phiếu (Môi Giới)',
          actor: 'Phạm Thị Thảo (Agent)',
          action: 'created',
          timestamp: new Date().toISOString(),
          comment: 'Khách VIP chốt cọc sau khi xem sa bàn 360',
        },
      ],
    },
  });

  await prisma.bookingTicket.upsert({
    where: { code: 'BK-1003' },
    update: {},
    create: {
      id: 'b3',
      code: 'BK-1003',
      customerId: c3.id,
      unitId: u4.id,
      projectId: p3.id,
      agentId: agent.id,
      depositAmount: 100000000,
      bookingType: 'Giữ chỗ có hoàn lại',
      stage: 'DONE_LOCKED',
      priority: 'vip',
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
      bankRef: 'VQR-20261003-9988',
      approvalHistory: [
        {
          step: 'Khởi Tạo Phiếu (Môi Giới)',
          actor: 'Phạm Thị Thảo (Agent)',
          action: 'created',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
        {
          step: 'Kế Toán Xác Nhận Tiền',
          actor: 'Hoàng Thị Kế Toán',
          action: 'approved',
          timestamp: new Date().toISOString(),
          comment: 'Đã nhận đủ 100tr vào tài khoản VPBank CĐT',
        },
      ],
    },
  });

  console.log('✅ Đã nạp phiếu booking và đếm ngược SLA!');

  // 6. Tạo Hợp Đồng Mẫu
  await prisma.contract.upsert({
    where: { code: 'HD-8801' },
    update: {},
    create: {
      id: 'ct-1',
      code: 'HD-8801',
      type: 'Hợp đồng mua bán',
      customerId: c1.id,
      unitId: u1.id,
      projectId: p1.id,
      creatorId: agent.id,
      value: 15500000000,
      paidAmount: 1550000000,
      paymentProgress: 10,
      status: 'PENDING_SIGNATURE',
      paymentSchedule: [
        { installment: 1, milestone: 'Đặt cọc', percentage: 10, amount: 1550000000, status: 'Đã thu' },
        { installment: 2, milestone: 'Ký HĐMB chính thức', percentage: 20, amount: 3100000000, status: 'Đến hạn' },
        { installment: 3, milestone: 'Hoàn thiện cất nóc', percentage: 20, amount: 3100000000, status: 'Chưa đến hạn' },
        { installment: 4, milestone: 'Bàn giao nhận nhà', percentage: 45, amount: 6975000000, status: 'Chưa đến hạn' },
        { installment: 5, milestone: 'Bàn giao Sổ Hồng', percentage: 5, amount: 775000000, status: 'Chưa đến hạn' },
      ],
    },
  });

  await prisma.contract.upsert({
    where: { code: 'HD-8802' },
    update: {},
    create: {
      id: 'ct-2',
      code: 'HD-8802',
      type: 'Hợp đồng đặt cọc',
      customerId: c2.id,
      unitId: u3.id,
      projectId: p2.id,
      creatorId: agent.id,
      value: 8200000000,
      paidAmount: 2460000000,
      paymentProgress: 30,
      status: 'SIGNED_ACTIVE',
      signatureHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      signedAt: new Date('2024-05-15'),
      paymentSchedule: [
        { installment: 1, milestone: 'Đặt cọc', percentage: 10, amount: 820000000, status: 'Đã thu' },
        { installment: 2, milestone: 'Ký HĐMB', percentage: 20, amount: 1640000000, status: 'Đã thu' },
        { installment: 3, milestone: 'Hoàn thiện', percentage: 70, amount: 5740000000, status: 'Chưa đến hạn' },
      ],
    },
  });

  console.log('✅ Đã nạp hợp đồng mua bán và chữ ký số SHA-256!');

  // 7. Tạo Nhật Ký Thanh Toán VietQR IPN
  await prisma.paymentTransaction.upsert({
    where: { transactionRef: 'VQR-20261003-9988' },
    update: {},
    create: {
      transactionRef: 'VQR-20261003-9988',
      bookingCode: 'BK-1003',
      contractCode: null,
      amount: 100000000,
      bankName: 'MBBANK',
      accountNumber: '0901888999',
      transferContent: 'THANH TOAN COC THE GRAND MANHATTAN BK-1003',
      gateway: 'VIETQR_NAPAS247',
      status: 'RECONCILED',
    },
  });

  // 8. GIAI ĐOẠN 3: Tạo Lớp Bản Đồ Hạ Tầng GIS
  await prisma.gisLayer.upsert({
    where: { code: 'metro-1' },
    update: {},
    create: {
      code: 'metro-1',
      name: 'Tuyến Metro Số 1 (Bến Thành - Suối Tiên)',
      category: 'TRANSPORT',
      color: '#ef4444',
      badge: '19.7 km',
      geoJson: {
        type: 'LineString',
        coordinates: [
          [106.6983, 10.7725],
          [106.7032, 10.7765],
          [106.7215, 10.795],
          [106.8042, 10.858],
        ],
      },
    },
  });

  await prisma.gisLayer.upsert({
    where: { code: 'ringroad-3' },
    update: {},
    create: {
      code: 'ringroad-3',
      name: 'Tuyến Vành Đai 3 TP.HCM',
      category: 'TRANSPORT',
      color: '#f97316',
      badge: '76.3 km',
      geoJson: {
        type: 'LineString',
        coordinates: [
          [106.612, 10.72],
          [106.75, 10.83],
          [106.85, 10.92],
        ],
      },
    },
  });

  // 9. GIAI ĐOẠN 3: Tạo Tour VR 360 & Sa Bàn
  await prisma.panoramaTour.upsert({
    where: { unitCode: 'NVW-01.01' },
    update: {},
    create: {
      id: 'tour-1',
      projectId: 'p1',
      unitCode: 'NVW-01.01',
      unitTitle: 'Biệt Thự Đơn Lập Florida 01.01 Hướng Biển',
      type: 'Biệt thự biển đơn lập',
      price: 25000000000,
      area: 250,
      bedrooms: 4,
      bathrooms: 4,
      location: 'Tiến Thành, Phan Thiết, Bình Thuận',
      rooms: [
        {
          id: 'p1-living',
          name: 'Phòng Khách Panorama',
          thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
          preset: 'living_room',
          measurements: { width: '8.5m', height: '3.6m', area: '45.2 m²' },
          portals: [
            { position: [4, 0, -2], label: 'Sang Phòng Ngủ Master', targetRoomId: 'p1-master' },
          ],
          specs: [
            {
              position: [2.5, 0.5, -3],
              title: 'Sofa Da Bò Ý Poltrona Frau',
              subtitle: 'Bộ sưu tập Archibald Limited Edition',
              brand: 'Poltrona Frau',
              origin: 'Tolentino, Italy',
              warranty: '10 năm chính hãng',
              description: 'Khung gỗ sồi tự nhiên, bọc da cao cấp kháng khuẩn.',
            },
          ],
        },
      ],
      zones: [
        {
          id: 'z1',
          name: 'Phân Khu Florida 1 & 2',
          totalUnits: 1200,
          soldPercent: 94,
          priceFrom: '7.5 Tỷ',
          height: 12,
          color: '#f97316',
          description: 'Phong cách Mỹ ven biển.',
        },
      ],
    },
  });

  // 10. GIAI ĐOẠN 3: Tạo Phòng Đấu Giá Trực Tuyến
  await prisma.auctionRoom.upsert({
    where: { code: 'AUC-101' },
    update: {},
    create: {
      id: 'auc-1',
      code: 'AUC-101',
      unitId: u1.id,
      startingPrice: 25000000000,
      currentBid: 27800000000,
      reservePrice: 28500000000,
      bidStep: 100000000,
      escrowDeposit: 500000000,
      status: 'LIVE',
      startTime: new Date(Date.now() - 3600000),
      endTime: new Date(Date.now() + 7200000),
      winningBidderId: 'usr-admin-001',
    },
  });

  // 11. GIAI ĐOẠN 3: Tạo Bản Ghi OCR Mẫu (CCCD & Sổ Hồng)
  await prisma.ocrRecord.upsert({
    where: { id: 'ocr-1' },
    update: {},
    create: {
      id: 'ocr-1',
      docType: 'cccd',
      title: 'CCCD Gắn Chip - Nguyễn Văn Tuấn (VVIP)',
      categoryName: 'Căn Cước Công Dân Gắn Chip (12 số)',
      imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80',
      extractedFields: {
        fullName: 'NGUYỄN VĂN TUẤN',
        idNumber: '079085012345',
        dob: '15/01/1985',
        gender: 'Nam',
        address: 'Số 215 Điện Biên Phủ, Phường Đa Kao, Quận 1, TP.HCM',
        issueDate: '12/04/2021',
      },
      confidences: {
        fullName: '99.8%',
        idNumber: '99.9%',
        dob: '99.5%',
        gender: '99.7%',
        address: '98.9%',
      },
      isValid: true,
      verifiedAt: new Date(),
    },
  });

  // 12. GIAI ĐOẠN 3: Tạo Tài Liệu Tri Thức RAG AI
  await prisma.knowledgeDocument.upsert({
    where: { id: 'doc-1' },
    update: {},
    create: {
      id: 'doc-1',
      title: 'Chính Sách Bán Hàng NovaWorld Phan Thiet 2026',
      category: 'policy',
      fileSize: '4.2 MB',
      projectId: 'p1',
      contentSummary: 'Quy định tiến độ thanh toán chuẩn 24 tháng, chiết khấu thanh toán sớm 12%, hỗ trợ lãi suất 0% trong 24 tháng.',
      contentRaw: 'Dự án NovaWorld Phan Thiet áp dụng chính sách bán hàng linh hoạt với 3 phương án thanh toán: Chuẩn, Nhanh và Vay ngân hàng ưu đãi. Ngân hàng MBBank giải ngân song song.',
    },
  });

  await prisma.knowledgeDocument.upsert({
    where: { id: 'doc-2' },
    update: {},
    create: {
      id: 'doc-2',
      title: 'Brochure Tổng Quan Aqua City Đồng Nai',
      category: 'brochure',
      fileSize: '18.5 MB',
      projectId: 'p2',
      contentSummary: 'Quy mô 1.000 ha, 32km đường sông bao bọc, các phân khu Phoenix South, The Suite, The Grand Villas.',
      contentRaw: 'Đô thị sinh thái thông minh Aqua City tọa lạc tại phía Đông TP.HCM, kết nối cao tốc TP.HCM - Long Thành qua trục Hương Lộ 2 rộng 60m.',
    },
  });

  await prisma.knowledgeDocument.upsert({
    where: { id: 'doc-3' },
    update: {},
    create: {
      id: 'doc-3',
      title: 'Luật Đất Đai 2024 & Quy Định Cấp Sổ Hồng',
      category: 'law',
      fileSize: '2.8 MB',
      projectId: null,
      contentSummary: 'Các điểm mới của Luật Đất Đai sửa đổi liên quan đến bảng giá đất thị trường và tiến độ cấp giấy chứng nhận.',
      contentRaw: 'Luật Đất Đai 2024 có hiệu lực bỏ khung giá đất, định giá đất theo nguyên tắc thị trường và đẩy nhanh tiến độ cấp giấy chứng nhận QSD đất.',
    },
  });

  await prisma.knowledgeDocument.upsert({
    where: { id: 'doc-4' },
    update: {},
    create: {
      id: 'doc-4',
      title: 'Quy Trình Khóa Căn & Đặt Cọc SLA 15 Phút',
      category: 'faq',
      fileSize: '1.2 MB',
      projectId: null,
      contentSummary: 'Hướng dẫn 4 bước: Khởi tạo phiếu booking, phê duyệt trực tuyến cấp Quản lý, Giám đốc và kế toán xác nhận qua VietQR IPN.',
      contentRaw: 'Thời hạn giữ chỗ tối đa 15 phút. Nếu quá thời hạn mà chưa hoàn tất chuyển tiền cọc tối thiểu 50 triệu đồng, căn hộ sẽ tự động mở khóa về rổ hàng.',
    },
  });

  // =============================================================
  // 16. GIAI ĐOẠN 4: BÀN GIAO & SNAGGING DEFECT
  // =============================================================
  const ho1 = await prisma.handoverTicket.upsert({
    where: { code: 'HO-2026-001' },
    update: {},
    create: {
      id: 'ho-ticket-1',
      code: 'HO-2026-001',
      contractId: 'HD-928',
      propertyCode: 'NVW-01.01',
      projectId: 'p1',
      projectName: 'NovaWorld Phan Thiet',
      customerId: 'c1',
      customerName: 'Nguyễn Văn Tuấn',
      customerPhone: '0901234567',
      customerEmail: 'tuan.nguyen@investor.vn',
      propertyType: 'Biệt thự biển đơn lập',
      area: 250,
      scheduledDate: '24/07/2026',
      scheduledTime: '09:00 AM',
      assignedEngineer: 'KS. Trần Đình Trọng (Ban QLDA)',
      status: 'da_ban_giao',
      electricMeterIndex: 1240.5,
      waterMeterIndex: 48.2,
      keysHandedOverCount: 6,
      accessCardsCount: 4,
      signedDate: '19/07/2026',
      signedByCustomer: true,
      signedByStaff: true,
      warrantyExpiryDate: '19/07/2031',
      pinkBookStage: 'da_in_phoi_so',
      pinkBookNumber: 'CN-892147/BThuan',
      defectsCount: 0,
      notes: 'Khách hàng rất hài lòng về tiến độ và cảnh quan sân Golf PGA',
      checklist: [
        { id: 'KT-01', category: 'KIEN_TRUC', criteria: 'Tường trát phẳng không nứt', isPassed: true },
        { id: 'ME-01', category: 'ME', criteria: 'Aptomat ngắt mạch chính xác', isPassed: true },
      ],
    },
  });

  const ho2 = await prisma.handoverTicket.upsert({
    where: { code: 'HO-2026-002' },
    update: {},
    create: {
      id: 'ho-ticket-2',
      code: 'HO-2026-002',
      contractId: 'HD-927',
      propertyCode: 'AQC-12A.01',
      projectId: 'p2',
      projectName: 'Aqua City',
      customerId: 'c7',
      customerName: 'Vũ Thu Trang',
      customerPhone: '0966554433',
      customerEmail: 'trang.vu@fashionvn.com',
      propertyType: 'Nhà phố đảo Phượng Hoàng',
      area: 160,
      scheduledDate: '25/07/2026',
      scheduledTime: '14:30 PM',
      assignedEngineer: 'KS. Nguyễn Văn Hải (Ban QLDA)',
      status: 'co_loi_can_sua',
      electricMeterIndex: 820.0,
      waterMeterIndex: 26.5,
      keysHandedOverCount: 4,
      accessCardsCount: 3,
      warrantyExpiryDate: '25/07/2028',
      pinkBookStage: 'tham_dinh_thue',
      defectsCount: 2,
      notes: 'Có 2 lỗi nhẹ ở ron gạch ban công và gioăng kính cửa lùa đang được xử lý',
      checklist: [
        { id: 'KT-03', category: 'KIEN_TRUC', criteria: 'Ron gạch sàn đồng đều 2mm', isPassed: false },
        { id: 'KT-10', category: 'KIEN_TRUC', criteria: 'Gioăng cao su EPDM đàn hồi tốt', isPassed: false },
      ],
      defects: {
        create: [
          {
            propertyCode: 'AQC-12A.01',
            location: 'Ban công phòng ngủ Master tầng 2',
            category: 'Sàn & Trần',
            description: 'Ron gạch lát ban công có khoảng hở 3mm chưa miết đầy',
            severity: 'Nhe',
            contractor: 'Xây dựng Hòa Bình Group',
            status: 'Dang Xu Ly',
            reportedDate: '2026-07-20',
          },
          {
            propertyCode: 'AQC-12A.01',
            location: 'Cửa lùa phòng khách hướng sông',
            category: 'Cửa & Khóa',
            description: 'Gioăng cao su cửa lùa nhôm kính Xingfa bị hở mép dưới',
            severity: 'Nhe',
            contractor: 'Nhôm kính BM Windows',
            status: 'Dang Xu Ly',
            reportedDate: '2026-07-20',
          },
        ],
      },
    },
  });

  const ho3 = await prisma.handoverTicket.upsert({
    where: { code: 'HO-2026-003' },
    update: {},
    create: {
      id: 'ho-ticket-3',
      code: 'HO-2026-003',
      contractId: 'HD-926',
      propertyCode: 'TGM-18.04',
      projectId: 'p3',
      projectName: 'The Grand Manhattan',
      customerId: 'c4',
      customerName: 'Phạm Minh Tuấn',
      customerPhone: '0912987654',
      customerEmail: 'minhtuan.pham@saigonres.com',
      propertyType: 'Căn hộ hạng sang 3PN',
      area: 115,
      scheduledDate: '26/07/2026',
      scheduledTime: '10:00 AM',
      assignedEngineer: 'KS. Lê Văn Nam (CBRE Property)',
      status: 'dang_nghiem_thu',
      electricMeterIndex: 450.2,
      waterMeterIndex: 14.8,
      keysHandedOverCount: 4,
      accessCardsCount: 4,
      warrantyExpiryDate: '26/07/2028',
      pinkBookStage: 'nop_so_tnmt',
      defectsCount: 1,
      notes: 'Chờ kiểm tra lại áp lực vòi sen tắm đứng phòng Master',
    },
  });

  // =============================================================
  // 17. GIAI ĐOẠN 4: VẬN HÀNH ĐÔ THỊ & HÓA ĐƠN DỊCH VỤ
  // =============================================================
  await prisma.operationBill.upsert({
    where: { billCode: 'INV-2026-0701' },
    update: {},
    create: {
      billCode: 'INV-2026-0701',
      month: '07/2026',
      propertyCode: 'NVW-01.01',
      projectName: 'NovaWorld Phan Thiet',
      residentName: 'Nguyễn Văn Tuấn',
      residentPhone: '0901234567',
      managementFee: 4500000,
      parkingFee: 2400000,
      utilitiesFee: 1850000,
      totalAmount: 8750000,
      status: 'da_thanh_toan',
      dueDate: '25/07/2026',
      paidDate: '19/07/2026',
      paymentMethod: 'VietQR Pro 24/7',
    },
  });

  await prisma.operationBill.upsert({
    where: { billCode: 'INV-2026-0702' },
    update: {},
    create: {
      billCode: 'INV-2026-0702',
      month: '07/2026',
      propertyCode: 'AQC-12A.01',
      projectName: 'Aqua City',
      residentName: 'Vũ Thu Trang',
      residentPhone: '0966554433',
      managementFee: 2880000,
      parkingFee: 1200000,
      utilitiesFee: 950000,
      totalAmount: 5030000,
      status: 'cho_thanh_toan',
      dueDate: '25/07/2026',
    },
  });

  await prisma.operationBill.upsert({
    where: { billCode: 'INV-2026-0703' },
    update: {},
    create: {
      billCode: 'INV-2026-0703',
      month: '07/2026',
      propertyCode: 'TGM-18.04',
      projectName: 'The Grand Manhattan',
      residentName: 'Phạm Minh Tuấn',
      residentPhone: '0912987654',
      managementFee: 2070000,
      parkingFee: 2500000,
      utilitiesFee: 1420000,
      totalAmount: 5990000,
      status: 'da_thanh_toan',
      dueDate: '25/07/2026',
      paidDate: '18/07/2026',
      paymentMethod: 'VietQR Pro 24/7',
    },
  });

  // Fitout Permits
  const existingPermit = await prisma.fitoutPermit.findFirst({ where: { propertyCode: 'AQC-12A.01' } });
  if (!existingPermit) {
    await prisma.fitoutPermit.create({
      data: {
        propertyCode: 'AQC-12A.01',
        residentName: 'Vũ Thu Trang',
        contractorName: 'TT-Decor Luxury Interior',
        contractorPhone: '0988776655',
        workersCount: 6,
        startDate: '2026-08-01',
        endDate: '2026-09-30',
        depositAmount: 50000000,
        status: 'dang_thi_cong',
        depositRefunded: false,
        notes: 'Thi công ốp gỗ tự nhiên phòng ngủ và lắp hệ tủ bếp thông minh',
      },
    });
  }

  // Amenity Bookings
  const existingBooking = await prisma.amenityBooking.findFirst({ where: { propertyCode: 'NVW-01.01' } });
  if (!existingBooking) {
    await prisma.amenityBooking.create({
      data: {
        amenityType: 'Sân Pickleball VIP',
        propertyCode: 'NVW-01.01',
        residentName: 'Nguyễn Văn Tuấn',
        residentPhone: '0901234567',
        bookingDate: '2026-07-26',
        timeSlot: '06:00 - 08:00',
        guestsCount: 4,
        status: 'da_xac_nhan',
      },
    });
  }

  // =============================================================
  // 18. GIAI ĐOẠN 4: THỊ TRƯỜNG THỨ CẤP & CO-BROKERING
  // =============================================================
  await prisma.resaleListing.upsert({
    where: { listingCode: 'KGB-TGM-1502' },
    update: {},
    create: {
      listingCode: 'KGB-TGM-1502',
      type: 'resale',
      projectName: 'The Grand Manhattan',
      propertyCode: 'TGM-15.02',
      propertyType: 'Căn hộ cao cấp',
      ownerName: 'Trần Văn Mạnh',
      ownerPhone: '0912.334.889',
      area: 96,
      bedrooms: 3,
      bathrooms: 2,
      direction: 'Đông Nam (View Bến Vân Đồn & Q1)',
      askingPrice: 18500000000,
      targetNetPrice: 18000000000,
      commissionRate: 1.5,
      commissionAmount: 277500000,
      legalStatus: 'Sổ hồng riêng',
      furnishedStatus: 'Full nội thất cao cấp 5★',
      keyStatus: 'Sàn giữ chìa Master',
      status: 'active',
      exclusiveContract: true,
      exclusiveEndDate: '2026-11-30',
      viewCount: 342,
      showingCount: 12,
      matchedLeadsCount: 8,
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60',
      coBrokerSplitRatio: 50.0,
    },
  });

  await prisma.resaleListing.upsert({
    where: { listingCode: 'KGB-AQC-PH10' },
    update: {},
    create: {
      listingCode: 'KGB-AQC-PH10',
      type: 'resale',
      projectName: 'Aqua City',
      propertyCode: 'AQC-PH-10',
      propertyType: 'Biệt thự song lập',
      ownerName: 'Nguyễn Thị Bích Phượng',
      ownerPhone: '0908.776.223',
      area: 240,
      bedrooms: 4,
      bathrooms: 4,
      direction: 'Nam (View công viên ven sông)',
      askingPrice: 15800000000,
      targetNetPrice: 15300000000,
      commissionRate: 1.5,
      commissionAmount: 237000000,
      legalStatus: 'Hợp đồng mua bán',
      furnishedStatus: 'Nhà thô hoàn thiện mặt ngoài',
      keyStatus: 'Chủ nhà giữ chìa (báo trước 2h)',
      status: 'active',
      exclusiveContract: true,
      exclusiveEndDate: '2026-10-15',
      viewCount: 189,
      showingCount: 6,
      matchedLeadsCount: 5,
      imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=60',
      coBrokerSplitRatio: 50.0,
    },
  });

  // Client Demands
  const existingDemand = await prisma.clientDemand.findFirst({ where: { clientPhone: '0903.112.990' } });
  if (!existingDemand) {
    await prisma.clientDemand.create({
      data: {
        clientName: 'Trần Đức Long',
        clientPhone: '0903.112.990',
        demandType: 'resale',
        targetProjects: ['Aqua City'],
        minPrice: 14000000000,
        maxPrice: 16500000000,
        bedrooms: 4,
        purpose: 'Ở thực',
        urgency: 'Cần gấp trong tuần 🔥',
        assignedAgent: 'Trần Minh Quang (Chuyên viên)',
        matchingScore: 95,
        suggestedListingCode: 'KGB-AQC-PH10',
      },
    });
  }

  // =============================================================
  // 19. GIAI ĐOẠN 4: QUẢN LÝ TÀI SẢN VIP & PHÂN TÍCH TÀI CHÍNH
  // =============================================================
  await prisma.portfolioAsset.upsert({
    where: { code: 'NVW-01.01' },
    update: {},
    create: {
      code: 'NVW-01.01',
      title: 'Biệt Thự Đơn Lập Golf PGA 250m2',
      projectName: 'NovaWorld Phan Thiet',
      projectId: 'p1',
      customerId: 'c1',
      customerName: 'Nguyễn Văn Tuấn',
      customerPhone: '0901234567',
      propertyType: 'Biệt thự đơn lập',
      area: 250,
      bedrooms: 4,
      bathrooms: 5,
      direction: 'Đông Nam',
      view: 'Sân Golf PGA & Biển',
      buyPrice: 15500000000,
      currentValuation: 24800000000,
      purchaseDate: '2023-03-15',
      handoverDate: '2025-12-20',
      constructionProgress: 100,
      constructionStatus: 'Đã bàn giao',
      rentalStatus: 'Đang cho thuê',
      monthlyRent: 45000000,
      tenantName: 'Mr. David Miller (Chuyên gia Hàn Quốc)',
      leaseEndDate: '2027-06-30',
      annualNetRental: 486000000,
      contractCode: 'HD-928',
      legalStatus: 'Sổ hồng riêng (Đang in phôi)',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=60',
      aiRecommendation: 'Tiếp tục giữ tích sản',
      aiScore: 92,
      irr: 19.8,
      cagr: 16.9,
      rentalYield: 1.96,
      milestones: [
        { id: 'm1', name: 'Đợt 1 - Ký HĐMB', dueDate: '2023-03-15', amount: 4650000000, percentage: 30, isPaid: true },
        { id: 'm2', name: 'Đợt 2 - Cất nóc', dueDate: '2024-06-30', amount: 6200000000, percentage: 40, isPaid: true },
        { id: 'm3', name: 'Đợt 3 - Bàn giao', dueDate: '2025-12-20', amount: 3875000000, percentage: 25, isPaid: true },
        { id: 'm4', name: 'Đợt 4 - Nhận sổ hồng', dueDate: '2026-12-31', amount: 775000000, percentage: 5, isPaid: false },
      ],
    },
  });

  await prisma.portfolioAsset.upsert({
    where: { code: 'AQC-12A.01' },
    update: {},
    create: {
      code: 'AQC-12A.01',
      title: 'Nhà Phố Đảo Phượng Hoàng 160m2',
      projectName: 'Aqua City',
      projectId: 'p2',
      customerId: 'c7',
      customerName: 'Vũ Thu Trang',
      customerPhone: '0966554433',
      propertyType: 'Nhà phố liền kề',
      area: 160,
      bedrooms: 3,
      bathrooms: 4,
      direction: 'Nam',
      view: 'Kênh đào & Công viên sinh thái',
      buyPrice: 9200000000,
      currentValuation: 13800000000,
      purchaseDate: '2023-08-20',
      handoverDate: '2026-06-15',
      constructionProgress: 100,
      constructionStatus: 'Đã bàn giao',
      rentalStatus: 'Đang tìm khách',
      monthlyRent: 28000000,
      annualNetRental: 302400000,
      contractCode: 'HD-927',
      legalStatus: 'Hợp đồng mua bán',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60',
      aiRecommendation: 'Tối ưu hóa giá thuê',
      aiScore: 84,
      irr: 16.5,
      cagr: 14.5,
      rentalYield: 2.19,
      milestones: [
        { id: 'm1', name: 'Đợt 1 - Ký HĐMB', dueDate: '2023-08-20', amount: 2760000000, percentage: 30, isPaid: true },
        { id: 'm2', name: 'Đợt 2 - Bàn giao', dueDate: '2026-06-15', amount: 5980000000, percentage: 65, isPaid: true },
        { id: 'm3', name: 'Đợt 3 - Sổ hồng', dueDate: '2027-06-30', amount: 460000000, percentage: 5, isPaid: false },
      ],
    },
  });

  await prisma.portfolioAsset.upsert({
    where: { code: 'TGM-18.04' },
    update: {},
    create: {
      code: 'TGM-18.04',
      title: 'Căn Hộ Hạng Sang 3PN Trung Tâm Q1',
      projectName: 'The Grand Manhattan',
      projectId: 'p3',
      customerId: 'c4',
      customerName: 'Phạm Minh Tuấn',
      customerPhone: '0912987654',
      propertyType: 'Căn hộ cao cấp',
      area: 115,
      bedrooms: 3,
      bathrooms: 2,
      direction: 'Đông Nam',
      view: 'Panorama Bitexco & Sông Sài Gòn',
      buyPrice: 18000000000,
      currentValuation: 22500000000,
      purchaseDate: '2024-01-10',
      handoverDate: '2026-07-26',
      constructionProgress: 98,
      constructionStatus: 'Đang nghiệm thu',
      rentalStatus: 'Chờ nhận nhà',
      monthlyRent: 55000000,
      annualNetRental: 594000000,
      contractCode: 'HD-926',
      legalStatus: 'Hợp đồng mua bán',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60',
      aiRecommendation: 'Tiếp tục giữ tích sản',
      aiScore: 89,
      irr: 13.8,
      cagr: 11.8,
      rentalYield: 2.64,
      milestones: [
        { id: 'm1', name: 'Đợt 1 - Cọc & Ký HĐ', dueDate: '2024-01-10', amount: 5400000000, percentage: 30, isPaid: true },
        { id: 'm2', name: 'Đợt 2 - Cất nóc', dueDate: '2025-05-30', amount: 7200000000, percentage: 40, isPaid: true },
        { id: 'm3', name: 'Đợt 3 - Bàn giao', dueDate: '2026-07-26', amount: 4500000000, percentage: 25, isPaid: false },
        { id: 'm4', name: 'Đợt 4 - Sổ hồng', dueDate: '2027-06-30', amount: 900000000, percentage: 5, isPaid: false },
      ],
    },
  });

  console.log('✅ Đã nạp dữ liệu Giai đoạn 4: Handover, Snagging Defect, Urban Operations, Resale Co-brokering, VIP Portfolio!');

  // =============================================================
  // 20. GIAI ĐOẠN 5: CHIẾN DỊCH TIẾP THỊ & ĐA KÊNH (MARKETING)
  // =============================================================
  await prisma.marketingCampaign.upsert({
    where: { code: 'CMP-2026-01' },
    update: {},
    create: {
      code: 'CMP-2026-01',
      name: 'NovaWorld Phan Thiet - Mở Bán Biệt Thự Biển Golf PGA',
      platform: 'Facebook',
      status: 'Active',
      budget: 500000000,
      spent: 320000000,
      leads: 380,
      clicks: 14500,
      conversions: 62,
      startDate: '2026-06-01',
      endDate: '2026-12-31',
      targetCPL: 850000,
      routingRule: 'top_seller',
      assignedTeam: 'Diamond Alpha',
      projectId: 'p1',
      utmSource: 'facebook',
      utmMedium: 'cpc',
      utmCampaign: 'novaworld_golf_pga',
    },
  });

  await prisma.marketingCampaign.upsert({
    where: { code: 'CMP-2026-02' },
    update: {},
    create: {
      code: 'CMP-2026-02',
      name: 'The Grand Manhattan - Căn Hộ Lõi Quận 1 Cho Chuyên Gia',
      platform: 'Google',
      status: 'Active',
      budget: 350000000,
      spent: 210000000,
      leads: 195,
      clicks: 8900,
      conversions: 45,
      startDate: '2026-06-15',
      endDate: '2026-11-30',
      targetCPL: 1100000,
      routingRule: 'by_project',
      assignedTeam: 'Platinum Stars',
      projectId: 'p3',
      utmSource: 'google',
      utmMedium: 'search',
      utmCampaign: 'tgm_district1_luxury',
    },
  });

  await prisma.marketingCampaign.upsert({
    where: { code: 'CMP-2026-03' },
    update: {},
    create: {
      code: 'CMP-2026-03',
      name: 'Aqua City Đồng Nai - Đô Thị Sinh Thái Đảo Phượng Hoàng',
      platform: 'TikTok',
      status: 'Active',
      budget: 400000000,
      spent: 280000000,
      leads: 520,
      clicks: 28400,
      conversions: 78,
      startDate: '2026-07-01',
      endDate: '2026-10-31',
      targetCPL: 550000,
      routingRule: 'round_robin',
      assignedTeam: 'Golden Hunters',
      projectId: 'p2',
      utmSource: 'tiktok',
      utmMedium: 'video_feed',
      utmCampaign: 'aquacity_island_phoenix',
    },
  });

  await prisma.marketingCampaign.upsert({
    where: { code: 'CMP-2026-04' },
    update: {},
    create: {
      code: 'CMP-2026-04',
      name: 'Zalo ZNS Tự Động - Chăm Sóc Khách Hàng VIP & Cập Nhật Lịch Thanh Toán',
      platform: 'Zalo',
      status: 'Active',
      budget: 150000000,
      spent: 65000000,
      leads: 410,
      clicks: 12200,
      conversions: 92,
      startDate: '2026-05-01',
      endDate: '2026-12-31',
      targetCPL: 160000,
      routingRule: 'round_robin',
      assignedTeam: 'Elite VIP Club',
      projectId: null,
      utmSource: 'zalo_oa',
      utmMedium: 'zns_notification',
      utmCampaign: 'crm_zalo_automation',
    },
  });

  // =============================================================
  // 21. GIAI ĐOẠN 5: CHƯƠNG TRÌNH KHÁCH HÀNG THÂN THIẾT (LOYALTY)
  // =============================================================
  const v1 = await prisma.loyaltyVoucher.upsert({
    where: { code: 'VCH-NOVA-500' },
    update: {},
    create: {
      code: 'VCH-NOVA-500',
      title: 'Voucher Nghỉ Dưỡng 3N2Đ Biệt Thự Biển NovaWorld Phan Thiet',
      points: 5000,
      iconName: 'Palmtree',
      color: 'emerald',
      category: 'resort',
      description: 'Miễn phí 2 đêm nghỉ tại biệt thự Florida hướng biển, bao gồm bữa sáng 5 sao cho 4 người.',
      expiryDate: '31/12/2026',
      stock: 45,
      terms: 'Áp dụng cho chủ sở hữu tài khoản NovaClub hạng Gold trở lên.',
    },
  });

  const v2 = await prisma.loyaltyVoucher.upsert({
    where: { code: 'VCH-NOVA-GOLF' },
    update: {},
    create: {
      code: 'VCH-NOVA-GOLF',
      title: 'Gói Trải Nghiệm Sân Golf PGA Chuẩn Quốc Tế 36 Lỗ',
      points: 3500,
      iconName: 'Trophy',
      color: 'blue',
      category: 'golf',
      description: 'Bao gồm green fee, caddie và xe điện buggy tại cụm sân Golf PGA Ocean & PGA Garden.',
      expiryDate: '31/12/2026',
      stock: 30,
      terms: 'Vui lòng đặt chỗ trước 48 giờ qua hotline Concierge VIP.',
    },
  });

  const v3 = await prisma.loyaltyVoucher.upsert({
    where: { code: 'VCH-NOVA-200M' },
    update: {},
    create: {
      code: 'VCH-NOVA-200M',
      title: 'Phiếu Giảm Trừ 200 Triệu Khi Mua Căn Hộ/Biệt Thự Mới',
      points: 15000,
      iconName: 'BadgePercent',
      color: 'rose',
      category: 'discount',
      description: 'Trừ trực tiếp vào giá trị Hợp đồng Mua bán ký mới trong năm 2026.',
      expiryDate: '31/12/2026',
      stock: 15,
      terms: 'Có thể chuyển nhượng cho người thân cùng hộ khẩu hoặc pháp nhân trực thuộc.',
    },
  });

  await prisma.loyaltyTransaction.create({
    data: {
      customerId: 'c1',
      customerName: 'Nguyễn Văn Tuấn',
      customerPhone: '0901234567',
      type: 'EARN',
      points: 25000,
      balanceAfter: 25000,
      description: 'Tích điểm ký Hợp đồng mua bán Biệt thự biển NVW-01.01',
      referenceCode: 'HD-8801',
    },
  });

  await prisma.loyaltyTransaction.create({
    data: {
      customerId: 'c1',
      customerName: 'Nguyễn Văn Tuấn',
      customerPhone: '0901234567',
      type: 'REDEEM',
      points: -5000,
      balanceAfter: 20000,
      description: 'Đổi Voucher Nghỉ dưỡng 3N2Đ NovaWorld Phan Thiet',
      voucherId: v1.id,
      referenceCode: 'VCH-NOVA-500',
    },
  });

  // =============================================================
  // 22. GIAI ĐOẠN 5: ĐUA TOP & THI ĐUA KINH DOANH (GAMIFICATION)
  // =============================================================
  await prisma.gamificationQuest.upsert({
    where: { questId: 1 },
    update: {},
    create: {
      questId: 1,
      title: 'Dẫn 3 Khách Tham Quan Sa Bàn Ảo 3D & VR Tour',
      description: 'Khách hàng trải nghiệm tính năng VR 360 thực tế ảo tối thiểu 5 phút',
      current: 3,
      max: 3,
      exp: 500,
      category: 'daily',
      rewardClaimed: false,
      iconName: 'Eye',
    },
  });

  await prisma.gamificationQuest.upsert({
    where: { questId: 2 },
    update: {},
    create: {
      questId: 2,
      title: 'Khóa Căn Giữ Chỗ SLA 15 Phút Thành Công',
      description: 'Tạo phiếu booking và được Kế toán xác nhận chuyển cọc thành công',
      current: 1,
      max: 1,
      exp: 2000,
      category: 'weekly',
      rewardClaimed: false,
      iconName: 'Lock',
    },
  });

  await prisma.gamificationQuest.upsert({
    where: { questId: 3 },
    update: {},
    create: {
      questId: 3,
      title: 'Điểm Danh GPS Check-in Tại Novaland Gallery',
      description: 'Xác thực tọa độ định vị vị trí tại sàn giao dịch trung tâm trước 08:30 AM',
      current: 1,
      max: 1,
      exp: 200,
      category: 'daily',
      rewardClaimed: true,
      iconName: 'MapPin',
    },
  });

  await prisma.gamificationBadge.upsert({
    where: { badgeId: 1 },
    update: {},
    create: {
      badgeId: 1,
      name: 'Thợ Săn Rổ Hàng Ngoại Giao',
      description: 'Chốt thành công 3 giao dịch căn hoa hậu trong 1 tuần mở bán',
      category: 'Chốt Deal',
      color: 'amber',
      unlocked: true,
      unlockedDate: '15/07/2026',
      bonusExp: 1500,
      rarity: 'Hiếm',
    },
  });

  await prisma.gamificationBadge.upsert({
    where: { badgeId: 2 },
    update: {},
    create: {
      badgeId: 2,
      name: 'Bàn Tay Vàng 100 Tỷ',
      description: 'Tổng giá trị GDV ký HĐMB lũy kế vượt mốc 100 Tỷ đồng',
      category: 'Doanh Số',
      color: 'purple',
      unlocked: true,
      unlockedDate: '20/07/2026',
      bonusExp: 5000,
      rarity: 'Huyền thoại',
    },
  });

  await prisma.gamificationReward.upsert({
    where: { id: 'rew-1' },
    update: {},
    create: {
      id: 'rew-1',
      title: 'Đồng Hồ Apple Watch Ultra 2 GPS + Cellular',
      costExp: 15000,
      category: 'Công nghệ',
      stock: 8,
      description: 'Phiên bản viền Titan dây Alpine Loop dành cho chiến binh kinh doanh hàng đầu',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80',
    },
  });

  await prisma.gamificationReward.upsert({
    where: { id: 'rew-2' },
    update: {},
    create: {
      id: 'rew-2',
      title: 'Chuyến Du Lịch Nghỉ Dưỡng Singapore Marina Bay 4N3Đ',
      costExp: 35000,
      category: 'Du lịch',
      stock: 5,
      description: 'Vé máy bay hạng thương gia, phòng suite khách sạn Marina Bay Sands',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80',
    },
  });

  // =============================================================
  // 23. GIAI ĐOẠN 5: SÀN LIÊN KẾT ĐẠI LÝ F1/F2 (MARKETPLACE B2B)
  // =============================================================
  await prisma.agencyPartner.upsert({
    where: { code: 'AGY-001' },
    update: {},
    create: {
      code: 'AGY-001',
      name: 'Công Ty CP Bất Động Sản Đất Xanh Miền Nam',
      tier: 'F1',
      phone: '0908112233',
      email: 'lienhe@datxanhmiennam.com.vn',
      activeListingsCount: 85,
      successfulDealsCount: 42,
      totalCommissionShared: 4850000000,
      rating: 4.9,
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&q=80',
      joinedDate: '12/03/2025',
    },
  });

  await prisma.agencyPartner.upsert({
    where: { code: 'AGY-002' },
    update: {},
    create: {
      code: 'AGY-002',
      name: 'Tập Đoàn BĐS CenGroup Holdings (CenLand)',
      tier: 'F1',
      phone: '0918445566',
      email: 'f1partners@cenland.vn',
      activeListingsCount: 120,
      successfulDealsCount: 68,
      totalCommissionShared: 8200000000,
      rating: 5.0,
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&q=80',
      joinedDate: '05/01/2025',
    },
  });

  await prisma.marketplaceListing.upsert({
    where: { code: 'MKT-0001' },
    update: {},
    create: {
      code: 'MKT-0001',
      title: 'Căn Hộ Sapphire The Grand Manhattan - Cô Bắc Q1',
      price: 12000000000,
      priceFormatted: '12.0 Tỷ',
      commSplit: '50/50',
      f2Commission: '1.5%',
      f2CommissionRate: 1.5,
      type: 'Bán',
      propertyCategory: 'Căn hộ',
      location: 'Cô Giang - Cô Bắc, Quận 1',
      district: 'Quận 1, TP.HCM',
      ownerAgency: 'Sàn Novaland Gallery Q1',
      ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
      ownerPhone: '0901888999',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      verified: true,
      exclusive: true,
      coBrokeringStatus: 'OPEN',
    },
  });

  await prisma.marketplaceListing.upsert({
    where: { code: 'MKT-0002' },
    update: {},
    create: {
      code: 'MKT-0002',
      title: 'Biệt Thự Đơn Lập Florida NovaWorld Phan Thiet Hướng Biển',
      price: 25000000000,
      priceFormatted: '25.0 Tỷ',
      commSplit: '50/50',
      f2Commission: '2.0%',
      f2CommissionRate: 2.0,
      type: 'Bán',
      propertyCategory: 'Biệt thự',
      location: 'Tiến Thành, Phan Thiết',
      district: 'TP. Phan Thiết',
      ownerAgency: 'Đất Xanh Miền Nam (F1)',
      ownerAvatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&q=80',
      ownerPhone: '0908112233',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
      verified: true,
      exclusive: false,
      coBrokeringStatus: 'OPEN',
    },
  });

  // =============================================================
  // 24. GIAI ĐOẠN 5: ĐO LƯỜNG SỰ HÀI LÒNG NPS/CSAT (SURVEYS)
  // =============================================================
  const sv1 = await prisma.surveyCampaign.upsert({
    where: { code: 'SVY-101' },
    update: {},
    create: {
      code: 'SVY-101',
      name: 'Khảo Sát Trải Nghiệm Sa Bàn Ảo 3D & Tư Vấn Căn Hộ',
      trigger: 'Sau khi xem sa bàn & nhà mẫu',
      responsesCount: 245,
      conversion: '48.5%',
      status: 'active',
      channel: 'Zalo ZNS',
      targetAudience: 'Khách hàng có lịch hẹn xem dự án',
      rewardPoints: 200,
      csatScore: 4.9,
      npsScore: 82,
      formUrl: 'https://crm.novaland.com.vn/survey/sa-ban-3d',
    },
  });

  await prisma.surveyFeedback.create({
    data: {
      campaignId: sv1.id,
      customerName: 'Nguyễn Văn Tuấn',
      customerPhone: '0901234567',
      propertyCode: 'NVW-01.01',
      projectName: 'NovaWorld Phan Thiet',
      rating: 5,
      category: 'Tư vấn',
      sentiment: 'POSITIVE',
      comment: 'Trải nghiệm sa bàn thực tế ảo 3D VR rất trực quan, giúp hình dung rõ hướng gió biển và view sân golf.',
      resolutionStatus: 'RESOLVED',
      assignedStaff: 'Lê Hoàng Anh (Admin)',
    },
  });

  // =============================================================
  // 25. GIAI ĐOẠN 5: CÔNG CỤ TÀI CHÍNH TÍN DỤNG (MORTGAGE ENGINE)
  // =============================================================
  await prisma.mortgageSimulation.create({
    data: {
      customerId: 'c1',
      customerName: 'Nguyễn Văn Tuấn',
      propertyCode: 'NVW-01.01',
      propertyValue: 25000000000,
      loanPercent: 70.0,
      loanAmount: 17500000000,
      loanTermYears: 20,
      bankId: 'vpb',
      bankName: 'VPBank - Gói Ngôi Nhà Đầu Tiên',
      preferentialRate: 5.9,
      preferentialMonths: 12,
      floatingRate: 9.5,
      repaymentMethod: 'reducing',
      enableGracePeriod: true,
      graceMonths: 24,
      monthlyIncome: 350000000,
      dtiRatio: 36.8,
      monthlyPaymentFirst: 128958333,
      totalInterest: 11450000000,
    },
  });

  // =============================================================
  // 26. GIAI ĐOẠN 5: KẾT NỐI NGOẠI VI & WEBHOOK (INTEGRATIONS)
  // =============================================================
  await prisma.integrationApp.upsert({
    where: { appCode: 'vietqr' },
    update: {},
    create: {
      appCode: 'vietqr',
      name: 'VietQR NAPAS 24/7 Gateway',
      category: 'payment',
      iconName: 'QrCode',
      description: 'Gạch nợ tức thì qua mã QR động và đối soát giao dịch tiền cọc IPN',
      connected: true,
      lastSync: 'Vừa xong',
      requestCount24h: 1420,
      endpoint: 'https://api.vietqr.io/v2',
      apiKeyMasked: 'vqr_live_••••••••9988',
      latencyMs: 95,
      provider: 'NAPAS / VietQR API',
    },
  });

  await prisma.integrationApp.upsert({
    where: { appCode: 'zalo_zns' },
    update: {},
    create: {
      appCode: 'zalo_zns',
      name: 'Zalo Notification Service (ZNS)',
      category: 'communication',
      iconName: 'MessageSquare',
      description: 'Gửi thông báo tiến độ thanh toán, duyệt cọc và xác nhận giao dịch qua Zalo OA',
      connected: true,
      lastSync: '2 phút trước',
      requestCount24h: 3580,
      endpoint: 'https://business.openapi.zalo.me/message/template',
      apiKeyMasked: 'zalo_token_••••••••7766',
      latencyMs: 110,
      provider: 'Zalo Cloud Platform',
    },
  });

  await prisma.integrationApp.upsert({
    where: { appCode: 'smartca' },
    update: {},
    create: {
      appCode: 'smartca',
      name: 'VNPT SmartCA Chữ Ký Số Từ Xa',
      category: 'legal',
      iconName: 'FileCheck',
      description: 'Ký số điện tử SHA-256 có giá trị pháp lý tương đương mộc đỏ cho HĐMB và Biên bản bàn giao',
      connected: true,
      lastSync: '15 phút trước',
      requestCount24h: 420,
      endpoint: 'https://smartca.vnpt.vn/api/v1',
      apiKeyMasked: 'vnpt_ca_••••••••1122',
      latencyMs: 145,
      provider: 'Tập đoàn Bưu chính Viễn thông VNPT',
    },
  });

  await prisma.integrationApp.upsert({
    where: { appCode: 'misa_erp' },
    update: {},
    create: {
      appCode: 'misa_erp',
      name: 'MISA AMIS Doanh Nghiệp ERP',
      category: 'finance',
      iconName: 'Database',
      description: 'Đồng bộ doanh thu, hóa đơn điện tử e-Invoice và hoạch toán kế toán xây dựng',
      connected: true,
      lastSync: '30 phút trước',
      requestCount24h: 890,
      endpoint: 'https://actapp.misa.vn/api/v1',
      apiKeyMasked: 'misa_app_••••••••5544',
      latencyMs: 180,
      provider: 'Công ty Cổ phần MISA',
    },
  });

  await prisma.webhookConfig.upsert({
    where: { id: 'wh-1' },
    update: {},
    create: {
      id: 'wh-1',
      name: 'Đồng Bộ Ký Hợp Đồng Sang ERP MISA',
      url: 'https://erp.novaland.com.vn/api/webhooks/contract-signed',
      events: ['contract.signed', 'booking.confirmed', 'payment.reconciled'],
      secret: 'whsec_novacrm_misa_2026',
      status: 'ACTIVE',
      failureCount: 0,
      lastTriggeredAt: new Date(),
    },
  });

  console.log('✅ Đã nạp toàn diện dữ liệu Giai đoạn 5: Marketing, Loyalty, Gamification, Marketplace B2B, Surveys, Mortgage, BI & Integrations ERP!');
  console.log('🎉 KHỞI TẠO TOÀN DIỆN CƠ SỞ DỮ LIỆU THẬT POSTGRESQL & REDIS HOÀN TẤT!');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi nạp dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
