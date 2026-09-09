# Charlotte service ZIP boundaries

Input: src/service-area-zips.json (69 ZIP codes).
Exported: 66 ZIP areas, 77 polygon features; 426,427 bytes.

Import charlotte-service-zip-boundaries.kml in Google My Maps: Add layer > Import.

Source: U.S. Census Bureau, 2020 ZCTA cartographic boundaries, 1:500,000.
https://www2.census.gov/geo/tiger/GENZ2020/kml/cb_2020_us_zcta520_500k.zip

ZCTAs approximate ZIP areas and are not official USPS delivery boundaries. The original polygon geometry, including holes, is preserved. Disconnected parts are separate features for My Maps compatibility.

## ZIP codes without a matching Census boundary

No boundary was invented for these codes. Some ZIP codes, such as PO Box-only codes, do not have a ZCTA; absence here does not establish an individual ZIP code's type.

- 28026 — Concord, NC
- 28093 — Lincolnton, NC
- 28111 — Monroe, NC
