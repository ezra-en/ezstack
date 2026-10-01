import { afterEach, describe, expect, it } from "vitest";
import { getAllowedOrigins, getExtraOrigins } from "../convex/lib/origins";

const original = { ...process.env };

afterEach(() => {
  process.env = { ...original };
});

describe("getExtraOrigins", () => {
  it("splits, trims, and drops empty entries", () => {
    process.env.CORS_ORIGINS = " https://a.example , https://b.example ,, ";
    expect(getExtraOrigins()).toEqual(["https://a.example", "https://b.example"]);
  });

  it("returns an empty array when unset", () => {
    delete process.env.CORS_ORIGINS;
    expect(getExtraOrigins()).toEqual([]);
  });
});

describe("getAllowedOrigins", () => {
  it("includes SITE_URL, extras and localhost, de-duplicated", () => {
    process.env.SITE_URL = "https://app.example";
    process.env.CORS_ORIGINS = "https://app.example, https://old.example";
    expect(getAllowedOrigins()).toEqual([
      "https://app.example",
      "https://old.example",
      "http://localhost:3000",
    ]);
  });

  it("still allows localhost when no site URL is set", () => {
    delete process.env.SITE_URL;
    delete process.env.CORS_ORIGINS;
    expect(getAllowedOrigins()).toEqual(["http://localhost:3000"]);
  });
});
