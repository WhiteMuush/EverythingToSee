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

export default function Home() {
  const [sites, setSites] = useState<Site[]>([])
  const [filteredSites, setFilteredSites] = useState<Site[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch sites from API
  const fetchSites = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/sites")

      if (!response.ok) {
        throw new Error("Failed to fetch sites")
      }

      const data = await response.json()
      setSites(data)
    } catch (error) {
      console.error("Error fetching sites:", error)
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

  const handleAddSite = async (newSite: Omit<Site, "id">) => {
    try {
      if (editingSite) {
        // Update existing site
        const response = await fetch(`/api/sites/${editingSite.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSite),
        })

        if (!response.ok) {
          throw new Error("Failed to update site")
        }

        toast({
          title: "Success",
          description: "Site updated successfully!",
        })
      } else {
        // Add new site
        const response = await fetch("/api/sites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSite),
        })

        if (!response.ok) {
          throw new Error("Failed to add site")
        }

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

  const handleDeleteSite = async (siteId: string) => {
    try {
      const response = await fetch(`/api/sites/${siteId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete site")
      }

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

