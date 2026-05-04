import {
  BellIcon,
  CaretDownIcon,
  ClockCounterClockwiseIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import type { ElementType } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const centerLinks = ["Inventory", "Orders", "Invoices"];

export function MainHeader() {
  return (
    <header className="flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-5">
      <p className="min-w-fit text-sm font-semibold text-slate-900">
        Global Operations
      </p>

      <div className="relative max-w-md flex-1">
        <MagnifyingGlassIcon
          size={14}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
        />
        <Input
          placeholder="Search transactions, clients..."
          className="h-9 rounded-md border-slate-200 bg-slate-50 pl-8 text-xs"
        />
      </div>

      <nav className="hidden items-center gap-4 text-xs text-slate-600 md:flex">
        {centerLinks.map((link) => (
          <button key={link} type="button" className="hover:text-slate-900">
            {link}
          </button>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <IconShell icon={BellIcon} />
        <IconShell icon={ClockCounterClockwiseIcon} />

        <Button className="h-8 rounded-md bg-primary px-3 text-xs font-medium text-white hover:bg-primary/90">
          Quick Add
        </Button>

        <button
          type="button"
          className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1.5"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
            WA
          </div>
          <CaretDownIcon size={12} className="text-slate-500" />
        </button>
      </div>
    </header>
  );
}

function IconShell({ icon: Icon }: { icon: ElementType }) {
  return (
    <button
      type="button"
      className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600"
    >
      <Icon size={16} />
    </button>
  );
}
