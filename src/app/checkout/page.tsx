"use client"

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { createOrder } from '@/lib/orders'

function CheckoutStartContent() {
  const router = useRouter()
  const params = useSearchParams()
  const { data: session, status } = useSession()

  const itemType = (params.get('itemType') || '').toLowerCase() as 'course' | 'ebook'
  const itemId = params.get('itemId') || ''

  const [item, setItem] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [coupon, setCoupon] = useState('')
  const [couponResult, setCouponResult] = useState<any | null>(null)
  const [validating, setValidating] = useState(false)

  const subtotal = useMemo(() => {
    if (!item) return 0
    if (itemType === 'course') return item.price || 0
    return item.discountPrice || item.price || 0
  }, [item, itemType])

  const finalTotal = useMemo(() => {
    if (!couponResult) return subtotal
    return Math.max(0, Number(couponResult.finalTotal) || subtotal)
  }, [couponResult, subtotal])

  useEffect(() => {
    if (!itemType || !itemId) {
      setError('ไม่มีข้อมูลสินค้า')
      setLoading(false)
      return
    }
    const run = async () => {
      try {
        setLoading(true)
        if (itemType === 'course') {
          const res = await fetch(`/api/courses/${encodeURIComponent(itemId)}`, { cache: 'no-store' })
          const json = await res.json()
          if (!res.ok || !json.success) throw new Error(json.error || 'ไม่พบคอร์ส')
          setItem(json.data)
        } else {
          const res = await fetch(`/api/ebooks/${encodeURIComponent(itemId)}`, { cache: 'no-store' })
          const json = await res.json()
          if (!res.ok || !json.success) throw new Error(json.error || 'ไม่พบหนังสือ')
          setItem(json.data)
        }
      } catch (e: any) {
        setError(e.message || 'เกิดข้อผิดพลาด')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [itemType, itemId])

  const validateCoupon = async () => {
    if (!coupon) return
    if (!session?.user?.id) { router.push('/login'); return }
    try {
      setValidating(true)
      setCouponResult(null)
      const payload = {
        code: coupon.trim(),
        userId: session.user.id,
        itemType,
        itemId,
        subtotal
      }
      const res = await fetch('/api/coupons/validate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'คูปองไม่ถูกต้อง')
      setCouponResult(json.data)
    } catch (e: any) {
      setCouponResult(null)
      alert(e.message || 'ตรวจสอบคูปองไม่สำเร็จ')
    } finally {
      setValidating(false)
    }
  }

  const proceed = async () => {
    if (!session?.user?.id) {
      const current = typeof window !== 'undefined' ? window.location.href : undefined
      router.push(current ? `/login?callbackUrl=${encodeURIComponent(current)}&msg=login_required` : '/login?msg=login_required')
      return
    }
    try {
      const data = await createOrder({
        userId: session.user.id as string,
        itemType,
        itemId,
        couponCode: couponResult ? coupon.trim() : undefined,
      })
      if (data.isFree) {
        router.push('/enrollments')
      } else {
        router.push(`/checkout/${encodeURIComponent(data.orderId)}`)
      }
    } catch (e: any) {
      alert(e.message || 'สร้างคำสั่งซื้อไม่สำเร็จ')
    }
  }

  if (status === 'loading') return <div className="min-h-screen bg-gray-50 pt-20"><div className="max-w-3xl mx-auto p-6">กำลังโหลด...</div></div>
  if (loading) return <div className="min-h-screen bg-gray-50 pt-20"><div className="max-w-3xl mx-auto p-6">กำลังโหลด...</div></div>
  if (error) return <div className="min-h-screen bg-gray-50 pt-20"><div className="max-w-3xl mx-auto p-6 text-red-600">{error}</div></div>

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">ยืนยันการสั่งซื้อ</h1>
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="font-semibold">{item?.title || (itemType === 'course' ? 'คอร์ส' : 'หนังสือ')}</div>
            <div className="text-sm text-gray-600">ยอดสุทธิ: ฿{subtotal.toLocaleString()}</div>
            <div className="flex gap-2 items-center">
              <Input placeholder="คูปองส่วนลด (ถ้ามี)" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
              <Button variant="outline" disabled={!coupon || validating} onClick={validateCoupon}>ตรวจสอบคูปอง</Button>
            </div>
            {couponResult && (
              <div className="text-sm text-green-700">คูปองใช้ได้: {couponResult.coupon?.code} → ยอดสุทธิใหม่ ฿{(couponResult.finalTotal || subtotal).toLocaleString()}</div>
            )}
            <div className="pt-2">
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-white" onClick={proceed}>ดำเนินการต่อ</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CheckoutStartPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutStartContent />
    </Suspense>
  )
}
