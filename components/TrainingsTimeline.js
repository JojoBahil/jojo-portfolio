'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, MapPin, Award, ExternalLink, Clock, GraduationCap } from 'lucide-react'

export default function TrainingsTimeline({ trainings = [] }) {
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

  const getStatusColor = (endDate) => {
    if (!endDate) return 'bg-emerald-500'
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = now - end
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) return 'bg-blue-500'
    if (diffDays < 365) return 'bg-purple-500'
    return 'bg-gray-500'
  }

  if (trainings.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center py-16"
      >
        <Award className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-lg">No trainings available at the moment.</p>
      </motion.div>
    )
  }

  return (
    <div ref={ref} className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500"></div>
      
      <div className="space-y-8">
        {trainings.map((training, index) => (
          <motion.div
            key={training.id}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.1 * index
            }}
            className="relative flex items-start"
          >
            {/* Timeline dot */}
            <div className="relative z-10 flex-shrink-0">
              <div className={`w-4 h-4 ${getStatusColor(training.endDate)} rounded-full border-4 border-white dark:border-gray-800 shadow-lg`}></div>
            </div>
            
            {/* Content */}
            <div className="ml-6 flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {training.title}
                    </h3>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                      <MapPin className="w-3 h-3 mr-1" />
                      {training.institution}
                    </div>
                  </div>
                  {training.certificate && (
                    <motion.a
                      href={training.certificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-md transition-colors duration-200"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Cert
                    </motion.a>
                  )}
                </div>
                
                {training.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    {training.description}
                  </p>
                )}
                
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(training.startDate)} - {training.endDate ? formatDate(training.endDate) : 'Present'}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {getDuration(training.startDate, training.endDate)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
