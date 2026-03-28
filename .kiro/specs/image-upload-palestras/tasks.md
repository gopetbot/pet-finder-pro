# Implementation Plan: image-upload-palestras

## Overview

Replace the Google Drive image ID field with a direct Cloudinary upload pipeline. The browser compresses the image, uploads it to Cloudinary, and persists the `secure_url` in Firestore. The public area consumes `imageUrl` directly, removing all `driveImage.ts` dependencies.

## Tasks

- [x] 1. Install dependencies
  - Run `npm install browser-image-compression` in `pet-finder-pro/`
  - Run `npm install --save-dev fast-check` in `pet-finder-pro/`
  - _Requirements: 2.1, 2.3, Testing Strategy_

- [x] 2. Update CI/CD and environment configuration
  - [x] 2.1 Add `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` to the `env:` block of the `npm ci && npm run build` step in both workflow files:
    - `pet-finder-pro/.github/workflows/firebase-hosting-merge.yml`
    - `pet-finder-pro/.github/workflows/firebase-hosting-pull-request.yml`
  - Add the two new secrets alongside the existing `VITE_FIREBASE_*` entries
  - _Requirements: 1.1_

- [x] 3. Create `src/services/storageService.ts`
  - [x] 3.1 Implement `uploadPalestraImage(file: File): Promise<string>`
    - Validate `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` are defined; throw descriptive error if missing
    - Validate `file.type` is one of `image/jpeg`, `image/png`, `image/webp`; throw before any network call if invalid
    - Call `imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 1200, useWebWorker: true })`
    - Build `FormData` with `file`, `upload_preset`, and `folder: "palestras"`
    - `fetch` POST to `https://api.cloudinary.com/v1_1/{cloudName}/image/upload`
    - Throw `Error("Upload falhou: HTTP {status}")` if `!response.ok`
    - Return `data.secure_url`
    - _Requirements: 1.1, 1.3, 1.4, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 3.2 Write property test for upload request body invariant (P1)
    - **Property 1: Upload request body invariant**
    - For any valid image file (JPEG/PNG/WebP), the `FormData` sent to Cloudinary must contain `upload_preset` equal to `VITE_CLOUDINARY_UPLOAD_PRESET` and `folder` equal to `"palestras"`
    - Use `fc.record({ name: fc.string(), type: fc.constantFrom("image/jpeg","image/png","image/webp") })` to generate files; mock `fetch` to capture the `FormData`
    - **Validates: Requirements 1.3, 3.2**

  - [x] 3.3 Write property test for upload returns secure_url (P3)
    - **Property 3: Upload returns secure_url**
    - For any valid image file and a simulated HTTP 200 response containing a `secure_url`, `uploadPalestraImage` must return exactly that `secure_url` as a non-empty string
    - Use `fc.webUrl()` for the simulated `secure_url`; mock `fetch` to return it
    - **Validates: Requirements 3.1, 3.3**

  - [x] 3.4 Write property test for invalid file type rejection (P4)
    - **Property 4: Invalid file type rejection**
    - For any file whose `type` is not in `{ "image/jpeg", "image/png", "image/webp" }`, `uploadPalestraImage` must throw before making any network call
    - Use `fc.string()` filtered to exclude valid MIME types; assert `fetch` is never called
    - **Validates: Requirements 3.5**

  - [x] 3.5 Write unit tests for storageService edge cases
    - Test: throws descriptive error when `VITE_CLOUDINARY_CLOUD_NAME` is undefined
    - Test: throws descriptive error when `VITE_CLOUDINARY_UPLOAD_PRESET` is undefined
    - Test: throws when Cloudinary responds with HTTP 500
    - _Requirements: 1.4, 3.4_

- [x] 4. Checkpoint — Ensure all storageService tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Update `PalestraCard.tsx` and `Palestra` interface
  - [x] 5.1 Update `PalestraCard.tsx`
    - Replace `driveImageId: string` with `imageUrl: string` in the `Palestra` interface
    - Remove `import { getDriveImageUrl } from "@/lib/driveImage"`
    - Change `<img src={getDriveImageUrl(palestra.driveImageId)} ...>` to `<img src={palestra.imageUrl} loading="lazy" alt={palestra.titulo} ...>`
    - _Requirements: 7.1, 7.2, 7.3, 8.2_

  - [x] 5.2 Write property test for PalestraCard render invariant (P8)
    - **Property 8: PalestraCard render invariant**
    - For any `Palestra` object with a valid `imageUrl`, `PalestraCard` must render an `<img>` with `src` equal to `palestra.imageUrl` and `loading="lazy"`
    - Use `fc.record({ imageUrl: fc.webUrl(), titulo: fc.string(), palestrante: fc.string(), data: fc.string(), resumo: fc.string(), id: fc.string() })`
    - **Validates: Requirements 7.1, 7.2**

- [x] 6. Update `AdminPalestras.tsx`
  - [x] 6.1 Remove `driveImageId` from schema and form
    - Remove `driveImageId` from the `Palestra` interface and `PalestraFormData` type
    - Remove `driveImageId: z.string().trim().min(1, ...)` from `palestraSchema`
    - Remove the `<Label>` + `<Input id="driveImageId">` field from the JSX
    - _Requirements: 4.1, 8.1_

  - [x] 6.2 Add file input with local preview
    - Add `useRef<HTMLInputElement>(null)` for the file input
    - Add `useState<string>("")` for the preview URL
    - Add `<input type="file" accept="image/jpeg,image/png,image/webp" ref={fileRef}>` with an `onChange` handler that calls `URL.createObjectURL` and sets the preview state
    - Render `<img src={previewUrl}>` when `previewUrl` is non-empty
    - Add `useState<string>("")` for a file validation error message; display it below the input
    - _Requirements: 4.1, 4.2_

  - [x] 6.3 Wire `uploadPalestraImage` into `handleAddPalestra`
    - Add `useState<boolean>(false)` for `isUploading`
    - In `handleAddPalestra`: validate `fileRef.current?.files?.[0]` exists; if not, set file error message and return early
    - Set `isUploading(true)` before calling `uploadPalestraImage(file)`
    - Await `uploadPalestraImage(file)` to get `imageUrl`
    - Call `addDoc` with `{ ...formData, imageUrl, createdAt: serverTimestamp() }` (no `driveImageId`)
    - Set `isUploading(false)` in `finally`; reset preview and file input on success
    - Disable submit button while `isUploading`; show `<Loader2>` + "A otimizar e enviar imagem..." label during upload
    - _Requirements: 3.1, 5.1, 5.2, 5.3, 6.1, 6.2, 6.3, 6.4_

- [x] 7. Delete legacy files
  - Delete `src/lib/driveImage.ts`
  - Delete `src/lib/driveImage.test.ts`
  - _Requirements: 8.2_

- [x] 8. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests use `fast-check` with a minimum of 100 iterations (`numRuns: 100`)
- Each property test must include the tag `// Feature: image-upload-palestras, Property {N}: {título}`
- P2 (compression output constraints) is not covered by property tests — it requires integration with `browser-image-compression` internals and is validated via manual testing
- P5, P6, P7 (AdminPalestras component properties) are not included as separate tasks — they are covered by the unit tests in task 6 and the integration between tasks 3 and 6
