import { describe, expect, it } from "vitest";
import {
  EMPTY_CHECKOUT_FORM,
  SA_PROVINCES,
  createOrderReference,
  hasCheckoutErrors,
  isValidPostalCode,
  isValidSaPhone,
  validateCheckout,
  type CheckoutFormData,
} from "@/lib/validation";

const validForm: CheckoutFormData = {
  email: "shopper@example.co.za",
  firstName: "Thandi",
  lastName: "Mokoena",
  address: "12 Loop Street",
  city: "Cape Town",
  province: "Western Cape",
  postalCode: "8001",
  phone: "082 123 4567",
};

describe("validateCheckout", () => {
  it("accepts a complete South African delivery address", () => {
    expect(validateCheckout(validForm)).toEqual({});
    expect(hasCheckoutErrors(validateCheckout(validForm))).toBe(false);
  });

  it("reports every required field on an empty form", () => {
    const errors = validateCheckout(EMPTY_CHECKOUT_FORM);

    expect(Object.keys(errors).sort()).toEqual(
      [
        "address",
        "city",
        "email",
        "firstName",
        "lastName",
        "phone",
        "postalCode",
        "province",
      ].sort(),
    );
  });

  it("rejects malformed email addresses", () => {
    for (const email of ["not-an-email", "a@b", "a@b.", "a b@c.co.za"]) {
      expect(validateCheckout({ ...validForm, email }).email).toBeTruthy();
    }
  });

  it("requires a known South African province", () => {
    expect(
      validateCheckout({ ...validForm, province: "Atlantis" }).province,
    ).toMatch(/province/i);
    expect(SA_PROVINCES).toHaveLength(9);
  });

  it("requires a four-digit postal code", () => {
    expect(validateCheckout({ ...validForm, postalCode: "800" }).postalCode).toBeTruthy();
    expect(validateCheckout({ ...validForm, postalCode: "80011" }).postalCode).toBeTruthy();
    expect(validateCheckout({ ...validForm, postalCode: "0000" }).postalCode).toBeUndefined();
  });

  it("trims whitespace before checking required fields", () => {
    const errors = validateCheckout({ ...validForm, firstName: "   " });
    expect(errors.firstName).toBeTruthy();
  });
});

describe("phone and postal helpers", () => {
  it.each([
    "0821234567",
    "082 123 4567",
    "+27 82 123 4567",
    "0027821234567",
  ])("accepts %s", (phone) => {
    expect(isValidSaPhone(phone)).toBe(true);
  });

  it.each(["12345", "08212345678", "082123456", "abc"])(
    "rejects %s",
    (phone) => {
      expect(isValidSaPhone(phone)).toBe(false);
    },
  );

  it("validates postal codes", () => {
    expect(isValidPostalCode(" 8001 ")).toBe(true);
    expect(isValidPostalCode("800")).toBe(false);
    expect(isValidPostalCode("ABCD")).toBe(false);
  });
});

describe("createOrderReference", () => {
  it("creates a clearly labelled demo reference", () => {
    expect(createOrderReference(() => 0)).toBe("DASH-DEMO-000000");
    expect(createOrderReference(() => 0.5)).toMatch(/^DASH-DEMO-[A-Z0-9]{6}$/);
    expect(createOrderReference()).toMatch(/^DASH-DEMO-[A-Z0-9]{6}$/);
  });

  it("does not imply a payment identifier", () => {
    expect(createOrderReference(() => 0.25)).not.toMatch(/PAY|TXN|ORDER/i);
  });
});
