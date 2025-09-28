import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const filename = formData.get('filename')

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure images directory exists
    const imagesDir = join(process.cwd(), 'public', 'images')
    try {
      await mkdir(imagesDir, { recursive: true })
    } catch (error) {
      // Directory might already exist, that's fine
    }

    // Write file to public/images directory
    const filePath = join(imagesDir, filename)
    await writeFile(filePath, buffer)

    // Return the public URL path
    const imagePath = `/images/${filename}`

    return NextResponse.json({
      success: true,
      imagePath: imagePath,
      filename: filename,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: error.message 
    }, { status: 500 })
  }
}

