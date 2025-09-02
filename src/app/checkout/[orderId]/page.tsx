"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { uploadPaymentSlip } from '@/lib/orders'

const BANK_ACCOUNT = '1078898751'
const BANK_NAME = 'นาย เชษฐา พวงบุบผา'

export default function CheckoutConfirmPage() {
  const params = useParams<{ orderId: string }>()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [order, setOrder] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const isCourse = useMemo(() => order?.orderType === 'COURSE', [order])

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/orders/${encodeURIComponent(params.orderId)}`, { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'ไม่พบคำสั่งซื้อ')
      setOrder(json.data)
    } catch (e: any) {
      setError(e.message || 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') load()
  }, [status])

  const onSelectFile = (f: File | undefined) => {
    if (!f) return setFile(null)
    const okType = ['image/jpeg', 'image/jpg', 'image/png']
    if (!okType.includes(f.type)) { alert('รองรับเฉพาะ .jpg และ .png'); return }
    if (f.size > 2 * 1024 * 1024) { alert('ขนาดไฟล์ต้องไม่เกิน 2MB'); return }
    setFile(f)
  }

  const doConfirm = async () => {
    if (!order) return
    if (!file) { alert('กรุณาแนบสลิปก่อนยืนยัน'); return }
    try {
      setUploading(true)
      await uploadPaymentSlip(order.id, file)
      // หลังอัพโหลด ลองรีเฟรชคำสั่งซื้อและตรวจ enrollment (กรณีคอร์ส)
      await load()
      if (isCourse && session?.user?.id && order?.course?.id) {
        const res = await fetch(`/api/enrollments?userId=${encodeURIComponent(session.user.id as string)}&courseId=${encodeURIComponent(order.course.id)}`, { cache: 'no-store' })
        const json = await res.json()
        if (json?.enrollment) {
          router.push('/enrollments')
          return
        }
      }
      alert('อัพโหลดสลิปสำเร็จ กำลังรอการตรวจสอบ')
    } catch (e: any) {
      alert(e.message || 'ยืนยันการโอนไม่สำเร็จ')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
      setFile(null)
    }
  }

  if (status === 'loading' || loading) return <div className="min-h-screen bg-gray-50 pt-20"><div className="max-w-3xl mx-auto p-6">กำลังโหลด...</div></div>
  if (error) return <div className="min-h-screen bg-gray-50 pt-20"><div className="max-w-3xl mx-auto p-6 text-red-600">{error}</div></div>

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">ยืนยันการโอน</h1>
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="font-semibold">คำสั่งซื้อ #{order.id.slice(-8)}</div>
            <div className="text-sm text-gray-600">สินค้า: {order.ebook?.title || order.course?.title}</div>
            <div className="text-sm">ยอดรวม: ฿{(order.total || 0).toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="font-semibold">โอนเข้าบัญชี</div>
            <div className="text-sm">ชื่อบัญชี: {BANK_NAME}</div>
            <div className="text-sm">เลขบัญชี: {BANK_ACCOUNT} <Button variant="outline" className="ml-2" onClick={() => navigator.clipboard.writeText(BANK_ACCOUNT)}>คัดลอก</Button></div>
            <div className="text-sm text-gray-600">แนบสลิปการโอน (.jpg, .png ไม่เกิน 2MB)</div>
            <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png" onChange={(e) => onSelectFile(e.target.files?.[0] || undefined)} />
            <div>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-white" disabled={uploading} onClick={doConfirm}>
                {uploading ? 'กำลังอัพโหลด...' : 'ยืนยันการโอน'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

