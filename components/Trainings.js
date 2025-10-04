'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, MapPin, Award, ExternalLink, Clock, GraduationCap, Star } from 'lucide-react'

export default function Trainings({ trainings = [] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const formatDate = (dateString) => {
    // Handle both string and Date object inputs
    const date =
      typeof dateString === 'string' ? new Date(dateString) : dateString

    // Use UTC methods to avoid timezone issues
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth()

    return new Date(year, month).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    })
  }

  const getDuration = (startDate, endDate) => {
    // Handle both string and Date object inputs
    const start =
      typeof startDate === 'string' ? new Date(startDate) : startDate
    const end = endDate
      ? typeof endDate === 'string'
        ? new Date(endDate)
        : endDate
      : new Date()

    // Use UTC methods to avoid timezone issues
    const startYear = start.getUTCFullYear()
    const startMonth = start.getUTCMonth()
    const startDay = start.getUTCDate()
    const endYear = end.getUTCFullYear()
    const endMonth = end.getUTCMonth()
    const endDay = end.getUTCDate()

    // Calculate the difference in days (inclusive)
    const startDateObj = new Date(startYear, startMonth, startDay)
    const endDateObj = new Date(endYear, endMonth, endDay)
    const diffTime = Math.abs(endDateObj - startDateObj)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 for inclusive counting

    // Ensure minimum of 1 day
    const displayDays = Math.max(1, diffDays)

    if (displayDays < 30) {
      return `${displayDays} day${displayDays > 1 ? 's' : ''}`
    } else if (displayDays < 365) {
      const months = Math.round(displayDays / 30)
      return `${months} month${months > 1 ? 's' : ''}`
    } else {
      const years = Math.round(displayDays / 365)
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
            </div>

            {training.certificate && (
              <div className="border-t border-gray-100 pt-4 dark:border-gray-700">
                <a
                  href={training.certificate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
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
