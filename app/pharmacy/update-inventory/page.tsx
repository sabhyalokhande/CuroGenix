"use client"
import { PharmacyLayout } from "@/components/layouts/pharmacy-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Edit3, Trash2, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"



export default function UpdateInventory() {
  const router = useRouter()
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<any[]>([])
  const [manualName, setManualName] = useState("")
  const [manualStock, setManualStock] = useState("")
  const [manualPrice, setManualPrice] = useState("")
  const [manualEntries, setManualEntries] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [uploadMessage, setUploadMessage] = useState("")

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCsvFile(e.dataTransfer.files[0])
    }
  }

  function handleRemoveFile() {
    setCsvFile(null)
    setCsvData([])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function handleUpload() {
    if (!csvFile) return
    
    const token = localStorage.getItem('token');
    if (!token) {
      setUploadStatus('error')
      setUploadMessage('Please login first')
      return;
    }
    
    setUploading(true)
    setUploadStatus('uploading')
    setUploadMessage("Uploading and processing CSV file...")
    
    try {
      const formData = new FormData()
      formData.append('file', csvFile)
      
      const response = await fetch('/api/inventory/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setUploadStatus('success')
        setUploadMessage(result.message)
        // Refresh the page after successful upload
        setTimeout(() => {
          router.push('/pharmacy/manage-inventory')
        }, 2000)
      } else {
        setUploadStatus('error')
        setUploadMessage(result.error || 'Upload failed')
      }
    } catch (error) {
      setUploadStatus('error')
      setUploadMessage('Network error occurred')
    } finally {
      setUploading(false)
    }
  }

  async function handleManualSave() {
    if (!manualName || !manualStock || !manualPrice) return
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }
    
    try {
      const medicineData = {
        name: manualName,
        stock: parseInt(manualStock),
        price: parseFloat(manualPrice),
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
        setManualEntries([...manualEntries, { 
          name: manualName, 
          stock: parseInt(manualStock),
          price: parseFloat(manualPrice)
        }])
        setManualName("")
        setManualStock("")
        setManualPrice("")
      } else {
        alert('Failed to save medicine')
      }
    } catch (error) {
      alert('Error saving medicine')
    }
  }

  function handleRemoveManual(idx: number) {
    setManualEntries(manualEntries.filter((_, i) => i !== idx))
  }

  return (
    <PharmacyLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-8">
        {/* CSV Upload Section */}
        <Card className="glass-card shadow-xl rounded-2xl">
          <CardHeader className="flex flex-row items-center gap-2">
            <Upload className="h-6 w-6 text-blue-500" />
            <CardTitle className="text-xl">Upload Inventory CSV</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-blue-400/40 rounded-lg p-6 text-center bg-white/5 cursor-pointer hover:bg-blue-400/10 transition"
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              <Input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                className="hidden"
                onChange={e => setCsvFile(e.target.files?.[0] || null)}
              />
              {csvFile ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm text-blue-500 font-medium">{csvFile.name}</span>
                  <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); handleRemoveFile(); }}>Remove</Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-blue-400 mb-2" />
                  <span className="text-gray-300">Drag & drop or click to select a CSV file</span>
                </div>
              )}
            </div>
            <Button className="mt-4 w-full" disabled={!csvFile || uploading} onClick={handleUpload}>
              {uploading ? "Uploading..." : "Upload"}
            </Button>
            
            {/* Upload Status */}
            {uploadStatus !== 'idle' && (
              <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
                uploadStatus === 'success' ? 'bg-green-500/20 text-green-400' :
                uploadStatus === 'error' ? 'bg-red-500/20 text-red-400' :
                'bg-blue-500/20 text-blue-400'
              }`}>
                {uploadStatus === 'success' && <CheckCircle className="h-4 w-4" />}
                {uploadStatus === 'error' && <XCircle className="h-4 w-4" />}
                {uploadStatus === 'uploading' && <AlertCircle className="h-4 w-4" />}
                <span className="text-sm">{uploadMessage}</span>
              </div>
            )}
            
            <div className="mt-2 text-xs text-gray-400">
              Accepted format: .csv (columns: name, stock, price, manufacturer, category, batchNumber, location)
            </div>
          </CardContent>
        </Card>
        {/* Manual Entry Section */}
        <Card className="glass-card shadow-xl rounded-2xl">
          <CardHeader className="flex flex-row items-center gap-2">
            <Edit3 className="h-6 w-6 text-green-500" />
            <CardTitle className="text-xl">Manual Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Input placeholder="Medicine Name" value={manualName} onChange={e => setManualName(e.target.value)} />
              <Input placeholder="Stock" type="number" value={manualStock} onChange={e => setManualStock(e.target.value)} />

              <Input placeholder="Price (₹)" type="number" step="0.01" value={manualPrice} onChange={e => setManualPrice(e.target.value)} />
              <Button className="w-full" onClick={handleManualSave}>Save</Button>
              <div className="text-xs text-gray-400">Tip: Start typing to see suggestions from past data.</div>
            </div>
            {manualEntries.length > 0 && (
              <div className="mt-6">
                <div className="font-semibold mb-2">Manual Entries</div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border-separate border-spacing-y-1">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Medicine</th>
                        <th className="px-4 py-2">Stock</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {manualEntries.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white/5" : "bg-white/0"}>
                          <td className="px-4 py-2">{row.name}</td>
                          <td className="px-4 py-2">{row.stock}</td>
                          <td className="px-4 py-2">₹{row.price}</td>
                          <td className="px-4 py-2">
                            <Button size="icon" variant="ghost" onClick={() => handleRemoveManual(idx)}><Trash2 className="h-4 w-4" /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PharmacyLayout>
  )
} 