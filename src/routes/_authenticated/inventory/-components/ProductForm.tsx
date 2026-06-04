import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '#/components/ui/input-group'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Switch } from '#/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import type { Products, ProductsUnits } from '#/services/inventoryService'
import {
  FloppyDiskIcon,
  PercentIcon,
  PlusIcon,
  TrashIcon,
} from '@phosphor-icons/react'
import { InventoryImageForm } from './InventoryImageForm'

const origins = ['NACIONAL', 'IMPORTADO']

// Tipado estricto para los errores del formulario
interface FormErrors {
  code?: string
  description?: string
  origin?: string
  products_units?: { unit?: string; cost?: string; price?: string }[]
}

export const ProductForm = ({
  onSubmit,
  defaultValues,
  onDeleteButtonPress,
}: {
  onSubmit: (
    data: Omit<Products, 'id'> & {
      products_units: Omit<ProductsUnits, 'id' | 'product_id'>[]
    },
  ) => void
  defaultValues?: Omit<Products, 'id'> & {
    products_units: Omit<ProductsUnits, 'id' | 'product_id'>[]
  }
  onDeleteButtonPress?: () => void
}) => {
  // Estados para componentes controlados y dinámicos
  const [status, setStatus] = useState<boolean>(defaultValues?.status ?? true)
  const [origin, setOrigin] = useState<string>(defaultValues?.origin || '')
  const [productUnits, setProductUnits] = useState<
    Omit<ProductsUnits, 'id' | 'product_id'>[]
  >(defaultValues?.products_units || [])
  const [errors, setErrors] = useState<FormErrors>({})

  const addUnit = () => {
    setProductUnits([...productUnits, { unit: 'UNIDAD', cost: 0, price: 0 }])
  }

  const removeUnit = (index: number) => {
    setProductUnits(productUnits.filter((_, i) => i !== index))
    if (errors.products_units) {
      const newUnitErrors = [...errors.products_units]
      newUnitErrors.splice(index, 1)
      setErrors({ ...errors, products_units: newUnitErrors })
    }
  }

  const handleUnitChange = (
    index: number,
    field: keyof Omit<ProductsUnits, 'id'>,
    value: string | number,
  ) => {
    const updatedUnits = productUnits.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value }
      }
      return item
    })
    setProductUnits(updatedUnits)
  }

  const calculateMarkup = (cost: number, price: number): string => {
    if (!cost || !price || cost <= 0) return '0.00%'
    const markup = ((price - cost) / cost) * 100
    return `${markup.toFixed(2)}%`
  }

  const onPreparedValues = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    const code = (form.get('code') as string).trim()
    const description = (form.get('description') as string).trim()
    const mark = (form.get('mark') as string).trim()
    const model = (form.get('model') as string).trim()
    const referenc = (form.get('referenc') as string).trim()
    const discount = Number(form.get('discount')) || 0
    const buy_tax = Number(form.get('buy_tax')) || 0
    const sale_tax = Number(form.get('sale_tax')) || 0

    // Validaciones de negocio
    const currentErrors: FormErrors = {}
    if (!code) currentErrors.code = 'Product code is required'
    if (!description) currentErrors.description = 'Description is required'
    if (!origin) currentErrors.origin = 'Origin is required'

    // Validar unidades dinámicas
    if (productUnits.length > 0) {
      const unitErrorsArray: {
        unit?: string
        cost?: string
        price?: string
      }[] = []
      let hasUnitErrors = false

      for (let index = 0; index < productUnits.length; index++) {
        const unitItem = productUnits[index]
        const rowErrors: { unit?: string; cost?: string; price?: string } = {}

        if (!unitItem.unit.trim()) {
          rowErrors.unit = 'Required'
          hasUnitErrors = true
        }
        if (unitItem.cost <= 0) {
          rowErrors.cost = 'Must be > 0'
          hasUnitErrors = true
        }
        if (unitItem.price <= 0) {
          rowErrors.price = 'Must be > 0'
          hasUnitErrors = true
        }

        unitErrorsArray[index] = rowErrors
      }

      if (hasUnitErrors) {
        currentErrors.products_units = unitErrorsArray
      }
    }

    if (Object.keys(currentErrors).length > 0) {
      console.log('ERRORES ACTUALES: ', currentErrors)
      setErrors(currentErrors)
      return
    }

    // Limpiar errores si pasa la validación
    setErrors({})

    // Envío de datos tipados correctamente
    onSubmit({
      code,
      description,
      mark,
      model,
      referenc,
      discount,
      status,
      origin,
      buy_tax,
      sale_tax,
      products_units: productUnits,
    })
  }

  return (
    <form onSubmit={onPreparedValues} className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-8">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
              <CardTitle>General Information</CardTitle>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="status"
                  className="text-xs text-muted-foreground"
                >
                  Active Status
                </Label>
                <Switch
                  id="status"
                  checked={status}
                  onCheckedChange={setStatus}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="code">Product Code</Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="PRD-0001"
                    defaultValue={defaultValues?.code}
                    autoComplete="off"
                  />
                  {errors.code && (
                    <span className="text-xs text-destructive">
                      {errors.code}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="mark">Mark</Label>
                  <Input
                    id="mark"
                    name="mark"
                    placeholder="Enter product Mark..."
                    defaultValue={defaultValues?.mark}
                    autoComplete="off"
                  />
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <Label htmlFor="description">Product Description</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Enter product description..."
                    defaultValue={defaultValues?.description}
                    autoComplete="off"
                  />
                  {errors.description && (
                    <span className="text-xs text-destructive">
                      {errors.description}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    placeholder="Product Model"
                    defaultValue={defaultValues?.model}
                    autoComplete="off"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="referenc">Internal Reference</Label>
                  <Input
                    id="referenc"
                    name="referenc"
                    placeholder="INT-REF-001"
                    defaultValue={defaultValues?.referenc}
                    autoComplete="off"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="discount">Discount</Label>
                  <Input
                    id="discount"
                    name="discount"
                    placeholder="0"
                    type="number"
                    step="0.01"
                    defaultValue={defaultValues?.discount}
                    autoComplete="off"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="origin">Origin</Label>
                  <Select value={origin} onValueChange={setOrigin}>
                    <SelectTrigger id="origin">
                      <SelectValue placeholder="Select Origin" />
                    </SelectTrigger>
                    <SelectContent>
                      {origins.map((orig) => (
                        <SelectItem key={orig} value={orig.toUpperCase()}>
                          {orig}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.origin && (
                    <span className="text-xs text-destructive">
                      {errors.origin}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
              <CardTitle>Multi-unit Pricing</CardTitle>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={addUnit}
                disabled={
                  defaultValues?.products_units &&
                  defaultValues.products_units.length > 0
                }
              >
                <PlusIcon weight="bold" />
                Add Unit
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Unit Type</TableHead>
                    <TableHead className="font-semibold">Cost</TableHead>
                    <TableHead className="font-semibold">Price</TableHead>
                    <TableHead className="font-semibold">Markup</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productUnits.length > 0 ? (
                    productUnits.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            placeholder="e.g. Single Unit"
                            value={item.unit}
                            onChange={(e) =>
                              handleUnitChange(index, 'unit', e.target.value)
                            }
                          />
                          {errors.products_units?.[index]?.unit && (
                            <span className="text-xs text-destructive block mt-1">
                              {errors.products_units[index].unit}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={item.cost || ''}
                            onChange={(e) =>
                              handleUnitChange(
                                index,
                                'cost',
                                Number(e.target.value) || 0,
                              )
                            }
                          />
                          {errors.products_units?.[index]?.cost && (
                            <span className="text-xs text-destructive block mt-1">
                              {errors.products_units[index].cost}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={item.price || ''}
                            onChange={(e) =>
                              handleUnitChange(
                                index,
                                'price',
                                Number(e.target.value) || 0,
                              )
                            }
                          />
                          {errors.products_units?.[index]?.price && (
                            <span className="text-xs text-destructive block mt-1">
                              {errors.products_units[index].price}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-semibold text-emerald-600">
                            {calculateMarkup(item.cost, item.price)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeUnit(index)}
                          >
                            <TrashIcon weight="bold" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <span className="text-xs text-destructive block mt-1">
                          Debes agregar almenos 1 unidad al producto
                        </span>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Tax Configuration</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="buy_tax">Purchase Tax (%)</Label>
                  <InputGroup>
                    <InputGroupInput
                      id="buy_tax"
                      name="buy_tax"
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      defaultValue={defaultValues?.buy_tax}
                      autoComplete="off"
                    />
                    <InputGroupAddon align="inline-end">
                      <PercentIcon className="text-muted-foreground" />
                    </InputGroupAddon>
                  </InputGroup>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="sale_tax">Sales Tax (%)</Label>
                  <InputGroup>
                    <InputGroupInput
                      id="sale_tax"
                      name="sale_tax"
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      defaultValue={defaultValues?.sale_tax}
                      autoComplete="off"
                    />
                    <InputGroupAddon align="inline-end">
                      <PercentIcon className="text-muted-foreground" />
                    </InputGroupAddon>
                  </InputGroup>
                </div>
              </div>
            </CardContent>
          </Card>
          {defaultValues && (
            <Card>
              <CardHeader>
                <CardTitle>Product Image</CardTitle>
              </CardHeader>
              <CardContent className="h-[32dvh]">
                <InventoryImageForm
                  // @ts-ignore id comes with the default values :p i think
                  productId={defaultValues.id}
                  image_url={defaultValues.image_url}
                />
              </CardContent>
            </Card>
          )}
          <div className="grid grid-cols-2 gap-4">
            {defaultValues && (
              <Button
                variant="destructive"
                type="button"
                onClick={() => {
                  if (onDeleteButtonPress) onDeleteButtonPress()
                }}
              >
                <TrashIcon weight="bold" />
                Delete Product
              </Button>
            )}
            <Button
              type="submit"
              className={`bg-primary hover:bg-primary/90 ${defaultValues ? '' : 'col-span-2'}`}
            >
              <FloppyDiskIcon weight="bold" />
              Save Product
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
