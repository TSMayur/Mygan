"use client"

import { useState, useCallback, useRef } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Upload, ImageIcon, Download, RefreshCw, Info, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define types for axios progress event
interface ProgressEvent {
  loaded: number
  total: number
}

export function DenoiseForm() {
  const [file, setFile] = useState<File | null>(null)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [denoisedImage, setDenoisedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [denoiseLevel, setDenoiseLevel] = useState([50])
  const [preserveDetails, setPreserveDetails] = useState([70])
  const [exportFormat, setExportFormat] = useState("png")
  const { toast } = useToast()
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0]

        // Check if file is an image
        if (!selectedFile.type.startsWith("image/")) {
          toast({
            title: "Invalid file type",
            description: "Please upload an image file (JPEG, PNG, etc.)",
            variant: "destructive",
          })
          return
        }

        // Check file size (5MB limit)
        if (selectedFile.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please upload an image smaller than 5MB",
            variant: "destructive",
          })
          return
        }

        setFile(selectedFile)

        // Create preview
        const reader = new FileReader()
        reader.onload = () => {
          setOriginalImage(reader.result as string)
          setDenoisedImage(null) // Reset denoised image when new file is uploaded
        }
        reader.readAsDataURL(selectedFile)
      }
    },
    [toast],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
  })

  const handleDenoise = async () => {
    if (!file) {
      toast({
        title: "No image selected",
        description: "Please select an image first",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setProgress(0)

    const formData = new FormData()
    formData.append("image", file)
    formData.append("denoiseLevel", denoiseLevel[0].toString())
    formData.append("preserveDetails", preserveDetails[0].toString())
    formData.append("format", exportFormat)

    try {
      // Uncomment this for actual API integration
      const response = await axios.post("http://127.0.0.1:5000/denoise", formData, {
        headers: { "Content-Type": "multipart/form-data" },onUploadProgress: 
        (progressEvent: ProgressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setProgress(percentCompleted)
        },
      })

      const imageUrl = response.data.image_url
      setDenoisedImage(`http://127.0.0.1:5000${imageUrl}`)

      // For demo/testing purposes, you can use this fallback if your API isn't ready
      // Comment this out when using the real API
      /*
      setTimeout(() => {
        setDenoisedImage(originalImage)
        setProgress(100)
        setLoading(false)
        toast({
          title: "Denoising complete",
          description: "Your image has been successfully denoised",
        })
      }, 3000)
      */

      setLoading(false)
      toast({
        title: "Denoising complete",
        description: "Your image has been successfully denoised",
      })
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "An error occurred while processing the image",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!denoisedImage) return

    const link = document.createElement("a")
    link.href = denoisedImage
    link.download = `denoised-image.${exportFormat}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReset = () => {
    setFile(null)
    setOriginalImage(null)
    setDenoisedImage(null)
    setDenoiseLevel([50])
    setPreserveDetails([70])
    setExportFormat("png")
  }

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                : "border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500"
            } ${file ? "border-teal-500" : ""}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-4">
              {file ? (
                <>
                  <div className="relative h-16 w-16 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-teal-600" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReset()
                      }}
                      className="absolute -top-2 -right-2 h-6 w-6 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <p className="font-medium text-teal-600">{file.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {isDragActive ? "Drop the image here" : "Drag and drop your image here"}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">or click to browse</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Supports JPG, PNG, WEBP (max 5MB)</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Section */}
      {file && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Denoising Settings</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Denoise Level</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-slate-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">
                            Higher values remove more noise but may affect image details
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-sm font-medium">{denoiseLevel[0]}%</span>
                </div>
                <Slider
                  value={denoiseLevel}
                  onValueChange={setDenoiseLevel}
                  min={0}
                  max={100}
                  step={1}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Preserve Details</label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-slate-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">
                            Higher values preserve more details but may retain some noise
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span className="text-sm font-medium">{preserveDetails[0]}%</span>
                </div>
                <Slider
                  value={preserveDetails}
                  onValueChange={setPreserveDetails}
                  min={0}
                  max={100}
                  step={1}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Export Format</label>
                <Select value={exportFormat} onValueChange={setExportFormat} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG (Lossless)</SelectItem>
                    <SelectItem value="jpg">JPEG (Smaller size)</SelectItem>
                    <SelectItem value="webp">WEBP (Modern format)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2">
                <Button onClick={handleDenoise} disabled={loading || !file} className="w-full">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Denoise Image"
                  )}
                </Button>
              </div>

              {loading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Processing image</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {(originalImage || denoisedImage) && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Results</h3>
            <Tabs defaultValue="comparison" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
                <TabsTrigger value="original">Original</TabsTrigger>
                <TabsTrigger value="denoised" disabled={!denoisedImage}>
                  Denoised
                </TabsTrigger>
              </TabsList>
              <TabsContent value="comparison" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {originalImage && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-center">Original Image</p>
                      <div className="relative aspect-square w-full overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
                        <Image
                          src={originalImage || "/placeholder.svg"}
                          alt="Original"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                  {denoisedImage ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-center">Denoised Image</p>
                      <div className="relative aspect-square w-full overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
                        <Image
                          src={denoisedImage || "/placeholder.svg"}
                          alt="Denoised"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center aspect-square w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Denoised image will appear here</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="original" className="pt-4">
                {originalImage && (
                  <div className="space-y-2">
                    <div className="relative aspect-auto max-h-[600px] w-full overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
                      <Image src={originalImage || "/placeholder.svg"} alt="Original" fill className="object-contain" />
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="denoised" className="pt-4">
                {denoisedImage && (
                  <div className="space-y-2">
                    <div className="relative aspect-auto max-h-[600px] w-full overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
                      <Image src={denoisedImage || "/placeholder.svg"} alt="Denoised" fill className="object-contain" />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleDownload} variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
