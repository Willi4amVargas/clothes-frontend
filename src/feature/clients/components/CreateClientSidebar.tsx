import {
  CalendarIcon,
  CurrencyDollarIcon,
  InfoIcon,
  MapPinIcon,
  PercentIcon,
  TimerIcon,
  UserPlusIcon,
} from "@phosphor-icons/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const currencies = [
  { code: "USD", label: "USD" },
  { code: "EUR", label: "EUR" },
  { code: "ARS", label: "ARS" },
  { code: "MXN", label: "MXN" },
  { code: "CLP", label: "CLP" },
];

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
              <Label htmlFor="credit-limit">Lmite de Credito</Label>
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

            <div className="mt-2 p-3 bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-2.5">
                <InfoIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-primary mb-0.5">
                    Resumen de Cuenta
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Este cliente ser asignado al grupo de riesgo estndar. Se
                    aplicarn las polticas automticas de facturacin mensual.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-none border border-outline-variant overflow-hidden">
        <div className="aspect-[4/3] w-full bg-muted/30 flex items-center justify-center">
          <div className="flex flex-col items-center text-center p-4">
            <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center mb-2">
              <MapPinIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-0.5">
              Contexto Regional
            </p>
            <p className="text-xs font-semibold text-muted-foreground">
              Sede Principal
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-1 py-1.5 border border-outline-variant bg-muted/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <UserPlusIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">
              Creado por:{" "}
              <span className="font-semibold text-primary">Admin_S01</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">
              Fecha:{" "}
              <span className="font-semibold text-primary">05 OCT 2026</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TimerIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[11px] text-muted-foreground">Borrador</span>
        </div>
      </div>
    </div>
  );
}
