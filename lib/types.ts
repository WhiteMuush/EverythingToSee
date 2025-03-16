export type Category = "Movies" | "TV Shows" | "Anime" | "Sports" | "Streaming"

export interface Site {
  id: string
  name: string
  url: string
  description: string
  category: Category
  imageUrl?: string
}

