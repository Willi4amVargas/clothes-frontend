import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useClients } from '#/hook/useClient'
import { useInventory } from '#/hook/useInventory'
import { useSalesOperations } from '#/hook/useSalesOperation'
import type {
  SalesOperationPayload,
  SalesOperationType,
  SalesOperationResponse,
} from '#/services/salesOperationService'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Button } from '#/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import {
  TrashIcon,
  PlusIcon,
  FloppyDiskIcon,
  CalculatorIcon,
} from '@phosphor-icons/react'
import { toast } from 'react-toastify'
import { Separator } from '#/components/ui/separator'
import { generateUUID } from '#/lib/generateUUID'
import { BreadcrumbMain } from '#/components/BreadcrumbMain'
import { useAuth } from '#/hook/useAuth'

export const Route = createFileRoute('/_authenticated/sales/new/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { clients } = useClients()
  const { inventory } = useInventory()
  const { createOperation, simulateOperation } = useSalesOperations()
  const { user } = useAuth()

  if (!user) {
    return <span className="text-red-500">ES NECESARIO INICIAR SESIÓN</span>
  }

  const [operationType, setOperationType] = useState<SalesOperationType>('SALE')
  const [clientId, setClientId] = useState<number | ''>('')
  const [description, setDescription] = useState('')
  const [seller, setSeller] = useState('')
  const [details, setDetails] = useState<
    { id: string; product_id: number | ''; amount: number; unit: number }[]
  >([])

  const [simulation, setSimulation] = useState<SalesOperationResponse | null>(
    null,
  )

  const handleAddProduct = () => {
    setDetails([
      ...details,
      { id: generateUUID(), product_id: '', amount: 1, unit: 1 },
    ])
  }

  const handleRemoveProduct = (id: string) => {
    setDetails(details.filter((d) => d.id !== id))
  }

  const handleDetailChange = (
    id: string,
    field: 'product_id' | 'amount' | 'unit',
    value: number | '',
  ) => {
    setDetails(details.map((d) => (d.id === id ? { ...d, [field]: value } : d)))
  }

  const buildPayload = (): SalesOperationPayload | null => {
    if (clientId === '') return null
    const validDetails = details.filter(
      (d) => d.product_id !== '' && d.amount > 0 && d.unit > 0,
    )

    return {
      operation_type: operationType,
      description,
      client_id: clientId,
      seller: seller,
      credit: 0,
      cash: 0,
      pending: false,
      sales_operation_details: validDetails.map((d) => ({
        product_id: d.product_id as number,
        amount: d.amount,
        unit: d.unit,
      })),
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const payload = buildPayload()

      if (!payload || payload.sales_operation_details.length === 0) {
        setSimulation(null)
        return
      }

      simulateOperation.mutate(payload, {
        onSuccess: (data) => {
          setSimulation(data)
        },
        onError: () => {
          setSimulation(null)
        },
      })
    }, 700)

    return () => clearTimeout(delayDebounceFn)
  }, [details])

  const handleSave = () => {
    const payload = buildPayload()
    if (!payload) return
    if (payload.sales_operation_details.length === 0) {
      toast.warning('Debe agregar al menos un producto válido')
      return
    }

    createOperation.mutate(payload, {
      onSuccess: (e) => {
        setDetails([])
        navigate({
          from: '/sales/$id/',
          params: { id: `${e.id}` },
        })
      },
    })
  }

  return (
    <div className="flex flex-col mx-5 pb-10">
      <div className="mb-4 flex flex-col gap-2">
        <BreadcrumbMain
          main={
            simulateOperation.data
              ? simulateOperation.data.document_no
              : `NUEVA VENTA`
          }
          routes={[{ to: '/sales', name: 'Ventas' }]}
        />
      </div>
      <div className="flex items-center justify-between bg-card p-6 border ">
        <div>
          <h1 className="text-2xl font-bold">Nueva Operación</h1>
          <p className="text-muted-foreground mt-1">
            Crea una nueva venta, presupuesto o pedido
          </p>
        </div>
        <Button
          size="lg"
          className="shadow-md transition-transform hover:scale-105 active:scale-95"
          onClick={handleSave}
          disabled={
            clientId === '' || details.length === 0 || createOperation.isPending
          }
        >
          <FloppyDiskIcon className="mr-2 size-5" />
          {createOperation.isPending ? 'Procesando...' : 'Guardar Operación'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start mt-6">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex justify-between">
                  <span>Datos Principales</span>
                  {simulateOperation.data && (
                    <span>Nº DOC: {simulateOperation.data.document_no}</span>
                  )}
                </div>
              </CardTitle>
              <CardDescription>
                Selecciona el cliente y define el tipo de documento.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="client"
                    className="font-semibold text-primary/80"
                  >
                    Cliente *
                  </Label>
                  <Input
                    id="client"
                    list="clients-list"
                    className="focus-visible:ring-primary/50 transition-all"
                    placeholder="Buscar cliente por su identificación o nombre..."
                    onChange={(e) => {
                      const val = e.target.value
                      const client = clients.data?.find(
                        (c) =>
                          c.client_id === val ||
                          c.description === val ||
                          String(c.id) === val,
                      )
                      if (client) {
                        setClientId(client.id)
                        e.target.value = client.description
                      } else {
                        setClientId('')
                      }
                    }}
                  />
                  <datalist id="clients-list">
                    {clients.data?.map((client) => (
                      <option key={client.id} value={client.description}>
                        {client.client_id}
                      </option>
                    ))}
                  </datalist>
                  {!clientId && (
                    <span className="text-[11px] font-medium text-destructive">
                      La operación requiere un cliente válido.
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="seller"
                    className="font-semibold text-primary/80"
                  >
                    Vendedor
                  </Label>
                  <Input
                    id="seller"
                    type="text"
                    value={seller}
                    onChange={(e) => setSeller(e.target.value)}
                    placeholder="Persona encargada de la venta"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="operation-type"
                    className="font-semibold text-primary/80"
                  >
                    Tipo de Documento
                  </Label>
                  <Select
                    value={operationType}
                    onValueChange={(val) =>
                      setOperationType(val as SalesOperationType)
                    }
                  >
                    <SelectTrigger className="focus-visible:ring-primary/50 transition-all">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SALE">Venta</SelectItem>
                      <SelectItem value="QUOTATION">Presupuesto</SelectItem>
                      <SelectItem value="ORDER">Pedido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="description"
                  className="font-semibold text-primary/80"
                >
                  Descripción (Opcional)
                </Label>
                <Input
                  id="description"
                  placeholder="Añade notas u observaciones..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={clientId === ''}
                  className="focus-visible:ring-primary/50 transition-all disabled:opacity-50"
                />
              </div>
            </CardContent>
          </Card>

          <Card
            className={`transition-all duration-300 ${clientId === '' ? 'opacity-40 grayscale pointer-events-none' : 'hover:shadow-md'}`}
          >
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle>Líneas de Detalle</CardTitle>
                <CardDescription>
                  Busca y añade productos a la operación.
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleAddProduct}
                className="shadow-sm"
              >
                <PlusIcon className="mr-2 size-4" /> Nuevo Producto
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {details.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10">
                  <div className="rounded-full bg-primary/20 p-3 mb-3 text-primary">
                    <PlusIcon className="size-6" />
                  </div>
                  <p className="font-medium text-primary/70">
                    Aún no hay productos en la lista
                  </p>
                  <Button
                    variant="link"
                    onClick={handleAddProduct}
                    className="mt-1"
                  >
                    Comienza agregando uno
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-[45%] font-semibold text-primary/80">
                        Buscador de Producto
                      </TableHead>
                      <TableHead className="font-semibold text-primary/80">
                        Cantidad
                      </TableHead>
                      <TableHead className="font-semibold text-primary/80">
                        Unidad
                      </TableHead>
                      <TableHead className="font-semibold text-primary/80">
                        Descuento
                      </TableHead>
                      <TableHead className="font-semibold text-primary/80">
                        Precio
                      </TableHead>
                      <TableHead className="font-semibold text-primary/80">
                        % Impuestos
                      </TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {details.map((detail, idx) => {
                      // Obtenemos el producto actual y sus unidades/stock para pintar el selector
                      const selectedProduct = inventory.data?.find(
                        (p) => p.id === detail.product_id,
                      )
                      const availableUnits = selectedProduct?.units || []

                      return (
                        <TableRow
                          key={detail.id}
                          className="group transition-colors hover:bg-muted/40"
                        >
                          <TableCell>
                            <Input
                              list={`products-list-${idx}`}
                              placeholder="Ej. Código o Descripción..."
                              className="bg-background/50 focus-visible:ring-primary/50"
                              onChange={(e) => {
                                const val = e.target.value
                                const prod = inventory.data?.find(
                                  (p) =>
                                    p.code === val || p.description === val,
                                )
                                if (prod) {
                                  // Al elegir un producto, seteamos el producto y la primera unidad por defecto
                                  const firstUnitId = prod.units[0].id || ''
                                  setDetails(
                                    details.map((d) =>
                                      d.id === detail.id
                                        ? {
                                            ...d,
                                            product_id: prod.id,
                                            unit: firstUnitId,
                                          }
                                        : d,
                                    ),
                                  )
                                  e.target.value = prod.description
                                } else {
                                  // Limpiar datos si borra el producto
                                  setDetails(
                                    details.map((d) =>
                                      d.id === detail.id
                                        ? { ...d, product_id: 0, unit: 0 }
                                        : d,
                                    ),
                                  )
                                }
                              }}
                            />
                            <datalist id={`products-list-${idx}`}>
                              {inventory.data?.map((prod) => (
                                <option key={prod.id} value={prod.description}>
                                  {prod.code} - ${prod.units[0].price}
                                </option>
                              ))}
                            </datalist>
                          </TableCell>

                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              className="w-24 bg-background/50 focus-visible:ring-primary/50 text-right"
                              value={detail.amount}
                              onChange={(e) =>
                                handleDetailChange(
                                  detail.id,
                                  'amount',
                                  parseInt(e.target.value) || 0,
                                )
                              }
                            />
                          </TableCell>

                          <TableCell>
                            <Select
                              value={
                                String(detail.unit) !== ''
                                  ? String(detail.unit)
                                  : undefined
                              }
                              onValueChange={(val) =>
                                handleDetailChange(
                                  detail.id,
                                  'unit',
                                  parseInt(val),
                                )
                              }
                              disabled={
                                !detail.product_id ||
                                availableUnits.length === 0
                              }
                            >
                              <SelectTrigger className="bg-background/50 focus-visible:ring-primary/50">
                                <SelectValue placeholder="Elegir unidad" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableUnits.map((u) => {
                                  const stockQty =
                                    selectedProduct?.stock.find(
                                      (s) => s.unit === u.id,
                                    )?.stock || 0

                                  return (
                                    <SelectItem key={u.id} value={String(u.id)}>
                                      {u.unit} (Stock: {stockQty})
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right font-medium text-muted-foreground">
                            {selectedProduct?.discount}
                          </TableCell>
                          <TableCell className="text-right font-medium text-muted-foreground">
                            {(() => {
                              const currentUnit = availableUnits.find(
                                (u) => u.id === detail.unit,
                              )
                              return currentUnit
                                ? `$${currentUnit.price.toFixed(2)}`
                                : '-'
                            })()}
                          </TableCell>

                          <TableCell className="text-right font-medium text-muted-foreground">
                            {selectedProduct?.sale_tax}
                          </TableCell>

                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive/70 opacity-50 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 focus:opacity-100"
                              onClick={() => handleRemoveProduct(detail.id)}
                              title="Eliminar línea"
                            >
                              <TrashIcon className="size-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="top-6 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1" />
            <CardHeader className="bg-muted/10 pb-4">
              <CardTitle className="flex items-center gap-2 text-primary">
                <CalculatorIcon className="size-6" weight="duotone" />
                Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              {simulation ? (
                <div className="flex flex-col gap-5 text-sm">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-muted-foreground font-medium">
                      Subtotal Neto
                    </span>
                    <span className="font-semibold text-[15px]">
                      ${simulation.total_net.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-muted-foreground font-medium">
                      Descuento Global
                    </span>
                    <span className="font-semibold text-[15px] text-destructive">
                      -${simulation.discount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-muted-foreground font-medium">
                      Impuestos (IVA)
                    </span>
                    <span className="font-semibold text-[15px]">
                      ${simulation.total_tax.toFixed(2)}
                    </span>
                  </div>

                  <Separator className="bg-primary/20" />

                  <div className="flex justify-between items-center bg-primary/10 p-4">
                    <span className="text-lg font-bold text-primary">
                      Total Final
                    </span>
                    <span className="text-2xl font-black text-primary tracking-tight">
                      ${simulation.total.toFixed(2)}
                    </span>
                  </div>

                  {simulation.sales_operation_details &&
                    simulation.sales_operation_details.length > 0 && (
                      <div className="mt-2 bg-muted/40 p-3 text-xs border">
                        <p className="font-semibold text-muted-foreground mb-2 px-1">
                          Desglose rápido:
                        </p>
                        <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                          {simulation.sales_operation_details.map((d, i) => (
                            <div
                              key={i}
                              className="flex justify-between items-center rounded bg-background px-2 py-1.5 shadow-sm"
                            >
                              <span
                                className="truncate w-[140px] font-medium"
                                title={d.description_product}
                              >
                                {d.description_product}
                              </span>
                              <span className="font-semibold text-primary/80">
                                ${d.total.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div className="flex h-40 flex-col items-center justify-center text-center text-sm text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
                  <CalculatorIcon className="size-10 text-muted-foreground/30 mb-2" />
                  <p className="px-4 leading-relaxed">
                    Selecciona cliente y añade productos válidos para ver la
                    previsualización de la factura.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
