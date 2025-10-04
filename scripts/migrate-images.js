#!/usr/bin/env node

/**
 * Migration script to help move local images to Cloudinary
 * This script will:
 * 1. Find all projects with local image paths
 * 2. Upload them to Cloudinary
 * 3. Update the database with new Cloudinary URLs
 *
 * Usage: node scripts/migrate-images.js
 */

const { PrismaClient } = require('@prisma/client')
const { v2: cloudinary } = require('cloudinary')
const fs = require('fs')
const path = require('path')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const prisma = new PrismaClient()

async function migrateImages() {
  try {
    console.log('🔍 Finding projects with local image paths...')

    // Find all projects with local image paths
    const projects = await prisma.project.findMany({
      where: {
        coverId: {
          startsWith: '/images/',
        },
      },
    })

    console.log(`📋 Found ${projects.length} projects with local images`)

    if (projects.length === 0) {
      console.log('✅ No local images to migrate!')
      return
    }

    for (const project of projects) {
      const localPath = project.coverId
      const fullPath = path.join(process.cwd(), 'public', localPath)

      console.log(`\n🔄 Processing: ${project.title}`)
      console.log(`   Local path: ${localPath}`)

      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        console.log(`   ❌ File not found: ${fullPath}`)
        continue
      }

      try {
        // Upload to Cloudinary
        console.log(`   📤 Uploading to Cloudinary...`)
        const result = await cloudinary.uploader.upload(fullPath, {
          folder: 'portfolio',
          public_id: `project-${project.id}-${Date.now()}`,
          resource_type: 'auto',
        })

        console.log(`   ✅ Upload successful: ${result.secure_url}`)

        // Update database
        await prisma.project.update({
          where: { id: project.id },
          data: { coverId: result.secure_url },
        })

        console.log(`   💾 Database updated`)

        // Optionally delete local file (uncomment if you want to clean up)
        // fs.unlinkSync(fullPath)
        // console.log(`   🗑️  Local file deleted`)
      } catch (error) {
        console.log(`   ❌ Upload failed: ${error.message}`)
      }
    }

    console.log('\n🎉 Migration completed!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run migration
migrateImages()
