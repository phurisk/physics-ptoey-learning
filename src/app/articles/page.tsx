import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getPosts } from "@/lib/api-client"

const PAGE_SIZE = 9

export const metadata = {
  title: "บทความทั้งหมด | Physics Ptoey",
  description: "รวมบทความ เทคนิคการเรียนฟิสิกส์ และแนะแนวการสอบ",
}

type Props = {
  searchParams?: { page?: string }
}

export default async function ArticlesIndexPage({ searchParams }: Props) {
  const raw = searchParams?.page ?? "1"
  const page = Math.max(1, Number.isNaN(Number(raw)) ? 1 : Number(raw))

  // Fetch all active posts and paginate locally for now
  const posts = await getPosts()
  const sorted = posts.sort((a, b) => new Date(b.publishedAt || b.createdAt || 0).getTime() - new Date(a.publishedAt || a.createdAt || 0).getTime())
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  if (page > totalPages) redirect(`/articles?page=${totalPages}`)
  const start = (page - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE
  const pageItems = sorted.slice(start, end)

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">
            บทความทั้งหมด
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
            อัปเดตความรู้ฟิสิกส์ เคล็ดลับทำข้อสอบ และแนวคิดที่ใช้ได้จริง
          </p>
        </div>


        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pageItems.map((article) => (
            <Card
              key={`${article.id}-${article.slug ?? ""}`} 
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white"
            >
              <CardContent className="p-0">
                <Link href={`/articles/${article.slug}`}>
                  <div className="aspect-[16/10] relative overflow-hidden cursor-pointer">
                    {article.imageUrl && (
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    {!article.imageUrl && (
                      <div className="w-full h-full bg-gray-100" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </Link>

                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3 gap-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(article.publishedAt || article.createdAt || Date.now()).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <Link href={`/articles/${article.slug}`}>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 text-balance group-hover:text-yellow-600 transition-colors duration-200">
                      {article.title}
                    </h3>
                  </Link>

                  <p className="text-gray-600 mb-6 text-pretty leading-relaxed">
                    {article.excerpt || ''}
                  </p>

                  <Button asChild variant="ghost" className="group/btn p-0 h-auto text-yellow-600 hover:text-yellow-700">
                    <Link href={`/articles/${article.slug}`}>
                      อ่านต่อ
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>


        <div className="flex items-center justify-center gap-3 mt-12">

          {page <= 1 ? (
            <Button variant="outline" disabled>
              ← หน้าก่อนหน้า
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link href={`/articles?page=${page - 1}`}>← หน้าก่อนหน้า</Link>
            </Button>
          )}

          <span className="text-sm text-gray-600" aria-current="page">
            หน้า {page} / {totalPages}
          </span>


          {page >= totalPages ? (
            <Button variant="outline" disabled>
              หน้าถัดไป →
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link href={`/articles?page=${page + 1}`}>หน้าถัดไป →</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
