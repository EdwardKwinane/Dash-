/**
 * Checkout validation for the demo order flow.
 *
 * Only data needed to describe a delivery is collected. No card numbers, CVVs,
 * identity numbers or other payment credentials are requested anywhere.
 */

export const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
] as const;

export type SaProvince = (typeof SA_PROVINCES)[number];

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
}

export type CheckoutField = keyof CheckoutFormData;
export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

export const EMPTY_CHECKOUT_FORM: CheckoutFormData = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  phone: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Accept the common South African formats:
 * 0821234567, 082 123 4567, +27 82 123 4567, 0027821234567.
 */
export function isValidSaPhone(value: string): boolean {
  const compact = value.replace(/[\s()\-]/g, "");
  if (/^0\d{9}$/.test(compact)) return true;
  if (/^\+27\d{9}$/.test(compact)) return true;
  if (/^0027\d{9}$/.test(compact)) return true;
  return false;
}

export function isValidPostalCode(value: string): boolean {
  return /^\d{4}$/.test(value.trim());
}

export function validateCheckout(data: CheckoutFormData): CheckoutErrors {
  const errors: CheckoutErrors = {};
  const required = (field: CheckoutField, message: string) => {
    if (data[field].trim() === "") errors[field] = message;
  };

  required("email", "Enter your email address.");
  if (!errors.email && !EMAIL_PATTERN.test(data.email.trim())) {
    errors.email = "Enter a valid email address, for example name@example.co.za.";
  }

  required("firstName", "Enter your first name.");
  required("lastName", "Enter your last name.");
  required("address", "Enter your street address.");
  required("city", "Enter your city or town.");

  required("province", "Select your province.");
  if (
    !errors.province &&
    !SA_PROVINCES.includes(data.province.trim() as SaProvince)
  ) {
    errors.province = "Select a South African province from the list.";
  }

  required("postalCode", "Enter your postal code.");
  if (!errors.postalCode && !isValidPostalCode(data.postalCode)) {
    errors.postalCode = "Enter a 4-digit postal code.";
  }

  required("phone", "Enter your phone number.");
  if (!errors.phone && !isValidSaPhone(data.phone)) {
    errors.phone = "Enter a valid South African phone number.";
  }

  return errors;
}

export function hasCheckoutErrors(errors: CheckoutErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Demo order reference. It is deliberately prefixed with DASH-DEMO so it can
 * never be mistaken for a payment or fulfilment identifier.
 */
export function createOrderReference(random: () => number = Math.random): string {
  const value = Math.floor(random() * 36 ** 6)
    .toString(36)
    .toUpperCase()
    .padStart(6, "0");
  return `DASH-DEMO-${value}`;
}
