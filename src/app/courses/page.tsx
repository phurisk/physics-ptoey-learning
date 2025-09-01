"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Star, Users, BookOpen, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// derive categories from API items
import { Footer } from "@/components/sections/footer"
import { getCourses, type PublicCourse } from "@/lib/api-client"

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [items, setItems] = useState<PublicCourse[] | null>(null)
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([{ id: 'all', name: 'คอร์สทั้งหมด' }])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getCourses()
      .then((data) => {
        setItems(data)
        const uniq = new Map<string, string>()
        data.forEach((c) => { if (c.category?.id && c.category?.name) uniq.set(c.category.id, c.category.name) })
        const cat = [{ id: 'all', name: 'คอร์สทั้งหมด' }, ...Array.from(uniq.entries()).map(([id, name]) => ({ id, name }))]
        setCategories(cat)
      })
      .catch((e) => { console.error(e); setError("ไม่สามารถดึงข้อมูลคอร์สได้") })
  }, [])

  const filteredCourses = useMemo(() => {
    if (!items) return []
    if (selectedCategory === 'all') return items
    return items.filter((c) => c.category?.id === selectedCategory)
  }, [items, selectedCategory])

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
         
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-balance">คอร์สเรียนทั้งหมด</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
              เลือกคอร์สที่เหมาะกับระดับการศึกษาของคุณ เรียนกับอาจารย์เต้ยผู้เชี่ยวชาญ
            </p>
          </motion.div>

      
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`px-6 py-2 ${
                  selectedCategory === category.id
                    ? "bg-yellow-400 hover:bg-yellow-500 text-white"
                    : "hover:bg-yellow-50 hover:border-yellow-400"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </motion.div>

       
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {(!items && !error ? Array.from({ length: 6 }) : filteredCourses).map((course: any, idx: number) => (
              <motion.div key={course?.id ?? `s-${idx}`} variants={fadeInUp}>
                <Card className="h-full hover:shadow-xl transition-shadow duration-300 group pt-0">
                  <CardContent className="p-0">
                
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      {course?.coverImageUrl ? (
                        <Image
                          src={course.coverImageUrl}
                          alt={course.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100" />
                      )}
                      <div className="absolute top-4 left-4">
                        {course?.instructor?.name && (
                          <Badge className="bg-yellow-400 text-white">{course.instructor.name}</Badge>
                        )}
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/90">
                       
                        </Badge>
                      </div>
                    </div>

                 
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 text-balance line-clamp-2">{course?.title || <span className="inline-block h-5 w-40 bg-gray-200 animate-pulse" />}</h3>
                      {course?.description && (
                        <p className="text-gray-600 mb-4 text-pretty line-clamp-2">{course.description}</p>
                      )}

                     
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course?._count?.enrollments ?? 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{course?._count?.chapters ?? 0} บท</span>
                        </div>
                        {course?.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{typeof course.duration === 'number' ? `${course.duration} ชั่วโมง` : course.duration}</span>
                          </div>
                        )}
                      </div>

                 
                      

               
                      <div className="flex items-center gap-2 mb-6">
                        {course?.isFree ? (
                          <span className="text-2xl font-bold text-green-600">ฟรี</span>
                        ) : (
                          <span className="text-2xl font-bold text-yellow-600">฿{(course?.price ?? 0).toLocaleString()}</span>
                        )}
                      </div>

                   
                      {course?.id && (
                        <Link href={`/courses/${course.id}`}>
                        <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white">ดูรายละเอียด</Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

      
          {items && filteredCourses.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xl text-gray-500">ไม่พบคอร์สในหมวดหมู่นี้</p>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
