# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Deploy to Apache / Ubuntu

Run `npm run build` and upload the complete contents of `dist/` to the site's
document root, preserving subdirectories. The build includes:

```text
dist/
  index.html
  cost-estimator/
    index.html
  assets/
    ...
```

The estimator has its own static HTML entry so Apache can serve
`/cost-estimator/` using its normal `DirectoryIndex index.html` behavior.
Apache normally redirects `/cost-estimator` to `/cost-estimator/`; both paths
are recognized by the app. No SPA rewrite or `.htaccess` is required for this
route. Upload the HTML entries and matching assets from the same build.

If the homepage works but the estimator returns Apache's “Not Found” page,
verify that `cost-estimator/index.html` was uploaded beneath the same document
root as the working homepage. Uploading only the root `index.html` is insufficient.
