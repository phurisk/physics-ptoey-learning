import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function AboutTeacher() {
  const teacherInfo = {
    name: "พี่เต้ย (อ.เชษฐา)",
    title: "โรงเรียนกวดวิชาฟิสิกส์อาจารย์เต้ย",
    subtitle: "(ในความควบคุมของกระทรวงศึกษาธิการ)",
    image: "/teacher(1).png",
    achievements: [
      "ที่ 1 ฟิสิกส์สามัญ ประเทศ",
      "ชนะเลิศการแข่งขันฟิสิกส์สัประยุทธ์ กลุ่มภาคกลางและกลุ่มภาคตะวันออก",
      "ที่ 1 ชนะเลิศการตอบปัญหาวิศวกรรมศาสตร์ (มหาวิทยาลัยเกษตรศาสตร์)",
      "นักเรียนฟิสิกส์โอลิมปิค มหาวิทยาลัยศิลปากร (สนามจันทร์)",
      "นักเรียนทุนส่งเสริมความเป็นเลิศทางวิทยาศาสตร์และเทคโนโลยี JSTP ของสวทช และอพวช",
      "รับเชิญเข้าร่วมประชุมสัมนาฟิสิกส์ศึกษา เกี่ยวกับการเรียนการสอนและงานวิจัยด้านฟิสิกส์ศึกษาของประเทศไทย",
    ],
    currentPosition: ["อาจารย์ฟิสิกส์ สถาบันฟิสิกส์ อ.เต้ย", "อาจารย์พิเศษห้องเรียนพิเศษทั่วประเทศ"],
  }

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

      
          <div className="order-1 lg:order-2 lg:col-span-1 space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-balance">{teacherInfo.name}</h2>
            <div className="space-y-2">
              <h3 className="text-xl lg:text-2xl font-semibold text-yellow-600 text-pretty">{teacherInfo.title}</h3>
              <p className="text-gray-600 text-pretty">{teacherInfo.subtitle}</p>
            </div>
          </div>

        
          <div className="order-2 lg:order-1 lg:row-span-2">
            <div className="relative">
              <div className="aspect-[4/5] relative overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src={teacherInfo.image || "/placeholder.svg"}
                  alt={teacherInfo.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-yellow-400 rounded-full opacity-30"></div>
            </div>

           
            <div className="mt-14 hidden md:flex flex-row gap-3 justify-start flex-nowrap mb-10 ">
              <Link
                href="/courses"
                className="min-w-[160px] px-4 py-2 text-lg md:min-w-[220px] md:px-8 md:py-3 md:text-xl
                  bg-[#2688DF] hover:bg-[#1f6fba] text-white rounded-sm font-semibold 
                  shadow-md hover:shadow-lg transition-transform duration-300 
                  cursor-pointer flex items-center justify-center gap-2 hover:scale-105"
              >
                คอร์สออนไลน์
                <svg
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  className="w-5 h-5 md:w-7 md:h-7"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    d="M26 22H6c-2.2 0-4-1.8-4-4V8c0-2.2 1.8-4 4-4h20c2.2 0 4 1.8 4 4v10c0 2.2-1.8 4-4 4M3 27h4m4 0h18"
                  />
                  <circle cx="9" cy="27" r="2" fill="white" />
                  <path
                    d="M13 10v6c0 .7.9 1.2 1.5.8l5-3c.6-.4.6-1.2 0-1.6l-5-3c-.6-.5-1.5 0-1.5.8"
                    fill="white"
                  />
                </svg>
              </Link>

              <Link
                href="/live"
                className="min-w-[160px] px-4 py-2 text-lg md:min-w-[250px] md:px-8 md:py-3 md:text-xl
                  bg-[#FEBE01] hover:bg-[#e5aa00] text-black rounded-sm font-semibold 
                  shadow-md hover:shadow-lg transition-transform duration-300 
                  cursor-pointer flex items-center justify-center gap-2 hover:scale-105 text-nowrap"
              >
                คอร์สสอนสด Live
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="w-5 h-5 md:w-8 md:h-8"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M16 4a1 1 0 0 1 1 1v4.2l5.213-3.65a.5.5 0 0 1 .787.41v12.08a.5.5 0 0 1-.787.41L17 14.8V19a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm-1 2H3v12h12zM7.4 8.829a.4.4 0 0 1 .215.062l4.355 2.772a.4.4 0 0 1 0 .674L7.615 15.11A.4.4 0 0 1 7 14.77V9.23a.4.4 0 0 1 .4-.4zM21 8.84l-4 2.8v.718l4 2.8z"
                    fill="red"
                  />
                </svg>
              </Link>
            </div>
          </div>

       
          <div className="order-3 lg:order-3 lg:col-span-1 space-y-8">
           
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-gray-900">ประวัติ / ประสบการณ์การสอน</h4>
              <div className="space-y-3">
                {teacherInfo.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 text-pretty leading-relaxed">{achievement}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-gray-900">ปัจจุบัน</h4>
              <div className="flex flex-wrap gap-2">
                {teacherInfo.currentPosition.map((position, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 px-3 py-1 text-sm cursor-default"
                  >
                    {position}
                  </Badge>
                ))}
              </div>
            </div>

            <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 lg:hidden">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <h5 className="text-lg font-semibold text-gray-900">พร้อมเรียนกับครูพี่เต้ยแล้วหรือยัง?</h5>
                  <p className="text-gray-600 text-pretty">
                    เรียนรู้เทคนิคการแก้โจทย์ฟิสิกส์ เพื่อให้เข้าใจและได้คะแนนสูง
                  </p>
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold text-2xl shadow-md hover:shadow-lg transition-colors duration-300 cursor-pointer">
                    สมัครเรียนเลย
                  </button>
                </div>
              </CardContent>
            </Card>

           
            <div className="mt-6 flex flex-row gap-3 justify-center flex-nowrap md:hidden">
              <Link
                href="/courses"
                className="min-w-[160px] px-4 py-2 text-lg md:min-w-[250px] md:px-8 md:py-3 md:text-2xl
                  bg-[#2688DF] hover:bg-[#1f6fba] text-white rounded-sm font-semibold 
                  shadow-md hover:shadow-lg transition-transform duration-300 
                  cursor-pointer flex items-center justify-center gap-2 hover:scale-105"
              >
                คอร์สออนไลน์
                <svg
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  className="w-5 h-5 md:w-7 md:h-7"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeMiterlimit="10"
                    d="M26 22H6c-2.2 0-4-1.8-4-4V8c0-2.2 1.8-4 4-4h20c2.2 0 4 1.8 4 4v10c0 2.2-1.8 4-4 4M3 27h4m4 0h18"
                  />
                  <circle cx="9" cy="27" r="2" fill="white" />
                  <path
                    d="M13 10v6c0 .7.9 1.2 1.5.8l5-3c.6-.4.6-1.2 0-1.6l-5-3c-.6-.5-1.5 0-1.5.8"
                    fill="white"
                  />
                </svg>
              </Link>

              <Link
                href="/live"
                className="min-w-[160px] px-4 py-2 text-lg md:min-w-[250px] md:px-8 md:py-3 md:text-2xl
                  bg-[#FEBE01] hover:bg-[#e5aa00] text-black rounded-sm font-semibold 
                  shadow-md hover:shadow-lg transition-transform duration-300 
                  cursor-pointer flex items-center justify-center gap-2 hover:scale-105"
              >
                คอร์สสอนสด Live
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="w-5 h-5 md:w-8 md:h-8"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M16 4a1 1 0 0 1 1 1v4.2l5.213-3.65a.5.5 0 0 1 .787.41v12.08a.5.5 0 0 1-.787.41L17 14.8V19a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm-1 2H3v12h12zM7.4 8.829a.4.4 0 0 1 .215.062l4.355 2.772a.4.4 0 0 1 0 .674L7.615 15.11A.4.4 0 0 1 7 14.77V9.23a.4.4 0 0 1 .4-.4zM21 8.84l-4 2.8v.718l4 2.8z"
                    fill="red"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 hidden md:flex">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <h5 className="text-lg font-semibold text-gray-900">พร้อมเรียนกับครูพี่เต้ยแล้วหรือยัง?</h5>
                  <p className="text-gray-600 text-pretty">
                    เรียนรู้เทคนิคการแก้โจทย์ฟิสิกส์ เพื่อให้เข้าใจและได้คะแนนสูง
                  </p>
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold text-2xl shadow-md hover:shadow-lg transition-colors duration-300 cursor-pointer">
                    สมัครเรียนเลย
                  </button>
                </div>
              </CardContent>
            </Card>
    </section>
  )
}
