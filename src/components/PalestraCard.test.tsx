// Feature: image-upload-palestras, Property 8: PalestraCard render invariant
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import * as fc from "fast-check";
import { PalestraCard } from "./PalestraCard";
import PalestraCardSource from "./PalestraCard?raw";

/**
 * Validates: Requirements 7.1, 7.2
 *
 * Property 8: PalestraCard render invariant
 * For any Palestra with a valid imageUrl, PalestraCard must render an <img>
 * with src === palestra.imageUrl and loading === "lazy".
 */
describe("PalestraCard", () => {
  it("P8: renders img with src=imageUrl and loading=lazy for any valid Palestra", () => {
    fc.assert(
      fc.property(
        fc.record({
          imageUrl: fc.webUrl(),
          titulo: fc.string(),
          palestrante: fc.string(),
          data: fc.string(),
          resumo: fc.string(),
          id: fc.string(),
        }),
        (palestra) => {
          const { container } = render(<PalestraCard palestra={palestra} />);
          const img = container.querySelector("img");
          expect(img).not.toBeNull();
          expect(img!.getAttribute("src")).toBe(palestra.imageUrl);
          expect(img!.getAttribute("loading")).toBe("lazy");
        }
      ),
      { numRuns: 100 }
    );
  });

  it("does not reference getDriveImageUrl or driveImageId", () => {
    expect(PalestraCardSource).not.toContain("getDriveImageUrl");
    expect(PalestraCardSource).not.toContain("driveImageId");
  });
});
