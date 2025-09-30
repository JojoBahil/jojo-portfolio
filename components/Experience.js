'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, MapPin, ChevronRight } from 'lucide-react'

export default function Experience({ experiences = [] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const formatDate = (date) => {
    // Handle both string and Date object inputs
    const dateObj = typeof date === 'string' ? new Date(date) : date

    // Use UTC methods to avoid timezone issues
    const year = dateObj.getUTCFullYear()
    const month = dateObj.getUTCMonth()

    return new Date(year, month).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

    // Convert days to months and years for display
    const years = Math.floor(diffDays / 365)
    const remainingDays = diffDays % 365
    const months = Math.round(remainingDays / 30)

    // Ensure minimum of 1 month for any experience
    const displayMonths = Math.max(1, months)

    if (years > 0) {
      return displayMonths > 0 ? `${years}y ${displayMonths}m` : `${years}y`
    }
    return `${displayMonths}m`
  }

  const parseHighlights = (highlightsString) => {
    // Handle null, undefined, or empty string
    if (!highlightsString || highlightsString === '') {
      return []
    }

    // If it's already an array, return it
    if (Array.isArray(highlightsString)) {
      return highlightsString
    }

    // If it's a string, try to parse it
    if (typeof highlightsString === 'string') {
      try {
        const parsed = JSON.parse(highlightsString)
        return Array.isArray(parsed) ? parsed : []
      } catch (error) {
        // Try to fix common JSON issues
        let fixedString = highlightsString

        // Fix unterminated strings by adding missing quotes/brackets
        if (fixedString.includes('"') && !fixedString.endsWith('"')) {
          // Try to find where the string should end
          const lastQuoteIndex = fixedString.lastIndexOf('"')
          if (lastQuoteIndex > 0) {
            fixedString = fixedString.substring(0, lastQuoteIndex + 1)
          }
        }

        // Ensure proper JSON array format
        if (!fixedString.startsWith('[')) {
          fixedString = '[' + fixedString
        }
        if (!fixedString.endsWith(']')) {
          fixedString = fixedString + ']'
        }

        // Try parsing the fixed string
        try {
          const parsed = JSON.parse(fixedString)
          return Array.isArray(parsed) ? parsed : []
        } catch (secondError) {
          // Final fallback: split by newlines
          if (highlightsString.includes('\n')) {
            const lines = highlightsString
              .split('\n')
              .filter((line) => line.trim())
            return lines
          }

          return []
        }
      }
    }

    return []
  }

  return (
    <div ref={ref} className="space-y-8">
      {experiences.length === 0 ? (
        <div className="py-12 text-center">
          <div className="text-lg text-gray-500 dark:text-gray-400">
            No experience entries found.
          </div>
          <div className="mt-2 text-sm text-gray-400 dark:text-gray-500">
            Experience entries will appear here once they are added through the
            admin panel.
          </div>
        </div>
      ) : (
        experiences.map((experience, index) => {
          const highlights = parseHighlights(experience.highlights)

          return (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative"
            >
              <div className="flex flex-col gap-8 lg:flex-row">
                {/* Timeline line */}
                <div className="absolute bottom-0 left-8 top-0 hidden w-0.5 bg-gradient-to-b from-blue-500 to-purple-600 lg:block"></div>

                {/* Timeline dot */}
                <div className="z-10 hidden h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg lg:flex">
                  <div className="h-4 w-4 rounded-full bg-white"></div>
                </div>

                {/* Content */}
                <div className="flex-1 rounded-2xl bg-white p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800">
                  <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                        {experience.role}
                      </h3>
                      <div className="mb-2 flex items-center font-semibold text-blue-600 dark:text-blue-400">
                        <MapPin className="mr-1 h-4 w-4" />
                        {experience.company}
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end">
                      <div className="mb-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="mr-1 h-4 w-4" />
                        {formatDate(experience.startDate)} -{' '}
                        {experience.endDate
                          ? formatDate(experience.endDate)
                          : 'Present'}
                      </div>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {getDuration(experience.startDate, experience.endDate)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="whitespace-pre-wrap break-words leading-relaxed text-gray-600 dark:text-gray-300">
                      {experience.summary}
                    </p>
                  </div>

                  {highlights.length > 0 && (
                    <div>
                      <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                        Key Achievements
                      </h4>
                      <ul className="space-y-3">
                        {highlights.map((highlight, highlightIndex) => (
                          <motion.li
                            key={highlightIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={
                              isInView
                                ? { opacity: 1, x: 0 }
                                : { opacity: 0, x: -20 }
                            }
                            transition={{
                              duration: 0.6,
                              delay: index * 0.2 + highlightIndex * 0.1,
                            }}
                            className="flex items-start"
                          >
                            <ChevronRight className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                            <span className="text-gray-600 dark:text-gray-300">
                              {highlight}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })
      )}
    </div>
  )
}
