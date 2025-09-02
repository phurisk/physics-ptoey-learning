"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

export default function MyCoursesPage() {
  const { data: session, status } = useSession()
  const [items, setItems] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      if (!session?.user?.id) return
      try {
        const res = await fetch(`/api/my-courses?userId=${encodeURIComponent(session.user.id as string)}`, { cache: 'no-store' })
        const json = await res.json()
        if (!res.ok || !json.success) throw new Error(json.error || 'โหลดคอร์สไม่สำเร็จ')
        setItems(json.courses || [])
      } catch (e: any) {
        setError(e.message || 'เกิดข้อผิดพลาด')
      }
    }
    if (status === 'authenticated') run()
  }, [status])

  if (status === 'loading') return <div className="min-h-screen bg-gray-50 pt-20"><div className="max-w-6xl mx-auto p-6">กำลังโหลด...</div></div>
  if (!session?.user?.id) return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">คอร์สของฉัน</h1>
        <p>กรุณาเข้าสู่ระบบเพื่อดูคอร์ส</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">คอร์สของฉัน</h1>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {!items && !error && <div>กำลังโหลด...</div>}
        {items?.length === 0 && <div>ยังไม่มีคอร์สที่เป็นเจ้าของ</div>}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items?.map((c) => (
            <Card key={c.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video relative bg-gray-100">
                  {c.coverImageUrl && (
                    <Image src={c.coverImageUrl} alt={c.title} fill className="object-cover" />
                  )}
                </div>
                <div className="p-4">
                  <div className="font-semibold mb-1">{c.title}</div>
                  <div className="text-sm text-gray-600 mb-3">{c.category?.name || '-'}</div>
                  <Link href={`/courses/${c.id}`} className="text-yellow-600">เข้าเรียน →</Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

