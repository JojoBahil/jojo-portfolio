'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, MapPin, Award, ExternalLink, Clock, GraduationCap, Star } from 'lucide-react'

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

  const getStatusColor = (endDate) => {
    if (!endDate) {
      return 'from-emerald-500 to-teal-600' // Ongoing - green gradient
    }
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = now - end
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) {
      return 'from-blue-500 to-indigo-600' // Recent - blue gradient
    } else if (diffDays < 365) {
      return 'from-purple-500 to-pink-600' // Recent year - purple gradient
    } else {
      return 'from-gray-500 to-slate-600' // Older - gray gradient
    }
  }

  const getStatusText = (endDate) => {
    if (!endDate) return 'Ongoing'
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = now - end
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) return 'Recently Completed'
    if (diffDays < 365) return 'Completed This Year'
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
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-20 scale-150"></div>
          <Award className="relative w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Trainings Yet</h3>
        <p className="text-gray-500 dark:text-gray-400">Check back soon for my learning journey!</p>
      </motion.div>
    )
  }

  return (
    <div ref={ref} className="space-y-4">
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
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg mr-3">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {training.title}
                    </h3>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                      <MapPin className="w-3 h-3 mr-1" />
                      {training.institution}
                    </div>
                  </div>
                </div>
                
                {training.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                    {training.description}
                  </p>
                )}

                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                  <Calendar className="w-3 h-3 mr-2" />
                  <span className="mr-4">
                    {formatDate(training.startDate)} - {training.endDate ? formatDate(training.endDate) : 'Present'}
                  </span>
                  <Clock className="w-3 h-3 mr-1" />
                  <span className="mr-4">{getDuration(training.startDate, training.endDate)}</span>
                  <span className={`px-2 py-1 bg-gradient-to-r ${getStatusColor(training.endDate)} text-white rounded-full text-xs font-medium`}>
                    {getStatusText(training.endDate)}
                  </span>
                </div>
              </div>
              
              {training.certificate && (
                <motion.a
                  href={training.certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="ml-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Certificate
                </motion.a>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

