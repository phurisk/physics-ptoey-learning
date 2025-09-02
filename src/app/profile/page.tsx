import { getServerSession } from "next-auth"
import type { Session } from "next-auth"
import { Card, CardContent } from "@/components/ui/card"
import { authOptions } from "@/lib/auth"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export default async function ProfilePage() {
  const session = (await getServerSession(authOptions as any)) as Session | null
  const user = session?.user
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-4">โปรไฟล์</h1>
          <p>กรุณาเข้าสู่ระบบเพื่อดูโปรไฟล์</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white pt-20">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">สวัสดี{user.name ? `, ${user.name}` : ''} 👋</h1>
          <p className="text-gray-600 mt-2">ยินดีต้อนรับกลับสู่พื้นที่การเรียนรู้ของคุณ</p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 p-1">
                  <Image
                    src={user.image || "/placeholder-user.jpg"}
                    alt="avatar"
                    width={88}
                    height={88}
                    className="rounded-full w-full h-full object-cover bg-white"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white fill-current" />
                </div>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name || "ผู้ใช้"}</h2>
                <p className="text-gray-600 mb-4">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <div className="font-semibold mb-1">คอร์สของฉัน</div>
                <div className="text-sm text-gray-600">ดูคอร์สที่คุณเป็นเจ้าของและเริ่มเรียนได้ทันที</div>
              </div>
              <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-white">
                <Link href="/enrollments">ดูคอร์สที่ซื้อแล้ว</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <div className="font-semibold mb-1">คำสั่งซื้อของฉัน</div>
                <div className="text-sm text-gray-600">ตรวจสอบสถานะการชำระเงินและอัพโหลดสลิป</div>
              </div>
              <Button asChild variant="outline">
                <Link href="/orders">ไปที่คำสั่งซื้อ</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
