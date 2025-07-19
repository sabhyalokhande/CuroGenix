"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash } from "lucide-react"

export default function PharmacyInventory() {
  const [medicines, setMedicines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    description: "",
    stock: 0,
    price: 0,
    manufacturer: "",
    expiryDate: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    setToken(typeof window !== "undefined" ? localStorage.getItem("token") : null)
  }, [])

  const fetchMedicines = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/medicines")
      const data = await res.json()
      setMedicines(Array.isArray(data) ? data : [])
    } catch {
      setError("Failed to load medicines")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedicines()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/medicines", {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editId ? { ...form, id: editId } : form)
      })
      if (!res.ok) throw new Error("Failed to save medicine")
      setForm({ name: "", description: "", stock: 0, price: 0, manufacturer: "", expiryDate: "" })
      setEditId(null)
      fetchMedicines()
    } catch {
      setError("Failed to save medicine")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (med: any) => {
    setEditId(med._id)
    setForm({
      name: med.name || "",
      description: med.description || "",
      stock: med.stock || 0,
      price: med.price || 0,
      manufacturer: med.manufacturer || "",
      expiryDate: med.expiryDate ? med.expiryDate.slice(0, 10) : ""
    })
  }

  const handleDelete = async (id: string) => {
    setIsSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/medicines", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      })
      if (!res.ok) throw new Error("Failed to delete medicine")
      fetchMedicines()
    } catch {
      setError("Failed to delete medicine")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pharmacy Inventory</h1>
      <Card className="mb-6">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Medicine Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input id="manufacturer" name="manufacturer" value={form.manufacturer} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" name="stock" type="number" value={form.stock} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" name="price" type="number" value={form.price} onChange={handleChange} required />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" name="description" value={form.description} onChange={handleChange} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input id="expiryDate" name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} />
              </div>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {editId ? "Update Medicine" : "Add Medicine"}
              <Plus className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
      <h2 className="text-xl font-semibold mb-2">Current Inventory</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-3">
          {medicines.length === 0 && <div className="text-gray-500">No medicines found.</div>}
          {medicines.map((med) => (
            <Card key={med._id} className="flex items-center justify-between p-4">
              <div>
                <div className="font-bold">{med.name}</div>
                <div className="text-sm text-gray-500">Stock: {med.stock} | Price: ₹{med.price}</div>
                <div className="text-xs text-gray-400">{med.description}</div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(med)}><Edit className="h-4 w-4" /></Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(med._id)}><Trash className="h-4 w-4" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 