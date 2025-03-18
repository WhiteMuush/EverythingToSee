"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Header from "@/components/header"
import Hero from "@/components/hero"
import SearchBar from "@/components/search-bar"
import CategorySection from "@/components/category-section"
import AddSiteModal from "@/components/add-site-modal"
import Footer from "@/components/footer"
import type { Site, Category } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { getStorage } from "@/lib/storage"

export default function Home() {
  const [sites, setSites] = useState<Site[]>([])
  const [filteredSites, setFilteredSites] = useState<Site[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch sites from API or localStorage
  const fetchSites = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Try to fetch from API first
      try {
        const response = await fetch("/api/sites")

        if (response.ok) {
          const data = await response.json()
          setSites(data)
          return
        }
      } catch (apiError) {
        console.error("API error, falling back to localStorage:", apiError)
      }

      // Fallback to direct localStorage access if API fails
      const storage = getStorage()
      const data = await storage.getAllSites()
      setSites(data)
    } catch (error) {
      console.error("Error fetching sites:", error)
      setError("Failed to load sites. Please try again later.")
      toast({
        title: "Error",
        description: "Failed to load sites. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load sites on initial render
  useEffect(() => {
    fetchSites()
  }, [fetchSites])

  // Listen for edit-site event
  useEffect(() => {
    const handleEditSite = (e: CustomEvent<Site>) => {
      setEditingSite(e.detail)
      setSelectedCategory(e.detail.category)
      setIsModalOpen(true)
    }

    window.addEventListener("edit-site", handleEditSite as EventListener)

    return () => {
      window.removeEventListener("edit-site", handleEditSite as EventListener)
    }
  }, [])

  // Update filtered sites when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSites(sites)
    } else {
      const filtered = sites.filter(
        (site) =>
          site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          site.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredSites(filtered)
    }
  }, [searchQuery, sites])

  // Handle adding or updating a site
  const handleAddSite = async (newSite: Omit<Site, "id">) => {
    try {
      if (editingSite) {
        // Try API first
        try {
          const response = await fetch(`/api/sites/${editingSite.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newSite),
          })

          if (response.ok) {
            toast({
              title: "Success",
              description: "Site updated successfully!",
            })
            fetchSites()
            setIsModalOpen(false)
            setEditingSite(null)
            return
          }
        } catch (apiError) {
          console.error("API error, falling back to localStorage:", apiError)
        }

        // Fallback to localStorage
        const storage = getStorage()
        await storage.updateSite(editingSite.id, newSite)
        toast({
          title: "Success",
          description: "Site updated successfully!",
        })
      } else {
        // Try API first
        try {
          const response = await fetch("/api/sites", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newSite),
          })

          if (response.ok) {
            toast({
              title: "Success",
              description: "Site added successfully!",
            })
            fetchSites()
            setIsModalOpen(false)
            return
          }
        } catch (apiError) {
          console.error("API error, falling back to localStorage:", apiError)
        }

        // Fallback to localStorage
        const storage = getStorage()
        await storage.addSite(newSite)
        toast({
          title: "Success",
          description: "Site added successfully!",
        })
      }

      // Refresh the sites list
      fetchSites()
      setIsModalOpen(false)
      setEditingSite(null)
    } catch (error) {
      console.error("Error saving site:", error)
      toast({
        title: "Error",
        description: editingSite ? "Failed to update site. Please try again." : "Failed to add site. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle deleting a site
  const handleDeleteSite = async (siteId: string) => {
    try {
      // Try API first
      try {
        const response = await fetch(`/api/sites/${siteId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          toast({
            title: "Success",
            description: "Site deleted successfully!",
          })
          fetchSites()
          return
        }
      } catch (apiError) {
        console.error("API error, falling back to localStorage:", apiError)
      }

      // Fallback to localStorage
      const storage = getStorage()
      await storage.deleteSite(siteId)

      // Refresh the sites list
      fetchSites()

      toast({
        title: "Success",
        description: "Site deleted successfully!",
      })
    } catch (error) {
      console.error("Error deleting site:", error)
      toast({
        title: "Error",
        description: "Failed to delete site. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openModal = (category?: Category) => {
    setEditingSite(null)
    setSelectedCategory(category || null)
    setIsModalOpen(true)
  }

  // Get unique categories from sites
  const categories = Array.from(new Set(sites.map((site) => site.category)))

  // Fallback UI for errors
  if (error && !isLoading && sites.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
        <Header onAddSite={() => openModal()} />
        <main className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to load sites</h2>
          <p className="text-gray-400 mb-8">{error}</p>
          <button onClick={fetchSites} className="bg-[#ED4592] hover:bg-[#ED4592]/90 text-white px-6 py-2 rounded-md">
            Try Again
          </button>
        </main>
        <Footer />
        <Toaster />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      <Header onAddSite={() => openModal()} />

      <main>
        <Hero />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="container mx-auto px-4 py-8"
        >
          <SearchBar onSearch={setSearchQuery} />

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ED4592]"></div>
            </div>
          ) : searchQuery.trim() !== "" ? (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Search Results</h2>
              {filteredSites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredSites.map((site) => (
                    <CategorySection.Card key={site.id} site={site} onDelete={handleDeleteSite} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No results found for "{searchQuery}"</p>
              )}
            </div>
          ) : (
            categories.map((category) => (
              <CategorySection
                key={category}
                category={category}
                sites={sites.filter((site) => site.category === category)}
                onAddSite={() => openModal(category as Category)}
                onDeleteSite={handleDeleteSite}
              />
            ))
          )}
        </motion.div>
      </main>

      <Footer />

      {isModalOpen && (
        <AddSiteModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingSite(null)
          }}
          onAddSite={handleAddSite}
          initialCategory={selectedCategory}
          editingSite={editingSite}
        />
      )}

      <Toaster />
    </div>
  )
}

