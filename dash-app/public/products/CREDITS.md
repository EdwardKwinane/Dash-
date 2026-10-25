# Product image provenance and licensing — `public/products/`

This folder holds catalogue imagery that has been **verified against the exact
named product** and **license-checked** for use and redistribution in this
project. Every file here must have a row in this record. The catalogue loads
assets from this folder by path (`/products/<file>.jpg` — see
`src/lib/data/products.ts`); the automated guardrails in
`src/lib/data/products.test.ts` verify that every local catalogue image exists
here.

## Replacement policy (summary)

An image may replace a catalogue entry only when *both* hold:

1. **Exact-model identity is verified** — e.g. visible model code, in-frame
   product placard, or an unambiguous source record; never from a
   similar-looking device.
2. **Permitted use is established from a verifiable license** — a product
   page displaying an image, or a public URL, is not itself permission.

## Assets in this folder

| File | Product (slug) | Depicts (what was visually verified) | Source organization & original page | Author | License | Modifications made |
|---|---|---|---|---|---|---|
| `samsung-galaxy-s25-ultra.jpg` | Samsung Galaxy S25 Ultra (`samsung-galaxy-s25-ultra`) | Exact model confirmed in-frame: rear view in Titanium Silverblue; demo-unit sticker reads **SM-S938B/DS 256GB** (the official S25 Ultra model code) with S/N and IMEI; retail placard reads "Galaxy S25 Ultra"; S Pen on display pad; "NOVINKA 2025" retailer signage; photo EXIF dated 2025-02-21 (post-launch) | Wikimedia Commons — <https://commons.wikimedia.org/wiki/File:Samsung_Galaxy_S25_Ultra.jpg> (original 3317×2488) | Jakub CA (Commons user) | **CC BY 4.0** — <https://creativecommons.org/licenses/by/4.0/> (commercial use, sharing, adaptation permitted with attribution) | Downscaled to 1600 px JPEG (quality 82); EXIF/XMP/IPTC metadata segments removed; no pixel content otherwise altered remotely from that re-encode |
| `logitech-mx-master-3s.jpg` | Logitech MX Master 3S (`logitech-mx-master-3s`) | Sculpted right-handed MX Master body verified visually: thumb-rest scallop, dual thumb buttons, "logi" branding, dynamic Magspeed-style wheel, textured grips; uploader's photo series explicitly captioned "Logitech MX Master 3S"; EXIF dated 2025-10-10 (3S shipped 2024) | Wikimedia Commons — <https://commons.wikimedia.org/wiki/File:Logitech_MX_Master_3S_HS02.jpg> (original 6000×4000, Nikon D7100) | Hayden Schiff (Commons user `IagoQnsi`) | **CC BY 4.0** — <https://creativecommons.org/licenses/by/4.0/> | Downscaled to 1600 px JPEG (quality 82); EXIF/XMP/IPTC segments removed; pixels otherwise unaltered |

### Attribution obligation (CC BY 4.0)

If this catalogue were published publicly while these files are in use, the
following credit lines must accompany the imagery (e.g. in a visible credits/
about page, or a per-image caption):

- Product image: *"Samsung Galaxy S25 Ultra"* © Jakub CA / Wikimedia Commons,
  CC BY 4.0 (cropped/resized).
- Product image: *"Logitech MX Master 3S"* © Hayden Schiff / Wikimedia Commons,
  CC BY 4.0 (cropped/resized).

License texts must be provided to recipients (public repo hosting of this
record satisfies the source-disclosure part of the terms). No endorsement may
be implied.

### Remaining uncertainty (recorded honestly)

- The MX Master 3S photo is a deliberate "3S" photo series by the uploader,
  but the 3S body is visually near-identical to the earlier MX Master 3;
  discrimination rests on the uploader's caption and the 2024+ time frame,
  not on visually dichotomous hardware features.
- The Samsung photo is an in-store hand-held shot; it reads as authentic demo
  imagery and is used in a build that discloses everywhere that the catalogue
  is seeded sample data.

## Catalogue images *not* in this folder (status of record)

The remaining four products still serve remote Unsplash-hosted demo imagery
(host allowlisted in `next.config.ts`). Their status:

| Product | Status |
|---|---|
| Apple MacBook Pro 14" M4 | Photo is a lit-Apple-logo MacBook — brand correct, exact model unverifiable. Replacement deferred. |
| Sony WH-1000XM5 | Generic over-ear headphones — type correct, model unverifiable. Deferred. |
| Apple iPad Air 11" M3 | Earlier iPad Pro with Apple Pencil — brand correct, model unverifiable. Deferred. |
| Dell XPS 13 Plus | **Confirmed mismatch** (photo is an Apple MacBook, not a Dell). No verifiable asset found: Wikimedia Commons has zero photos of the XPS 13 Plus (9320) — searches for "XPS 13 Plus" / "XPS 9320" returned 0 hits; the "Dell XPS 13 9350" file is the later 9350 model line, a different product. Dell/retailer product images carry no redistribution license (manufacturer press imagery is not free to reuse). Deferred pending an owner-provided or verifiably licensed asset of the 9320. |

Unsplash images are used under the Unsplash License (free commercial use; the
host is the pre-existing choice for this demo catalogue — see
`PROJECT_CONTEXT.md` §5 and ADR-013).
