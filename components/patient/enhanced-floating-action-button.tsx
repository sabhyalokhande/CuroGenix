"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Upload, Receipt, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FloatingActionButtonProps {
  onPrescriptionUpload: () => void
  onReceiptUpload: () => void
}

export function EnhancedFloatingActionButton({ onPrescriptionUpload, onReceiptUpload }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const menuItems = [
    {
      icon: Upload,
      label: "Upload Prescription",
      onClick: () => {
        onPrescriptionUpload()
        setIsOpen(false)
      },
      gradient: "from-blue-500 to-purple-600",
      delay: 0,
    },
    {
      icon: Receipt,
      label: "Upload Receipt",
      onClick: () => {
        onReceiptUpload()
        setIsOpen(false)
      },
      gradient: "from-green-500 to-emerald-600",
      delay: 0.1,
    },
  ]

  return (
    <div className="fab-menu">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu items */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-20 right-0 space-y-4"
            >
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 50, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, y: 20, scale: 0.8 }}
                  transition={{
                    delay: item.delay,
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                  className="flex items-center space-x-4 group"
                >
                  {/* Label */}
                  <motion.div
                    whileHover={{ scale: 1.05, x: -5 }}
                    className="glass-morphism px-4 py-2 rounded-xl shadow-lg backdrop-blur-md border border-white/20"
                  >
                    <span className="text-sm font-medium text-gray-800 whitespace-nowrap">{item.label}</span>
                  </motion.div>

                  {/* Button */}
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="icon"
                      className={`w-14 h-14 rounded-full shadow-xl bg-gradient-to-r ${item.gradient} border-0 glow-effect`}
                      onClick={item.onClick}
                    >
                      <item.icon className="w-6 h-6" />
                    </Button>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
        <Button
          size="icon"
          className="w-16 h-16 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border-0 relative overflow-hidden group animate-pulse-glow"
          onClick={toggleMenu}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Sparkle effect */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute inset-0 opacity-30"
          >
            <Sparkles className="w-4 h-4 absolute top-2 right-2 text-white" />
            <Sparkles className="w-3 h-3 absolute bottom-3 left-3 text-white" />
          </motion.div>

          {/* Main icon */}
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className="relative z-10"
          >
            {isOpen ? <X className="w-7 h-7" /> : <Plus className="w-7 h-7" />}
          </motion.div>
        </Button>
      </motion.div>
    </div>
  )
}
