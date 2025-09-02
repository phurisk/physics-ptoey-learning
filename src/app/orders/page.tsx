"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { uploadPaymentSlip, fetchOrders } from '@/lib/orders'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState<string | null>(null)

  const load = async () => {
    if (!session?.user?.id) return
    try {
      const data = await fetchOrders(session.user.id as string)
      setOrders(data)
    } catch (e: any) {
      setError(e.message || 'โหลดคำสั่งซื้อไม่สำเร็จ')
    }
  }

  useEffect(() => {
    if (status === 'authenticated') load()
  }, [status])

  if (status === 'loading') return <div className="min-h-screen bg-gray-50 pt-20"><div className="max-w-5xl mx-auto p-6">กำลังโหลด...</div></div>
  if (!session?.user?.id) return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">คำสั่งซื้อของฉัน</h1>
        <p>กรุณาเข้าสู่ระบบเพื่อดูคำสั่งซื้อ</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">คำสั่งซื้อของฉัน</h1>
        {error && <div className="text-red-600">{error}</div>}
        {!orders && !error && <div>กำลังโหลด...</div>}
        {orders?.length === 0 && <div>ยังไม่มีคำสั่งซื้อ</div>}
        {orders?.map((o) => (
          <Card key={o.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row gap-4 p-4 items-start">
                <div className="w-28 h-20 relative bg-gray-100 rounded">
                  {o.ebook?.coverImageUrl && (
                    <Image src={o.ebook.coverImageUrl} alt={o.ebook.title} fill className="object-cover rounded" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{o.ebook?.title || o.course?.title || `คำสั่งซื้อ #${o.id.slice(-8)}`}</div>
                  <div className="text-sm text-gray-600">ยอดสุทธิ ฿{o.total?.toLocaleString?.() || 0}</div>
                  <div className="text-sm mt-1">สถานะคำสั่งซื้อ: <span className="font-medium">{o.status}</span></div>
                  <div className="text-sm">สถานะการชำระเงิน: <span className="font-medium">{o.payment?.status || '-'}</span></div>
                </div>
              </div>
              {o.status === 'PENDING' && o.payment?.status === 'PENDING' && (
                <div className="px-4 pb-4">
                  <div className="text-sm mb-2">อัพโหลดสลิปการโอนเงิน (JPG/PNG/WebP, ไม่เกิน 10MB)</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        try {
                          setUploading(o.id)
                          await uploadPaymentSlip(o.id, file)
                          await load()
                          alert('อัพโหลดสลิปสำเร็จ กำลังรอตรวจสอบ')
                        } catch (err: any) {
                          alert(err.message || 'อัพโหลดสลิปไม่สำเร็จ')
                        } finally {
                          setUploading(null)
                          e.currentTarget.value = ''
                        }
                      }}
                      disabled={uploading === o.id}
                      className="block"
                    />
                    {uploading === o.id && <span className="text-sm text-gray-500">กำลังอัพโหลด...</span>}
                  </div>
                </div>
              )}
              {o.payment?.slipUrl && (
                <div className="px-4 pb-4 text-sm text-gray-600">มีสลิปอัพโหลดแล้ว</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

