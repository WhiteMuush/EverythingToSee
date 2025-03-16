"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  const clearSearch = () => {
    setQuery("")
    onSearch("")
  }

  return (
    <motion.div
      id="search"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="max-w-3xl mx-auto mt-8 mb-12"
    >
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Search for streaming sites..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-14 pl-12 pr-12 bg-gray-800/50 border-gray-700 rounded-full text-white placeholder:text-gray-400 focus:border-[#ED4592] focus:ring-[#ED4592]/20"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />

        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        )}

        <Button
          type="submit"
          className="absolute right-1 top-1 h-12 bg-[#ED4592] hover:bg-[#ED4592]/90 text-white rounded-full px-6"
        >
          Search
        </Button>
      </form>
    </motion.div>
  )
}

