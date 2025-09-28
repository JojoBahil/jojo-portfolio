'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Mail, Phone, MapPin, GraduationCap, Languages } from 'lucide-react'

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'jbahil47@gmail.com', href: 'mailto:jbahil47@gmail.com' },
    { icon: Phone, label: 'Phone', value: '0912-079-9370', href: 'tel:+639120799370' },
    { icon: MapPin, label: 'Address', value: 'B2 L8, Pantabangan St., NIA Village, Sauyo, Quezon City' },
  ]

  const education = {
    degree: 'BS in Information Technology',
    school: 'STI Fairview',
    year: '2016',
  }

  const languages = ['Tagalog', 'English']


  return (
    <div ref={ref} className="grid lg:grid-cols-2 gap-12 items-start">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        transition={{ duration: 0.8 }}
        className="space-y-8"
      >
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About Me</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Results-driven Full Stack Software Engineer with extensive experience in designing, developing, and deploying enterprise-level systems. Skilled in end-to-end development, database management, and leading cross-functional teams.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Education
          </h4>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h5 className="font-semibold text-gray-900 dark:text-white">{education.degree}</h5>
            <p className="text-blue-600 dark:text-blue-400 font-medium">{education.school}</p>
            <p className="text-gray-500 dark:text-gray-400">Graduated {education.year}</p>
          </div>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Languages className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Languages
          </h4>
          <div className="flex flex-wrap gap-2">
            {languages.map((language, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
              >
                {language}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="space-y-8"
      >
        <div>
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Contact Information</h4>
          <div className="space-y-4">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4">
                  <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-gray-900 dark:text-white font-medium">{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </motion.div>
    </div>
  )
}
