export const runtime = 'edge';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  // Determine response based on prompt context (mocking AI capability)
  let mockResponse = "";
  if (prompt.includes("Action: email")) {
    mockResponse = `Kính gửi anh Tuấn,\n\nDựa trên cuộc trao đổi gần đây và mục tiêu đầu tư sinh lời của anh, em xin phép gửi anh bảng giá ưu đãi mới nhất cho dòng sản phẩm Biệt thự song lập tại Aqua City.\n\nĐặc biệt, các căn này đều có hướng Đông Nam, rất phù hợp với phong thủy mệnh Hỏa của anh. Anh tham khảo tài liệu đính kèm nhé.\n\nTrân trọng,\nTrợ lý AI CRM`;
  } else if (prompt.includes("Action: zalo")) {
    mockResponse = `Dạ chào anh Tuấn, em từ bên dự án Aqua City đây ạ. Không biết anh đã xem qua thiết kế 3D nhà mẫu căn góc em gửi qua Zalo tuần trước chưa ạ? Nếu anh thu xếp được thời gian, cuối tuần này em có thể đón anh đi xem thực tế dự án luôn ạ!`;
  } else if (prompt.includes("Action: proposal")) {
    mockResponse = `[BẢN ĐỀ XUẤT ĐẦU TƯ]\n- Khách hàng: Nguyễn Văn Tuấn\n- Sản phẩm đề xuất: Biệt thự đơn lập Aqua City (Ven sông)\n- Ngân sách dự kiến: 15-20 Tỷ VNĐ\n- Lý do phù hợp: Khách hàng có điểm tín dụng Hạng A, nhu cầu vay 5-7 tỷ, khẩu vị rủi ro mức cao. Biệt thự ven sông có tiềm năng tăng giá 20%/năm, phù hợp chiến lược lãi vốn trung hạn.`;
  } else {
    mockResponse = `[TÓM TẮT]\nKhách hàng quan tâm dự án nghỉ dưỡng ven sông. Yêu cầu gửi báo giá 3 căn góc. Khả năng chốt cao trong tháng này vì khách đã chuẩn bị sẵn tài chính.`;
  }

  // Simulate streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const words = mockResponse.split(" ");
      for (let i = 0; i < words.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 50));
        controller.enqueue(new TextEncoder().encode(words[i] + " "));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
