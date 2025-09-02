"use client"

import { use, useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Users, BookOpen, Clock, CheckCircle, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getCourse, type PublicCourse } from "@/lib/api-client"
import { useRouter } from "next/navigation"

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [course, setCourse] = useState<PublicCourse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    getCourse(id)
      .then(setCourse)
      .catch((e) => { console.error(e); setError('ไม่พบคอร์ส') })
  }, [id])

  if (error) return notFound()
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">กำลังโหลด...</div></div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <motion.div variants={fadeInUp} initial="initial" animate="animate">
              <div className="aspect-video relative overflow-hidden rounded-xl shadow-lg mb-6">
                {course.coverImageUrl ? (
                  <Image
                    src={course.coverImageUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-white">
                    <Play className="h-6 w-6 mr-2" />
                    ดูตัวอย่าง
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                {course.category?.name && (
                  <Badge className="bg-yellow-400 text-white">{course.category.name}</Badge>
                )}
                {course.instructor?.name && (
                  <Badge variant="outline">{course.instructor.name}</Badge>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 text-balance">{course.title}</h1>

              {course.description && (
                <p className="text-xl text-gray-600 mb-6 text-pretty">{course.description}</p>
              )}


              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{course._count?.enrollments ?? 0} นักเรียน</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{course._count?.chapters ?? 0} บท</span>
                </div>
                {course.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>{typeof course.duration === 'number' ? `${course.duration} ชั่วโมง` : course.duration}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {Array.isArray((course as any).chapters) && (course as any).chapters.length > 0 && (
              <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.2 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">สารบัญบทเรียน</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(course as any).chapters.map((ch: any, idx: number) => (
                        <div key={ch.id} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{idx + 1}. {ch.title} ({ch.contents?.length || 0} เนื้อหา)</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}



          </div>


          <div className="lg:col-span-1">
            <motion.div
              className="sticky top-24"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.1 }}
            >
              <Card className="shadow-lg">
                <CardContent className="p-6">

                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {course.isFree ? (
                        <span className="text-3xl font-bold text-green-600">ฟรี</span>
                      ) : (
                        <span className="text-3xl font-bold text-yellow-600">฿{(course.price ?? 0).toLocaleString()}</span>
                      )}
                    </div>
                    
                  </div>

                  <Separator className="mb-6" />


                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ผู้สอน:</span>
                      <span className="font-medium">{course.instructor?.name || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ระยะเวลา:</span>
                      <span className="font-medium">{course.duration ? (typeof course.duration === 'number' ? `${course.duration} ชั่วโมง` : course.duration) : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">บทเรียน:</span>
                      <span className="font-medium">{course._count?.chapters ?? 0} บทเรียน</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">นักเรียน:</span>
                      <span className="font-medium">{course._count?.enrollments ?? 0} คน</span>
                    </div>
                  </div>


                  <div className="space-y-3">
                    <Button
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-white text-lg py-3"
                      onClick={() => course?.id && router.push(`/checkout?itemType=course&itemId=${encodeURIComponent(course.id)}`)}
                    >
                      {course?.isFree ? 'สมัครเรียนฟรี' : 'สมัครเรียนเลย'}
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      เพิ่มในรายการโปรด
                    </Button>
                  </div>

                  <Separator className="my-6" />


                  <div className="text-center text-sm text-gray-600">
                    <p>รับประกันความพึงพอใจ 30 วัน</p>
                    <p>หรือคืนเงิน 100%</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
