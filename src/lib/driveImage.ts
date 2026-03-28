/**
 * Extracts the Google Drive file ID from any Drive URL format.
 * Supported formats:
 *   - /file/d/{id}/view
 *   - /file/d/{id}
 *   - /open?id={id}
 *   - Any drive.google.com URL containing the ID
 */
export function extractDriveId(link: string): string {
  // /file/d/{id}/view or /file/d/{id}
  const fileMatch = link.match(/\/file\/d\/([^/?&#]+)/);
  if (fileMatch) return fileMatch[1];

  // /open?id={id} or ?id={id}
  const idMatch = link.match(/[?&]id=([^&]+)/);
  if (idMatch) return idMatch[1];

  // Fallback: return the input as-is (treat as raw ID)
  return link;
}

/**
 * Returns a direct-view Google Drive image URL.
 * Accepts either a raw Drive file ID or any drive.google.com link.
 * Pure function — no side effects.
 */
export function getDriveImageUrl(idOrLink: string): string {
  const id = idOrLink.includes("drive.google.com")
    ? extractDriveId(idOrLink)
    : idOrLink;

  return `https://drive.google.com/uc?export=view&id=${id}`;
}
