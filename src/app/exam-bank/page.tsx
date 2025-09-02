"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, FileText, Search, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Footer } from "@/components/sections/footer"
import Link from "next/link"
import { getExamCategories, getExams, getExamDetail, type PublicExam, type PublicExamCategory } from "@/lib/api-client"

export default function ExamBankPage() {
  const [categories, setCategories] = useState<PublicExamCategory[]>([])
  const [exams, setExams] = useState<PublicExam[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExam, setSelectedExam] = useState<(PublicExam & { files?: any[] }) | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(12)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getExamCategories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    const categoryId = selectedCategory === 'all' ? undefined : selectedCategory
    getExams({ page, limit, search: searchTerm || undefined, categoryId })
      .then(({ items, pagination }) => {
        setExams(items)
        setTotal(pagination?.total || items.length)
      })
      .catch((e) => { console.error(e); setError('ไม่สามารถดึงข้อมูลข้อสอบได้') })
      .finally(() => setLoading(false))
  }, [page, limit, searchTerm, selectedCategory])

  const availableYears = useMemo(() => {
    const years = new Set<number>()
    exams.forEach((ex) => {
      const y = ex.createdAt ? new Date(ex.createdAt).getFullYear() : undefined
      if (y) years.add(y)
    })
    return Array.from(years).sort((a, b) => b - a)
  }, [exams])

  const filteredExams = useMemo(() => {
    return exams.filter((ex) => {
      const y = ex.createdAt ? String(new Date(ex.createdAt).getFullYear()) : ''
      return selectedYear === 'all' || y === selectedYear
    })
  }, [exams, selectedYear])

  const openExam = async (exam: PublicExam) => {
    try {
      const full = await getExamDetail(exam.id)
      setSelectedExam(full)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-white to-yellow-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">คลังข้อสอบ</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              รวบรวมข้อสอบฟิสิกส์และวิชาที่เกี่ยวข้องจากหลายปีการศึกษา พร้อมให้ดูและดาวน์โหลดฟรี
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-row gap-3 items-center max-w-2xl mx-auto w-85 md:w-full">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="ค้นหาข้อสอบ..."
                  value={searchTerm}
                  onChange={(e) => { setPage(1); setSearchTerm(e.target.value) }}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
              <div className="shrink-0">
                <Select value={selectedYear} onValueChange={(v) => { setPage(1); setSelectedYear(v) }}>
                  <SelectTrigger className="w-33 sm:w-48">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="เลือกปี" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกปี</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        ปี {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-wrap justify-center gap-3">
              {[{ id: 'all', name: 'ทั้งหมด' } as any, ...categories].map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => { setPage(1); setSelectedCategory(category.id) }}
                  className={`px-6 py-2 rounded-full transition-all duration-300 ${selectedCategory === category.id ? "text-white shadow-lg transform scale-105" : "hover:scale-105"}`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </motion.div>

          {error && (
            <div className="text-center text-gray-500">{error}</div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-6"
          >
            <p className="text-gray-600">พบข้อสอบ {total} รายการ</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {(loading ? Array.from({ length: 8 }) : filteredExams).map((exam: any, index: number) => (
              <motion.div
                key={exam?.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card
                  className="h-full cursor-pointer transition-all duration-300 border-2 hover:shadow-xl"
                  onClick={() => typeof exam === 'object' && openExam(exam as PublicExam)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <FileText className="h-8 w-8 flex-shrink-0 mt-1 text-yellow-600" />
                      <Badge variant="secondary" className="text-white text-xs bg-yellow-500">
                        {typeof exam === 'object' && (new Date(exam.createdAt || Date.now()).getFullYear())}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight text-gray-900">
                      {typeof exam === 'object' ? exam.title : <span className="inline-block h-4 w-40 bg-gray-200 animate-pulse" />}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-center pt-2">
                      <p className="text-xs text-gray-500">คลิกเพื่อดูหรือดาวน์โหลด</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <Dialog open={!!selectedExam} onOpenChange={() => setSelectedExam(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">{selectedExam?.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selectedExam?.files && selectedExam.files.length > 0 ? (
                  <div className="space-y-2">
                    {selectedExam.files.map((f) => (
                      <div key={f.id} className="flex items-center justify-between border rounded-md p-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{f.fileName}</span>
                        </div>
                        <div className="flex gap-2">
                          <a href={(f as any).fileUrl || f.filePath} target="_blank" rel="noreferrer">
                            <Button variant="outline" className="cursor-pointer"><Eye className="h-4 w-4 mr-2" />ดู</Button>
                          </a>
                          <a href={(f as any).fileUrl || f.filePath} download>
                            <Button className="cursor-pointer"><Download className="h-4 w-4 mr-2" />ดาวน์โหลด</Button>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">ไม่มีไฟล์แนบ</p>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {!loading && filteredExams.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">ไม่พบข้อสอบที่ค้นหา</h3>
              <p className="text-gray-500">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-16 p-8 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-2xl"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">ต้องการข้อสอบเพิ่มเติม?</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              สมัครเรียนกับเราเพื่อเข้าถึงข้อสอบและเนื้อหาเพิ่มเติม พร้อมคำอธิบายและเทคนิคการแก้โจทย์จากอาจารย์เต้ย
            </p>
            <Link href="/courses"><Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-full cursor-pointer">สมัครเรียนออนไลน์</Button></Link>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  )
}
