"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Upload, Receipt, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FloatingActionButtonProps {
  onPrescriptionUpload: () => void
  onReceiptUpload: () => void
}

export function FloatingActionButton({ onPrescriptionUpload, onReceiptUpload }: FloatingActionButtonProps) {
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
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: Receipt,
      label: "Upload Receipt",
      onClick: () => {
        onReceiptUpload()
        setIsOpen(false)
      },
      color: "bg-green-500 hover:bg-green-600",
    },
  ]

  return (
    <div className="fab-menu">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 20, y: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <span className="bg-white px-3 py-1 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
                <Button size="icon" className={`w-12 h-12 rounded-full shadow-lg ${item.color}`} onClick={item.onClick}>
                  <item.icon className="w-5 h-5" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          size="icon"
          className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          onClick={toggleMenu}
        >
          <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
            {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
          </motion.div>
        </Button>
      </motion.div>
    </div>
  )
}
