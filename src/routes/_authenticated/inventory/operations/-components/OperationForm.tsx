import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useInventory } from '#/hook/useInventory'
import { useCreateInventoryOperation } from '#/hook/useInventoryOperation'
import { useAuth } from '#/hook/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Trash,
  Search,
  Calendar,
  User,
  List,
  CheckIcon,
  Calculator,
} from 'lucide-react'
import { toast } from 'react-toastify'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '#/components/ui/command'
import { BreadcrumbMain } from '#/components/BreadcrumbMain'
import type { Products } from '#/services/inventoryService'

type DetailRow = {
  id: string
  product_id: number
  unit: number
  amount: number
  notes?: string
}

type OperationType = 'LOAD' | 'DOWNLOAD'

function generateUUID(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function OperationForm() {
  const { inventory } = useInventory()
  const { createOperation } = useCreateInventoryOperation()
  const { user } = useAuth()

  const [operationType, setOperationType] = useState<OperationType>('LOAD')
  const [description, setDescription] = useState('')

  const [details, setDetails] = useState<DetailRow[]>([
    { id: generateUUID(), product_id: 0, unit: 0, amount: 0, notes: '' },
  ])

  const [searchInputValue, setSearchInputValue] = useState('')
  const [openSearchDialog, setOpenSearchDialog] = useState(false)

  const products = Array.isArray(inventory.data) ? inventory.data : []

  const totalItems = details.filter((d) => d.product_id !== 0).length
  const totalUnits = details.reduce(
    (acc, curr) => acc + (Number(curr.amount) || 0),
    0,
  )

  // Datos de la simulación (si existen)
  const simulationData = createOperation.data?.dry_run
    ? createOperation.data
    : null

  const handleAddRow = (detail?: DetailRow) => {
    const newRow = detail ?? {
      id: generateUUID(),
      product_id: 0,
      unit: 0,
      amount: 0,
      notes: '',
    }

    setDetails((prevDetails) => [...prevDetails, newRow])
  }

  const handleRemoveRow = (id: string) => {
    if (details.length <= 1) return
    setDetails(details.filter((row) => row.id !== id))
  }

  const handleDetailChange = (
    id: string,
    field: keyof DetailRow,
    value: any,
  ) => {
    setDetails(
      details.map((row) => {
        if (row.id === id) {
          // Si cambia el producto, reseteamos la unidad elegida a 0 obligatoriamente
          if (field === 'product_id') {
            return { ...row, [field]: value, unit: 0 }
          }
          return { ...row, [field]: value }
        }
        return row
      }),
    )
  }

  const validateForm = () => {
    const validDetails = details.filter((d) => d.product_id)

    if (validDetails.length === 0) {
      toast.error('Debe agregar al menos un producto válido.')
      return null
    }

    const invalidRow = validDetails.find((d) => d.unit < 1 || d.amount <= 0)
    if (invalidRow) {
      toast.error(
        'Asegúrese de usar valores válidos mayores a cero en cantidad y unidad.',
      )
      return null
    }

    return validDetails.map((d) => ({
      product_id: Number(d.product_id),
      unit: Number(d.unit),
      amount: Number(d.amount),
    }))
  }

  const handleSubmit = ({
    e,
    dryRun,
  }: {
    e?: React.SubmitEvent<HTMLFormElement>
    dryRun: boolean
  }) => {
    e?.preventDefault()
    const payloadDetails = validateForm()
    if (!payloadDetails) return

    createOperation.mutate({
      body: {
        operation_type: operationType,
        description,
        inventory_operation_details: payloadDetails,
      },
      dryRun,
    })
  }

  const getCurrentStock = (productId: number, unitId: number) => {
    if (!productId || !unitId) return null
    const product = products.find((p) => p.id === productId)
    if (!product) return null

    // Buscamos el registro que coincida con la unidad seleccionada
    const stockObj = product.stock.find((s) => s.unit === unitId)
    return stockObj ? stockObj.stock : 0
  }

  const getNewStock = (currentStock: number, amount: number) => {
    const qty = Number(amount) || 0
    return currentStock + qty
  }

  const handleAddProductOnSearch = (p: Products) => {
    handleAddRow({
      id: generateUUID(),
      product_id: p.id,
      unit: 0,
      amount: 0,
      notes: '',
    })
    setSearchInputValue('')
    setOpenSearchDialog(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 mb-2">
        <BreadcrumbMain
          main={
            operationType === 'LOAD'
              ? 'Carga de Inventario'
              : 'Descarga de Inventario'
          }
          routes={[
            {
              to: '/inventory',
              name: 'Inventario',
            },
            {
              to: '/inventory/operations',
              name: 'Operaciones de Inventario',
            },
          ]}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-slate-900">
              {operationType === 'LOAD' ? 'Carga' : 'Descarga'} de Inventario /{' '}
              {operationType === 'LOAD' ? 'Entrada' : 'Salida'} de Stock
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline">
              <Link to="/inventory/operations">Cancelar</Link>
            </Button>
            {!simulationData ? (
              <Button
                type="button"
                onClick={(_) => handleSubmit({ dryRun: true })}
                disabled={createOperation.isPending}
                // className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                <Calculator className="mr-2 h-4 w-4" />
                Validar carga
              </Button>
            ) : (
              <Button
                type="submit"
                form="inventory-operation-form"
                disabled={createOperation.isPending}
                variant={'secondary'}
                // className="bg-[#0f285c] hover:bg-[#0f285c]/90 text-white rounded-md"
              >
                <CheckIcon className="mr-2 h-4 w-4" />
                Confirmar Carga
              </Button>
            )}
          </div>
        </div>
      </div>

      <form
        id="inventory-operation-form"
        onSubmit={(e) => handleSubmit({ e, dryRun: false })}
        className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start"
      >
        {/* PANEL PRINCIPAL (Izquierda - 3/4) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Metadata de Operación */}
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold text-slate-800 uppercase tracking-wide">
                Metadata de Operación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500 font-medium">
                    Nº de Documento
                  </Label>
                  <Input
                    disabled
                    placeholder={
                      simulationData?.document_no
                        ? simulationData.document_no
                        : 'Auto-generado'
                    }
                    className="bg-slate-50 border-slate-200 text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500 font-medium">
                    Fecha Operación
                  </Label>
                  <div className="relative">
                    <Input
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="pl-9 border-slate-200"
                      disabled
                    />
                    <Calendar className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500 font-medium">
                    Usuario Responsable
                  </Label>
                  <div className="relative">
                    <Input
                      disabled
                      value={user?.description || 'Admin'}
                      className="pl-9 bg-slate-50 border-slate-200 text-slate-700"
                    />
                    <User className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500 font-medium">
                    Tipo de operación
                  </Label>
                  <Select
                    defaultValue="LOAD"
                    onValueChange={(e) => setOperationType(e as OperationType)}
                  >
                    <SelectTrigger className="border-slate-200">
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOAD">Carga</SelectItem>
                      <SelectItem value="DOWNLOAD">Descarga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Líneas de Entrada */}
          <Card className="bg-white border-slate-200 border shadow-sm">
            <CardHeader className="pb-0 border-b border-slate-100 flex flex-row items-center justify-between p-4 bg-white">
              <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <List className="h-4 w-4 text-slate-500" /> Líneas de Entrada
              </CardTitle>
              <Button
                type="button"
                variant="link"
                onClick={() => handleAddRow()}
                className="text-blue-600 font-medium p-0 h-auto"
              >
                + Añadir Item
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/80">
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="w-[30%] text-slate-500 font-medium">
                      Código / Producto
                    </TableHead>
                    <TableHead className="w-[15%] text-slate-500 font-medium">
                      Unidad
                    </TableHead>
                    <TableHead className="w-[10%] text-right text-slate-500 font-medium">
                      Stock Act.
                    </TableHead>
                    <TableHead className="w-[15%] text-right text-slate-500 font-medium">
                      Cantidad
                    </TableHead>
                    <TableHead className="w-[10%] text-right text-blue-600 font-medium">
                      Nuevo Stock
                    </TableHead>
                    {/* <TableHead className="w-[20%] pl-4 text-slate-500 font-medium">
                      Notas
                    </TableHead> */}
                    <TableHead className="w-[5%]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {details.map((row) => {
                    const productObj = products.find(
                      (p) => p.id === row.product_id,
                    )
                    const currentStock = getCurrentStock(
                      row.product_id,
                      row.unit,
                    )
                    const newStock =
                      currentStock !== null
                        ? getNewStock(
                            currentStock,
                            operationType === 'LOAD' ? row.amount : -row.amount,
                          )
                        : null

                    return (
                      <TableRow key={row.id} className="group border-slate-100">
                        <TableCell className="p-2 align-top">
                          <Select
                            value={row.product_id.toString()}
                            onValueChange={(val) =>
                              handleDetailChange(row.id, 'product_id', val)
                            }
                          >
                            <SelectTrigger className="w-full border-slate-200 h-9">
                              <SelectValue placeholder="Seleccionar producto..." />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((p) => (
                                <SelectItem key={p.id} value={p.id.toString()}>
                                  <div className="flex flex-col text-left">
                                    <span className="font-semibold text-slate-900">
                                      {p.description}
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                      SKU: {p.code}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {productObj && (
                            <div className="mt-1 px-1">
                              <span className="text-[11px] text-slate-400 font-mono">
                                {productObj.code}
                              </span>
                            </div>
                          )}
                        </TableCell>

                        <TableCell className="p-2 align-top">
                          <Select
                            value={row.unit.toString()}
                            onValueChange={(val) =>
                              handleDetailChange(row.id, 'unit', Number(val))
                            }
                            disabled={!productObj || !productObj.units.length}
                          >
                            <SelectTrigger className="w-full border-slate-200 h-9">
                              <SelectValue placeholder="Unidad" />
                            </SelectTrigger>
                            <SelectContent>
                              {productObj?.units.map((u) => (
                                <SelectItem key={u.id} value={u.id.toString()}>
                                  {u.unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>

                        <TableCell className="p-2 align-top text-right">
                          <div className="h-9 flex items-center justify-end text-sm text-slate-600">
                            {currentStock}
                          </div>
                        </TableCell>

                        <TableCell className="p-2 align-top">
                          <Input
                            type="number"
                            min="0"
                            value={row.amount || ''}
                            onChange={(e) =>
                              handleDetailChange(
                                row.id,
                                'amount',
                                Number(e.target.value),
                              )
                            }
                            className="h-9 text-right border-slate-200"
                            placeholder="0"
                          />
                        </TableCell>

                        <TableCell className="p-2 align-top text-right">
                          <div className="h-9 flex items-center justify-end text-sm font-semibold text-emerald-600">
                            {row.product_id ? newStock : '-'}
                          </div>
                        </TableCell>

                        {/* <TableCell className="p-2 align-top">
                          <Input
                            value={row.notes}
                            onChange={(e) =>
                              handleDetailChange(
                                row.id,
                                'notes',
                                e.target.value,
                              )
                            }
                            placeholder="Ej. Lote A"
                            className="h-9 border-slate-200 text-sm placeholder:italic"
                          />
                        </TableCell> */}
                        <TableCell className="p-2 align-top text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveRow(row.id)}
                            disabled={details.length === 1}
                            className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
              <div className="p-8 bg-slate-50/50 flex flex-col items-center justify-center gap-3 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Use el buscador para añadir más productos a la carga actual.
                </p>
                <div className="relative w-full max-w-lg">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={16}
                  />
                  <Input
                    type="text"
                    className="w-full pl-9"
                    placeholder="Buscar por Nombre o SKU..."
                    value={searchInputValue}
                    onChange={(e) => setSearchInputValue(e.target.value)}
                    onSelect={() => setOpenSearchDialog(true)}
                  />
                </div>
                <CommandDialog
                  open={openSearchDialog}
                  onOpenChange={() => setOpenSearchDialog(false)}
                >
                  <Command>
                    <CommandInput
                      placeholder="Buscar por Nombre o SKU..."
                      value={searchInputValue}
                      onValueChange={(e) => setSearchInputValue(e)}
                    />
                    <CommandList>
                      <CommandEmpty>
                        No se encontraron productos coincidentes.
                      </CommandEmpty>
                      {products.map((p) => (
                        <CommandItem
                          key={p.id}
                          value={`${p.description.toLowerCase()} ${p.code.toLowerCase()}`}
                          onSelect={() => handleAddProductOnSearch(p)}
                          className="flex flex-col items-start gap-0.5 py-2 px-3 cursor-pointer data-[selected='true']:bg-slate-100"
                        >
                          <span className="font-medium text-sm text-slate-900">
                            {p.description}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            SKU: {p.code}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </CommandDialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PANEL LATERAL (Derecha - 1/4) */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-primary text-white border-none shadow-md overflow-hidden">
            <CardHeader className="pb-4 pt-5 px-5">
              <CardTitle className="text-xs font-bold tracking-widest text-white/80 uppercase">
                Resumen de Carga
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-6 space-y-5">
              <div className="flex justify-between items-end border-b border-white/10 pb-3">
                <span className="text-sm text-white/90 font-medium">
                  Total Items (Líneas)
                </span>
                <span className="text-3xl font-light">
                  {totalItems.toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex justify-between items-end border-b border-white/10 pb-3">
                <span className="text-sm text-white/90 font-medium">
                  Total Unidades
                </span>
                <span className="text-3xl font-light">{totalUnits}</span>
              </div>

              {simulationData && (
                <div className="pt-2 space-y-3">
                  <div className="p-3 bg-white/10 space-y-2">
                    <div className="flex justify-between items-center text-xs text-white/80">
                      <span>Subtotal</span>
                      <span>
                        ${simulationData.total_net.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-white/80">
                      <span>Impuestos</span>
                      <span>
                        ${simulationData.total_tax.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-semibold text-white pt-1 border-t border-white/10">
                      <span>Costo Total</span>
                      <span>${simulationData.total.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 border shadow-sm">
            <CardHeader className="pb-3 px-5 pt-4">
              <CardTitle className="text-sm font-semibold text-slate-800">
                Información Adicional
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <Textarea
                placeholder="Notas de referencia, números de guía, comentarios de recepción..."
                className="min-h-30 text-sm resize-none border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
