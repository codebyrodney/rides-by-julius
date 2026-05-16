import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { WHATSAPP_NUMBER } from '../../utils/helpers'

export default function WhatsAppButton({ car }) {
  const msg = car
    ? `Hello, I'm interested in the ${car.year} ${car.make} ${car.model}. Could you please provide more details?`
    : `Hello, I'm interested in your luxury vehicle collection. Could you assist me?`

  const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, '')}?text=${encodeURIComponent(msg)}`

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-green-500 hover:bg-green-400 text-white px-4 py-3 shadow-2xl shadow-green-500/30 transition-all duration-300 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle size={20} fill="currentColor" />
      <span className="text-sm font-body font-medium tracking-wide hidden sm:block">WhatsApp Us</span>
    </motion.a>
  )
}
