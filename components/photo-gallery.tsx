"use client"

import type React from "react"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PhotoGalleryProps {
  photos: Array<{
    id: number
    src: string
    alt: string
  }>
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)

  const openModal = (photoId: number) => {
    setSelectedPhoto(photoId)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setSelectedPhoto(null)
    document.body.style.overflow = "unset"
  }

  const goToPrevious = () => {
    if (selectedPhoto === null) return
    const currentIndex = photos.findIndex((photo) => photo.id === selectedPhoto)
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1
    setSelectedPhoto(photos[previousIndex].id)
  }

  const goToNext = () => {
    if (selectedPhoto === null) return
    const currentIndex = photos.findIndex((photo) => photo.id === selectedPhoto)
    const nextIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0
    setSelectedPhoto(photos[nextIndex].id)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeModal()
    if (e.key === "ArrowLeft") goToPrevious()
    if (e.key === "ArrowRight") goToNext()
  }

  const selectedPhotoData = photos.find((photo) => photo.id === selectedPhoto)

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="aspect-square bg-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => openModal(photo.id)}
          >
            <img
              src={photo.src || "/placeholder.svg"}
              alt={photo.alt}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPhoto !== null && selectedPhotoData && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
            onClick={closeModal}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Previous Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
            onClick={(e) => {
              e.stopPropagation()
              goToPrevious()
            }}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 z-10"
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Image */}
          <div
            className="relative max-w-full max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhotoData.src || "/placeholder.svg"}
              alt={selectedPhotoData.alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>

          {/* Photo Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-lg">
            {photos.findIndex((photo) => photo.id === selectedPhoto) + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  )
}
