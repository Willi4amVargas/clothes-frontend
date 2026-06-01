import { useState } from 'react'
import { useCart } from './CartContext'
import { Button } from '#/components/ui/button'
import {
  ArrowLeftIcon,
  CreditCardIcon,
  FileTextIcon,
  TruckIcon,
  ShieldCheckIcon,
} from '@phosphor-icons/react'

export function CheckoutView() {
  const { cartItems, setCurrentView, setOrderData, clearCart } = useCart()

  // Steps: 1 = Shipping, 2 = Payment
  const [step, setStep] = useState(1)

  // Form Fields State
  const [formData, setFormData] = useState({
    companyName: '',
    taxId: '',
    address: '',
    facility: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    contactPerson: '',
    phone: '',
    paymentMethod: 'net30', // 'net30' | 'cc'
    accountNumber: '',
    poNumber: '',
    ccName: '',
    ccNumber: '',
    ccExpiry: '',
    ccCvv: '',
    shippingSpeed: 'express', // 'express' = $75, 'standard' = $25, 'collect' = $0
  })

  // Errors State
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  )

  // B2B Bulk discount check: 5% off if subtotal is over $5,000
  const bulkDiscount = subtotal >= 5000 ? subtotal * 0.05 : 0

  // Shipping Speed Cost
  let shippingCost = 0
  if (formData.shippingSpeed === 'express') shippingCost = 75
  if (formData.shippingSpeed === 'standard') shippingCost = 25
  if (subtotal >= 5000) shippingCost = 0 // Free express shipping over $5,000

  const tax = (subtotal - bulkDiscount + shippingCost) * 0.085
  const total = subtotal - bulkDiscount + shippingCost + tax

  const validateStep1 = () => {
    const requiredFields = [
      'companyName',
      'taxId',
      'address',
      'city',
      'state',
      'zipCode',
      'contactPerson',
      'phone',
    ]
    const newErrors: Record<string, boolean> = {}
    let isValid = true

    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = true
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const validateStep2 = () => {
    const newErrors: Record<string, boolean> = {}
    let isValid = true

    if (formData.paymentMethod === 'net30') {
      if (!formData.accountNumber) {
        newErrors.accountNumber = true
        isValid = false
      }
      if (!formData.poNumber) {
        newErrors.poNumber = true
        isValid = false
      }
    } else {
      if (!formData.ccName) {
        newErrors.ccName = true
        isValid = false
      }
      if (!formData.ccNumber) {
        newErrors.ccNumber = true
        isValid = false
      }
      if (!formData.ccExpiry) {
        newErrors.ccExpiry = true
        isValid = false
      }
      if (!formData.ccCvv) {
        newErrors.ccCvv = true
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevStep = () => {
    setStep(1)
    window.scrollTo(0, 0)
  }

  const handlePlaceOrder = () => {
    if (validateStep2()) {
      const orderNo = 'ORD-' + Math.floor(Math.random() * 900000 + 100000)
      const txnRef = 'TXN-' + Math.floor(Math.random() * 89999 + 10000) + '-PRO'
      const deliveryEst =
        formData.shippingSpeed === 'express'
          ? '3-5 Business Days'
          : formData.shippingSpeed === 'standard'
            ? '7-10 Business Days'
            : 'Arrange carrier pick-up'

      const orderDetails = {
        orderNumber: orderNo,
        transactionRef: txnRef,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        deliveryEstimate: deliveryEst,
        items: cartItems,
        shipping: {
          companyName: formData.companyName,
          taxId: formData.taxId,
          address: formData.address,
          facility: formData.facility,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          contactPerson: formData.contactPerson,
          phone: formData.phone,
        },
        payment: {
          method:
            formData.paymentMethod === 'net30'
              ? 'Corporate Net-30'
              : 'Credit Card',
          reference:
            formData.paymentMethod === 'net30'
              ? `PO #${formData.poNumber}`
              : `CC Ending in ${formData.ccNumber.slice(-4)}`,
        },
        totals: {
          subtotal,
          bulkDiscount,
          shippingCost,
          tax,
          total,
        },
      }

      setOrderData(orderDetails)
      clearCart()
      setCurrentView('success')
      window.scrollTo(0, 0)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: false,
      })
    }
  }

  return (
    <div className="max-w-[1280px] mx-auto px-10 py-10">
      {/* Header breadcrumb */}
      <div className="flex items-center justify-between mb-8 border-b border-outline-variant pb-4">
        <div className="space-y-1">
          <button
            onClick={() => setCurrentView('shop')}
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline uppercase tracking-wider"
          >
            <ArrowLeftIcon size={14} />
            Back to Catalog
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">
            Secure Checkout
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-surface-container text-on-surface-variant'}`}
            >
              1
            </span>
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${step >= 1 ? 'text-on-surface' : 'text-on-surface-variant/50'}`}
            >
              Shipping
            </span>
          </div>
          <span className="w-10 h-[1px] bg-outline-variant"></span>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-surface-container text-on-surface-variant'}`}
            >
              2
            </span>
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${step >= 2 ? 'text-on-surface' : 'text-on-surface-variant/50'}`}
            >
              Billing & PO
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">
        {/* Left Column: Form Forms */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-[4px] p-6 space-y-8 shadow-sm">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
                <TruckIcon size={20} className="text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface">
                  1. Corporate Logistics & Delivery Address
                </h3>
              </div>

              {/* Form Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Company Name */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-on-surface uppercase tracking-wide">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) =>
                      handleInputChange('companyName', e.target.value)
                    }
                    placeholder="Enter corporate entity name"
                    className={`h-10 px-3 border rounded-[4px] text-xs font-medium bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 ${errors.companyName ? 'border-2 border-[#ba1a1a] bg-red-50/20' : 'border-outline'}`}
                  />
                  {errors.companyName && (
                    <span className="text-[10px] text-error font-medium">
                      Company name is required for commercial logistics.
                    </span>
                  )}
                </div>

                {/* Tax ID */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-on-surface uppercase tracking-wide">
                    Corporate Tax ID / EIN *
                  </label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => handleInputChange('taxId', e.target.value)}
                    placeholder="XX-XXXXXXX"
                    className={`h-10 px-3 border rounded-[4px] text-xs font-mono bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 ${errors.taxId ? 'border-2 border-[#ba1a1a] bg-red-50/20' : 'border-outline'}`}
                  />
                  {errors.taxId && (
                    <span className="text-[10px] text-error font-medium">
                      Federal Tax ID / EIN required for customs and business
                      billing.
                    </span>
                  )}
                </div>

                {/* Street Address */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-on-surface uppercase tracking-wide">
                    Facility Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange('address', e.target.value)
                    }
                    placeholder="123 Industrial Parkway"
                    className={`h-10 px-3 border rounded-[4px] text-xs font-medium bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 ${errors.address ? 'border-2 border-[#ba1a1a] bg-red-50/20' : 'border-outline'}`}
                  />
                  {errors.address && (
                    <span className="text-[10px] text-error font-medium">
                      Main street address is required.
                    </span>
                  )}
                </div>

                {/* Facility / Suite */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-on-surface uppercase tracking-wide">
                    Suite / Warehouse / Loading Dock (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.facility}
                    onChange={(e) =>
                      handleInputChange('facility', e.target.value)
                    }
                    placeholder="Dock 4B, Building C"
                    className="h-10 px-3 border border-outline rounded-[4px] text-xs font-medium bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>

                {/* City */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface uppercase tracking-wide">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Houston"
                    className={`h-10 px-3 border rounded-[4px] text-xs font-medium bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 ${errors.city ? 'border-2 border-[#ba1a1a] bg-red-50/20' : 'border-outline'}`}
                  />
                  {errors.city && (
                    <span className="text-[10px] text-error font-medium">
                      City is required.
                    </span>
                  )}
                </div>

                {/* State */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface uppercase tracking-wide">
                    State / Province *
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="TX"
                    className={`h-10 px-3 border rounded-[4px] text-xs font-medium bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 ${errors.state ? 'border-2 border-[#ba1a1a] bg-red-50/20' : 'border-outline'}`}
                  />
                  {errors.state && (
                    <span className="text-[10px] text-error font-medium">
                      State is required.
                    </span>
                  )}
                </div>

                {/* Postal Code */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface uppercase tracking-wide">
                    Postal / ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) =>
                      handleInputChange('zipCode', e.target.value)
                    }
                    placeholder="77001"
                    className={`h-10 px-3 border rounded-[4px] text-xs font-mono bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 ${errors.zipCode ? 'border-2 border-[#ba1a1a] bg-red-50/20' : 'border-outline'}`}
                  />
                  {errors.zipCode && (
                    <span className="text-[10px] text-error font-medium">
                      ZIP code is required.
                    </span>
                  )}
                </div>

                {/* Country */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface uppercase tracking-wide">
                    Country
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) =>
                      handleInputChange('country', e.target.value)
                    }
                    className="h-10 px-3 border border-outline rounded-[4px] text-xs font-semibold bg-surface-container-lowest text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="United States">United States</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>

                {/* Contact Person */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface uppercase tracking-wide">
                    Delivery Contact Person *
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      handleInputChange('contactPerson', e.target.value)
                    }
                    placeholder="John Doe (Receiving Manager)"
                    className={`h-10 px-3 border rounded-[4px] text-xs font-medium bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 ${errors.contactPerson ? 'border-2 border-[#ba1a1a] bg-red-50/20' : 'border-outline'}`}
                  />
                  {errors.contactPerson && (
                    <span className="text-[10px] text-error font-medium">
                      Recipient contact name is required.
                    </span>
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface uppercase tracking-wide">
                    Contact Phone Number *
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1-555-0199"
                    className={`h-10 px-3 border rounded-[4px] text-xs font-mono bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 ${errors.phone ? 'border-2 border-[#ba1a1a] bg-red-50/20' : 'border-outline'}`}
                  />
                  {errors.phone && (
                    <span className="text-[10px] text-error font-medium">
                      Contact phone number is required.
                    </span>
                  )}
                </div>
              </div>

              {/* Shipping Speed Selection */}
              <div className="space-y-3 pt-4 border-t border-outline-variant">
                <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">
                  Select Freight Service Speed
                </h4>
                <div className="grid sm:grid-cols-3 gap-3">
                  {/* Express */}
                  <label
                    className={`border rounded-[4px] p-3 flex flex-col justify-between cursor-pointer select-none transition-all ${formData.shippingSpeed === 'express' ? 'border-primary bg-primary/5' : 'border-outline hover:border-primary/40'}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-on-surface">
                        Express Freight
                      </span>
                      <input
                        type="radio"
                        name="shippingSpeed"
                        value="express"
                        checked={formData.shippingSpeed === 'express'}
                        onChange={() =>
                          handleInputChange('shippingSpeed', 'express')
                        }
                        className="text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="pt-2">
                      <span className="text-[10px] text-on-surface-variant/80">
                        3-5 Business Days
                      </span>
                      <div className="text-xs font-bold text-primary font-mono mt-1">
                        {subtotal >= 5000 ? 'FREE (Volume Promo)' : '$75.00'}
                      </div>
                    </div>
                  </label>

                  {/* Standard */}
                  <label
                    className={`border rounded-[4px] p-3 flex flex-col justify-between cursor-pointer select-none transition-all ${formData.shippingSpeed === 'standard' ? 'border-primary bg-primary/5' : 'border-outline hover:border-primary/40'}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-on-surface">
                        Standard Logistics
                      </span>
                      <input
                        type="radio"
                        name="shippingSpeed"
                        value="standard"
                        checked={formData.shippingSpeed === 'standard'}
                        onChange={() =>
                          handleInputChange('shippingSpeed', 'standard')
                        }
                        className="text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="pt-2">
                      <span className="text-[10px] text-on-surface-variant/80">
                        7-10 Business Days
                      </span>
                      <div className="text-xs font-bold text-on-surface font-mono mt-1">
                        $25.00
                      </div>
                    </div>
                  </label>

                  {/* Collect */}
                  <label
                    className={`border rounded-[4px] p-3 flex flex-col justify-between cursor-pointer select-none transition-all ${formData.shippingSpeed === 'collect' ? 'border-primary bg-primary/5' : 'border-outline hover:border-primary/40'}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-on-surface">
                        Carrier Collect
                      </span>
                      <input
                        type="radio"
                        name="shippingSpeed"
                        value="collect"
                        checked={formData.shippingSpeed === 'collect'}
                        onChange={() =>
                          handleInputChange('shippingSpeed', 'collect')
                        }
                        className="text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="pt-2">
                      <span className="text-[10px] text-on-surface-variant/80">
                        FOB Warehouse Pick-up
                      </span>
                      <div className="text-xs font-bold text-on-surface font-mono mt-1">
                        Collect ($0.00)
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-outline-variant flex justify-end">
                <Button
                  onClick={handleNextStep}
                  className="bg-primary text-primary-foreground font-semibold h-10 rounded-[4px] text-xs uppercase tracking-wider px-6 hover:bg-primary/95 transition-colors"
                >
                  Continue to Billing
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-outline-variant pb-3">
                <CreditCardIcon size={20} className="text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface">
                  2. Billing & Purchase Authorization
                </h3>
              </div>

              {/* Payment Method Selector */}
              <div className="flex gap-4 p-4 rounded-[4px] bg-surface-container-low border border-outline-variant">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="net30"
                    checked={formData.paymentMethod === 'net30'}
                    onChange={() => handleInputChange('paymentMethod', 'net30')}
                    className="text-primary focus:ring-primary"
                  />
                  <div className="text-xs font-bold text-on-surface uppercase">
                    Corporate Net-30 Account
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none border-l border-outline-variant pl-4">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cc"
                    checked={formData.paymentMethod === 'cc'}
                    onChange={() => handleInputChange('paymentMethod', 'cc')}
                    className="text-primary focus:ring-primary"
                  />
                  <div className="text-xs font-bold text-on-surface uppercase">
                    Commercial Credit Card
                  </div>
                </label>
              </div>

              {/* Payment Method Details Form */}
              {formData.paymentMethod === 'net30' ? (
                <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in duration-200">
                  {/* Account Number */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-on-surface uppercase tracking-wide">
                      Corporate Account Number *
                    </label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) =>
                        handleInputChange('accountNumber', e.target.value)
                      }
                      placeholder="AC-XXXXXXXX-XX"
                      className={`h-10 px-3 border rounded-[4px] text-xs font-mono bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 ${errors.accountNumber ? 'border-2 border-[#ba1a1a] bg-red-50/20' : 'border-outline'}`}
                    />
                    {errors.accountNumber && (
                      <span className="text-[10px] text-error font-medium">
                        B2B procurement billing account number is required.
                      </span>
                    )}
                  </div>

                  {/* Purchase Order */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-on-surface uppercase tracking-wide">
                      Purchase Order (PO) Number *
                    </label>
                    <input
                      type="text"
                      value={formData.poNumber}
                      onChange={(e) =>
                        handleInputChange('poNumber', e.target.value)
                      }
                      placeholder="PO-2026-XXXX"
                      className={`h-10 px-3 border rounded-[4px] text-xs font-mono bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 ${errors.poNumber ? 'border-2 border-[#ba1a1a] bg-red-50/20' : 'border-outline'}`}
                    />
                    {errors.poNumber && (
                      <span className="text-[10px] text-error font-medium">
                        Authorized Purchase Order (PO) code is required for
                        terms billing.
                      </span>
                    )}
                  </div>

                  <div className="sm:col-span-2 p-4 border border-primary/20 bg-primary/5 rounded-[4px] flex gap-3 items-start">
                    <ShieldCheckIcon
                      size={20}
                      className="text-primary shrink-0 mt-0.5"
                    />
                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                      All purchase orders are subject to immediate audit and
                      matching against your approved Credit Limit. Net terms are
                      strictly Net-30 from date of shipping.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-4 gap-4 animate-in fade-in duration-200">
                  {/* CC Name */}
                  <div className="flex flex-col gap-1.5 sm:col-span-4">
                    <label className="text-xs font-semibold text-on-surface uppercase tracking-wide">
                      Name on Card *
                    </label>
                    <input
                      type="text"
                      value={formData.ccName}
                      onChange={(e) =>
                        handleInputChange('ccName', e.target.value)
                      }
                      placeholder="Jane H. Doe"
                      className={`h-10 px-3 border rounded-[4px] text-xs font-medium bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 ${errors.ccName ? 'border-2 border-[#ba1a1a] bg-red-50/20' : 'border-outline'}`}
                    />
                    {errors.ccName && (
                      <span className="text-[10px] text-error font-medium">
                        Name on card is required.
                      </span>
                    )}
                  </div>

                  {/* CC Number */}
                  <div className="flex flex-col gap-1.5 sm:col-span-4">
                    <label className="text-xs font-semibold text-on-surface uppercase tracking-wide">
                      Credit Card Number *
                    </label>
                    <input
                      type="text"
                      value={formData.ccNumber}
                      onChange={(e) =>
                        handleInputChange('ccNumber', e.target.value)
                      }
                      placeholder="0000 0000 0000 0000"
                      className={`h-10 px-3 border rounded-[4px] text-xs font-mono bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 ${errors.ccNumber ? 'border-2 border-[#ba1a1a] bg-red-50/20' : 'border-outline'}`}
                    />
                    {errors.ccNumber && (
                      <span className="text-[10px] text-error font-medium">
                        Valid credit card number is required.
                      </span>
                    )}
                  </div>

                  {/* Expiry */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-on-surface uppercase tracking-wide">
                      Expiration Date *
                    </label>
                    <input
                      type="text"
                      value={formData.ccExpiry}
                      onChange={(e) =>
                        handleInputChange('ccExpiry', e.target.value)
                      }
                      placeholder="MM/YY"
                      className={`h-10 px-3 border rounded-[4px] text-xs font-mono bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 ${errors.ccExpiry ? 'border-2 border-[#ba1a1a] bg-red-50/20' : 'border-outline'}`}
                    />
                    {errors.ccExpiry && (
                      <span className="text-[10px] text-error font-medium">
                        Expiration date is required.
                      </span>
                    )}
                  </div>

                  {/* CVV */}
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-on-surface uppercase tracking-wide">
                      Security Code (CVV) *
                    </label>
                    <input
                      type="text"
                      value={formData.ccCvv}
                      onChange={(e) =>
                        handleInputChange('ccCvv', e.target.value)
                      }
                      placeholder="000"
                      className={`h-10 px-3 border rounded-[4px] text-xs font-mono bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 ${errors.ccCvv ? 'border-2 border-[#ba1a1a] bg-red-50/20' : 'border-outline'}`}
                    />
                    {errors.ccCvv && (
                      <span className="text-[10px] text-error font-medium">
                        CVV security code is required.
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-outline-variant flex justify-between">
                <button
                  onClick={handlePrevStep}
                  className="flex items-center gap-1 text-xs font-bold text-secondary hover:text-primary transition-colors uppercase tracking-wider py-2"
                >
                  <ArrowLeftIcon size={14} />
                  Back to Shipping
                </button>
                <Button
                  onClick={handlePlaceOrder}
                  className="bg-primary text-primary-foreground font-semibold h-10 rounded-[4px] text-xs uppercase tracking-wider px-8 hover:bg-primary/95 transition-colors"
                >
                  Submit Order
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Order Summary (Sidebar) */}
        <div className="sticky top-6 space-y-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-[4px] p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface border-b border-outline-variant pb-2.5">
              Order Specification
            </h3>

            {/* Cart Items List */}
            <div className="max-h-[220px] overflow-y-auto space-y-3 pr-1">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <h5
                      className="font-bold text-on-surface truncate"
                      title={item.title}
                    >
                      {item.title}
                    </h5>
                    <div className="text-[10px] text-on-surface-variant/80 font-mono flex items-center gap-1.5">
                      <span>QTY: {item.quantity}</span>
                      <span>•</span>
                      <span>SKU: {item.sku}</span>
                    </div>
                  </div>
                  <span className="font-mono text-on-surface font-semibold shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="border-t border-outline-variant pt-3.5 space-y-2 text-xs">
              <div className="flex justify-between text-on-surface-variant">
                <span>Items Subtotal</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>

              {bulkDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Bulk discount (5% promo)</span>
                  <span className="font-mono">-${bulkDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-on-surface-variant">
                <span>Logistics / Freight</span>
                <span className="font-mono">
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-on-surface-variant">
                <span>Estimated Sales Tax (8.5%)</span>
                <span className="font-mono">${tax.toFixed(2)}</span>
              </div>

              <div className="border-t border-outline-variant/60 my-2 pt-2.5 flex justify-between text-sm font-bold text-on-surface">
                <span>Contract Total</span>
                <span className="font-mono text-primary text-base">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Secure details card */}
          <div className="bg-surface-container-low border border-outline-variant rounded-[4px] p-4 text-[10px] text-on-surface-variant/80 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-on-surface uppercase tracking-wider text-[9px]">
              <FileTextIcon size={14} className="text-primary" />
              Corporate Terms & Regulations
            </div>
            <p className="leading-relaxed">
              Wholesale transactions are encrypted and subject to contract
              specifications under UCC standards. Orders are shipped FOB origin
              from the central manufacturing hubs.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
