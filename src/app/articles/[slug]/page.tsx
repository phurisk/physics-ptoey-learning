import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPost } from "@/lib/api-client"

type Props = { params: { slug: string } }

export default async function ArticleDetail({ params }: Props) {
  let article: Awaited<ReturnType<typeof getPost>> | null = null
  try {
    article = await getPost(params.slug)
  } catch (e) {
    return notFound()
  }
  if (!article) return notFound()

  return (
    <article className="max-w-3xl mx-auto py-12 px-4">
      <div className="mb-6">
        <Button asChild variant="outline" className="gap-2">
          <Link href="/articles" aria-label="กลับไปหน้าบทความทั้งหมด">
            <ArrowLeft className="w-4 h-4" />
            กลับไปหน้าบทความ
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-500 mb-6">
        เผยแพร่: {new Date(article.publishedAt || article.createdAt || Date.now()).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      {(article.imageUrl || article.imageUrlMobileMode) && (
        <div className="relative w-full h-64 mb-6">
          <Image
            src={article.imageUrl || article.imageUrlMobileMode!}
            alt={article.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}

      <div className="prose max-w-none">
        {article.content ? (
          <div style={{ whiteSpace: 'pre-wrap' }}>{article.content}</div>
        ) : (
          <p>{article.excerpt}</p>
        )}
      </div>
    </article>
  )
}
