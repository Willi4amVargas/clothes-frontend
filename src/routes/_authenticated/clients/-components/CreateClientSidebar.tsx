import {
  CalendarIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  PercentIcon,
  TimerIcon,
  UserPlusIcon,
} from '@phosphor-icons/react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

const currencies = [
  { code: 'USD', label: 'USD' },
  { code: 'EUR', label: 'EUR' },
  { code: 'ARS', label: 'ARS' },
  { code: 'MXN', label: 'MXN' },
  { code: 'CLP', label: 'CLP' },
]

export function CreateClientSidebar() {
  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 space-y-0 border-b px-4 py-2.5">
          <CurrencyDollarIcon className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm">Finanzas</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 px-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="credit-days">Dias de Credito</Label>
              <InputGroup>
                <InputGroupInput
                  id="credit-days"
                  type="number"
                  defaultValue={30}
                  className="text-right"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText className="font-semibold text-[10px] tracking-wide">
                    DIAS
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="credit-limit">Limite de Credito</Label>
              <div className="flex items-center gap-1.5">
                <div className="flex-1">
                  <InputGroup>
                    <InputGroupInput
                      id="credit-limit"
                      placeholder="5,000.00"
                      className="font-mono text-right"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText className="font-semibold text-[10px]">
                        5,000
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
                <Select defaultValue="usd">
                  <SelectTrigger className="h-8 w-20 text-xs shrink-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem
                        key={currency.code}
                        value={currency.code.toLowerCase()}
                      >
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="discount-pct">Porcentaje de Descuento</Label>
              <InputGroup>
                <InputGroupInput
                  id="discount-pct"
                  type="number"
                  placeholder="0"
                  defaultValue={0}
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
  )
}
