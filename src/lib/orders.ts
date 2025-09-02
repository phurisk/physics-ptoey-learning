"use client"

export type CreateOrderParams = {
  userId: string
  itemType: 'course' | 'ebook'
  itemId: string
  couponCode?: string
  shippingAddress?: {
    name?: string
    phone?: string
    address?: string
    district?: string
    province?: string
    postalCode?: string
  }
}

export async function createOrder(params: CreateOrderParams) {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  const json = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'สร้างคำสั่งซื้อไม่สำเร็จ')
  }
  return json.data as {
    orderId: string
    paymentId?: string
    paymentRef?: string
    total: number
    isFree: boolean
  }
}

export async function fetchOrders(userId: string) {
  const res = await fetch(`/api/orders?userId=${encodeURIComponent(userId)}`, { cache: 'no-store' })
  const json = await res.json()
  if (!res.ok || !json.success) throw new Error(json.error || 'โหลดคำสั่งซื้อไม่สำเร็จ')
  return json.data as any[]
}

export async function uploadPaymentSlip(orderId: string, file: File) {
  const fd = new FormData()
  fd.append('orderId', orderId)
  fd.append('slip', file)
  const res = await fetch('/api/payments/upload-slip', { method: 'POST', body: fd })
  const json = await res.json()
  if (!res.ok || !json.success) throw new Error(json.error || 'อัพโหลดสลิปไม่สำเร็จ')
  return json.data
}

