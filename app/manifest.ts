import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NOVA CRM - Nền Tảng Quản Trị Bất Động Sản & PropTech',
    short_name: 'NOVA CRM',
    description: 'Hệ sinh thái PropTech số 1 Việt Nam: Quản trị rổ hàng, sa bàn ảo 3D, sàn đấu giá trực tuyến, thanh toán VietQR và thẩm định tín dụng.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#2563eb',
    lang: 'vi',
    orientation: 'portrait',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  };
}
