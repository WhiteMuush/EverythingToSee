"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, ExternalLink, Trash2, Plus, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Site } from "@/lib/types"
import { cn } from "@/lib/utils"
import { getCategoryColor } from "@/lib/utils"

interface CategorySectionProps {
  category: string
  sites: Site[]
  onAddSite: () => void
  onDeleteSite: (id: string) => void
}

export default function CategorySection({ category, sites, onAddSite, onDeleteSite }: CategorySectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef
      const scrollAmount = current.clientWidth * 0.8

      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  const categoryColor = getCategoryColor(category)
  const categoryId = category.toLowerCase().replace(/\s+/g, "-")

  return (
    <section id={categoryId} className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <span className={cn("inline-block w-3 h-3 rounded-full mr-3", categoryColor.dot)} />
          {category}
        </h2>
        <Button
          onClick={onAddSite}
          variant="outline"
          className={cn("border-gray-700 bg-gray-800/50 hover:bg-gray-700", categoryColor.buttonHover)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add {category} Site
        </Button>
      </div>

      <div className="relative group">
        {sites.length > 4 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {sites.length > 0 ? (
            sites.map((site) => <CategoryCard key={site.id} site={site} onDelete={onDeleteSite} />)
          ) : (
            <div className="flex items-center justify-center w-full h-48 bg-gray-800/30 rounded-lg border border-gray-700">
              <div className="text-center">
                <p className="text-gray-400 mb-3">No {category} sites added yet</p>
                <Button onClick={onAddSite} className={cn("bg-gray-800 hover:bg-gray-700", categoryColor.buttonHover)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Site
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

interface CategoryCardProps {
  site: Site
  onDelete: (id: string) => void
}

function CategoryCard({ site, onDelete }: CategoryCardProps) {
  const categoryColor = getCategoryColor(site.category)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="min-w-[250px] w-[250px] mr-4 snap-start"
    >
      <div
        className={cn(
          "relative group rounded-lg overflow-hidden border border-gray-800 bg-gray-900 transition-all duration-300 hover:shadow-lg",
          `hover:shadow-${categoryColor.shadow}`,
        )}
      >
        <div className="aspect-[2/3] relative overflow-hidden">
          {site.imageUrl ? (
            <img
              src={site.imageUrl || "/placeholder.svg"}
              alt={site.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className={cn("w-full h-full flex items-center justify-center", categoryColor.bg)}>
              <span className="text-2xl font-bold">{site.name.charAt(0)}</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="text-lg font-bold mb-1">{site.name}</h3>
            <p className="text-sm text-gray-300 line-clamp-2">{site.description}</p>

            <div className="flex mt-3 space-x-2">
              <Button
                size="sm"
                className="flex-1 bg-white text-black hover:bg-gray-200"
                onClick={() => window.open(site.url, "_blank")}
              >
                <ExternalLink className="mr-1 h-3 w-3" />
                Visit
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="bg-black/50 hover:bg-black/70"
                onClick={() => window.dispatchEvent(new CustomEvent("edit-site", { detail: site }))}
              >
                <Pencil className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="bg-black/50 hover:bg-black/70"
                onClick={() => onDelete(site.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className={cn("h-1 w-full", categoryColor.bar)} />
      </div>
    </motion.div>
  )
}

// Export the Card component to be used in the main page for search results
CategorySection.Card = CategoryCard

