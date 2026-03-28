import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";

vi.mock("browser-image-compression", () => ({
  default: vi.fn(async (file: File) => file),
}));

describe("storageService", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_CLOUDINARY_CLOUD_NAME", "test-cloud");
    vi.stubEnv("VITE_CLOUDINARY_UPLOAD_PRESET", "test-preset");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  // Feature: image-upload-palestras, Property 1: Upload request body invariant
  it("P1 — FormData must contain upload_preset and folder=palestras for any valid image file", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string(),
          type: fc.constantFrom(
            "image/jpeg" as const,
            "image/png" as const,
            "image/webp" as const
          ),
        }),
        async ({ name, type }) => {
          let capturedFormData: FormData | null = null;

          vi.stubGlobal(
            "fetch",
            vi.fn(async (_url: string, init?: RequestInit) => {
              capturedFormData = init?.body as FormData;
              return {
                ok: true,
                json: async () => ({ secure_url: "https://res.cloudinary.com/test/image/upload/v1/palestras/test.jpg" }),
              };
            })
          );

          const file = new File(["dummy"], name || "image", { type });

          const { uploadPalestraImage } = await import("./storageService");
          await uploadPalestraImage(file);

          expect(capturedFormData).not.toBeNull();
          expect((capturedFormData as unknown as FormData).get("upload_preset")).toBe("test-preset");
          expect((capturedFormData as unknown as FormData).get("folder")).toBe("palestras");
        }
      ),
      { numRuns: 100 }
    );
  });
  // Validates: Requirements 1.3, 3.2

  // Feature: image-upload-palestras, Property 3: Upload returns secure_url
  it("P3 — uploadPalestraImage must return exactly the secure_url from the HTTP 200 response", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string(),
          type: fc.constantFrom(
            "image/jpeg" as const,
            "image/png" as const,
            "image/webp" as const
          ),
          secureUrl: fc.webUrl(),
        }),
        async ({ name, type, secureUrl }) => {
          vi.stubGlobal(
            "fetch",
            vi.fn(async () => ({
              ok: true,
              json: async () => ({ secure_url: secureUrl }),
            }))
          );

          const file = new File(["dummy"], name || "image", { type });

          const { uploadPalestraImage } = await import("./storageService");
          const result = await uploadPalestraImage(file);

          expect(result).toBe(secureUrl);
          expect(result.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
  // Validates: Requirements 3.1, 3.3

  // Unit test: throws when VITE_CLOUDINARY_CLOUD_NAME is missing
  // Validates: Requirements 1.4, 3.4
  it("throws descriptive error when VITE_CLOUDINARY_CLOUD_NAME is undefined", async () => {
    vi.stubEnv("VITE_CLOUDINARY_CLOUD_NAME", "");
    const file = new File(["dummy"], "image.jpg", { type: "image/jpeg" });
    const { uploadPalestraImage } = await import("./storageService");
    await expect(uploadPalestraImage(file)).rejects.toThrow("VITE_CLOUDINARY_CLOUD_NAME");
  });

  // Unit test: throws when VITE_CLOUDINARY_UPLOAD_PRESET is missing
  // Validates: Requirements 1.4, 3.4
  it("throws descriptive error when VITE_CLOUDINARY_UPLOAD_PRESET is undefined", async () => {
    vi.stubEnv("VITE_CLOUDINARY_UPLOAD_PRESET", "");
    const file = new File(["dummy"], "image.jpg", { type: "image/jpeg" });
    const { uploadPalestraImage } = await import("./storageService");
    await expect(uploadPalestraImage(file)).rejects.toThrow("VITE_CLOUDINARY_UPLOAD_PRESET");
  });

  // Unit test: throws when Cloudinary responds with HTTP 500
  // Validates: Requirements 1.4, 3.4
  it("throws when Cloudinary responds with HTTP 500", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, status: 500 }))
    );
    const file = new File(["dummy"], "image.jpg", { type: "image/jpeg" });
    const { uploadPalestraImage } = await import("./storageService");
    await expect(uploadPalestraImage(file)).rejects.toThrow("HTTP 500");
  });

  // Feature: image-upload-palestras, Property 4: Invalid file type rejection
  it("P4 — uploadPalestraImage must throw before making any network call for any invalid file type", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string().filter(type => !["image/jpeg", "image/png", "image/webp"].includes(type)),
        async (invalidType) => {
          const mockFetch = vi.fn();
          vi.stubGlobal("fetch", mockFetch);

          const file = new File(["dummy"], "image", { type: invalidType });

          const { uploadPalestraImage } = await import("./storageService");
          await expect(uploadPalestraImage(file)).rejects.toThrow();

          expect(mockFetch).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 100 }
    );
  });
  // Validates: Requirements 3.5
});
