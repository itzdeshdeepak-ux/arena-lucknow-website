# Publish Arena Lucknow on your existing Hostinger website

Public address: https://arenalucknow.in

## What you upload

Upload **Arena-Lucknow-Hostinger-Upload.zip**. It contains the finished homepage, scholarship enquiry page, 43 course guides, images, styles, animations, placement brochure links, SEO files and the PHP enquiry connection to the existing private Google Sheet. No Node server, build command, MySQL database or Google password is needed on the host.

This package is for Hostinger **PHP/HTML web or cloud hosting**, with PHP 8.2 or newer and the cURL extension enabled. It is not an import file for Hostinger Website Builder or a WordPress theme. If the current website uses Website Builder and has no File Manager, use Hostinger's PHP/HTML website option or ask support to move the domain to that hosting setup before replacing anything.

## Replace the old website

1. In Hostinger hPanel, open **Websites → arenalucknow.in → Manage site → File Manager**. Check that you are editing this domain's files.
2. **Back up first.** Download the old website files, including hidden `.htaccess`. If it is WordPress or another database website, take a database backup too. Keep the backup outside `public_html` so it can be restored. Also keep a list of valuable old page URLs: this new build does not invent redirects for unknown old URLs.
3. Select a current PHP version (8.2+) in PHP Configuration and enable **cURL**. Confirm SSL is active for the domain. This package uses HTTPS for admissions and Google submissions.
4. Move the previous website files out of `public_html` into a backup folder **outside** the web root. Preserve any Hostinger-managed `.well-known` certificate directory. The previous `index.php`, `default.php`, WordPress rewrite rules and old `.htaccess` must not compete with the new files. Replace the old `.htaccess` with the one supplied here.
5. Upload **Arena-Lucknow-Hostinger-Upload.zip** into this domain's `public_html` and extract its **contents directly there**. You should see `public_html/index.html`, `public_html/.htaccess`, `public_html/assets/`, `public_html/courses/` and `public_html/api/enquiry.php`. Do not leave them inside an extra `dist`, `hostinger` or ZIP-name folder. Show hidden files to confirm `.htaccess` was extracted. Remove the uploaded ZIP after extraction.
6. Clear Hostinger/CDN caches, then open https://arenalucknow.in in a private browser window. Because the same domain remains on the same hosting, DNS normally stays as it is. Change DNS only if your actual hosting location is changing.

## Check after upload

- Homepage images, navigation, course dialogs and mobile menu work.
- https://arenalucknow.in/courses/master-in-blender/ opens directly and still works after refresh.
- Submit **one clearly labelled TEST / no callback required** enquiry using a phone number you control, with consent. Check the new row in the private Sheet, including name, phone, course, qualification, message, consent and reference. The browser must only show success after Google confirms the save. Open WhatsApp to check the destination; sending a message is optional.
- Private response Sheet: https://docs.google.com/spreadsheets/d/1-8MLmVposDBnN2B8vJdoqQue8Hb-JZdtz7LACBKw7iA/edit
- Open https://arenalucknow.in/scholarship/ and check that a labelled scholarship enquiry lands in **Scholarship Enquiries**, while general admissions still go to **Form responses 1**. Both PHP handlers (`api/enquiry.php` and `api/scholarship.php`) and the supplied `.htaccess` must be uploaded.
- https://arenalucknow.in/sitemap.xml contains 45 public URLs. https://arenalucknow.in/robots.txt names that sitemap. Submit it in your Google Search Console account after launch.
- https://www.arenalucknow.in redirects to HTTPS on arenalucknow.in once both hostnames have working DNS and SSL. An unknown URL returns the custom 404, with HTTP status 404. Old course URLs that differ from these new paths need individual redirect decisions.

Temporary Hostinger domains are intentionally noindex and their robots file blocks crawling. The canonical domain is **arenalucknow.in** throughout.

## If something fails

- Homepage unchanged: check the chosen domain, extraction depth, old `index.php`/`default.php`, and host/CDN cache.
- Form errors: PHP + cURL must run and the host must allow outbound HTTPS to `docs.google.com`. The Google Form must remain published, accepting responses, with its English default confirmation. Keep the question IDs unchanged. No success message is shown for an unconfirmed save; WhatsApp remains available. A Google timeout can leave the save uncertain, so check the Sheet/reference before retrying.
- HTTP 500 immediately: restore the previous version if needed, then check Hostinger's error log or ask support to confirm Apache/LiteSpeed rewrite and header support for the supplied `.htaccess`.

## Maintenance

The upload ZIP is the production build, not the editable source project. To rebuild later, run `pnpm build` then `node scripts/package-hostinger.mjs` in the source project and ZIP the contents of `dist/hostinger`, including `.htaccess`. Never upload `node_modules`, research work, test scripts or account data to `public_html`.

The private Sheet is the lead database; this package does not create a MySQL database. The PHP handler preserves the existing consent, validation, formula-safe field values, honeypot and recorded-response confirmation checks. There is no persistent rate limiting or transactional deduplication. The website files have been checked locally; a live Hostinger enquiry test is still required after upload.

Hostinger's upload guide: https://www.hostinger.com/support/how-to-upload-a-website-from-backups/
