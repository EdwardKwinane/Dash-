"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/format";
import {
  EMPTY_CHECKOUT_FORM,
  SA_PROVINCES,
  createOrderReference,
  hasCheckoutErrors,
  validateCheckout,
  type CheckoutErrors,
  type CheckoutField,
  type CheckoutFormData,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

const FIELD_ORDER: CheckoutField[] = [
  "email",
  "firstName",
  "lastName",
  "address",
  "city",
  "province",
  "postalCode",
  "phone",
];

const inputClass =
  "w-full rounded-card border border-line bg-white px-4 py-2 text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

export default function CheckoutPage() {
  const { state, isHydrated, clearCart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState<CheckoutFormData>(EMPTY_CHECKOUT_FORM);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const submittingRef = useRef(false);
  const errorSummaryId = useId();

  const isEmpty = state.items.length === 0;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const field = event.target.name as CheckoutField;
    setFormData((previous) => ({ ...previous, [field]: event.target.value }));
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;

    const nextErrors = validateCheckout(formData);
    if (hasCheckoutErrors(nextErrors)) {
      setErrors(nextErrors);
      const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
      if (firstInvalid) {
        document.getElementById(firstInvalid)?.focus();
      }
      return;
    }

    submittingRef.current = true;
    setIsProcessing(true);
    setErrors({});

    // Demo only: no network request and no payment. The short delay exists so
    // the disabled/pending state is observable.
    await new Promise((resolve) => setTimeout(resolve, 700));

    const reference = createOrderReference();
    clearCart();
    router.push(`/checkout/success?ref=${encodeURIComponent(reference)}`);
  };

  if (!isHydrated) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-8 text-3xl font-bold text-ink">Checkout</h1>
          <p role="status" className="text-ink-muted">
            Loading your cart…
          </p>
        </div>
      </div>
    );
  }

  if (isEmpty && !isProcessing) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-content px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-3xl font-bold text-ink">
            Your cart is empty
          </h1>
          <p className="mb-8 text-ink-muted">
            Add a product before starting the demo checkout.
          </p>
          <Button
            asChild
            className="h-auto rounded-card bg-brand px-6 py-3 text-white hover:bg-brand-hover"
          >
            <Link href="/products">Browse products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const errorCount = Object.keys(errors).length;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-content px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-3xl font-bold text-ink">Demo checkout</h1>
        <p className="mb-8 max-w-2xl text-ink-muted">
          This form validates a delivery address and shows a confirmation. No
          payment is taken, no card details are requested, and no order is sent
          to a server.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          aria-describedby={errorCount > 0 ? errorSummaryId : undefined}
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {errorCount > 0 && (
                <div
                  id={errorSummaryId}
                  role="alert"
                  className="rounded-card border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#991b1b]"
                >
                  Please correct the highlighted{" "}
                  {errorCount === 1 ? "field" : `${errorCount} fields`} below.
                </div>
              )}

              <fieldset className="rounded-card border border-line bg-white p-6">
                <legend className="px-1 text-xl font-bold text-ink">
                  Contact information
                </legend>
                <div className="mt-4">
                  <Field
                    id="email"
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    error={errors.email}
                    onChange={handleChange}
                    placeholder="name@example.co.za"
                  />
                </div>
              </fieldset>

              <fieldset className="rounded-card border border-line bg-white p-6">
                <legend className="px-1 text-xl font-bold text-ink">
                  Delivery address
                </legend>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field
                    id="firstName"
                    label="First name"
                    autoComplete="given-name"
                    value={formData.firstName}
                    error={errors.firstName}
                    onChange={handleChange}
                  />
                  <Field
                    id="lastName"
                    label="Last name"
                    autoComplete="family-name"
                    value={formData.lastName}
                    error={errors.lastName}
                    onChange={handleChange}
                  />
                  <Field
                    id="address"
                    label="Street address"
                    autoComplete="street-address"
                    value={formData.address}
                    error={errors.address}
                    onChange={handleChange}
                    className="md:col-span-2"
                  />
                  <Field
                    id="city"
                    label="City or town"
                    autoComplete="address-level2"
                    value={formData.city}
                    error={errors.city}
                    onChange={handleChange}
                  />
                  <div>
                    <label
                      htmlFor="province"
                      className="mb-1 block text-sm font-medium text-ink"
                    >
                      Province
                    </label>
                    <select
                      id="province"
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      autoComplete="address-level1"
                      aria-invalid={errors.province ? true : undefined}
                      aria-describedby={
                        errors.province ? "province-error" : undefined
                      }
                      className={cn(
                        inputClass,
                        errors.province && "border-[#b91c1c]",
                      )}
                    >
                      <option value="">Select a province</option>
                      {SA_PROVINCES.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                    {errors.province && (
                      <p
                        id="province-error"
                        className="mt-1 text-sm text-[#b91c1c]"
                      >
                        {errors.province}
                      </p>
                    )}
                  </div>
                  <Field
                    id="postalCode"
                    label="Postal code"
                    autoComplete="postal-code"
                    inputMode="numeric"
                    value={formData.postalCode}
                    error={errors.postalCode}
                    onChange={handleChange}
                    placeholder="0000"
                  />
                  <Field
                    id="phone"
                    label="Phone number"
                    type="tel"
                    autoComplete="tel"
                    value={formData.phone}
                    error={errors.phone}
                    onChange={handleChange}
                    placeholder="082 123 4567"
                    className="md:col-span-2"
                  />
                </div>
              </fieldset>

              <section
                aria-labelledby="payment-heading"
                className="rounded-card border border-line bg-white p-6"
              >
                <h2 id="payment-heading" className="text-xl font-bold text-ink">
                  Payment
                </h2>
                <p className="mt-3 text-ink-muted">
                  No payment step exists in this build. Submitting this form
                  creates a local demo confirmation only.
                </p>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28 rounded-card border border-line bg-surface p-6">
                <h2 className="mb-4 text-xl font-bold text-ink">Order summary</h2>
                <ul className="space-y-3">
                  {state.items.map((item) => (
                    <li key={item.product.id} className="flex gap-3">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-line bg-white">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.altText?.[0] ?? item.product.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium text-ink">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-ink-muted">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-bold text-ink">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <dl className="mt-4 space-y-2 border-t border-line pt-4">
                  <div className="flex justify-between gap-4 text-ink">
                    <dt>Subtotal</dt>
                    <dd>{formatPrice(state.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between gap-4 text-ink-muted">
                    <dt>Delivery</dt>
                    <dd className="text-right text-sm">Not configured</dd>
                  </div>
                  <div className="flex justify-between gap-4 text-ink-muted">
                    <dt>Tax</dt>
                    <dd className="text-right text-sm">Not configured</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-line pt-2 text-lg font-bold text-ink">
                    <dt>Total</dt>
                    <dd>{formatPrice(state.subtotal)}</dd>
                  </div>
                </dl>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  aria-describedby="checkout-demo-note"
                  className="mt-5 h-12 w-full rounded-card bg-brand text-white hover:bg-brand-hover"
                >
                  {isProcessing ? "Creating demo order…" : "Place demo order"}
                </Button>

                <p
                  id="checkout-demo-note"
                  className="mt-3 text-center text-xs text-ink-muted"
                >
                  No payment will be taken. No stock is reserved.
                </p>

                <p aria-live="polite" className="sr-only">
                  {isProcessing ? "Creating your demo order." : ""}
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

type FieldProps = {
  id: CheckoutField;
  label: string;
  value: string;
  error?: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  placeholder?: string;
  className?: string;
};

function Field({
  id,
  label,
  value,
  error,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  className,
}: FieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(inputClass, error && "border-[#b91c1c]")}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-[#b91c1c]">
          {error}
        </p>
      )}
    </div>
  );
}
