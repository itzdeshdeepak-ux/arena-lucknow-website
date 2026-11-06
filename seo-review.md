# SEO setup — Arena Animation, Indira Nagar, Lucknow

Prepared for **https://arenalucknow.in**, confirmed by the user on 4 November 2026. These changes are implemented in the local preview and production build; no domain deployment or Search Console submission was performed.

## Implemented

- Homepage title: **Arena Animation Indira Nagar Lucknow | Animation & VFX**.
- Homepage description: Explore animation, VFX, gaming and design courses at Arena Animation, Indira Nagar, Lucknow. View syllabuses and contact our admission counsellor.
- Unique titles, descriptions and absolute canonical URLs for the homepage, scholarship enquiry page and all 43 course guides.
- Open Graph and Twitter preview metadata, using the existing original hero artwork and accurate descriptive alternative text.
- `en-IN` document language and visible Lucknow course context in the homepage introduction.
- EducationalOrganization, WebSite and WebPage structured data, with the supplied branch telephone number and confirmed city/region. Course pages include Course data with Arena's national organization as provider; local availability remains subject to confirmation.
- A crawlable syllabus directory links to all 43 course pages. Ordinary course-card clicks retain the existing pop-up experience; opening the links in another tab or visiting a course URL loads its full standalone guide.
- The build pre-renders 45 pages with readable HTML, including curricula, tools, eligibility and career information. Search engines do not have to click controls to find the course information. This follows [Google's JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
- A root `sitemap.xml` contains the 45 canonical page URLs. `robots.txt` points to it and excludes the enquiry API. [Google recommends fully qualified canonical URLs in sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- Production routing supports course pages, canonical trailing slashes, HTTPS/apex redirects and real 404 responses. Unknown URLs no longer return a successful homepage response.
- Preview hosts remain unindexable. The production build is indexable on `arenalucknow.in`; the local development server and temporary preview domains use noindex controls.

## Content and keyword focus

The homepage targets the branch name, Indira Nagar/Lucknow, animation courses, VFX courses, gaming and design. Individual course pages target their actual program/tool names with Lucknow context, such as Blender, Unreal Engine, UI UX design and video editing. The site does not add unsupported “best institute,” placement guarantees, fabricated fees, ratings or local placement claims.

The two provisional course records with conflicting/incomplete information omit structured durations. National placement examples retain their source labels and links.

## Validation

- Production build and hosting package generated successfully.
- All **13 checks passed**, including inspection of every generated page for unique metadata, canonical URLs, single H1, parseable structured data and readable content.
- Sitemap URLs match the generated pages exactly; each program is linked from the homepage directory.
- Production-routing checks cover a real course page, redirects, missing pages and preview noindex behavior.
- Browser checks confirmed correct metadata, functioning course links, pop-up browsing, standalone navigation and a prefilled course enquiry. No real enquiry was submitted.
- No application or hydration errors were observed in the browser. Course-page mobile width was checked at 390px without document overflow.
- Google URL Inspection and Rich Results Test were not represented as completed; the new site has not been deployed to the confirmed domain in this chat.

## Remaining launch details

1. Supply the exact street address and PIN code, confirmed business hours and the branch's Google Business Profile/Maps link. These are needed to finish precise local-business information; none were invented. The current organization markup is not a claim of LocalBusiness rich-result eligibility. See [Google's local business documentation](https://developers.google.com/search/docs/appearance/structured-data/local-business).
2. Publish the complete production package to the confirmed domain, including its enquiry server route.
3. Verify the domain in Google Search Console, submit `https://arenalucknow.in/sitemap.xml`, and inspect the homepage plus representative course pages after publication.

## Maintenance

Course data and URL generation live in `src/catalog.js`; metadata, structured data and the sitemap live in `src/seo.js`. The public hostname check is also in `worker/index.js`. If changing domains, update both and rerun the SEO checks. `node scripts/build.mjs` regenerates the pages and hosting package. The enquiry route remains server-side and no Google credentials are placed in the generated HTML.
