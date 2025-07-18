"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowLeft, HelpCircle, Mail, Phone, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function PatientHelpCenter() {
  const faqs = [
    {
      question: "How do I find a specific medicine?",
      answer:
        "Use the 'Search Medicines' feature on your dashboard. You can type the medicine name or select from popular options. Filters for distance, price, and availability are also available.",
    },
    {
      question: "What are reward points and how do I earn them?",
      answer:
        "Reward points are earned by uploading prescriptions and receipts. They help us gather data for real-time monitoring. You can use these points for discounts on future medicine purchases.",
    },
    {
      question: "What if a pharmacy is selling medicines at a higher price?",
      answer:
        "You can report this using the 'Report a Problem' feature. Our system will verify the anomaly, and if confirmed, the pharmacy will be flagged, and you will earn reward points.",
    },
    {
      question: "How accurate is the medicine availability data?",
      answer:
        "Our data is crowdsourced from patients and updated by pharmacies. While we strive for real-time accuracy, occasional discrepancies may occur. You can help by reporting any issues you find.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 max-w-sm mx-auto">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center p-4">
          <Link href="/patient/dashboard">
            <Button variant="ghost" size="sm" className="mr-2 p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold text-gray-900">Help Center</h1>
            <p className="text-sm text-gray-600">Find answers and get support</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* FAQs */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <HelpCircle className="mr-2 h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">Can't find what you're looking for? Reach out to us.</p>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Mail className="mr-2 h-5 w-5" />
              Email Us
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Phone className="mr-2 h-5 w-5" />
              Call Us
            </Button>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <MessageSquare className="mr-2 h-5 w-5" />
              Chat with Support
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom padding for mobile navigation */}
      <div className="h-20"></div>
    </div>
  )
}
