export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
             Hello<span className="text-white">Stream</span>
            </span>
            <p className="text-sm text-gray-400 mt-1">Your curated streaming platform directory</p>
          </div>

          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Hello-Stream. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

