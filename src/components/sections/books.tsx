"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getEbooks, type PublicEbook } from "@/lib/api-client"

export default function Books() {
  const [ebooks, setEbooks] = useState<PublicEbook[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    getEbooks({ limit: 4 })
      .then(({ items }) => {
        if (mounted) setEbooks(items)
      })
      .catch((e) => {
        console.error(e)
        if (mounted) setError("ไม่สามารถดึงรายการหนังสือได้")
      })
    return () => {
      mounted = false
    }
  }, [])

  const items = useMemo(() => {
    return (ebooks || []).map((b) => {
      const original = typeof b.price === 'number' ? b.price : 0
      const discounted = typeof b.discountPrice === 'number' && b.discountPrice! > 0 ? b.discountPrice! : original
      return {
        id: b.id,
        title: b.title,
        image: b.coverImageUrl || "/placeholder.svg",
        description: b.description || "",
        originalPrice: original,
        discountPrice: discounted,
      }
    })
  }, [ebooks])

  const calculateDiscount = (original: number, discounted: number) => {
    if (!original || original <= 0 || discounted >= original) return 0
    return Math.round(((original - discounted) / original) * 100)
  }

  return (
    <section className="py-12 lg:py-24 bg-white"> 
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
    
        <div className="text-center mb-8 lg:mb-12"> 
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4 text-balance bg-[#ffbf00] px-8 py-4 w-fit mx-auto rounded-full shadow-sm"> 
            หนังสือของเรา
          </h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto text-pretty"> 
            หนังสือเรียนฟิสิกส์คุณภาพสูง เขียนโดยอาจารย์เต้ย พร้อมเทคนิคการแก้โจทย์ที่เข้าใจง่าย
          </p>
        </div>

     
        <div
          className="
            grid grid-cols-2        /* MOBILE-ONLY: 2 คอลัมน์ */
            md:grid-cols-2          /* tablet เหมือนเดิม */
            lg:grid-cols-4          /* desktop เหมือนเดิม */
            gap-4 md:gap-8          /* MOBILE-ONLY: ลดช่องไฟ */
          "
        >
          {!ebooks && !error && [0,1,2,3].map((i) => (
            <Card key={`s-${i}`} className="pt-0 overflow-hidden">
              <div className="animate-pulse">
                <div className="aspect-[640/906] bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 w-3/4" />
                  <div className="h-4 bg-gray-200 w-full" />
                </div>
              </div>
            </Card>
          ))}

          {items.map((book) => (
            <Card
              key={book.id}
              className="
                group hover:shadow-xl transition-all duration-300 overflow-hidden pt-0
              "
            >
              <CardContent className="p-0">
            
                <div className="aspect-[640/906] relative overflow-hidden">
                  <Image
                    src={book.image || "/placeholder.svg"}
                    alt={book.title}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                 
                  <Badge
                    className="
                      absolute top-2 right-2 lg:top-4 lg:right-4  /* MOBILE-ONLY: ขยับ badge ชิดขอบน้อยลง */
                      bg-red-500 text-white text-[10px] lg:text-xs /* MOBILE-ONLY: ย่อฟอนต์ */
                      px-1.5 py-0.5 lg:px-2 lg:py-0.5              /* MOBILE-ONLY: ย่อ padding */
                    "
                  >
                    -{calculateDiscount(book.originalPrice, book.discountPrice)}%
                  </Badge>
                </div>

               
                <div className="p-3 md:p-6"> 
                  <h3 className="text-sm md:text-xl font-semibold text-gray-900 mb-2 md:mb-3 text-balance line-clamp-2">
                
                    {book.title}
                  </h3>

                
                  <p className="hidden md:block text-gray-600 mb-4 text-pretty leading-relaxed">
                    {book.description}
                  </p>

               
                  <div className="flex items-center mb-3 md:mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs md:text-sm text-gray-500 ml-2">(4.9)</span>
                  </div>

                 
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg md:text-2xl font-bold text-yellow-600">
                        ฿{book.discountPrice.toLocaleString()}
                      </span>
                      {book.discountPrice < book.originalPrice && (
                        <span className="text-sm md:text-lg text-gray-400 line-through">
                          ฿{book.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                
                  <Button
                    className="
                      w-full bg-yellow-400 hover:bg-yellow-500 text-white font-medium
                      py-2 md:py-3 text-sm md:text-base  /* MOBILE-ONLY: ปุ่มเตี้ยลง + ฟอนต์เล็กลง */
                    "
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    สั่งซื้อเลย
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {error && (
            <div className="col-span-full text-center text-gray-500">{error}</div>
          )}
        </div>

      
        <div className="text-center mt-10 lg:mt-12"> 
          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
            ต้องการหนังสือเพิ่มเติม หรือมีคำถามเกี่ยวกับหนังสือ?
          </p>
          <Button
            variant="outline"
            size="lg"
            className="
              border-yellow-400 text-yellow-600 hover:bg-yellow-50 bg-transparent
              h-10 px-4 text-sm md:h-12 md:px-6 md:text-base  /* MOBILE-ONLY: ปรับขนาดปุ่ม */
            "
          >
            ติดต่อสอบถาม
          </Button>
        </div>
      </div>
    </section>
  )
}
