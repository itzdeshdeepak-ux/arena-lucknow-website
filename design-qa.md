# Design QA — Arena Animation, Indira Nagar, Lucknow

Review date: 4 November 2026. Scope: responsive local branch website prototype with national course research and WhatsApp handoff.

## Findings

No actionable P0, P1 or P2 findings remain in the reviewed prototype. The selected VFS visual language has been adapted to Arena's branch homepage, rather than duplicating VFS's single-program claims or branding.

## Visual truth and comparison evidence

- Reference URL: https://vfs.edu/programs/3D-animation-vfx
- Source capture: `qa/reference-desktop.jpg`.
- Implementation: http://127.0.0.1:4173/ and `qa/desktop.jpg`.
- Both desktop captures: 1280 × 800 pixels, 1280 × 800 CSS viewport, 1:1 captured density. State: initial desktop homepage, closed dialogs, top of page. Browser chrome excluded. No density resampling was needed.
- Full-view comparison: `qa/desktop-comparison.jpg`, 2560 × 800, reference left and implementation right. Opened and reviewed together.
- Focused type/action comparison: `qa/typography-comparison.jpg`, 1680 × 300. Opened and reviewed to assess headline weight, wrapping and square split-arrow controls.
- Full implementation page: `qa/full-page.jpg`, 1280 × 6151. Reviewed for section rhythm, card grids, image crops, local information, FAQs and footer.
- Additional desktop states: `qa/catalogue-desktop.jpg`, `qa/course-desktop.jpg`, `qa/curriculum-desktop.jpg`, `qa/enquiry-desktop.jpg`.
- Mobile: 390 × 844 CSS/pixel viewport, captured 1:1 in `qa/mobile.jpg`, `qa/catalogue-mobile.jpg` and `qa/enquiry-mobile.jpg`.
- Additional layout checks: 320 × 800 and 768 × 1024 CSS viewports. No horizontal document overflow observed. Temporary viewport override reset before handoff.

## Required fidelity surfaces

1. **Fonts and typography:** Arial/Helvetica sans-serif reproduces the reference's restrained typography and strong white display heading. Headline wrapping is deliberately adapted to the branch message. Labels, body text and course details remain readable at desktop and mobile sizes; no clipped headings or truncated controls observed.
2. **Spacing and layout rhythm:** Preserves full-width cinematic opening, white header, sticky section navigation and square controls. The Arena header is 84px versus approximately 60px in the reference to accommodate the supplied logo and branch identity. The branch catalogue uses a three-column desktop grid and single-column mobile cards; section spacing remains consistent across the full-page review.
3. **Colors and tokens:** White and warm neutral content surfaces with Arena-compatible red actions (`#a52a32`) adapt the reference's red/white hierarchy. Hero text sits over a dark image treatment. Selected categories, focus states and expanded controls are distinct. WhatsApp uses a recognizable green treatment.
4. **Image quality and assets:** Original generated 3D observatory/robot hero replaces VFS footage, using cinematic warm highlights and cool shadows. The optimized WebP is sharp in the actual hero slot. Arena's logo and official discipline illustrations render without failed images or distortion. Illustrations are not labelled as local student work. Phosphor icons provide UI symbols; no handcrafted image substitutes were used.
5. **Copy and content:** Branch name and user-supplied WhatsApp number are accurate. Catalogue contains 43 researched national courses and 94 term/module summaries. Local availability, fees and batches are framed for confirmation. Source conflicts for AR-021, AR-042 and AR-007 remain explicitly handled. No invented awards, placement statistics, local address or staff claims. Enquiry preparation clearly states that it has not yet been submitted.

## Intentional adaptations

- A local branch homepage with a searchable multi-course catalogue replaces VFS's single-program landing page.
- Arena identity and supplied contact details replace VFS identity and claims.
- Original still imagery replaces a showreel; no VFS film or awards are reused.
- Course detail dialogs provide curricula, tools, career examples and admission guidance without adding unrequested page routes.
- Google Sheets capture is a pending production integration. This prototype prepares a message and opens WhatsApp; it does not claim to save or submit a lead.

## Comparison and correction history

