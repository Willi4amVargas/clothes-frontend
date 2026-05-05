import { IdentificationCardIcon , MapPinIcon } from "@phosphor-icons/react";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const countries = [
  "Argentina",
  "Brasil",
  "Chile",
  "Colombia",
  "Espaa",
  "Mxico",
  "Per",
  "Uruguay",
];

export function CreateClientForm() {
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b px-4 py-2.5">
          <div className="flex items-center gap-2">
            <IdentificationCardIcon  className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm">Informacin Bsica</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="client-active"
              className="text-xs text-muted-foreground"
            >
              Marcar como Activo
            </Label>
            <Switch
              id="client-active"
              size="sm"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </CardHeader>
        <CardContent className="px-4 py-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="client-code">Cdigo de Cliente</Label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground select-none">
                  CLI-
                </span>
                <Input
                  id="client-code"
                  className="pl-10 font-mono text-xs"
                  placeholder="00001"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="client-status">Estado</Label>
              <Select defaultValue={isActive ? "active" : "inactive"}>
                <SelectTrigger id="client-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                  <SelectItem value="on-hold">En Espera</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="client-description">
                Descripcin / Nombre Comercial
              </Label>
              <Input
                id="client-description"
                placeholder="Corporacin Ejemplo S.A."
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="client-email">Email Corporativo</Label>
              <Input
                id="client-email"
                type="email"
                placeholder="contacto@empresa.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="client-phone">Telfono</Label>
              <Input
                id="client-phone"
                type="tel"
                placeholder="+54 11 0000-0000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2 space-y-0 border-b px-4 py-2.5">
          <MapPinIcon className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm">Localizacin</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="client-country">Pas</Label>
              <Select>
                <SelectTrigger id="client-country">
                  <SelectValue placeholder="Seleccione un pas" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country.toLowerCase()}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="client-city">Ciudad</Label>
              <Input
                id="client-city"
                placeholder="Ciudad Autnoma de Buenos Aires"
              />
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="client-address">Direccin Completa</Label>
              <Textarea
                id="client-address"
                placeholder="Calle, Nmero, Piso/Depto, Barrio..."
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
