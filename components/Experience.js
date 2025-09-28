'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, MapPin, ChevronRight } from 'lucide-react'

export default function Experience({ experiences = [] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })
  }

  const getDuration = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const years = Math.floor(diffDays / 365)
    const months = Math.floor((diffDays % 365) / 30)
    
    if (years > 0) {
      return months > 0 ? `${years}y ${months}m` : `${years}y`
    }
    return `${months}m`
  }

  const parseHighlights = (highlightsString) => {
    try {
      return JSON.parse(highlightsString || '[]')
    } catch (error) {
      console.error('Error parsing highlights:', error)
      return []
    }
  }

  return (
    <div ref={ref} className="space-y-8">
      {experiences.map((experience, index) => {
        const highlights = parseHighlights(experience.highlights)
        
        return (
          <motion.div
            key={experience.id}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="relative"
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Timeline line */}
              <div className="hidden lg:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600"></div>
              
              {/* Timeline dot */}
              <div className="hidden lg:flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg z-10">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>

              {/* Content */}
              <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {experience.role}
                    </h3>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {experience.company}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:items-end">
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Present'}
                    </div>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                      {getDuration(experience.startDate, experience.endDate)}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {experience.summary}
                </p>

                {highlights.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Achievements</h4>
                    <ul className="space-y-3">
                      {highlights.map((highlight, highlightIndex) => (
                        <motion.li
                          key={highlightIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                          transition={{ duration: 0.6, delay: (index * 0.2) + (highlightIndex * 0.1) }}
                          className="flex items-start"
                        >
                          <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300">{highlight}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
