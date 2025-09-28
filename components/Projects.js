'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import ProjectCard from './ProjectCard'

export default function Projects({ projects = [] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Separate projects by type
  const developedProjects = projects.filter(project => project.projectType === 'developed')
  const supervisedProjects = projects.filter(project => project.projectType === 'supervised')

  return (
    <div ref={ref} className="space-y-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Here are some of my recent projects that showcase my expertise in full-stack development, 
          database management, and system optimization for government agencies.
        </p>
      </motion.div>

      {/* Personally Developed Projects */}
      {developedProjects.length > 0 && (
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Personally Developed Projects
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Projects I built from scratch using my technical skills
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developedProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Supervised Projects */}
      {supervisedProjects.length > 0 && (
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Supervised Projects
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Projects I planned, guided, and supervised with my development team
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supervisedProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      )}

      {projects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 dark:text-gray-600 text-lg">
            No projects available at the moment.
          </div>
        </motion.div>
      )}
    </div>
  )
}
