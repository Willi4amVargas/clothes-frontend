import React, { useState, useEffect } from 'react'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '#/components/ui/input-group'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import {
  CurrencyDollarIcon,
  FloppyDiskIcon,
  IdentificationCardIcon,
  MapPinIcon,
  PercentIcon,
} from '@phosphor-icons/react'
import type { Client } from '#/services/clientService'

interface ClientFormProps {
  initialValues?: Partial<Client>
  onSave: (data: Partial<Client>) => void
  onCancel?: () => void
}

export const ClientForm = ({
  initialValues,
  onSave,
  onCancel,
}: ClientFormProps) => {
  const [formData, setFormData] = useState<Partial<Client>>({
    code: '',
    client_id: '',
    description: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    address: '',
    credit_days: 30,
    credit_limit: 0,
    discount: 0,
    ...initialValues,
  })

  useEffect(() => {
    if (initialValues) {
      setFormData((prev) => ({ ...prev, ...initialValues }))
    }
  }, [initialValues])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSave(formData)
  }

  const isEditing = !!formData.id

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between items-end pb-4 border-b mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">
          {isEditing ? 'Edición de cliente' : 'Creación de cliente'}
        </h1>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" variant="default" size="sm" className="gap-1.5">
            <FloppyDiskIcon className="h-3.5 w-3.5" />
            {isEditing ? 'Actualizar Cliente' : 'Guardar Cliente'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-8">
          <div className="flex flex-col gap-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <IdentificationCardIcon className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm">Información Básica</CardTitle>
                </div>
                  {isEditing && (
                    <div className="flex gap-1.5">
                      <Label htmlFor="client-id" className='text-nowrap'>ID del Cliente</Label>
                      <Input
                        id="client-id"
                        className="font-mono text-xs bg-slate-50"
                        disabled
                        value={formData.id}
                      />
                    </div>
                  )}
              </CardHeader>
              <CardContent className="px-4 py-3">
                <div className="grid grid-cols-2 gap-3">
                  {/* Muestra el ID solo si viene en los valores iniciales */}

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="client-code">Código de Cliente</Label>
                    <div className="relative">
                      {!isEditing && (
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground select-none">
                          CLI-
                        </span>
                      )}
                      <Input
                        id="client-code"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        className={`${!isEditing && 'pl-10'} font-mono text-xs`}
                        placeholder="00001"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="client-id-card">
                      Identificación del Cliente
                    </Label>
                    <div className="relative">
                      <Input
                        id="client-id-card"
                        name="client_id"
                        value={formData.client_id}
                        onChange={handleChange}
                        className="font-mono text-xs"
                        placeholder="V123456789"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-span-2 flex flex-col gap-1.5">
                    <Label htmlFor="client-description">
                      Descripción / Nombre Comercial
                    </Label>
                    <Input
                      id="client-description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Corporativa Ejemplo S.A."
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="client-email">Email Corporativo</Label>
                    <Input
                      id="client-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="contacto@empresa.com"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="client-phone">Teléfono</Label>
                    <Input
                      id="client-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+54 11 0000-0000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 border-b px-4 py-2.5">
                <MapPinIcon className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm">Localización</CardTitle>
              </CardHeader>
              <CardContent className="px-4 py-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="client-country">País</Label>
                    <Input
                      id="client-country"
                      name="country"
                      type="text"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Ej: Venezuela"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="client-city">Ciudad</Label>
                    <Input
                      id="client-city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Ciudad Capital"
                    />
                  </div>
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <Label htmlFor="client-address">Dirección Completa</Label>
                    <Textarea
                      id="client-address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Calle, Número, Piso/Dep, Barrio..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="col-span-4">
          <div className="flex flex-col gap-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 border-b px-4 py-2.5">
                <CurrencyDollarIcon className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm">Finanzas</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 px-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="credit-days">Días de Crédito</Label>
                    <InputGroup>
                      <InputGroupInput
                        id="credit-days"
                        name="credit_days"
                        type="number"
                        value={formData.credit_days}
                        onChange={handleChange}
                        className="text-right"
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupText className="font-semibold text-[10px] tracking-wide">
                          DÍAS
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="credit-limit">Límite de Crédito</Label>
                    <InputGroup>
                      <InputGroupInput
                        id="credit-limit"
                        name="credit_limit"
                        type="number"
                        value={formData.credit_limit}
                        onChange={handleChange}
                        placeholder="5000.00"
                        className="font-mono text-right"
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupText className="font-semibold text-[10px]">
                          USD
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="discount-pct">
                      Porcentaje de Descuento
                    </Label>
                    <InputGroup>
                      <InputGroupInput
                        id="discount-pct"
                        name="discount"
                        type="number"
                        value={formData.discount}
                        onChange={handleChange}
                        placeholder="0"
                      />
                      <InputGroupAddon align="inline-end">
                        <PercentIcon className="text-muted-foreground" />
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </form>
  )
}
