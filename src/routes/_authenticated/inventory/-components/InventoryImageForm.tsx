import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useInventory, useInventoryDetails } from '#/hook/useInventory'
import {
  CircleNotchIcon,
  TrashIcon,
  UploadSimpleIcon,
} from '@phosphor-icons/react'

interface InventoryImageFormProps {
  productId: number
  image_url?: string
}

export const InventoryImageForm = ({
  productId,
  image_url,
}: InventoryImageFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { addInventoryImage, removeInventoryImage } = useInventory()
  const { inventoryDetails } = useInventoryDetails(productId)

  const currentImageSrc = image_url
    ? `${import.meta.env.VITE_API_URL}/products/${image_url}`
    : null

  const isUploading = addInventoryImage.isPending
  const isDeleting = removeInventoryImage.isPending
  const isLoading = isUploading || isDeleting

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] // aqui si parece que existe el archivo
    if (!file) return

    const formData = new FormData()

    formData.append('product-image', file)

    addInventoryImage.mutate(
      { id: productId, formData },
      {
        onSettled: () => {
          if (fileInputRef.current) fileInputRef.current.value = ''
        },
        onSuccess: () => {
          inventoryDetails.refetch()
        }
      },
    )
  }

  const handleDelete = (e: React.MouseEvent) => {
    // Evita que el click del botón "Eliminar" se propague al div contenedor
    // y termine abriendo el selector de archivos por error.
    e.stopPropagation()

    if (window.confirm('¿Estás seguro de que deseas eliminar esta imagen?')) {
      removeInventoryImage.mutate(productId)
    }
  }

  const handleContainerClick = (e: React.MouseEvent) => {
    if (isLoading) return

    // Evitamos que clicks accidentales en elementos internos anidados
    // causen comportamientos erráticos.
    if (
      e.target === e.currentTarget ||
      (e.target as HTMLElement).tagName === 'IMG' ||
      (e.target as HTMLElement).closest('.dropzone-trigger')
    ) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col h-full space-y-4">
      {/* 2. Cambiamos flex-1 y h-0 para forzar a este contenedor a medir exactamente el espacio disponible */}
      <div
        onClick={handleContainerClick}
        className={`relative w-full flex-1 h-0 min-h-50 overflow-hidden rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/40 flex items-center justify-center group transition-all duration-200 ${!isLoading
          ? 'cursor-pointer hover:border-primary/50'
          : 'cursor-not-allowed opacity-70'
          }`}
      >
        {currentImageSrc ? (
          <>
            {/* 3. Cambiado a object-contain para planos/CAD (o mantén object-cover si prefieres que llene todo sacrificando bordes) */}
            <img
              src={currentImageSrc}
              alt="Producto"
              className="w-full h-full object-contain p-2 transition-opacity duration-300 group-hover:opacity-40"
            />

            <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <span className="text-sm font-semibold bg-background/80 text-foreground px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm dropzone-trigger">
                Cambiar Imagen
              </span>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isLoading}
                className="shadow-md"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </>
        ) : (
          <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 p-6 text-center dropzone-trigger w-full h-full">
            <UploadSimpleIcon className="w-10 h-10 stroke-[1.5] text-muted-foreground/70 group-hover:text-primary transition-colors" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Añadir imagen del producto
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG o WEBP hasta 5MB
              </p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-2 text-sm font-medium text-muted-foreground">
              <CircleNotchIcon className="w-8 h-8 animate-spin text-primary" />
              <span>{isUploading ? 'Subiendo...' : 'Eliminando...'}</span>
            </div>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          e.stopPropagation()
          handleFileChange(e)
        }}
        accept="image/*"
        className="hidden"
        disabled={isLoading}
      />

      {/* El botón de abajo se queda estático en su propio tamaño, restándole espacio al dropzone */}
      {!currentImageSrc && (
        <Button
          type="button"
          className="w-full shrink-0"
          onClick={(e) => {
            e.stopPropagation()
            handleContainerClick(e)
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircleNotchIcon className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <UploadSimpleIcon className="w-4 h-4 mr-2" />
          )}
          Seleccionar Archivo
        </Button>
      )}
    </div>
  )
}