- **P2: prepared enquiry keyboard focus.** Location: enquiry dialog after preparing a message. Earlier state left focus outside the useful prepared-message controls. Fix: focus the Continue on WhatsApp link after preparation, and restore the name field on Edit. Retest on desktop and 390px mobile confirmed focus on the intended control; prepared-state visual evidence is `qa/enquiry-desktop.jpg`.
- **P2: phone format acceptance.** Location: enquiry phone input. Strengthened the browser pattern to accept an Indian 10-digit mobile number with optional 91/+91 prefix. Retest rejected `----------`, accepted `+91 9999999999`, and retained the required contact-consent step. Form layout remained intact in `qa/enquiry-mobile.jpg`.
- Rechecked the final hero against the same-size reference in `qa/desktop-comparison.jpg` after replacing the PNG with optimized WebP. No new visual issues observed.

## Interaction and browser verification

- Catalogue opens with six featured courses; Show all reveals 43. VFX category returns three courses. Blender software/name search returns seven. No-result state and reset work.
- Course details open correctly; curriculum accordions expand; course navigation scrolls the heading below sticky controls. Settled curriculum heading top was 188px with sticky navigation ending at 122.5px.
- Course enquiry prefills the selected program. Required name, phone and consent validation work. Prepare, review and edit preserve entered information.
- Generated WhatsApp URL targets `916390006309` and includes the selected course. No external WhatsApp message was sent during testing, and no Google Sheet was written.
- Native dialogs close with Escape and restore trigger focus. Mobile navigation opens/closes; FAQ disclosure exposes its expanded state.
- No failed images or document overflow at the reviewed widths. No application console errors observed; external VFS reference errors were identified by their VFS URLs and excluded from the local-app result.
- Production build passed. Sites worker packaging succeeded and its four routing/static-serving tests passed.

## Implementation checklist

- [x] Review same-size source and implementation together, including focused typography/action crops.
- [x] Verify desktop, mobile and smaller-width layouts.
- [x] Verify primary course discovery and enquiry journey.
- [x] Resolve and retest identified P2 issues.
- [x] Keep the local preview running and open for handoff.

## Follow-up polish and launch inputs

- P3: replace the illustrative hero with a client-approved showreel or approved student work when available.
- Confirm local course availability, exact address, fees, batches and approved branch photography before production launch.
- Connect enquiry storage to a private response Sheet or server-side integration. No live storage is included in this reviewed prototype.

## Enquiry database update — 4 November 2026

The earlier Google Sheets integration limitation above describes the original build. It is now resolved for the local prototype: the existing form saves through `/api/enquiry` and the published Google Form into the private linked response Sheet. WhatsApp follows a confirmed save as an optional action.

- Browser test response reference: `ARL-eaeded25-196e-4fae-b107-b8820b5dd7f3`.
- Connector readback of `Form responses 1!A1:I4` confirmed exactly one test response with all nine expected columns. No real prospective student data or WhatsApp message was sent.
- Database metadata and Google-rendered sharing state confirmed private owner-only response access. Input collection is public; response data is not public.
- Updated mobile evidence: `qa/enquiry-saved-mobile.jpg` and `qa/enquiry-connected-mobile.jpg`, both 390 × 844 pixels/CSS viewport at 1:1 density. The previous and current empty form with Master in Blender selected were compared together in `qa/enquiry-update-comparison.jpg` (780 × 844). Headline, field spacing, tokens and square controls match; introductory copy, button text and save notice intentionally change. Both forms fit the viewport. At 390px, document width is 390px and dialog scroll width is 358px. Desktop success layout was also inspected in the browser; success focus lands on Continue on WhatsApp. The updated copy accurately distinguishes saved enquiries from optional WhatsApp contact.
- Native Sheet evidence: `qa/leads-sheet.jpg` and `qa/leads-sheet-details.jpg`. Wrapped cells and resized authored columns resolve the default clipped test-name/message values; native table and form link are preserved.
- Server tests cover complete field mapping, invalid data and consent rejection, cross-origin rejection, literal formula-like text, upstream validation/closed-form responses and timeout. All four new enquiry tests plus four existing worker tests passed. Production build and Sites packaging passed.
- No actionable P0/P1/P2 issue remains in this update. Hosting remains local; production deployment and client account sharing have not been requested or performed.

## Micro animation update — 4 November 2026

