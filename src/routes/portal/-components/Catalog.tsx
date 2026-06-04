import { HeartIcon, ShoppingCartSimpleIcon } from '@phosphor-icons/react'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardFooter } from '#/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Separator } from '#/components/ui/separator'
import { useCart } from './CartContext'
import { useInventory, useInventoryDetails } from '#/hook/useInventory'
import type { Products } from '#/services/inventoryService'
import { useMarks } from '#/hook/useMark'
import { RadioGroup, RadioGroupItem } from '#/components/ui/radio-group'
import { Label } from '#/components/ui/label'
import { useMemo, useState } from 'react'
import { useFavorites } from './FavoriteContext'

// Custom high-precision SVG blueprint drawings for industrial parts
function ProductBlueprint({ image_url }: { image_url?: string }) {
  // Default to motor
  return <img src={`${import.meta.env.VITE_API_URL}/products/${image_url}`} />
}

export function Catalog() {
  const { inventory } = useInventory()
  const { marks } = useMarks()
  const [selectedMark, setSelectedMark] = useState<string>('');
  const [orderBy, setOrderBy] = useState("")

  const filteredInventory = useMemo(() => {
    if (!inventory.data) return [];

    const inventoryDataTrue = [...inventory.data].filter((p) => p.status === true)

    const result = selectedMark
      ? inventoryDataTrue.filter((product) => product.mark === selectedMark)
      : [...inventoryDataTrue];

    if (orderBy) {
      result.sort((a, b) => {
        return orderBy === "name-low"
          ? a.description.localeCompare(b.description)
          : b.description.localeCompare(a.description);
      });
    }

    return result;
  }, [inventory.data, selectedMark, orderBy]);

  return (
    <section className="max-w-[1280px] mx-auto px-10 py-12 bg-surface">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-outline-variant pb-6">
        <div className="text-xs text-on-surface-variant">
          Showing{' '}
          <span className="font-semibold text-on-surface font-mono">{filteredInventory.length}</span> of{' '}
          <span className="font-semibold text-on-surface font-mono">{filteredInventory.length}</span>{' '}
          commercial SKU listings
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-on-surface">
            Sort By:
          </span>
          <Select defaultValue="relevant" value={orderBy} onValueChange={setOrderBy}>
            <SelectTrigger className="w-[180px] h-9 text-xs rounded-[4px] border-outline text-on-surface font-medium bg-surface-container-lowest">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-surface-container-lowest border-outline rounded-[4px] text-xs">
              <SelectItem value="name-low">Name: ASC</SelectItem>
              <SelectItem value="name-high">Name: DESC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        {/* Left Sidebar - Filters */}
        <aside className="space-y-6">
          <FilterSection title="Mark" value={selectedMark} onValueChange={setSelectedMark}>
            {marks.data && marks.data.map(
              (brand, key) => (
                <FilterItem
                  key={key}
                  label={brand.mark}
                />
              ),
            )}
          </FilterSection>
        </aside>

        {/* Right Content Grid */}
        <div className="space-y-10">
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredInventory.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-1.5 pt-6">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-[4px] border-outline text-on-surface-variant hover:text-primary"
            >
              {'<'}
            </Button>
            <Button
              variant="default"
              className="h-8 w-8 rounded-[4px] bg-primary text-primary-foreground font-mono text-xs"
            >
              1
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 rounded-[4px] border-outline text-on-surface-variant font-mono text-xs hover:text-primary"
            >
              2
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 rounded-[4px] border-outline text-on-surface-variant font-mono text-xs hover:text-primary"
            >
              3
            </Button>
            <span className="px-1 text-on-surface-variant/50 font-mono text-xs">
              ...
            </span>
            <Button
              variant="outline"
              className="h-8 w-8 rounded-[4px] border-outline text-on-surface-variant font-mono text-xs hover:text-primary"
            >
              24
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-[4px] border-outline text-on-surface-variant hover:text-primary"
            >
              {'>'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function FilterSection({
  title,
  children,
  value,
  onValueChange
}: {
  title: string
  children: React.ReactNode
  value: string
  onValueChange: (e: string) => void
}) {
  return (
    <RadioGroup className="space-y-3" value={value} onValueChange={onValueChange} >
      <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
      <Button variant={"link"} onClick={() => onValueChange("")} className='p-0 text-xs'>Quitar seleccion</Button>
      <Separator className="mt-4 bg-outline-variant/60" />
    </RadioGroup>
  )
}

function FilterItem({ label }: { label: string; }) {
  return (
    <label className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-2">
        <RadioGroupItem value={label} id={label} />
        <Label className="text-xs text-on-surface-variant group-hover:text-primary transition-colors" htmlFor={label}>
          {label}
        </Label>
      </div>
    </label>
  )
}

function ProductCard({ product }: { product: Products }) {
  const { addToCart } = useCart()
  const { favoriteItems, addToFavorite, removeFromFavorites } = useFavorites()
  const { inventoryDetails } = useInventoryDetails(product.id)
  const mainProductUnit = inventoryDetails.data?.units[0]
  if (!mainProductUnit) {
    return <span>Cargando unidades...</span>
  }
  const mainProductStock = inventoryDetails.data?.stock.filter(
    (e) => e.unit === mainProductUnit.id,
  )[0]
  if (!mainProductStock) {
    return <span>Cargando stock...</span>
  }

  // Set semantic colors for stock status dot
  let statusDotColor = 'bg-green-600'
  let statusTextColor = 'text-green-600'
  if (mainProductStock.stock >= 8 && mainProductStock.stock <= 16) {
    statusDotColor = 'bg-amber-500'
    statusTextColor = 'text-amber-600'
  } else if (mainProductStock.stock == 0) {
    statusDotColor = 'bg-red-600'
    statusTextColor = 'text-red-600'
  }

  const handleAddToCartClick = () => {
    // Prevent adding out of stock items
    if (mainProductStock.stock == 0) return

    addToCart({
      id: product.id,
      brand: product.mark,
      title: product.description,
      sku: product.code,
      price: mainProductUnit.price,
      status: mainProductStock.stock >= 8 ? 'In Stock' : 'Low Stock',
      statusColor:
        mainProductStock.stock >= 8
          ? 'text-green-600 bg-green-50'
          : 'text-amber-600 bg-amber-50',
      dotColor: statusDotColor,
    })
  }

  const isFavorite = favoriteItems.some((item) => item.id === product.id)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation() // Evita disparar eventos del contenedor/tarjeta si aplica

    if (isFavorite) {
      removeFromFavorites(product.id)
    } else {
      addToFavorite({
        id: product.id,
        brand: product.mark,
        title: product.description,
        sku: product.code,
        price: mainProductUnit.price,
        status: mainProductStock.stock >= 8 ? 'In Stock' : 'Low Stock',
        statusColor:
          mainProductStock.stock >= 8
            ? 'text-green-600 bg-green-50'
            : 'text-amber-600 bg-amber-50',
        dotColor: statusDotColor,
      })
    }
  }

  return (
    <Card className="overflow-hidden bg-surface-container-lowest border border-outline-variant hover:border-primary/50 transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-lg flex flex-col h-full">
      {/* Agrupamos todo el cuerpo en un solo contenedor flex que crece */}
      <CardContent className="p-0 flex flex-col grow">
        {/* Visual Drawing (CAD/Blueprint 1:1) */}
        <div className="aspect-square bg-surface-container-low flex items-center justify-center p-8 relative border-b border-outline-variant/40 w-full overflow-hidden">
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[9px] font-bold tracking-widest text-on-surface-variant/70 uppercase bg-surface-container-lowest border border-outline-variant/60 px-2 py-0.5 rounded-xs font-mono">
              {product.mark}
            </span>
          </div>
          {/* Contenedor wrapper para asegurar que el blueprint no rompa el aspect-ratio */}
          <div className="w-full h-full flex items-center justify-center">
            <ProductBlueprint image_url={product.image_url} />
          </div>
        </div>

        {/* Info Content - flex-grow aquí empuja el footer hacia abajo */}
        <div className="p-4 space-y-2.5 flex flex-col grow justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-medium">
              <span
                className={`w-1.5 h-1.5 rounded-full ${statusDotColor}`}
              ></span>
              <span className={`${statusTextColor} font-medium`}>
                {product.status}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-on-surface line-clamp-2 min-h-8">
              {product.description}
            </h4>
            <p className="text-[10px] font-mono text-on-surface-variant/80 uppercase tracking-wide">
              SKU: {product.code}
            </p>
          </div>

          {/* El precio se quedará siempre pegado justo arriba de los botones */}
          <div className="pt-1.5 border-t border-outline-variant/30 flex items-baseline justify-between mt-auto">
            <div className="text-base font-bold text-primary font-mono">
              ${mainProductUnit.price.toFixed(2)}
              <span className="text-[10px] font-normal text-on-surface-variant/60 font-sans ml-0.5">
                / {mainProductUnit.unit}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer siempre alineado al fondo del componente */}
      <CardFooter className="px-4 pb-4 pt-0 flex gap-2 mt-auto">
        <Button
          disabled={mainProductStock.stock == 0}
          onClick={handleAddToCartClick}
          className="flex-1 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold h-9 rounded-lg text-xs uppercase tracking-wider transition-colors disabled:opacity-50 disabled:bg-secondary/40"
        >
          <ShoppingCartSimpleIcon className="mr-1.5" size={14} />
          {mainProductStock.stock == 0 ? 'Unavailable' : 'Add to Cart'}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={`h-9 w-9 rounded-lg border-outline transition-colors duration-200
        ${isFavorite
              ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100 hover:border-red-300'
              : 'text-on-surface-variant hover:text-red-500 hover:border-red-200 hover:bg-red-50'
            }
      `}
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {/* Si usas @phosphor-icons/react, puedes usar la propiedad weight="fill" 
        Si usas Lucide, puedes pasar fill="currentColor" cuando esté activo
      */}
          <HeartIcon
            size={16}
            weight={isFavorite ? "fill" : "regular"}
          />
        </Button>
      </CardFooter>
    </Card>
  )
}
