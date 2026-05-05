import {
  CheckCircleIcon,
  CreditCardIcon,
  MoneyIcon,
  TagIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PaymentMethod = "credit" | "cash";

export function CheckoutSidebar() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit");
  const [discountInput, setDiscountInput] = useState("");

  const netSubtotal = 2716.23;
  const taxAmount = 231.09;
  const discountAmount = 0.0;
  const grandTotal = 2947.32;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="h-full">
      <Card className="h-full flex flex-col">
        <CardHeader className="border-b px-4 py-2.5">
          <CardTitle className="text-sm">Summary & Checkout</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-3 flex flex-col flex-1 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Net Subtotal</span>
              <span className="text-xs font-mono font-medium text-gray-900">
                {formatCurrency(netSubtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Tax (8.5%)</span>
              <span className="text-xs font-mono font-medium text-gray-900">
                {formatCurrency(taxAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Discount</span>
              <span className="text-xs font-mono font-medium text-gray-500">
                -{formatCurrency(discountAmount)}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">
                Grand Total
              </span>
              <span className="text-xl font-bold text-gray-900 font-mono">
                {formatCurrency(grandTotal)}{" "}
                <span className="text-xs font-medium text-gray-500">USD</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-medium text-gray-600">
              Payment Method
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                className={`flex flex-col items-center justify-center gap-1.5 h-20 border-2 rounded-none transition-all ${paymentMethod === "credit" ? "border-primary bg-primary/5 text-primary" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}
                onClick={() => setPaymentMethod("credit")}
              >
                <CreditCardIcon className="h-5 w-5" />
                <span className="text-[11px] font-semibold">Credit Card</span>
              </button>
              <button
                className={`flex flex-col items-center justify-center gap-1.5 h-20 border-2 rounded-none transition-all ${paymentMethod === "cash" ? "border-primary bg-primary/5 text-primary" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}
                onClick={() => setPaymentMethod("cash")}
              >
                <MoneyIcon className="h-5 w-5" />
                <span className="text-[11px] font-semibold">Cash</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="discount-code" className="text-xs font-medium text-gray-600">
              Apply Discount
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <TagIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input
                  id="discount-code"
                  className="pl-8 h-8 text-xs"
                  placeholder="Code or %"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="h-8 shrink-0">
                Apply
              </Button>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-2 pt-3">
            <Button variant="default" size="sm" className="w-full gap-1.5 h-9">
              <CheckCircleIcon className="h-4 w-4" />
              Complete Sale
            </Button>
            <Button variant="secondary" size="sm" className="w-full h-9">
              Save as Quotation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
