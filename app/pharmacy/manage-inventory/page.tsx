"use client"
import { PharmacyLayout } from "@/components/layouts/pharmacy-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"



function statusColor(status: string) {
  if (status === "critical") return "bg-red-500/20 text-red-500"
  if (status === "low") return "bg-yellow-500/20 text-yellow-500"
  return "bg-green-500/20 text-green-500"
}

function getStatus(stock: number, minimumStock: number) {
  if (stock < minimumStock / 2) return "critical"
  if (stock < minimumStock) return "low"
  return "ok"
}

export default function ManageInventory() {
  const [filter, setFilter] = useState("")
  const [inventory, setInventory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [user, setUser] = useState<any>(null)

  // Add Medicine State
  const [addName, setAddName] = useState("")
  const [addStock, setAddStock] = useState("")
  const [addPrice, setAddPrice] = useState("")

  // Edit Medicine State
  const [editName, setEditName] = useState("")
  const [editStock, setEditStock] = useState("")
  const [editPrice, setEditPrice] = useState("")

  const filtered = inventory.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))

  // Get current user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setUser(data);
      })
      .catch(err => {
        console.error('Failed to fetch user:', err);
      });
    }
  }, []);

  // Fetch inventory data when user is available
  useEffect(() => {
    if (user?._id) {
      fetchInventory()
    }
  }, [user])

  async function fetchInventory() {
    if (!user?._id) return;
    
    try {
      setLoading(true)
      const response = await fetch(`/api/medicines?pharmacyId=${user._id}`)
      if (response.ok) {
        const data = await response.json()
        setInventory(data)
      } else {
        console.error('Failed to fetch inventory')
      }
    } catch (error) {
      console.error('Error fetching inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd() {
    if (!addName || !addStock || !addPrice) return
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }
    
    try {
      const medicineData = {
        name: addName,
        stock: parseInt(addStock),
        price: parseFloat(addPrice),
        description: '',
        manufacturer: '',
        category: '',
        batchNumber: '',
        location: ''
      }
      
      const response = await fetch('/api/medicines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(medicineData)
      })
      
      if (response.ok) {
        await fetchInventory() // Refresh the list
        setAddName("")
        setAddStock("")
        setAddPrice("")
        setAddOpen(false)
      } else {
        alert('Failed to add medicine')
      }
    } catch (error) {
      alert('Error adding medicine')
    }
  }

  async function handleEdit() {
    if (editIdx === null || !editName || !editStock || !editPrice) return
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }
    
    try {
      const medicine = inventory[editIdx]
      const medicineData = {
        name: editName,
        stock: parseInt(editStock),
        price: parseFloat(editPrice)
      }
      
      const response = await fetch('/api/medicines', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: medicine._id,
          ...medicineData
        })
      })
      
      if (response.ok) {
        await fetchInventory() // Refresh the list
        setEditIdx(null)
        setEditName("")
        setEditStock("")
        setEditPrice("")
      } else {
        alert('Failed to update medicine')
      }
    } catch (error) {
      alert('Error updating medicine')
    }
  }

  function openEdit(idx: number) {
    setEditIdx(idx)
    const medicine = inventory[idx]
    setEditName(medicine.name)
    setEditStock(medicine.stock.toString())
    setEditPrice(medicine.price.toString())
  }

  return (
    <PharmacyLayout>
      <div className="relative max-w-5xl mx-auto mt-8">
        <Card className="glass-card shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Manage Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6 items-center">
              <Input placeholder="Search medicine..." value={filter} onChange={e => setFilter(e.target.value)} className="max-w-xs" />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchInventory}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full text-left border-separate border-spacing-y-1">
                <thead className="sticky top-0 z-10 bg-white/10 backdrop-blur-md">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-200">Medicine</th>
                    <th className="px-4 py-3 font-semibold text-gray-200">Stock</th>
                    <th className="px-4 py-3 font-semibold text-gray-200">Minimum</th>
                    <th className="px-4 py-3 font-semibold text-gray-200">Price</th>
                    <th className="px-4 py-3 font-semibold text-gray-200">Status</th>
                    <th className="px-4 py-3 font-semibold text-gray-200 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-400">Loading inventory...</td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-400">No medicines found.</td>
                    </tr>
                  ) : (
                    filtered.map((item, idx) => (
                      <tr key={idx} className={
                        `transition hover:bg-white/5 ${idx % 2 === 0 ? "bg-white/5" : "bg-white/0"}`
                      }>
                        <td className="px-4 py-3 font-medium text-white">{item.name}</td>
                        <td className="px-4 py-3 text-white">{item.stock}</td>
                        <td className="px-4 py-3 text-white">{item.minimumStock}</td>
                        <td className="px-4 py-3 text-white">₹{item.price}</td>
                        <td className="px-4 py-3">
                          <Badge className={`capitalize ${statusColor(getStatus(item.stock, item.minimumStock))}`}>
                            {getStatus(item.stock, item.minimumStock)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-center text-white">
                          <Dialog open={editIdx === idx} onOpenChange={open => { if (!open) setEditIdx(null) }}>
                            <DialogTrigger asChild>
                              <Button size="icon" variant="ghost" className="hover:bg-blue-500/10" onClick={() => openEdit(idx)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Medicine</DialogTitle>
                              </DialogHeader>
                              <div className="flex flex-col gap-3">
                                <Input placeholder="Medicine Name" value={editName} onChange={e => setEditName(e.target.value)} />
                                <Input placeholder="Stock" type="number" value={editStock} onChange={e => setEditStock(e.target.value)} />

                                <Input placeholder="Price (₹)" type="number" step="0.01" value={editPrice} onChange={e => setEditPrice(e.target.value)} />
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button onClick={handleEdit}>Save</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="fixed bottom-8 right-8 z-50 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
              <Plus className="h-5 w-5" /> Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Medicine</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3">
              <Input placeholder="Medicine Name" value={addName} onChange={e => setAddName(e.target.value)} />
              <Input placeholder="Stock" type="number" value={addStock} onChange={e => setAddStock(e.target.value)} />
              
              <Input placeholder="Price (₹)" type="number" step="0.01" value={addPrice} onChange={e => setAddPrice(e.target.value)} />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAdd}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PharmacyLayout>
  )
} 