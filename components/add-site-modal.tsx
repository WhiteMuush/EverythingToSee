"use client"

import { cn } from "@/lib/utils"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Site, Category } from "@/lib/types"
import { getCategoryColor } from "@/lib/utils"

interface AddSiteModalProps {
  isOpen: boolean
  onClose: () => void
  onAddSite: (site: Site) => void
  initialCategory: Category | null
  editingSite: Site | null
}

export default function AddSiteModal({ isOpen, onClose, onAddSite, initialCategory, editingSite }: AddSiteModalProps) {
  const [formData, setFormData] = useState<Omit<Site, "id">>({
    name: "",
    url: "",
    description: "",
    category: initialCategory || "Movies",
    imageUrl: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Update form data when editing a site
  useEffect(() => {
    if (editingSite) {
      setFormData({
        name: editingSite.name,
        url: editingSite.url,
        description: editingSite.description,
        category: editingSite.category,
        imageUrl: editingSite.imageUrl || "",
      })
    } else if (initialCategory) {
      setFormData((prev) => ({ ...prev, category: initialCategory }))
    }
  }, [editingSite, initialCategory])

  // Update category when initialCategory changes
  useEffect(() => {
    if (initialCategory) {
      setFormData((prev) => ({ ...prev, category: initialCategory }))
    }
  }, [initialCategory])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value as Category }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.url.trim()) {
      newErrors.url = "URL is required"
    } else if (!/^https?:\/\/.+/.test(formData.url)) {
      newErrors.url = "URL must start with http:// or https://"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onAddSite(formData)
    }
  }

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const categoryColor = getCategoryColor(formData.category)

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-gray-900 rounded-lg shadow-xl overflow-hidden"
          >
            <div className={cn("h-2 w-full", categoryColor.bar)} />

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{editingSite ? "Edit Streaming Site" : "Add New Streaming Site"}</h2>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Site Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={cn("bg-gray-800 border-gray-700", errors.name && "border-red-500")}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="url" className="block text-sm font-medium mb-1">
                      URL
                    </label>
                    <Input
                      id="url"
                      name="url"
                      value={formData.url}
                      onChange={handleChange}
                      placeholder="https://"
                      className={cn("bg-gray-800 border-gray-700", errors.url && "border-red-500")}
                    />
                    {errors.url && <p className="mt-1 text-sm text-red-500">{errors.url}</p>}
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-1">
                      Category
                    </label>
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="Movies">Movies</SelectItem>
                        <SelectItem value="Streaming">Streaming</SelectItem>
                        <SelectItem value="Anime">Anime</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Autres">Autres</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className={cn("bg-gray-800 border-gray-700", errors.description && "border-red-500")}
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                  </div>

                  <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                      Image URL (optional)
                    </label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6 space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="bg-gray-800 border-gray-700 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className={cn("text-white", categoryColor.button)}>
                    {editingSite ? "Save Changes" : "Add Site"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

