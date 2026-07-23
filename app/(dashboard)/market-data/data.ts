export type RegionKey = 'thu_duc' | 'nam_sai_gon' | 'dong_nai';

export const REGIONS: Record<string, string> = {
  'thu_duc': 'Thành phố Thủ Đức (Q2, Q9)',
  'nam_sai_gon': 'Quận 7, Nam Sài Gòn',
  'dong_nai': 'Khu vực vệ tinh (Đồng Nai)'
};

export const MARKET_DATA = {
  thu_duc: {
    priceAvg: 120,
    priceChange: '+15%',
    liquidity: 180,
    liquidityChange: '-14%',
    yield: 4.5,
    priceTrend: [
      { year: '2021', price: 65, volume: 120 },
      { year: '2022', price: 72, volume: 145 },
      { year: '2023', price: 70, volume: 90 },
      { year: '2024', price: 85, volume: 160 },
      { year: '2025', price: 105, volume: 210 },
      { year: '2026', price: 120, volume: 180 },
    ],
    aiInsight: "Giá khu vực Thủ Đức liên tục phá đỉnh từ 2024 nhờ lực đẩy từ hạ tầng Vành đai 3. Tuy nhiên, khối lượng giao dịch năm 2026 đang có dấu hiệu chững lại, kén người mua hơn.",
    amenitiesRadar: [
      { subject: 'Giáo Dục', A: 90, fullMark: 100 },
      { subject: 'Y Tế', A: 85, fullMark: 100 },
      { subject: 'Mua Sắm', A: 95, fullMark: 100 },
      { subject: 'Giao Thông', A: 85, fullMark: 100 },
      { subject: 'Cây Xanh', A: 70, fullMark: 100 },
      { subject: 'An Ninh', A: 80, fullMark: 100 },
    ],
    infras: [
      { name: "Tuyến Metro Số 1 (Bến Thành - Suối Tiên)", desc: "Sẽ tạo cú hích tăng giá từ 5-10% cho các dự án bán kính 1km.", progress: 98, impact: "Rất Lớn" },
      { name: "Đường Vành Đai 3", desc: "Giảm ùn tắc giao thông cục bộ, thúc đẩy Logistics.", progress: 45, impact: "Trung Bình" }
    ]
  },
  nam_sai_gon: {
    priceAvg: 95,
    priceChange: '+8%',
    liquidity: 220,
    liquidityChange: '+5%',
    yield: 5.2,
    priceTrend: [
      { year: '2021', price: 60, volume: 150 },
      { year: '2022', price: 68, volume: 180 },
      { year: '2023', price: 65, volume: 120 },
      { year: '2024', price: 75, volume: 190 },
      { year: '2025', price: 88, volume: 200 },
      { year: '2026', price: 95, volume: 220 },
    ],
    aiInsight: "Nam Sài Gòn duy trì thanh khoản ổn định nhờ tỷ suất cho thuê cao và tiện ích hiện hữu hoàn thiện. Nhu cầu ở thực rất lớn.",
    amenitiesRadar: [
      { subject: 'Giáo Dục', A: 95, fullMark: 100 },
      { subject: 'Y Tế', A: 95, fullMark: 100 },
      { subject: 'Mua Sắm', A: 90, fullMark: 100 },
      { subject: 'Giao Thông', A: 60, fullMark: 100 }, // Kẹt xe
      { subject: 'Cây Xanh', A: 85, fullMark: 100 },
      { subject: 'An Ninh', A: 90, fullMark: 100 },
    ],
    infras: [
      { name: "Hầm chui Nguyễn Văn Linh - Nguyễn Hữu Thọ", desc: "Giải quyết bài toán kẹt xe kinh niên, khơi thông dòng vốn.", progress: 85, impact: "Lớn" },
      { name: "Cầu Thủ Thiêm 4", desc: "Kết nối trực tiếp Quận 7 với trung tâm tài chính Thủ Thiêm mới.", progress: 15, impact: "Rất Lớn" }
    ]
  },
  dong_nai: {
    priceAvg: 45,
    priceChange: '+12%',
    liquidity: 150,
    liquidityChange: '+25%',
    yield: 3.5,
    priceTrend: [
      { year: '2021', price: 25, volume: 80 },
      { year: '2022', price: 32, volume: 120 },
      { year: '2023', price: 30, volume: 70 },
      { year: '2024', price: 35, volume: 110 },
      { year: '2025', price: 40, volume: 140 },
      { year: '2026', price: 45, volume: 150 },
    ],
    aiInsight: "Khu vực vệ tinh đang đón sóng hạ tầng sân bay. Giá trị gia tăng dài hạn cực kỳ tốt nhờ các khu đô thị sinh thái quy mô lớn.",
    amenitiesRadar: [
      { subject: 'Giáo Dục', A: 60, fullMark: 100 },
      { subject: 'Y Tế', A: 65, fullMark: 100 },
      { subject: 'Mua Sắm', A: 70, fullMark: 100 },
      { subject: 'Giao Thông', A: 90, fullMark: 100 }, // Đường rộng, cao tốc
      { subject: 'Cây Xanh', A: 100, fullMark: 100 }, // Sinh thái
      { subject: 'An Ninh', A: 80, fullMark: 100 },
    ],
    infras: [
      { name: "Sân bay Quốc tế Long Thành", desc: "Động lực phát triển số 1 của toàn vùng kinh tế trọng điểm phía Nam.", progress: 65, impact: "Rất Lớn" },
      { name: "Cao tốc Biên Hòa - Vũng Tàu", desc: "Kết nối Đồng Nai ra cảng biển nước sâu và khu du lịch.", progress: 30, impact: "Lớn" }
    ]
  }
};

export const MACRO_DATA = [
  { quarter: 'Q1/25', rate: 7.5, gdp: 5.2, fdi: 4.5 },
  { quarter: 'Q2/25', rate: 7.2, gdp: 5.8, fdi: 5.0 },
  { quarter: 'Q3/25', rate: 6.8, gdp: 6.1, fdi: 6.2 },
  { quarter: 'Q4/25', rate: 6.5, gdp: 6.5, fdi: 8.1 },
  { quarter: 'Q1/26', rate: 6.0, gdp: 6.8, fdi: 7.5 },
  { quarter: 'Q2/26', rate: 5.8, gdp: 7.1, fdi: 9.0 },
];
