'use client'

import { motion } from 'framer-motion'
import { Mail, Download, Eye, ChevronDown, Copy } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

export default function Hero() {
  const { showSuccess, showError } = useToast()

  const scrollToProjects = () => {
    const element = document.getElementById('projects')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-2xl ring-4 ring-gray-200 dark:ring-gray-800/20 bg-white dark:bg-gray-100 p-2"
          >
            <img
              src="/profile-picture.png"
              alt="Jason Bahil"
              className="w-full h-full object-cover rounded-full"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white"
          >
            Jason Bahil
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium"
          >
            Full Stack Software Engineer
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Results-driven Full Stack Software Engineer with extensive experience in designing, developing, and deploying enterprise-level systems. Skilled in end-to-end development, database management, and leading cross-functional teams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText('jbahil47@gmail.com')
                  showSuccess('Email copied to clipboard!')
                } catch (err) {
                  // Fallback for older browsers
                  const textArea = document.createElement('textarea')
                  textArea.value = 'jbahil47@gmail.com'
                  document.body.appendChild(textArea)
                  textArea.select()
                  document.execCommand('copy')
                  document.body.removeChild(textArea)
                  showSuccess('Email copied to clipboard!')
                }
              }}
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Copy className="w-5 h-5 mr-2" />
              Copy Email
            </button>
            
            <button
              onClick={scrollToProjects}
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
            >
              <Eye className="w-5 h-5 mr-2" />
              View Projects
            </button>
            
            <a
              href="/cv/CVJojo2025.pdf"
              download="Jason_Bahil_CV_2025.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5 mr-2" />
              Download CV
            </a>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.button
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-2 rounded-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-800/30 transition-colors duration-300"
        >
          <ChevronDown className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </motion.button>
      </motion.div>
    </section>
  )
}
