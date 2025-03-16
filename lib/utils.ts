import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCategoryColor(category: string) {
  switch (category) {
    case "Movies":
      return {
        dot: "bg-[#ED4592]",
        bar: "bg-[#ED4592]",
        bg: "bg-gradient-to-br from-[#ED4592]/20 to-[#ED4592]/5",
        button: "bg-[#ED4592] hover:bg-[#ED4592]/90",
        buttonHover: "hover:text-[#ED4592] hover:border-[#ED4592]",
        shadow: "shadow-[#ED4592]/20",
      }
    case "TV Shows":
      return {
        dot: "bg-purple-500",
        bar: "bg-purple-500",
        bg: "bg-gradient-to-br from-purple-500/20 to-purple-500/5",
        button: "bg-purple-500 hover:bg-purple-500/90",
        buttonHover: "hover:text-purple-500 hover:border-purple-500",
        shadow: "shadow-purple-500/20",
      }
    case "Anime":
      return {
        dot: "bg-blue-500",
        bar: "bg-blue-500",
        bg: "bg-gradient-to-br from-blue-500/20 to-blue-500/5",
        button: "bg-blue-500 hover:bg-blue-500/90",
        buttonHover: "hover:text-blue-500 hover:border-blue-500",
        shadow: "shadow-blue-500/20",
      }
    case "Sports":
      return {
        dot: "bg-green-500",
        bar: "bg-green-500",
        bg: "bg-gradient-to-br from-green-500/20 to-green-500/5",
        button: "bg-green-500 hover:bg-green-500/90",
        buttonHover: "hover:text-green-500 hover:border-green-500",
        shadow: "shadow-green-500/20",
      }
    case "News":
      return {
        dot: "bg-amber-500",
        bar: "bg-amber-500",
        bg: "bg-gradient-to-br from-amber-500/20 to-amber-500/5",
        button: "bg-amber-500 hover:bg-amber-500/90",
        buttonHover: "hover:text-amber-500 hover:border-amber-500",
        shadow: "shadow-amber-500/20",
      }
    default:
      return {
        dot: "bg-gray-500",
        bar: "bg-gray-500",
        bg: "bg-gradient-to-br from-gray-500/20 to-gray-500/5",
        button: "bg-gray-500 hover:bg-gray-500/90",
        buttonHover: "hover:text-gray-500 hover:border-gray-500",
        shadow: "shadow-gray-500/20",
      }
  }
}

