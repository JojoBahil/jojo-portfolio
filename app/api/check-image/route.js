import { NextResponse } from 'next/server'
import { existsSync } from 'fs'
import { join } from 'path'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const imagePath = searchParams.get('path')
    
    if (!imagePath) {
      return NextResponse.json({ error: 'No image path provided' }, { status: 400 })
    }
    
    // Remove leading slash and construct full path
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
    const fullPath = join(process.cwd(), 'public', cleanPath)
    
    const exists = existsSync(fullPath)
    
    return NextResponse.json({
      path: imagePath,
      fullPath: fullPath,
      exists: exists,
      publicPath: join(process.cwd(), 'public'),
      imagesDir: join(process.cwd(), 'public', 'images')
    })
  } catch (error) {
    console.error('Check image error:', error)
    return NextResponse.json({ 
      error: 'Failed to check image', 
      details: error.message 
    }, { status: 500 })
  }
}
