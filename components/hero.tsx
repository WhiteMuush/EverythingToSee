"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div
        className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center"
        style={{
          backgroundImage: "url('https://i.pinimg.com/originals/f7/f8/7c/f7f87c9ef19d812492bddf6a239c7878.jpg')",
          filter: "brightness(0.4)",
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-900/50 to-gray-950" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            Tu as pas de thune ?
            <span className="block text-[#ED4592]">Moi non plus !</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 mb-8"
          >
            En mode Slay t'as vues 🎀
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              size="lg"
              className="bg-[#ED4592] hover:bg-[#ED4592]/90 text-white"
              onClick={() => {
                document.getElementById("search")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Explore Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated gradient shapes */}
      <div className="absolute -bottom-32 left-0 w-full h-64 bg-gradient-to-t from-gray-950 to-transparent" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#ED4592]/20 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 3, delay: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        className="absolute -bottom-40 -left-20 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl"
      />
    </section>
  )
}

