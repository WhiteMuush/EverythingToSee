"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Menu, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeaderProps {
  onAddSite: () => void
}

export default function Header({ onAddSite }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Categories for navigation
  const categories = ["Movies", "Streaming", "Anime", "Sports", "Autres"]

  // Handle scroll event to add backdrop filter
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Hello<span className="text-white">Stream</span>
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {categories.map((category) => (
              <a
                key={category}
                href={`#${category.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {category}
              </a>
            ))}
          </nav>

          {/* Add Site Button (Desktop) */}
          <div className="hidden md:block">
            <Button onClick={onAddSite} className="bg-[#ED4592] hover:bg-[#ED4592]/90 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Site
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button onClick={onAddSite} size="sm" className="mr-2 bg-[#ED4592] hover:bg-[#ED4592]/90 text-white">
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-gray-900 border-t border-gray-800"
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {categories.map((category) => (
                <a
                  key={category}
                  href={`#${category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-gray-300 hover:text-white transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category}
                </a>
              ))}
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  )
}

