"use client"
import { PharmacyLayout } from "@/components/layouts/pharmacy-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil } from "lucide-react"
import { useState } from "react"
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

const initialInventory = [
  { name: "Paracetamol 500mg", stock: 12, minimum: 50, status: "critical" },
  { name: "Insulin Pen", stock: 3, minimum: 10, status: "critical" },
  { name: "Amoxicillin 250mg", stock: 25, minimum: 30, status: "low" },
  { name: "Aspirin 100mg", stock: 60, minimum: 40, status: "ok" },
]

function getStatus(stock: number, minimum: number) {
  if (stock < minimum / 2) return "critical"
  if (stock < minimum) return "low"
  return "ok"
}

export default function ManageInventory() {
  const [filter, setFilter] = useState("")
  const [inventory, setInventory] = useState(initialInventory)
  const [addOpen, setAddOpen] = useState(false)
  const [editIdx, setEditIdx] = useState<number | null>(null)

  // Add Medicine State
  const [addName, setAddName] = useState("")
  const [addStock, setAddStock] = useState("")
  const [addMin, setAddMin] = useState("")

  // Edit Medicine State
  const [editName, setEditName] = useState("")
  const [editStock, setEditStock] = useState("")
  const [editMin, setEditMin] = useState("")

  const filtered = inventory.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))

  function handleAdd() {
    if (!addName || !addStock || !addMin) return
    const stock = parseInt(addStock)
    const minimum = parseInt(addMin)
    setInventory([
      ...inventory,
      { name: addName, stock, minimum, status: getStatus(stock, minimum) },
    ])
    setAddName("")
    setAddStock("")
    setAddMin("")
    setAddOpen(false)
  }

  function handleEdit() {
    if (editIdx === null || !editName || !editStock || !editMin) return
    const stock = parseInt(editStock)
    const minimum = parseInt(editMin)
    const updated = [...inventory]
    updated[editIdx] = { name: editName, stock, minimum, status: getStatus(stock, minimum) }
    setInventory(updated)
    setEditIdx(null)
    setEditName("")
    setEditStock("")
    setEditMin("")
  }

  function openEdit(idx: number) {
    setEditIdx(idx)
    setEditName(inventory[idx].name)
    setEditStock(inventory[idx].stock.toString())
    setEditMin(inventory[idx].minimum.toString())
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
              {/* Bulk Edit button removed */}
            </div>
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full text-left border-separate border-spacing-y-1">
                <thead className="sticky top-0 z-10 bg-white/10 backdrop-blur-md">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-200">Medicine</th>
                    <th className="px-4 py-3 font-semibold text-gray-200">Stock</th>
                    <th className="px-4 py-3 font-semibold text-gray-200">Minimum Required</th>
                    <th className="px-4 py-3 font-semibold text-gray-200">Status</th>
                    <th className="px-4 py-3 font-semibold text-gray-200 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-400">No medicines found.</td>
                    </tr>
                  ) : (
                    filtered.map((item, idx) => (
                      <tr key={idx} className={
                        `transition hover:bg-white/5 ${idx % 2 === 0 ? "bg-white/5" : "bg-white/0"}`
                      }>
                        <td className="px-4 py-3 font-medium text-white">{item.name}</td>
                        <td className="px-4 py-3 text-white">{item.stock}</td>
                        <td className="px-4 py-3 text-white">{item.minimum}</td>
                        <td className="px-4 py-3">
                          <Badge className={`capitalize ${statusColor(item.status)}`}>{item.status}</Badge>
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
                                <Input placeholder="Minimum Required" type="number" value={editMin} onChange={e => setEditMin(e.target.value)} />
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
              <Input placeholder="Minimum Required" type="number" value={addMin} onChange={e => setAddMin(e.target.value)} />
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