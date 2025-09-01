import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions as any)
  const user = session?.user as any
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">แดชบอร์ด</h1>
      {!user ? (
        <p>กรุณาเข้าสู่ระบบก่อนใช้งาน</p>
      ) : (
        <div className="space-y-4">
          <p>สวัสดี {user.name || 'ผู้ใช้'}</p>
          <ul className="list-disc list-inside text-blue-600">
            <li><Link href="/orders">คำสั่งซื้อของฉัน</Link></li>
            <li><Link href="/courses">คอร์สทั้งหมด</Link></li>
          </ul>
        </div>
      )}
    </div>
  )
}

