import type React from "react"
import { Suspense } from "react"
import type { Metadata } from "next"
import { GeistMono } from "geist/font/mono"
import { Sarabun } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import AppSessionProvider from "@/components/session-provider"

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-sarabun",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ฟิสิกส์ครูพี่เต้ย - เรียนฟิสิกส์อย่างเป็นระบบกับฟิสิกส์พี่เต้ย",
  description: "เรียนฟิสิกส์กับครูพี่เต้ย ผู้เชี่ยวชาญด้านฟิสิกส์ที่มีประสบการณ์การสอนมากมาย พร้อมเทคนิคการสอนที่เข้าใจง่าย",
  keywords: "ฟิสิกส์, กวดวิชา, ครูพี่เต้ย, เรียนฟิสิกส์, GAT, PAT, ฟิสิกส์ม.ปลาย",
  generator: "physics-ptoey.app",
  icons: {
    icon: "/new-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th">
      <body className={`font-sans ${sarabun.variable} ${GeistMono.variable} antialiased`}>
        <AppSessionProvider>
          <Suspense fallback={null}>
            <Navigation />
          </Suspense>
          <main className="pt-16 lg:pt-20">{children}</main>
        </AppSessionProvider>
      </body>
    </html>
  )
}
