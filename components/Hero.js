'use client'

import { motion } from 'framer-motion'
import { Mail, Download, Eye, ChevronDown, Copy } from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'
import { useState, useEffect } from 'react'

// Typing effect component
function TypingEffect({ titles, className }) {
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const currentTitle = titles[currentTitleIndex]

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, 2000) // Pause for 2 seconds
      return () => clearTimeout(pauseTimer)
    }

    const timer = setTimeout(
      () => {
        if (!isDeleting && currentText.length < currentTitle.length) {
          // Typing
          setCurrentText(currentTitle.slice(0, currentText.length + 1))
        } else if (isDeleting && currentText.length > 0) {
          // Deleting
          setCurrentText(currentTitle.slice(0, currentText.length - 1))
        } else if (!isDeleting && currentText.length === currentTitle.length) {
          // Finished typing, pause then start deleting
          setIsPaused(true)
        } else if (isDeleting && currentText.length === 0) {
          // Finished deleting, move to next title
          setIsDeleting(false)
          setCurrentTitleIndex((prevIndex) => (prevIndex + 1) % titles.length)
        }
      },
      isDeleting ? 50 : 100
    ) // Faster deletion, slower typing

    return () => clearTimeout(timer)
  }, [currentText, isDeleting, isPaused, currentTitleIndex, titles])

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

export default function Hero() {
  const { showSuccess, showError } = useToast()

  const titles = [
    'Software Engineer',
    'Full Stack Web Developer',
    'Server Administrator',
  ]

  const scrollToProjects = () => {
    const element = document.getElementById('projects')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center"
    >
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
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
            className="mx-auto h-32 w-32 overflow-hidden rounded-full bg-white p-2 shadow-2xl ring-4 ring-gray-200 dark:bg-gray-100 dark:ring-gray-800/20"
          >
            <img
              src="/profile-picture.png"
              alt="Jason Bahil"
              className="h-full w-full rounded-full object-cover"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl font-bold text-gray-900 dark:text-white md:text-7xl"
          >
            Jason Bahil
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex min-h-[2.5rem] items-center justify-center text-xl font-medium text-gray-600 dark:text-gray-300 md:text-2xl"
          >
            <TypingEffect
              titles={titles}
              className="font-semibold text-blue-600 dark:text-blue-400"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-500 dark:text-gray-400"
          >
            Results-driven Full Stack Software Engineer with extensive
            experience in designing, developing, and deploying enterprise-level
            systems. Skilled in end-to-end development, database management, and
            leading cross-functional teams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
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
              className="inline-flex transform items-center rounded-full bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-xl"
            >
              <Copy className="mr-2 h-5 w-5" />
              Copy Email
            </button>

            <button
              onClick={scrollToProjects}
              className="inline-flex transform items-center rounded-full border-2 border-blue-600 bg-transparent px-8 py-4 font-semibold text-blue-600 transition-all duration-300 hover:scale-105 hover:bg-blue-600 hover:text-white dark:text-blue-400"
            >
              <Eye className="mr-2 h-5 w-5" />
              View Projects
            </button>

            <a
              href="/cv/CVJojo2025.pdf"
              download="Jason_Bahil_CV_2025.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex transform items-center rounded-full bg-gray-800 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-900 hover:shadow-xl dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <Download className="mr-2 h-5 w-5" />
              Download CV
            </a>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 transform"
      >
        <motion.button
          onClick={() =>
            document
              .getElementById('about')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="rounded-full bg-white/20 p-2 backdrop-blur-sm transition-colors duration-300 hover:bg-white/30 dark:bg-gray-800/20 dark:hover:bg-gray-800/30"
        >
          <ChevronDown className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </motion.button>
      </motion.div>
    </section>
  )
}
