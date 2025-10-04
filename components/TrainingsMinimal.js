'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, MapPin, Award, ExternalLink, Clock, GraduationCap } from 'lucide-react'

export default function TrainingsMinimal({ trainings = [] }) {
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
    if (!endDate) return 'text-emerald-500'
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = now - end
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) return 'text-blue-500'
    if (diffDays < 365) return 'text-purple-500'
    return 'text-gray-500'
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
    <div ref={ref} className="space-y-3">
      {trainings.map((training, index) => (
        <motion.div
          key={training.id}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ 
            duration: 0.4, 
            delay: 0.05 * index
          }}
          className="group"
        >
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700">
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex-shrink-0">
                <GraduationCap className={`w-5 h-5 ${getStatusColor(training.endDate)}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 truncate">
                    {training.title}
                  </h3>
                  <span className={`text-xs font-medium ${getStatusColor(training.endDate)}`}>
                    • {getStatusText(training.endDate)}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate mr-4">{training.institution}</span>
                  <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="mr-4">
                    {formatDate(training.startDate)} - {training.endDate ? formatDate(training.endDate) : 'Present'}
                  </span>
                  <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span>{getDuration(training.startDate, training.endDate)}</span>
                </div>
              </div>
            </div>
            
            {training.certificate && (
              <motion.a
                href={training.certificate}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="ml-4 flex-shrink-0 inline-flex items-center px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors duration-200"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Cert
              </motion.a>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