- Added a finite hero entrance, staggered once-only section/card reveals, button/arrow feedback, mobile menu and dialog entrances, FAQ/curriculum content fades, and enquiry loading/success feedback. Timing ranges from 180ms interaction feedback to 560–700ms entrances; the hero image settles once over 1400ms.
- Source for this incremental update: `qa/desktop.jpg`. Final rendered evidence: `qa/motion-desktop.jpg`. Both show the homepage at scroll position zero, 1280 × 800 CSS/pixel viewport at 1:1 density. Opened and compared together in `qa/motion-comparison.jpg` (2560 × 800).
- Typography, settled spacing/layout rhythm, red/white tokens, image crop/quality, and copy remain consistent with the approved branch design. Motion changes the transitions between states, not the final composition. No actionable P0/P1/P2 visual findings.
- Browser verification confirmed `arena-rise` and `arena-hero-settle` on the hero. VFX filtering still returned three courses; sampled entering cards had opacity 0.943/0.868 and vertical transforms 0.90px/2.11px, demonstrating the staggered reveals in the actual browser.
- Enquiry modal opens with `arena-dialog-enter`; fields remain accessible and focus stays in the native dialog. No real enquiry was submitted during this update.
- At 390 × 844, mobile navigation opens with `arena-rise`, closes when navigating, and the FAQ disclosure opens with the same short content entrance. Document width was 390px without overflow. Evidence: `qa/motion-mobile.jpg`.
- Reduced-motion behavior was reviewed in CSS and JavaScript: CSS effects are confined to `prefers-reduced-motion: no-preference`; the reveal hook skips/cancels motion when the preference requests reduction; programmatic section navigation also respects it. OS preference switching was not emulated in this browser run. Content has no persistent hidden/reveal-required state.
- Application console error check was empty. Production build, worker packaging and all eight existing enquiry/worker tests passed. Temporary viewport override reset; preview kept open.

## Placement brochure showcase — 4 November 2026

### Source and scope

Source: https://www.arena-multimedia.com/placement-brochure/2026/index.html — Arena Animation Talent & Placement Showcase 2026–27, 46 pages. Original page artwork was opened and reviewed at `work/placement-brochure/pages/11.webp`, `13.webp` and `17.webp`. The supplied brochure is the factual/portrait source; the existing branch website remains the visual style reference. This is an adaptation into the site's design, rather than a reproduction of the print page layout.

| Person | Role | Employer | Reported annual package | Source page |
| --- | --- | --- | --- | --- |
| Shreyosi Mondal | 3D Character Artist | Lakshya Digital | ₹4.80 LPA | 11 |
| Harshwardhan | 3D Animator | Addverb Technologies | ₹6.29 LPA | 13 |
| Mandeep Kaur | Graphics Designer | WNS | ₹7.80 LPA | 17 |
| Anirban Sarkar | 3D Character Artist | Little Red Zombies | ₹3.60 LPA | 11 |
| Sagar Gowda | Unreal Engine Artist | Pithra | ₹4.80 LPA | 13 |
| Sai Krishna | Video Editor | Star Sports | ₹6.00 LPA | 17 |

Examples are explicitly labelled as national Arena network placements. No Indira Nagar outcome claims or fresher claims derived from the separate Star Alumni section are introduced.

### Evidence and fidelity

- Implementation: http://127.0.0.1:4173/#placements. The direct hash link now resolves after React mounts, and the section begins at 156px beneath the desktop sticky navigation.
- Desktop screenshot: `qa/placements-desktop.jpg`, 1280 × 800 pixels/CSS viewport at 1:1 density. Full-page browser evidence: `qa/placements-full-page.jpg`, 1280 × 7472. The entire 1280 × 1333 placement region is saved in `qa/placements-section.jpg`; its visible section bounds were verified against the rendered background to avoid capture-offset differences.
- Mobile: `qa/placements-mobile.jpg` and `qa/placements-brochure-mobile.jpg`, 390 × 844. The complete brochure action, cover and new-tab notice are visible and readable. Also checked 320 × 800 and the 805 × 827 tablet viewport.
- **Typography:** existing Arial/Helvetica headings and body styles retained; card names use the existing semibold hierarchy. Long names fit at 320px after the compact layout adjustment.
- **Layout/spacing:** three desktop columns, two tablet columns and one phone column. Square cards and a restrained brochure callout match the established branch design. No document or card overflow remained at the verified widths.
- **Colors:** existing Arena red, warm neutral background, white cards and muted text tokens are reused. No new visual theme introduced.
- **Image fidelity:** public page images are unmodified originals; CSS crops only the relevant person's portrait. All six visible portraits match their source records. Seven placement-section images loaded successfully. Crop adjustments remove adjacent brochure lettering without creating or replacing faces.
- **Copy/content:** names, roles, employers and annual packages were checked against the full-resolution source pages. The year is 2026–27 as printed on the cover, despite the URL directory being 2026. National-network source labelling and LPA explanation are visible.

