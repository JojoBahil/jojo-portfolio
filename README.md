# Jason Bahil Portfolio

A production-ready portfolio website built with Next.js, featuring a modern design, admin dashboard, and comprehensive SEO optimization.

## 🚀 Features

- **Modern Design**: Clean, professional interface with dark mode support
- **Responsive**: Fully responsive design that works on all devices
- **Performance**: Optimized for speed with SSG and lazy loading
- **SEO Optimized**: Complete meta tags, Open Graph, Twitter Cards, and JSON-LD structured data
- **Admin Dashboard**: Full CRUD interface for managing portfolio content
- **Authentication**: Secure admin login with session management
- **Database**: SQLite with Prisma ORM for easy data management
- **Media Management**: Cloudinary integration for image/video uploads
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database**: MySQL + Prisma
- **Authentication**: Iron Session
- **Media**: Cloudinary
- **Deployment**: Vercel Ready

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Cloudinary account (for media uploads)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd reactjs-portfolio
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp env.example .env.local
```

Edit `.env.local` with your values:

```env
ADMIN_USER=admin
ADMIN_PASS=your-secure-password
DATABASE_URL="mysql://username:password@localhost:3306/portfolio_db"
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_SITE_URL=https://your-domain.com
SESSION_PASSWORD=your-super-secret-session-password
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npm run prisma:migrate

# Seed the database with sample data
npm run seed
```

### 4. Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see your portfolio!

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   │   ├── admin/         # Admin CRUD endpoints
│   │   ├── auth/          # Authentication endpoints
│   │   ├── og/            # Open Graph image generation
│   │   └── upload/        # File upload endpoint
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Home page
├── components/            # Reusable components
│   ├── About.js           # About section
│   ├── Contact.js         # Contact form
│   ├── Experience.js      # Experience timeline
│   ├── Footer.js          # Site footer
│   ├── Hero.js            # Hero section
│   ├── JsonLd.js          # JSON-LD structured data
│   ├── NavBar.js          # Navigation bar
│   ├── ProjectCard.js     # Project card component
│   ├── Projects.js        # Projects section
│   ├── Section.js         # Section wrapper
│   ├── TechStack.js       # Tech stack display
│   └── ThemeToggle.js     # Dark mode toggle
├── lib/                   # Utility libraries
│   ├── auth.js            # Authentication helpers
│   └── prisma.js          # Database client
├── prisma/                # Database schema and migrations
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Database seed data
└── public/                # Static assets
```

## 🎨 Customization

### Personal Information

Update the seed data in `prisma/seed.js` with your information:

- **Personal Details**: Name, title, contact information
- **Experience**: Work history and achievements
- **Projects**: Portfolio projects with descriptions and links
- **Tech Stack**: Technologies you work with
- **Education**: Academic background
- **Links**: Social media and professional links

### Styling

The design uses Tailwind CSS with inline classes. Key customization points:

- **Colors**: Update the color scheme in `tailwind.config.js`
- **Fonts**: Change fonts in `app/layout.js`
- **Animations**: Modify Framer Motion animations in components
- **Layout**: Adjust spacing and layout in component files

### Content Management

Use the admin dashboard at `/admin` to:

- Add/edit/delete projects
- Manage work experience
- Update tech stack
- Upload and manage media
- Edit social links

## 🔐 Admin Dashboard

Access the admin dashboard at `/admin` with your configured credentials.

### Features:
- **Projects Management**: Create, edit, and delete portfolio projects
- **Experience Management**: Manage work experience entries
- **Tech Stack**: Add and organize technologies
- **Media Library**: Upload and manage images/videos via Cloudinary
- **Links Management**: Update social and professional links

### Security:
- Session-based authentication
- Secure password hashing
- Protected API routes
- CSRF protection

## 📱 SEO & Performance

### SEO Features:
- **Meta Tags**: Complete title, description, and keyword tags
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Twitter-specific sharing
- **JSON-LD**: Structured data for search engines
- **Sitemap**: Automatic sitemap generation
- **Robots.txt**: Search engine crawling instructions

### Performance Optimizations:
- **Static Generation**: SSG for fast loading
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Non-critical content lazy loaded
- **Code Splitting**: Automatic code splitting
- **Caching**: Optimized caching strategies

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Environment Variables**:
   Set all environment variables in Vercel dashboard:
   - `ADMIN_USER`
   - `ADMIN_PASS`
   - `DATABASE_URL`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `NEXT_PUBLIC_SITE_URL`
   - `SESSION_PASSWORD`

3. **Database**:
   For production, consider using a hosted MySQL database like:
   - PlanetScale (MySQL)
   - Railway (MySQL)
   - AWS RDS (MySQL)
   - DigitalOcean Managed Database (MySQL)

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run prisma:migrate    # Run database migrations
npm run prisma:studio     # Open Prisma Studio
npm run seed              # Seed database

# Code Quality
npm run lint         # Run ESLint
```

## 📊 Performance Targets

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: All green
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🎯 Accessibility

- **WCAG 2.1 AA** compliant
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Optimized for screen readers
- **Color Contrast**: Meets accessibility standards
- **Focus Management**: Clear focus indicators
- **Motion Preferences**: Respects `prefers-reduced-motion`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: jbahil47@gmail.com
- Create an issue in the repository

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations
- Prisma for the excellent ORM
- Cloudinary for media management

---

**Built with ❤️ by Jason Bahil**
