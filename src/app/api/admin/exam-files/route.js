import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import cloudinary from '@/lib/cloudinary';

const prisma = new PrismaClient();

// POST - อัพโหลดไฟล์ข้อสอบ
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const examId = formData.get('examId');

    if (!file || !examId) {
      return NextResponse.json(
        { success: false, error: 'กรุณาเลือกไฟล์และระบุ ID ข้อสอบ' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่าข้อสอบมีอยู่หรือไม่
    const exam = await prisma.examBank.findUnique({
      where: { id: examId }
    });

    if (!exam) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบข้อสอบที่ระบุ' },
        { status: 404 }
      );
    }

    // ตรวจสอบประเภทไฟล์
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'ประเภทไฟล์ไม่ถูกต้อง (รองรับเฉพาะ PDF, Word, รูปภาพ)' },
        { status: 400 }
      );
    }

    // ตรวจสอบขนาดไฟล์ (จำกัดที่ 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'ขนาดไฟล์เกิน 10MB' },
        { status: 400 }
      );
    }

    // อัปโหลดไฟล์ไปที่ Cloudinary แทนการเก็บในไฟล์ระบบ (รองรับ Vercel)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isImage = file.type.startsWith('image/');
    const uploadOptions = {
      folder: 'e-learning/exams',
      resource_type: isImage ? 'image' : 'raw',
      public_id: `${examId}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    };

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error (exam file):', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(buffer);
    });

    // บันทึกข้อมูลไฟล์ในฐานข้อมูล (เก็บเป็น URL จาก Cloudinary)
    const examFile = await prisma.examFile.create({
      data: {
        examId,
        fileName: file.name,
        filePath: uploadResult.secure_url,
        fileType: file.type,
        fileSize: file.size
      }
    });

    return NextResponse.json({
      success: true,
      message: 'อัพโหลดไฟล์สำเร็จ',
      data: examFile
    });

  } catch (error) {
    console.error('Error uploading exam file:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์' },
      { status: 500 }
    );
  }
}

// GET - ดึงรายการไฟล์ข้อสอบ
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const examId = searchParams.get('examId');

    if (!examId) {
      return NextResponse.json(
        { success: false, error: 'กรุณาระบุ ID ข้อสอบ' },
        { status: 400 }
      );
    }

    const files = await prisma.examFile.findMany({
      where: { examId },
      orderBy: { uploadedAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: files
    });

  } catch (error) {
    console.error('Error fetching exam files:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูลไฟล์' },
      { status: 500 }
    );
  }
}
