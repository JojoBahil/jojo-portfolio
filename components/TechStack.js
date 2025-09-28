'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function TechStack({ techItems = [] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Group tech items by category
  const groupedTech = techItems.reduce((acc, tech) => {
    const group = tech.group || 'Other'
    if (!acc[group]) {
      acc[group] = []
    }
    acc[group].push(tech)
    return acc
  }, {})

  // Define the order of tech groups (most important to least important)
  const groupOrder = [
    'Programming',
    'Frameworks/Libraries',
    'Databases',
    'Tools/Platforms',
    'Other'
  ]

  // Sort groups according to the defined order
  const sortedGroups = groupOrder.filter(group => groupedTech[group]).concat(
    Object.keys(groupedTech).filter(group => !groupOrder.includes(group))
  )

  const getLevelColor = (level) => {
    switch (level) {
      case 'Expert':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800'
      case 'Advanced':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
      case 'Intermediate':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
    }
  }

  return (
    <div ref={ref} className="space-y-12">
      {sortedGroups.map((group, groupIndex) => {
        const items = groupedTech[group]
        return (
        <motion.div
          key={group}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: groupIndex * 0.2 }}
          className="space-y-6"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            {group}
          </h3>
          
          <div className="flex flex-wrap justify-center gap-3">
            {items.map((tech, index) => (
              <motion.div
                key={tech.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ 
                  duration: 0.6, 
                  delay: (groupIndex * 0.2) + (index * 0.05),
                  type: 'spring',
                  stiffness: 200
                }}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className={`
                  px-4 py-2 rounded-full border-2 transition-all duration-300 cursor-pointer
                  ${getLevelColor(tech.level)}
                  hover:shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-blue-400/20
                `}>
                  <span className="font-medium">{tech.label}</span>
                  
                  {tech.level && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded shadow-lg whitespace-nowrap z-10"
                    >
                      {tech.level}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        )
      })}

      {techItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 dark:text-gray-600 text-lg">
            No tech stack information available at the moment.
          </div>
        </motion.div>
      )}
    </div>
  )
}
