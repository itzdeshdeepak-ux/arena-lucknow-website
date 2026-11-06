# Arena Animation — Indira Nagar, Lucknow

Website source for the Arena Animation Indira Nagar branch in Lucknow. Intended domain: https://arenalucknow.in. Branch enquiries: +91 63900 06309.

## Included

- Responsive homepage and 43 individual course guides, with unique thumbnails.
- Three background hero videos with fixed text, playback controls and reduced-motion support.
- Scholarship enquiry page and national placement highlights linked to Arena’s official brochure.
- Admission and scholarship forms with server validation and separate Google Forms feeding the existing private lead workbook.
- Optional WhatsApp follow-up after the enquiry is saved.
- Pre-rendered pages, canonical metadata, social previews, structured data and sitemap.
- Hostinger PHP deployment and a separate Sites/Cloudflare Worker deployment.

## Local setup

Use Node.js 22.12 or later in the Node 22 series and pnpm 10 or later. Install pnpm using its official installation instructions if needed.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by Vite. Local enquiry submissions use the real Google Forms integration: use mocked automated tests for routine checks instead of sending test leads.

## Build and verify

```sh
pnpm build
node --test tests/seo.test.mjs tests/enquiry.test.mjs tests/scholarship.test.mjs tests/course-images.test.mjs tests/sites-worker.test.mjs
```

The build generates 45 indexable pages plus the 404 page. `dist/client` contains the frontend; `dist/server/index.js` contains the Sites Worker. Generated output is ignored by Git.

## Publish on Hostinger

```sh
pnpm build:hostinger
```

Back up the existing WordPress files and database before replacing it. Upload the contents of `dist/hostinger` into the domain’s `public_html`, including `.htaccess` and `api/`. Hostinger needs PHP 8.2+ with cURL and Apache/LiteSpeed rewrite support. Static frontend files alone cannot save enquiries.

Full instructions: [Hostinger publishing guide](hosting/HOSTINGER-PUBLISHING.md).

DNS must point to the hosting provider actually serving the site. The Sites deployment and Hostinger upload are separate deployment routes; this repository does not automatically publish when pushed to GitHub.

## Enquiries and privacy

The server endpoints `/api/enquiry` and `/api/scholarship` submit to fixed published Google Forms, which append responses to a private Google Sheet. No Google password, OAuth token or service-account key is required in this repository. Lead records are not included.

Keep the Forms accepting responses and their English recorded-response confirmation unchanged. Changing field IDs requires synchronized changes in `worker/index.js` and `hosting/hostinger/api/enquiry.php`. General admissions and scholarship enquiries use separate Forms/tabs. Only confirmed Google responses show success to the visitor.

The private workbook and Form editor links appear in the internal Hostinger publishing guide. Share this repository only with intended project collaborators. Repository access does not itself grant access to the Google Sheet.

## Editing the website

- `src/Prototype.jsx`: homepage.
- `src/CourseDetail.jsx` and `src/CoursePage.jsx`: course guides.
- `src/research.json`: published national course research and curriculum.
- `src/course-images.json`: unique artwork and alternative text for each course.
- `src/Enquiry.jsx` and `src/ScholarshipPage.jsx`: enquiry experiences.
- `src/seo.js`: domain, metadata and structured data.
- `src/surfaces.css`: shared 4px rounded corners.
- `worker/index.js`: Sites API and routing.
- `hosting/hostinger/`: PHP APIs and hosting rules.
- `public/assets/`: logo, optimized images and original supplied hero videos.
- `asset-sources/course-thumbnails.json`: artwork provenance and illustration directions.

## Before launch

Confirm local course availability, fees, batch dates, exact street address and approved branch claims. Scholarship wording is up to 35%, depending on the selected course and scholarship exam marks. Placement examples are from Arena’s national network, not verified branch placement outcomes.

The pre-launch review identified missing security response headers, limited application-level spam protection and dependency advisories in Vite/source-map-js. These were identified but are not fixed in this snapshot. Update the affected tools, add appropriate browser protections and rate limiting/bot checks, and retest before the final launch. The current form-size limit in the Worker is checked after the body has been buffered; bounded streaming is a further hardening item.

## Repository handoff

Create a private repository named `arena-lucknow-website` in the intended GitHub account or organization. Add collaborators explicitly through GitHub access settings. Keep the repository private unless the owner approves public release. Do not commit lead exports, `.env` files, hosting backups, access tokens or `node_modules`.

This package is a clean source snapshot prepared on 6 November 2026 from source revision `c2232d9578c4fb7d9a68ec110ba0f18e58aba99a`. It includes all required media. Future changes must be committed and pushed; neither GitHub nor Hostinger is automatically linked to updates made in a separate local copy.

## Asset provenance

Course content is researched from Arena’s national website. Images include Arena course/brochure artwork and original illustrative artwork. Franchise brand and asset permissions must be confirmed by the client. No open-source license is granted by this source handoff.