### Corrections and verification

- **P2, tablet overflow:** adding the placement tab widened the 805px section-navigation content beyond the document. Fixed with a horizontally scrollable tablet section menu and the compact header menu at 761–920px. Retest: document width 805px; the 927px menu content scrolls inside its 805px container.
- **P2, 320px name fit:** Harshwardhan exceeded the name column. Added safe wrapping and a compact 64px portrait/20px heading layout below 360px. Retest: document width 320px, no placement-card overflow.
- **P2, initial section hash:** a fresh `#placements` link initially loaded before its React target existed. Added a mount-time anchor resolution. Fresh page and reload tests now land at the placement section with the correct sticky offset.
- Clicked a card's actual external link and verified the new tab at `#p=13`, page field `13/46`. Clicked Explore full brochure and verified a separate new tab at `#p=1`, page field `1/46`. All six card links use the verified page hashes, `_blank` targets and `noopener noreferrer`.
- Mobile menu navigates to Placements and closes correctly. The 390px layout has one 342px card column. The brochure button remains a full-width touch target on phones. Existing micro animations include the new cards and brochure callout and retain reduced-motion support.
- Final desktop document width 1280px, all six cards at opacity 1, no card overflow, and no application console errors. Production build and worker packaging passed. Existing eight enquiry/worker tests passed; no real lead submissions or sharing changes were performed.
- No actionable P0/P1/P2 finding remains. Preview remains local, with no deployment requested.

## Section order adjustment — 4 November 2026

Moved the existing `#experience` introduction immediately after `.feature-story` and before `#placements`, as requested in the browser comment. Browser readback confirmed those adjacent sections, one introduction instance, and no horizontal document overflow at 805 × 827. The existing anchor remains functional. Visual evidence: `qa/section-order-update.jpg`. Production build and worker packaging passed. This is an order-only change with no new content or styling.

## SEO and course guide update — 4 November 2026

Configured the user-confirmed https://arenalucknow.in domain and pre-rendered the homepage plus 43 course guides. The existing course-detail design is reused for standalone URLs; normal homepage card clicks still open their original dialogs. A collapsed syllabus directory links to all guides without changing the approved section order.

- Browser verified Master in Blender at `/courses/master-in-blender/` with its unique title, correct production canonical, description and EducationalOrganization/WebSite/WebPage/Course data. The preview correctly remains noindex. Evidence: `qa/seo-metadata.json`.
- Standalone guide verified at 805 × 827 without horizontal overflow. Mobile viewport 390 × 844 also had a 390px document width. Evidence: `qa/seo-course-desktop.jpg` and `qa/seo-course-mobile.jpg`.
- Existing Arial typography, white/red tokens, course imagery, curriculum sections, sticky navigation and enquiry styling are reused. New related-guide links follow the same square-border layout. No new factual claims, unconfirmed address or ratings were introduced.
- Course enquiry opened with Master in Blender preselected; no response was submitted. All courses returns to the homepage catalogue. The homepage's regular Animation with Unreal Engine card click still opens its native course dialog with pathname `/` retained.
- Syllabus directory opens and exposes 43 ordinary course links; the 805px layout has no document overflow.
- All 13 SEO, worker and enquiry checks passed. They inspect all 44 generated pages, canonical/sitemap agreement, readable HTML before JavaScript, unique titles, one H1 per page, parseable structured data, omitted conflicting durations, preview noindex controls, redirects and true 404 behavior. Final build and hosting packaging passed.
- Browser application/hydration error and warning checks were empty. Temporary viewport override reset and the course preview kept open.
- Full street address, PIN, hours and Google Business Profile remain unconfirmed. No Search Console, rich-result eligibility or live-domain publication is represented as completed. Details and launch steps are in `seo-review.md`.

final result: passed
