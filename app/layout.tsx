import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://novacrm.vn";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "NOVA CRM - Nền Tảng Quản Trị Bất Động Sản & PropTech Toàn Diện",
    template: "%s | NOVA CRM",
  },
  description:
    "Hệ sinh thái PropTech & Quản trị BĐS số 1 Việt Nam. Tích hợp ma trận giỏ hàng, bảng giá thời gian thực, sa bàn ảo 3D VR360, thanh toán VietQR Pro, thẩm định lãi vay và quản trị gia sản VIP.",
  keywords: [
    "Nova CRM",
    "Bất động sản",
    "PropTech Việt Nam",
    "Quản trị rổ hàng BĐS",
    "Sa bàn ảo VR 360",
    "Bảng hàng Novaland",
    "Đấu giá BĐS trực tuyến",
    "Quản trị gia sản VIP",
    "VietQR BĐS",
    "Khấu hao vay mua nhà",
    "Sàn liên kết B2B",
    "Co-brokering 50/50",
    "Nghiệm thu bàn giao nhà",
    "Sổ hồng 5 cấp",
    "Vận hành đô thị thông minh",
  ],
  authors: [{ name: "NOVA CRM Enterprise Architecture Team", url: APP_URL }],
  creator: "NOVA CRM Enterprise",
  publisher: "NOVA CRM",
  category: "Real Estate & PropTech",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NOVA CRM - Nền Tảng Quản Trị Bất Động Sản & PropTech Toàn Diện",
    description:
      "Hệ sinh thái PropTech & Quản trị BĐS số 1 Việt Nam với sa bàn ảo 3D, thanh toán VietQR, sàn đấu giá trực tiếp và quản trị gia sản VIP.",
    url: APP_URL,
    siteName: "NOVA CRM",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "NOVA CRM PropTech Suite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NOVA CRM - Nền Tảng Quản Trị Bất Động Sản & PropTech Toàn Diện",
    description:
      "Hệ sinh thái PropTech & Quản trị BĐS số 1 Việt Nam với sa bàn ảo 3D, sàn đấu giá trực tiếp và quản trị gia sản VIP.",
    images: ["/og-image.svg"],
    creator: "@novacrm",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${APP_URL}/#organization`,
      name: "NOVA CRM",
      url: APP_URL,
      logo: `${APP_URL}/og-image.svg`,
      description: "Hệ sinh thái PropTech & Quản trị BĐS số 1 Việt Nam.",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+84-1900-6868",
        contactType: "customer service",
        areaServed: "VN",
        availableLanguage: ["Vietnamese", "English"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${APP_URL}/#website`,
      url: APP_URL,
      name: "NOVA CRM",
      publisher: {
        "@id": `${APP_URL}/#organization`,
      },
      inLanguage: "vi-VN",
    },
    {
      "@type": "SoftwareApplication",
      name: "NOVA CRM Enterprise PropTech Platform",
      operatingSystem: "Web Browser, iOS, Android",
      applicationCategory: "BusinessApplication",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "VND",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "1250",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
