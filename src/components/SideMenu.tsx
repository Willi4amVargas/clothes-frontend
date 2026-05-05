import { useAuth } from "@/feature/auth/hooks/use-auth";
import {
  ChartBarIcon,
  GearSixIcon,
  HouseIcon,
  LifebuoyIcon,
  ShoppingCartSimpleIcon,
  SignOutIcon,
  StackIcon,
  UsersThreeIcon,
  ListIcon,
  SquaresFourIcon,
} from "@phosphor-icons/react";
import type { ElementType } from "react";
import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router";

interface NavItem {
  label: string;
  icon: ElementType;
  path: string;
}

const topNavItems: NavItem[] = [
  { label: "Dashboard", icon: HouseIcon, path: "/" },
  { label: "Inventory", icon: StackIcon, path: "/inventory" },
  { label: "Clients", icon: UsersThreeIcon, path: "/clients" },
  { label: "Sales POS", icon: ShoppingCartSimpleIcon, path: "/sales" },
  // { label: "Reports", icon: ChartBarIcon, path: "/reports" },
  { label: "Settings", icon: GearSixIcon, path: "/settings" },
];

const bottomNavItems: NavItem[] = [
  { label: "Support", icon: LifebuoyIcon, path: "/support" },
];

export function SideMenu() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside
      className={`z-40 flex flex-col border-r border-slate-200 bg-slate-50 transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex flex-col border-b border-slate-200 px-4 py-4 overflow-hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="shrink-0 rounded-md p-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <ListIcon size={24} weight="bold" />
          </button>

          {isOpen && (
            <div className="flex items-center gap-2 truncate">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white">
                <SquaresFourIcon size={20} weight="fill" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900 leading-none">
                  Enterprise ERP
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  V2.4.0 High-Density
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-3 py-4">
        <ButtonLink
          label="New Transaction"
          to="/sales"
          isOpen={isOpen}
        />
      </div>

      <nav className="flex-1 overflow-y-auto space-y-1 px-3">
        {topNavItems.map((item) => (
          <SideMenuItem key={item.label} {...item} isOpen={isOpen} />
        ))}
      </nav>

      <div className="mt-auto sticky space-y-1 border-t border-slate-200 px-3 py-4">
        {bottomNavItems.map((item) => (
          <SideMenuItem key={item.label} {...item} isOpen={isOpen} />
        ))}
        <button
          title={!isOpen ? "Sign Out" : ""}
          className={`flex w-full items-center rounded-md px-3 py-2.5 transition-all relative group hover:text-red-400 ${isOpen ? "justify-start gap-4" : "justify-center"}`}
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <SignOutIcon size={22} weight="fill" className="shrink-0" />
          {isOpen && (
            <span className="text-[13px] whitespace-nowrap overflow-hidden">
              Sign Out
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}

function ButtonLink({
  label,
  to,
  isOpen,
}: {
  label: string;
  to: string;
  isOpen: boolean;
}) {
  return (
    <Link
      to={to}
      className={[
        "flex items-center rounded-md px-3 py-2.5 transition-all w-full bg-primary text-white shadow-md hover:bg-primary/90",
        isOpen ? "justify-start gap-3" : "justify-center",
      ].join(" ")}
    >
      <span className="text-lg font-bold leading-none">+</span>
      {isOpen && (
        <span className="text-xs font-semibold whitespace-nowrap">{label}</span>
      )}
    </Link>
  );
}

function SideMenuItem({
  label,
  icon: Icon,
  path,
  isOpen,
}: NavItem & { isOpen: boolean }) {
  return (
    <NavLink
      to={path}
      title={!isOpen ? label : ""}
      className={({ isActive }) =>
        [
          "flex w-full items-center rounded-md px-3 py-2.5 transition-all relative group",
          isOpen ? "justify-start gap-4" : "justify-center",
          isActive
            ? "bg-primary/50 text-primary font-semibold"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div className="absolute right-0 top-1 bottom-1 w-1 bg-primary rounded-l-full" />
          )}

          <Icon
            size={22}
            weight={isActive ? "fill" : "regular"}
            className="shrink-0"
          />

          {isOpen && (
            <span className="text-[13px] whitespace-nowrap overflow-hidden">
              {label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}
