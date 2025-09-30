'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, MapPin, Award, ExternalLink } from 'lucide-react'

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

  if (trainings.length === 0) {
    return (
      <div className="py-12 text-center">
        <Award className="mx-auto mb-4 h-16 w-16 text-gray-400 dark:text-gray-600" />
        <p className="text-lg text-gray-500 dark:text-gray-400">
          No trainings available at the moment.
        </p>
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
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-all duration-300 hover:border-blue-200 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-700">
            <div className="mb-6 flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="mb-3 flex items-center">
                  <Award className="mr-3 h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {training.title}
                  </h3>
                </div>

                <div className="mb-4 flex items-center font-semibold text-blue-600 dark:text-blue-400">
                  <MapPin className="mr-2 h-4 w-4" />
                  {training.institution}
                </div>

                {training.description && (
                  <p className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">
                    {training.description}
                  </p>
                )}
              </div>

              <div className="flex flex-col lg:ml-6 lg:items-end">
                <div className="mb-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="mr-2 h-4 w-4" />
                  {formatDate(training.startDate)} -{' '}
                  {training.endDate ? formatDate(training.endDate) : 'Ongoing'}
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {getDuration(training.startDate, training.endDate)}
                </span>
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
