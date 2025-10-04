'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, MapPin, Award, ExternalLink, Clock, GraduationCap } from 'lucide-react'

export default function TrainingsGrid({ trainings = [] }) {
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
    if (!endDate) return 'from-emerald-500 to-teal-600'
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = now - end
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) return 'from-blue-500 to-indigo-600'
    if (diffDays < 365) return 'from-purple-500 to-pink-600'
    return 'from-gray-500 to-slate-600'
  }

  const getStatusText = (endDate) => {
    if (!endDate) return 'Ongoing'
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = now - end
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) return 'Recent'
    if (diffDays < 365) return 'This Year'
    return 'Completed'
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
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trainings.map((training, index) => (
        <motion.div
          key={training.id}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ 
            duration: 0.5, 
            delay: 0.1 * index
          }}
          className="group"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className={`px-2 py-1 bg-gradient-to-r ${getStatusColor(training.endDate)} text-white rounded-full text-xs font-medium`}>
                {getStatusText(training.endDate)}
              </span>
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {training.title}
              </h3>
              <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">
                <MapPin className="w-3 h-3 mr-1" />
                {training.institution}
              </div>
              
              {training.description && (
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3 line-clamp-3">
                  {training.description}
                </p>
              )}
            </div>
            
            {/* Footer */}
            <div className="mt-auto">
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mb-3">
                <Calendar className="w-3 h-3 mr-1" />
                <span className="mr-3">
                  {formatDate(training.startDate)} - {training.endDate ? formatDate(training.endDate) : 'Present'}
                </span>
                <Clock className="w-3 h-3 mr-1" />
                <span>{getDuration(training.startDate, training.endDate)}</span>
              </div>
              
              {training.certificate && (
                <motion.a
                  href={training.certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="w-full inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium rounded-md transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View Certificate
                </motion.a>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
