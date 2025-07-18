import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, MapPin, Building2, Shield, Search, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">MediPulse</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900">
              Terms
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Track Medicine Availability in Real-Time</h1>
          <p className="text-xl text-gray-600 mb-12">
            Find medicines, report shortages, and help ensure healthcare accessibility for everyone
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Search className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Find Medicines</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Search and locate medicines across pharmacies in your area</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <AlertTriangle className="h-12 w-12 text-orange-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Report Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Report medicine shortages and pricing issues to help others</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Pharmacy Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Manage inventory and track demand patterns efficiently</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Government Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Monitor regional health trends and detect anomalies</CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Login Options */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Choose Your Role</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <Link href="/patient/login" className="flex-1">
                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
                  <MapPin className="mr-2 h-5 w-5" />
                  Login as Patient
                </Button>
              </Link>
              <Link href="/pharmacy/login" className="flex-1">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  <Building2 className="mr-2 h-5 w-5" />
                  Login as Pharmacy
                </Button>
              </Link>
              <Link href="/government/login" className="flex-1">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Login as Government
                </Button>
              </Link>
            </div>
            <div className="mt-4">
              <Link href="/patient/dashboard">
                <Button variant="ghost" className="text-gray-600">
                  Continue as Guest (Limited Access)
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Heart className="h-6 w-6 text-green-600" />
              <span className="text-lg font-semibold">MediPulse</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <Link href="/about" className="hover:text-gray-900">
                About
              </Link>
              <Link href="/contact" className="hover:text-gray-900">
                Contact
              </Link>
              <Link href="/terms" className="hover:text-gray-900">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-gray-900">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
