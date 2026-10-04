export interface ChecklistItem {
  id: string;
  category: 'KIEN_TRUC' | 'ME' | 'CAP_THOAT_NUOC' | 'NOI_THAT' | 'PCCC';
  categoryLabel: string;
  criteria: string;
  isPassed: boolean;
  notes?: string;
}

export const FIFTY_TECHNICAL_CHECKLIST_CRITERIA: Omit<ChecklistItem, 'isPassed'>[] = [
  // 1. Kiến trúc & Kết cấu (10 criteria)
  { id: 'KT-01', category: 'KIEN_TRUC', categoryLabel: 'Kiến trúc & Kết cấu', criteria: 'Tường trát phẳng, không nứt chân chim hoặc rạn nứt kết cấu' },
  { id: 'KT-02', category: 'KIEN_TRUC', categoryLabel: 'Kiến trúc & Kết cấu', criteria: 'Sơn nước nội thất 2 lớp đồng màu, không ố vàng, không bong tróc' },
  { id: 'KT-03', category: 'KIEN_TRUC', categoryLabel: 'Kiến trúc & Kết cấu', criteria: 'Ron gạch sàn đồng đều 2mm, gạch không bị rộp hoặc lệch mép' },
  { id: 'KT-04', category: 'KIEN_TRUC', categoryLabel: 'Kiến trúc & Kết cấu', criteria: 'Độ dốc sàn ban công và logia đạt chuẩn thoát nước (i = 1 - 2%)' },
  { id: 'KT-05', category: 'KIEN_TRUC', categoryLabel: 'Kiến trúc & Kết cấu', criteria: 'Màng chống thấm sàn vệ sinh và ban công ngâm nước nghiệm thu đạt' },
  { id: 'KT-06', category: 'KIEN_TRUC', categoryLabel: 'Kiến trúc & Kết cấu', criteria: 'Lan can kính cường lực 12mm chịu lực, tay vịn Inox 304 vững chắc' },
  { id: 'KT-07', category: 'KIEN_TRUC', categoryLabel: 'Kiến trúc & Kết cấu', criteria: 'Cao độ trần thạch cao chìm chuẩn cao độ theo bản vẽ thiết kế' },
  { id: 'KT-08', category: 'KIEN_TRUC', categoryLabel: 'Kiến trúc & Kết cấu', criteria: 'Cửa chính chống cháy đóng mở êm, kín khít, không vênh góc' },
  { id: 'KT-09', category: 'KIEN_TRUC', categoryLabel: 'Kiến trúc & Kết cấu', criteria: 'Cửa sổ nhôm Xingfa kính hộp Low-E cách âm, kín nước áp lực cao' },
  { id: 'KT-10', category: 'KIEN_TRUC', categoryLabel: 'Kiến trúc & Kết cấu', criteria: 'Gioăng cao su EPDM đàn hồi tốt, nẹp chỉ cửa liền mạch thẩm mỹ' },

  // 2. Cơ điện M&E (10 criteria)
  { id: 'ME-01', category: 'ME', categoryLabel: 'Cơ điện & Chiếu sáng (M&E)', criteria: 'Aptomat chống giật RCBO từng phân vùng ngắt mạch chính xác' },
  { id: 'ME-02', category: 'ME', categoryLabel: 'Cơ điện & Chiếu sáng (M&E)', criteria: 'Tất cả ổ cắm điện 220V có chân tiếp địa an toàn, đúng cực tính' },
  { id: 'ME-03', category: 'ME', categoryLabel: 'Cơ điện & Chiếu sáng (M&E)', criteria: 'Công tắc đèn thông minh SmartHome phản hồi tức thì dưới 100ms' },
  { id: 'ME-04', category: 'ME', categoryLabel: 'Cơ điện & Chiếu sáng (M&E)', criteria: 'Đèn LED downlight âm trần góc chiếu chuẩn, không nhấp nháy tần số' },
  { id: 'ME-05', category: 'ME', categoryLabel: 'Cơ điện & Chiếu sáng (M&E)', criteria: 'Hệ thống ống đồng & bảo ôn điều hòa nén áp suất Nitơ đạt 450 PSI' },
  { id: 'ME-06', category: 'ME', categoryLabel: 'Cơ điện & Chiếu sáng (M&E)', criteria: 'Chuông hình Video Doorphone kết nối âm thanh hình ảnh sảnh lễ tân' },
  { id: 'ME-07', category: 'ME', categoryLabel: 'Cơ điện & Chiếu sáng (M&E)', criteria: 'Tủ điện tổng căn hộ dán nhãn sơ đồ mạch song ngữ rõ ràng' },
  { id: 'ME-08', category: 'ME', categoryLabel: 'Cơ điện & Chiếu sáng (M&E)', criteria: 'Cáp quang Internet tốc độ cao FPT/Viettel kéo ngầm sẵn sàng tín hiệu' },
  { id: 'ME-09', category: 'ME', categoryLabel: 'Cơ điện & Chiếu sáng (M&E)', criteria: 'Quạt hút thông gió khu vệ sinh vận hành êm ái, độ ồn dưới 42dB' },
  { id: 'ME-10', category: 'ME', categoryLabel: 'Cơ điện & Chiếu sáng (M&E)', criteria: 'Đèn chiếu sáng khẩn cấp lưu điện tối thiểu 120 phút khi mất điện' },

  // 3. Cấp thoát nước & Thiết bị vệ sinh (10 criteria)
  { id: 'TN-01', category: 'CAP_THOAT_NUOC', categoryLabel: 'Cấp thoát nước & TB Vệ sinh', criteria: 'Áp lực nước vòi sen tắm đứng đạt 2.5 - 3.5 bar, dòng chảy massage đều' },
  { id: 'TN-02', category: 'CAP_THOAT_NUOC', categoryLabel: 'Cấp thoát nước & TB Vệ sinh', criteria: 'Bồn cầu thông minh xả xoáy siphon êm ái, cơ chế xả nước kín không rò' },
  { id: 'TN-03', category: 'CAP_THOAT_NUOC', categoryLabel: 'Cấp thoát nước & TB Vệ sinh', criteria: 'Phễu thu sàn Inox 304 có bẫy nước ngăn mùi hôi và côn trùng 100%' },
  { id: 'TN-04', category: 'CAP_THOAT_NUOC', categoryLabel: 'Cấp thoát nước & TB Vệ sinh', criteria: 'Vòi lavabo nóng lạnh mạ Crom đóng ngắt dứt khoát, sục khí êm' },
  { id: 'TN-05', category: 'CAP_THOAT_NUOC', categoryLabel: 'Cấp thoát nước & TB Vệ sinh', criteria: 'Van khóa nước tổng và van nhánh từng phòng hoạt động trơn tru' },
  { id: 'TN-06', category: 'CAP_THOAT_NUOC', categoryLabel: 'Cấp thoát nước & TB Vệ sinh', criteria: 'Bình nước nóng Ariston/Ferroli đạt nhiệt độ làm nóng tiêu chuẩn 75°C' },
  { id: 'TN-07', category: 'CAP_THOAT_NUOC', categoryLabel: 'Cấp thoát nước & TB Vệ sinh', criteria: 'Ống thoát nước ngưng điều hòa có độ dốc thoát tự do, không ứ đọng' },
  { id: 'TN-08', category: 'CAP_THOAT_NUOC', categoryLabel: 'Cấp thoát nước & TB Vệ sinh', criteria: 'Hệ thống bơm tăng áp biến tần tầng kỹ thuật cấp nước ổn định' },
  { id: 'TN-09', category: 'CAP_THOAT_NUOC', categoryLabel: 'Cấp thoát nước & TB Vệ sinh', criteria: 'Đồng hồ nước kiểm định chì niêm phong đo lường chính xác m3' },
  { id: 'TN-10', category: 'CAP_THOAT_NUOC', categoryLabel: 'Cấp thoát nước & TB Vệ sinh', criteria: 'Toàn bộ mối hàn nhiệt ống PPR chịu nhiệt không có hiện tượng rò rỉ' },

  // 4. Nội thất rời & Thiết bị bàn giao (10 criteria)
  { id: 'NT-01', category: 'NOI_THAT', categoryLabel: 'Nội thất rời & Thiết bị', criteria: 'Khóa cửa thông minh Hafele nhận diện vân tay/mã số/thẻ từ dưới 0.5s' },
  { id: 'NT-02', category: 'NOI_THAT', categoryLabel: 'Nội thất rời & Thiết bị', criteria: 'Bếp từ Bosch 3 vùng nấu nhận diện vùng đáy từ và tự ngắt an toàn' },
  { id: 'NT-03', category: 'NOI_THAT', categoryLabel: 'Nội thất rời & Thiết bị', criteria: 'Máy hút mùi công suất 750m3/h khử mùi than hoạt tính hoạt động êm' },
  { id: 'NT-04', category: 'NOI_THAT', categoryLabel: 'Nội thất rời & Thiết bị', criteria: 'Mặt đá bếp Vicostone chống thấm ố, góc cạnh bo vát tinh tế không sứt mẻ' },
  { id: 'NT-05', category: 'NOI_THAT', categoryLabel: 'Nội thất rời & Thiết bị', criteria: 'Bản lề cánh tủ bếp và ray kéo giảm chấn Blum trượt nhẹ êm ái' },
  { id: 'NT-06', category: 'NOI_THAT', categoryLabel: 'Nội thất rời & Thiết bị', criteria: 'Tủ quần áo âm tường gỗ An Cường chống ẩm E1 bề mặt Melamine chuẩn' },
  { id: 'NT-07', category: 'NOI_THAT', categoryLabel: 'Nội thất rời & Thiết bị', criteria: 'Sàn gỗ công nghiệp chịu nước 12mm phẳng phiu, hèm khóa khít không kêu' },
  { id: 'NT-08', category: 'NOI_THAT', categoryLabel: 'Nội thất rời & Thiết bị', criteria: 'Gương phòng tắm chống mờ sương có viền LED cảm ứng thông minh' },
  { id: 'NT-09', category: 'NOI_THAT', categoryLabel: 'Nội thất rời & Thiết bị', criteria: 'Hệ ray rèm âm trần trơn tru, khoảng hở ánh sáng theo tiêu chuẩn 5 sao' },
  { id: 'NT-10', category: 'NOI_THAT', categoryLabel: 'Nội thất rời & Thiết bị', criteria: 'Phụ kiện cửa sổ, chốt chặn gió, tay nắm Inox 304 sáng bóng không tì vết' },

  // 5. An toàn PCCC & Cứu nạn (10 criteria)
  { id: 'PC-01', category: 'PCCC', categoryLabel: 'An toàn PCCC & Cứu nạn', criteria: 'Đầu báo khói quang học trong căn hộ truyền tín hiệu báo động về BMS' },
  { id: 'PC-02', category: 'PCCC', categoryLabel: 'An toàn PCCC & Cứu nạn', criteria: 'Đầu phun chữa cháy tự động Sprinkler 68°C còn nguyên tem kiểm định' },
  { id: 'PC-03', category: 'PCCC', categoryLabel: 'An toàn PCCC & Cứu nạn', criteria: 'Hệ thống loa phát thanh thông báo khẩn cấp âm lượng rõ ràng > 75dB' },
  { id: 'PC-04', category: 'PCCC', categoryLabel: 'An toàn PCCC & Cứu nạn', criteria: 'Nút ấn báo cháy khẩn cấp hành lang kích hoạt chuông còi lập tức' },
  { id: 'PC-05', category: 'PCCC', categoryLabel: 'An toàn PCCC & Cứu nạn', criteria: 'Cửa chống cháy lối thoát hiểm 70 phút có tay đẩy panic, tự đóng kín' },
  { id: 'PC-06', category: 'PCCC', categoryLabel: 'An toàn PCCC & Cứu nạn', criteria: 'Van ngăn lửa tự động trên đường ống gió đóng kín khi nhiệt độ > 70°C' },
  { id: 'PC-07', category: 'PCCC', categoryLabel: 'An toàn PCCC & Cứu nạn', criteria: 'Bình chữa cháy khí CO2 và bột ABC tại tủ PCCC hành lang đủ áp suất kim xanh' },
  { id: 'PC-08', category: 'PCCC', categoryLabel: 'An toàn PCCC & Cứu nạn', criteria: 'Lối thoát hiểm và thang bộ tăng áp không có chướng ngại vật cản trở' },
  { id: 'PC-09', category: 'PCCC', categoryLabel: 'An toàn PCCC & Cứu nạn', criteria: 'Biển chỉ dẫn Exit dạ quang chiếu sáng liên tục dẫn hướng rõ ràng' },
  { id: 'PC-10', category: 'PCCC', categoryLabel: 'An toàn PCCC & Cứu nạn', criteria: 'Họng nước chữa cháy vách tường, cuộn vòi và lăng phun sẵn sàng áp lực' },
];
