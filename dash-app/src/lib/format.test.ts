import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/format";

describe("formatPrice", () => {
  it("formats whole rand amounts with two decimals", () => {
    expect(formatPrice(0)).toBe("R0.00");
    expect(formatPrice(100)).toBe("R1.00");
    expect(formatPrice(149900)).toBe("R1,499.00");
  });

  it("formats the seeded catalogue prices", () => {
    expect(formatPrice(2999900)).toBe("R29,999.00");
    expect(formatPrice(3999900)).toBe("R39,999.00");
  });

  it("keeps cents and adds thousands separators", () => {
    expect(formatPrice(123456)).toBe("R1,234.56");
    expect(formatPrice(100000000)).toBe("R1,000,000.00");
  });

  it("rounds fractional cents instead of emitting invalid currency", () => {
    expect(formatPrice(1499.6)).toBe("R15.00");
  });

  it("handles negative and non-finite input safely", () => {
    expect(formatPrice(-12345)).toBe("-R123.45");
    expect(formatPrice(Number.NaN)).toBe("R0.00");
  });
});
