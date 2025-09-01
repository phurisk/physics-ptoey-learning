import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Image from "next/image"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions as any)
  const user = session?.user as any
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">โปรไฟล์</h1>
        <p>กรุณาเข้าสู่ระบบเพื่อดูโปรไฟล์</p>
      </div>
    )
  }
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">โปรไฟล์</h1>
      <div className="flex items-center gap-4">
        <Image src={user.image || '/placeholder-user.jpg'} alt="avatar" width={64} height={64} className="rounded-full border" />
        <div>
          <div className="font-semibold">{user.name || 'ผู้ใช้'}</div>
          <div className="text-gray-600 text-sm">{user.email}</div>
        </div>
      </div>
    </div>
  )
}

