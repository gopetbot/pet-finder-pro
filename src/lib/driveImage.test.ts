import { describe, it, expect } from "vitest";
import { extractDriveId, getDriveImageUrl } from "./driveImage";

const TEST_ID = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs";
const BASE_URL = "https://drive.google.com/uc?export=view&id=";

describe("getDriveImageUrl", () => {
  it("returns correct URL for a pure ID", () => {
    expect(getDriveImageUrl(TEST_ID)).toBe(`${BASE_URL}${TEST_ID}`);
  });

  it("returns correct URL for a /file/d/{id}/view link", () => {
    const link = `https://drive.google.com/file/d/${TEST_ID}/view`;
    expect(getDriveImageUrl(link)).toBe(`${BASE_URL}${TEST_ID}`);
  });

  it("returns correct URL for an /open?id={id} link", () => {
    const link = `https://drive.google.com/open?id=${TEST_ID}`;
    expect(getDriveImageUrl(link)).toBe(`${BASE_URL}${TEST_ID}`);
  });

  it("round-trip: extractDriveId then getDriveImageUrl equals getDriveImageUrl(link)", () => {
    const link = `https://drive.google.com/file/d/${TEST_ID}/view`;
    const extractedId = extractDriveId(link);
    expect(getDriveImageUrl(extractedId)).toBe(getDriveImageUrl(link));
  });
});

describe("extractDriveId", () => {
  it("extracts ID from /file/d/{id}/view", () => {
    expect(extractDriveId(`https://drive.google.com/file/d/${TEST_ID}/view`)).toBe(TEST_ID);
  });

  it("extracts ID from /file/d/{id} (no trailing /view)", () => {
    expect(extractDriveId(`https://drive.google.com/file/d/${TEST_ID}`)).toBe(TEST_ID);
  });

  it("extracts ID from /open?id={id}", () => {
    expect(extractDriveId(`https://drive.google.com/open?id=${TEST_ID}`)).toBe(TEST_ID);
  });
});
