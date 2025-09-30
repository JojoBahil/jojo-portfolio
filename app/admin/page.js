'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  LogOut,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  Eye,
  EyeOff,
  Home,
  GripVertical,
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const TABS = {
  PROJECTS: 'projects',
  EXPERIENCE: 'experience',
  TRAININGS: 'trainings',
  TECH: 'tech',
  MEDIA: 'media',
  LINKS: 'links',
}

// Sortable Item Component
function SortableItem({ item, activeTab, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between px-6 py-4 ${
        isDragging ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
    >
      <div className="flex flex-1 items-center space-x-3">
        {(activeTab === TABS.PROJECTS || activeTab === TABS.TRAININGS) && (
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab p-1 text-gray-400 hover:cursor-grabbing hover:text-gray-600 dark:hover:text-gray-300"
          >
            <GripVertical className="h-4 w-4" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {item.title || item.role || item.label || item.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {item.summary ||
              item.company ||
              item.institution ||
              item.url ||
              item.description}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onEdit(item)}
          className="p-2 text-gray-400 transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-gray-400 transition-colors duration-200 hover:text-red-600 dark:hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('projects')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState({
    projects: [],
    experience: [],
    trainings: [],
    tech: [],
    media: [],
    links: [],
  })
  const [editingItem, setEditingItem] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({})
  const [isDragOver, setIsDragOver] = useState(false)
  const router = useRouter()

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check')
      if (response.ok) {
        setIsAuthenticated(true)
        fetchData()
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      router.push('/admin/login')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchData = async () => {
    try {
      const [
        projectsRes,
        experiencesRes,
        trainingsRes,
        techRes,
        mediaRes,
        linksRes,
      ] = await Promise.all([
        fetch('/api/admin/projects'),
        fetch('/api/admin/experience'),
        fetch('/api/admin/trainings'),
        fetch('/api/admin/tech'),
        fetch('/api/admin/media'),
        fetch('/api/admin/links'),
      ])

      const [projects, experiences, trainings, tech, media, links] =
        await Promise.all([
          projectsRes.json(),
          experiencesRes.json(),
          trainingsRes.json(),
          techRes.json(),
          mediaRes.json(),
          linksRes.json(),
        ])

      setData({
        projects,
        experience: experiences,
        trainings,
        tech,
        media,
        links,
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)

    // Process the item data for the form
    const formData = { ...item }

    // Convert tags from JSON string to comma-separated string for editing
    if (activeTab === TABS.PROJECTS && item.tags) {
      try {
        const tagsArray = JSON.parse(item.tags)
        formData.tags = tagsArray.join(', ')
      } catch (error) {
        formData.tags = item.tags
      }
    }

    // Convert highlights from JSON string to newline-separated string for editing
    if (activeTab === TABS.EXPERIENCE && item.highlights) {
      try {
        const highlightsArray = JSON.parse(item.highlights)
        formData.highlights = highlightsArray.join('\n')
      } catch (error) {
        formData.highlights = item.highlights
      }
    }

    setFormData(formData)
    setShowForm(true)
  }

  const handleCreate = () => {
    setEditingItem(null)
    setFormData({})
    setShowForm(true)
  }

  const handleSave = async () => {
    try {
      // Basic validation for trainings
      if (activeTab === TABS.TRAININGS) {
        if (!formData.title || !formData.institution || !formData.startDate) {
          alert(
            'Please fill in all required fields: Title, Institution, and Start Date'
          )
          return
        }
      }

      // Basic validation for experience
      if (activeTab === TABS.EXPERIENCE) {
        if (
          !formData.role ||
          !formData.company ||
          !formData.startDate ||
          !formData.summary
        ) {
          alert(
            'Please fill in all required fields: Role, Company, Start Date, and Summary'
          )
          return
        }
      }

      const endpoint = editingItem
        ? `/api/admin/${activeTab}/${editingItem.id}`
        : `/api/admin/${activeTab}`

      const method = editingItem ? 'PUT' : 'POST'

      // Process form data before sending
      const dataToSend = { ...formData }

      // Convert tags from comma-separated string to JSON array for projects
      if (activeTab === TABS.PROJECTS && dataToSend.tags) {
        const tagsArray = dataToSend.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
        dataToSend.tags = JSON.stringify(tagsArray)
      }

      // Convert highlights from newline-separated string to JSON array for experience
      if (activeTab === TABS.EXPERIENCE && dataToSend.highlights) {
        const highlightsArray = dataToSend.highlights
          .split('\n')
          .map((highlight) => highlight.trim().replace(/^[•\-\*]\s*/, '')) // Remove bullet points
          .filter((highlight) => highlight.length > 0)
        dataToSend.highlights = JSON.stringify(highlightsArray)
      }

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      })

      if (response.ok) {
        setShowForm(false)
        setEditingItem(null)
        setFormData({})
        fetchData()
        alert(
          `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} saved successfully!`
        )
      } else {
        const errorData = await response.json()
        console.error('Save error:', errorData)
        alert(
          `Error saving ${activeTab}: ${errorData.error || 'Unknown error'}`
        )
      }
    } catch (error) {
      console.error('Save error:', error)
      alert(`Error saving ${activeTab}: ${error.message}`)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch(`/api/admin/${activeTab}/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const handleCleanupExperience = async () => {
    if (!confirm('This will fix corrupted highlights data. Continue?')) return

    try {
      const response = await fetch('/api/admin/experience/cleanup', {
        method: 'POST',
      })

      if (response.ok) {
        const result = await response.json()
        alert(
          `Successfully fixed ${result.fixedCount} corrupted experience entries!`
        )
        fetchData() // Refresh the data
      } else {
        alert('Failed to cleanup experience data')
      }
    } catch (error) {
      console.error('Cleanup error:', error)
      alert('Error during cleanup')
    }
  }

  const handleFixDatabase = async () => {
    if (
      !confirm(
        'This will completely rebuild the experience database with proper data. This will DELETE all existing experience entries and recreate them. Continue?'
      )
    )
      return

    try {
      const response = await fetch('/api/admin/experience/fix-database', {
        method: 'POST',
      })

      if (response.ok) {
        const result = await response.json()
        alert(
          `Successfully rebuilt database! Created ${result.createdCount} experience entries with proper data.`
        )
        fetchData() // Refresh the data
      } else {
        const errorData = await response.json()
        alert(`Failed to fix database: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Database fix error:', error)
      alert('Error during database fix')
    }
  }

  const handleForceRebuild = async () => {
    if (
      !confirm(
        'FORCE REBUILD: This will aggressively delete and recreate ALL experience data. This is the most thorough fix available. Continue?'
      )
    )
      return

    try {
      const response = await fetch('/api/admin/experience/force-rebuild', {
        method: 'POST',
      })

      if (response.ok) {
        const result = await response.json()
        alert(
          `FORCE rebuild completed! Created ${result.createdCount} experience entries.`
        )
        fetchData() // Refresh the data
      } else {
        const errorData = await response.json()
        alert(`Failed to force rebuild: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Force rebuild error:', error)
      alert('Error during force rebuild')
    }
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (
      active.id !== over.id &&
      (activeTab === TABS.PROJECTS || activeTab === TABS.TRAININGS)
    ) {
      if (activeTab === TABS.PROJECTS) {
        const oldIndex = data.projects.findIndex(
          (item) => item.id === active.id
        )
        const newIndex = data.projects.findIndex((item) => item.id === over.id)

        const newProjects = arrayMove(data.projects, oldIndex, newIndex)

        // Update local state immediately for better UX
        setData((prev) => ({ ...prev, projects: newProjects }))

        // Update order values and send to server
        const projectOrders = newProjects.map((project, index) => ({
          id: project.id,
          order: index + 1,
        }))

        try {
          const response = await fetch('/api/admin/projects', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectOrders }),
          })

          if (!response.ok) {
            // Revert on error
            fetchData()
          }
        } catch (error) {
          console.error('Reorder error:', error)
          // Revert on error
          fetchData()
        }
      } else if (activeTab === TABS.TRAININGS) {
        const oldIndex = data.trainings.findIndex(
          (item) => item.id === active.id
        )
        const newIndex = data.trainings.findIndex((item) => item.id === over.id)

        const newTrainings = arrayMove(data.trainings, oldIndex, newIndex)

        // Update local state immediately for better UX
        setData((prev) => ({ ...prev, trainings: newTrainings }))

        // Update order values and send to server
        const trainingOrders = newTrainings.map((training, index) => ({
          id: training.id,
          order: index + 1,
        }))

        try {
          const response = await fetch('/api/admin/trainings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ trainingOrders }),
          })

          if (!response.ok) {
            // Revert on error
            fetchData()
          }
        } catch (error) {
          console.error('Reorder error:', error)
          // Revert on error
          fetchData()
        }
      }
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const uploadFile = async (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)

      // Determine which upload endpoint to use based on environment
      const isProduction = process.env.NODE_ENV === 'production'
      const uploadEndpoint = isProduction ? '/api/upload' : '/api/upload-local'

      console.log('Uploading file to:', uploadEndpoint)

      // Upload via the appropriate API route
      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Upload successful:', result)

        // Handle different response formats
        const imageUrl = result.url || result.imagePath
        handleInputChange('coverId', imageUrl)
        alert('Image uploaded successfully!')
      } else {
        const errorData = await response.json()
        console.error('Upload failed:', errorData)
        alert(`Upload failed: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(`Failed to upload image: ${error.message}`)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    await uploadFile(file)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = async (event) => {
    event.preventDefault()
    setIsDragOver(false)

    const files = event.dataTransfer.files
    if (files.length > 0) {
      await uploadFile(files[0])
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const currentData = Array.isArray(data[activeTab]) ? data[activeTab] : []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center px-4 py-2 text-gray-700 transition-colors duration-200 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              >
                <Home className="mr-2 h-5 w-5" />
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-gray-700 transition-colors duration-200 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {Object.entries(TABS).map(([key, value]) => (
                <button
                  key={value}
                  onClick={() => setActiveTab(value)}
                  className={`border-b-2 px-1 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeTab === value
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* List */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white shadow dark:bg-gray-800">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCreate}
                    className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                  </button>
                  {activeTab === TABS.EXPERIENCE && (
                    <>
                      <button
                        onClick={handleCleanupExperience}
                        className="flex items-center rounded-lg bg-yellow-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-yellow-700"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Fix Data
                      </button>
                      <button
                        onClick={handleFixDatabase}
                        className="flex items-center rounded-lg bg-red-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-700"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Rebuild DB
                      </button>
                      <button
                        onClick={handleForceRebuild}
                        className="flex items-center rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-purple-700"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        FORCE Rebuild
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {activeTab === TABS.PROJECTS || activeTab === TABS.TRAININGS ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={currentData.map((item) => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {currentData.map((item) => (
                        <SortableItem
                          key={item.id}
                          item={item}
                          activeTab={activeTab}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                ) : (
                  currentData.map((item) => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      activeTab={activeTab}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-1">
            {showForm && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-lg bg-white p-6 shadow dark:bg-gray-800"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {editingItem ? 'Edit' : 'Create'} {activeTab.slice(0, -1)}
                  </h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 text-gray-400 transition-colors duration-200 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {activeTab === TABS.PROJECTS && (
                    <>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Title
                        </label>
                        <input
                          type="text"
                          value={formData.title || ''}
                          onChange={(e) =>
                            handleInputChange('title', e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          placeholder="Project title"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Summary
                        </label>
                        <textarea
                          value={formData.summary || ''}
                          onChange={(e) =>
                            handleInputChange('summary', e.target.value)
                          }
                          rows={2}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          placeholder="Brief project summary"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <textarea
                          value={formData.description || ''}
                          onChange={(e) =>
                            handleInputChange('description', e.target.value)
                          }
                          rows={4}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          placeholder="Detailed project description"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={formData.tags || ''}
                          onChange={(e) =>
                            handleInputChange('tags', e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          placeholder="React, Node.js, MongoDB"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Repository URL
                        </label>
                        <input
                          type="url"
                          value={formData.repoUrl || ''}
                          onChange={(e) =>
                            handleInputChange('repoUrl', e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          placeholder="https://github.com/username/project"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Live URL
                        </label>
                        <input
                          type="url"
                          value={formData.liveUrl || ''}
                          onChange={(e) =>
                            handleInputChange('liveUrl', e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          placeholder="https://project-demo.com"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Project Type
                        </label>
                        <select
                          value={formData.projectType || 'developed'}
                          onChange={(e) =>
                            handleInputChange('projectType', e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="developed">
                            Personally Developed
                          </option>
                          <option value="supervised">Supervised</option>
                        </select>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Developed: You coded and built it yourself |
                          Supervised: You planned, guided, and supervised the
                          development team
                        </p>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Cover Image
                        </label>
                        <div className="space-y-4">
                          {/* Image Preview */}
                          {formData.coverId && (
                            <div className="flex justify-center">
                              <img
                                src={formData.coverId}
                                alt="Cover preview"
                                className="h-48 w-full max-w-sm rounded-lg border border-gray-300 object-cover dark:border-gray-600"
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                  e.target.nextSibling.style.display = 'block'
                                }}
                              />
                              <div className="flex hidden h-48 w-full max-w-sm items-center justify-center rounded-lg border border-gray-300 bg-gray-200 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                Image not found
                              </div>
                            </div>
                          )}

                          {/* File Upload */}
                          <div
                            className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors duration-200 ${
                              isDragOver
                                ? 'border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20'
                                : 'border-gray-300 hover:border-blue-400 dark:border-gray-600 dark:hover:border-blue-500'
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                          >
                            <input
                              type="file"
                              id="cover-upload"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                            <label
                              htmlFor="cover-upload"
                              className="flex cursor-pointer flex-col items-center space-y-2"
                            >
                              <Upload
                                className={`h-8 w-8 ${isDragOver ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`}
                              />
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium text-blue-600 dark:text-blue-400">
                                  Click to upload
                                </span>{' '}
                                or drag and drop
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-500">
                                PNG, JPG, GIF up to 10MB
                              </div>
                            </label>
                          </div>

                          {/* Manual Public ID Input (Optional) */}
                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                              Or enter Cloudinary Public ID manually:
                            </label>
                            <input
                              type="text"
                              value={formData.coverId || ''}
                              onChange={(e) =>
                                handleInputChange('coverId', e.target.value)
                              }
                              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                              placeholder={
                                process.env.NODE_ENV === 'production'
                                  ? 'e.g., https://res.cloudinary.com/...'
                                  : 'e.g., /images/project-cover.jpg'
                              }
                            />
                          </div>

                          {/* Info */}
                          <div className="rounded bg-gray-100 p-2 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            <div>
                              📁 Upload Method:{' '}
                              {process.env.NODE_ENV === 'production'
                                ? 'Cloudinary (Production)'
                                : 'Local files (Development)'}
                            </div>
                            <div>
                              ✅ Files are automatically saved with unique names
                            </div>
                            <div>
                              🔗 Image Path: {formData.coverId || 'Not set'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === TABS.EXPERIENCE && (
                    <>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Role *
                        </label>
                        <input
                          type="text"
                          value={formData.role || ''}
                          onChange={(e) =>
                            handleInputChange('role', e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          placeholder="e.g., Software Developer"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Company *
                        </label>
                        <input
                          type="text"
                          value={formData.company || ''}
                          onChange={(e) =>
                            handleInputChange('company', e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          placeholder="e.g., Tech Company Inc."
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          value={formData.startDate || ''}
                          onChange={(e) =>
                            handleInputChange('startDate', e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          End Date (Leave empty if current)
                        </label>
                        <input
                          type="date"
                          value={formData.endDate || ''}
                          onChange={(e) =>
                            handleInputChange('endDate', e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Summary *
                        </label>
                        <textarea
                          value={formData.summary || ''}
                          onChange={(e) =>
                            handleInputChange('summary', e.target.value)
                          }
                          rows={4}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          placeholder="Brief description of your role and responsibilities..."
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Key Achievements (One per line)
                        </label>
                        <textarea
                          value={formData.highlights || ''}
                          onChange={(e) =>
                            handleInputChange('highlights', e.target.value)
                          }
                          rows={6}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          placeholder="• Led a team of 5 developers&#10;• Improved system performance by 40%&#10;• Implemented CI/CD pipeline"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Enter each achievement on a new line. They will be
                          displayed as bullet points.
                        </p>
                      </div>
                    </>
                  )}

                  {activeTab === TABS.TRAININGS && (
                    <>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Title
                        </label>
                        <input
                          type="text"
                          value={formData.title || ''}
                          onChange={(e) =>
                            handleInputChange('title', e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          placeholder="Training title"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Institution
                        </label>
                        <input
                          type="text"
                          value={formData.institution || ''}
                          onChange={(e) =>
                            handleInputChange('institution', e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          placeholder="Institution name"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={formData.startDate || ''}
                          onChange={(e) =>
                            handleInputChange('startDate', e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          End Date (Optional)
                        </label>
                        <input
                          type="date"
                          value={formData.endDate || ''}
                          onChange={(e) =>
                            handleInputChange('endDate', e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description (Optional)
                        </label>
                        <textarea
                          value={formData.description || ''}
                          onChange={(e) =>
                            handleInputChange('description', e.target.value)
                          }
                          rows={3}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          placeholder="Training description"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Certificate URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={formData.certificate || ''}
                          onChange={(e) =>
                            handleInputChange('certificate', e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          placeholder="https://example.com/certificate.pdf"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === TABS.TECH && (
                    <>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Label
                        </label>
                        <input
                          type="text"
                          value={formData.label || ''}
                          onChange={(e) =>
                            handleInputChange('label', e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Group
                        </label>
                        <input
                          type="text"
                          value={formData.group || ''}
                          onChange={(e) =>
                            handleInputChange('group', e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === TABS.LINKS && (
                    <>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Label
                        </label>
                        <input
                          type="text"
                          value={formData.label || ''}
                          onChange={(e) =>
                            handleInputChange('label', e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          URL
                        </label>
                        <input
                          type="url"
                          value={formData.url || ''}
                          onChange={(e) =>
                            handleInputChange('url', e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
