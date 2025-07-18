"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, HelpCircle, MessageCircle, Phone, Mail, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const faqData = [
    {
      question: "How do I search for medicines?",
      answer:
        "Use the search bar on the dashboard or go to the Search tab. You can search by medicine name, brand, or generic name. The app will show nearby pharmacies with availability and prices.",
    },
    {
      question: "How do reward points work?",
      answer:
        "Earn points by uploading receipts (+25 pts), reporting price issues (+20 pts), and making purchases (+15 pts). Redeem points for discounts, vouchers, and other rewards.",
    },
    {
      question: "How accurate are the medicine prices?",
      answer:
        "Prices are updated regularly from pharmacy partners and user reports. If you find incorrect pricing, please report it to help keep our data accurate.",
    },
    {
      question: "Can I save my favorite pharmacies?",
      answer:
        "Yes! Tap the heart icon on any pharmacy to save it. Access your saved pharmacies from the Saved tab for quick reference.",
    },
    {
      question: "How do I upload a prescription?",
      answer:
        "Tap the + button on the dashboard, select 'Prescription', then take a photo or upload from gallery. Our AI will extract medicine details automatically.",
    },
    {
      question: "Is my personal data secure?",
      answer:
        "Yes, we use industry-standard encryption and never share your personal information with third parties without your consent.",
    },
  ]

  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen liquid-glass-bg text-white max-w-sm mx-auto">
      {/* SVG Filter for Liquid Distortion */}
      <svg style={{ display: "none" }}>
        <filter id="liquidGlass">
          <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="turb" />
          <feDisplacementMap in2="turb" in="SourceGraphic" scale="15" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Header */}
      <div className="glass-nav border-b border-white/10 sticky top-0 z-10">
        <div className="flex items-center p-4">
          <Link href="/patient/dashboard">
            <Button variant="ghost" size="sm" className="mr-2 p-2 glass-button border-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold text-white">Help & Support</h1>
            <p className="text-sm text-gray-400">Get help and find answers</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search help topics..."
              className="pl-10 glass-input border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="glass-card border-0">
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h3 className="font-medium text-white mb-1">Live Chat</h3>
              <p className="text-xs text-gray-400 mb-3">Chat with support</p>
              <Button size="sm" className="w-full glass-button border-0">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-4 text-center">
              <Phone className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <h3 className="font-medium text-white mb-1">Call Us</h3>
              <p className="text-xs text-gray-400 mb-3">24/7 support line</p>
              <Button size="sm" className="w-full glass-button border-0">
                Call Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Mail className="mr-2 h-5 w-5 text-purple-400" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Email Support</span>
              <span className="text-blue-400">support@medipulse.com</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Phone Support</span>
              <span className="text-green-400">+91 1800-123-4567</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Support Hours</span>
              <span className="text-gray-400">24/7</span>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <HelpCircle className="mr-2 h-5 w-5 text-yellow-400" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No results found for "{searchQuery}"</p>
            ) : (
              filteredFaqs.map((faq, index) => (
                <div key={index} className="glass-card rounded-lg">
                  <Button
                    variant="ghost"
                    className="w-full p-4 text-left justify-between hover:bg-white/5"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="text-white font-medium">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4">
                      <p className="text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-white">App Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Version</span>
              <span className="text-gray-400">1.2.3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Last Updated</span>
              <span className="text-gray-400">Dec 15, 2024</span>
            </div>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-blue-400 hover:text-blue-300">
                Privacy Policy
              </Button>
              <Button variant="ghost" className="w-full justify-start text-blue-400 hover:text-blue-300">
                Terms of Service
              </Button>
              <Button variant="ghost" className="w-full justify-start text-blue-400 hover:text-blue-300">
                Rate the App
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="h-20"></div>
    </div>
  )
}
