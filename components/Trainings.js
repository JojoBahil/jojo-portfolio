'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, MapPin, Award, ExternalLink } from 'lucide-react'

export default function Trainings({ trainings = [] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    })
  }

  const getDuration = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) {
      return `${diffDays} days`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} month${months > 1 ? 's' : ''}`
    } else {
      const years = Math.floor(diffDays / 365)
      return `${years} year${years > 1 ? 's' : ''}`
    }
  }

  if (trainings.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg">No trainings available at the moment.</p>
      </div>
    )
  }

  return (
    <div ref={ref} className="grid gap-8">
      {trainings.map((training, index) => (
        <motion.div
          key={training.id}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 * index }}
          className="group"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <Award className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {training.title}
                  </h3>
                </div>
                
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  {training.institution}
                </div>

                {training.description && (
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {training.description}
                  </p>
                )}
              </div>
              
              <div className="flex flex-col lg:items-end lg:ml-6">
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(training.startDate)} - {training.endDate ? formatDate(training.endDate) : 'Ongoing'}
                </div>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                  {getDuration(training.startDate, training.endDate)}
                </span>
              </div>
            </div>

            {training.certificate && (
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <a
                  href={training.certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Certificate
                </a>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

