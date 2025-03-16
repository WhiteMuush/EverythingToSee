"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Header from "@/components/header"
import Hero from "@/components/hero"
import SearchBar from "@/components/search-bar"
import CategorySection from "@/components/category-section"
import AddSiteModal from "@/components/add-site-modal"
import Footer from "@/components/footer"
import type { Site, Category } from "@/lib/types"
import { initialSites } from "@/lib/data"

export default function Home() {
  const [sites, setSites] = useState<Site[]>([])
  const [filteredSites, setFilteredSites] = useState<Site[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [editingSite, setEditingSite] = useState<Site | null>(null)

  // Load sites from localStorage on initial render
  useEffect(() => {
    const storedSites = localStorage.getItem("streamverse-sites")
    if (storedSites) {
      setSites(JSON.parse(storedSites))
    } else {
      setSites(initialSites)
      localStorage.setItem("streamverse-sites", JSON.stringify(initialSites))
    }
  }, [])

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

  // Update the handleAddSite function to handle editing
  const handleAddSite = (newSite: Site) => {
    if (editingSite) {
      // Update existing site
      const updatedSites = sites.map((site) => (site.id === editingSite.id ? { ...newSite, id: editingSite.id } : site))
      setSites(updatedSites)
      localStorage.setItem("streamverse-sites", JSON.stringify(updatedSites))
      setEditingSite(null)
    } else {
      // Add new site
      const updatedSites = [...sites, { ...newSite, id: Date.now().toString() }]
      setSites(updatedSites)
      localStorage.setItem("streamverse-sites", JSON.stringify(updatedSites))
    }
    setIsModalOpen(false)
  }

  const handleDeleteSite = (siteId: string) => {
    const updatedSites = sites.filter((site) => site.id !== siteId)
    setSites(updatedSites)
    localStorage.setItem("streamverse-sites", JSON.stringify(updatedSites))
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

          {searchQuery.trim() !== "" ? (
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
    </div>
  )
}

