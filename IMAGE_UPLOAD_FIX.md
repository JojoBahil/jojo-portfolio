# Image Upload Fix for Production

## Problem

Images uploaded through the admin panel were showing as broken placeholders in production, even though they worked fine locally.

## Root Cause

The application was using two different upload systems:

- **Local upload** (`/api/upload-local`) - saves files to `public/images/` directory
- **Cloudinary upload** (`/api/upload`) - uploads to Cloudinary CDN

The admin interface was only using the local upload system, which doesn't work in production environments (like Vercel, Netlify) because:

1. Production environments have ephemeral file systems
2. Files uploaded to `public/images/` are lost when the server restarts
3. Static hosting doesn't support server-side file writes to the `public` directory

## Solution

Updated the admin interface to automatically choose the appropriate upload method based on the environment:

- **Development**: Uses local file upload (`/api/upload-local`)
- **Production**: Uses Cloudinary upload (`/api/upload`)

## Changes Made

### 1. Updated Admin Upload Logic (`app/admin/page.js`)

- Modified `uploadFile()` function to detect environment
- Automatically switches between local and Cloudinary upload endpoints
- Handles different response formats from both upload methods

### 2. Environment Detection

```javascript
const isProduction = process.env.NODE_ENV === 'production'
const uploadEndpoint = isProduction ? '/api/upload' : '/api/upload-local'
```

### 3. Response Handling

```javascript
// Handle different response formats
const imageUrl = result.url || result.imagePath
```

## Required Environment Variables

Make sure these are set in your production environment:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Migration Script

If you have existing projects with local image paths, use the migration script:

```bash
node scripts/migrate-images.js
```

This script will:

1. Find all projects with local image paths (`/images/...`)
2. Upload them to Cloudinary
3. Update the database with new Cloudinary URLs

## Testing

1. **Local Development**: Upload images should save to `public/images/`
2. **Production**: Upload images should save to Cloudinary and return HTTPS URLs

## Next.js Configuration

The `next.config.js` already includes Cloudinary domain configuration:

```javascript
images: {
  domains: ['res.cloudinary.com'],
}
```

This ensures Next.js Image Optimization works with Cloudinary URLs.

## Benefits

- ✅ Images work in both development and production
- ✅ Automatic environment detection
- ✅ No manual configuration needed
- ✅ Backward compatible with existing local images
- ✅ Uses CDN for better performance in production
