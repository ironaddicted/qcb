# Analytics and lead tracking

The public site is a single-page React app with a one-step quote inquiry form.
`index.html` loads one Google tag script using Ads ID `AW-16582460982` and
initializes the Ads destination. `src/main.tsx` initializes the GA4 destination
once through `src/analytics.ts`. The GA4 measurement ID defaults to
`G-XMQGDWGHL2`; `VITE_GA4_MEASUREMENT_ID` can override it at build time.
An explicitly empty or invalid override disables GA4. There is no hostname,
consent, or development-mode suppression in this project.

| Event | Trigger | Parameters |
| --- | --- | --- |
| `section_view` | Named section visibly in view for one second, once per page load | `section_name` |
| `estimate_step_view` | Inquiry form visibly in view for one second | `form_id=estimate`, `form_version=short_inquiry`, `step_name=quick_inquiry`, `step_number=1` |
| `estimate_start` | First actual change to a quote field, once per form | Form and step details |
| `estimate_submit` | Inquiry endpoint returns 2xx HTTP success | Form and step details |
| `quote_cta_click` | Quote CTA link clicked | `placement`, `link_url=#estimate` |
| `phone_click` | Telephone CTA clicked | `placement`, `link_url=tel:+17047509110` |
| `text_click` | SMS CTA clicked | `placement`, `link_url=sms:+17047509110` |

Existing `contact_click`, `generate_lead`, `estimate_validation_error`,
`estimate_submit_attempt`, and `estimate_submit_error` remain for historical
reporting. The existing Google Ads conversion fires only after HTTP success.
There is one current estimator step; historical six-step events may still appear
in reports. Same-page `#estimate` navigation retains Google Ads and UTM query
parameters. The inquiry uses a fetch POST, not a route change.

## Browser verification

Load the deployed site in a fresh browser, then check DevTools Network for the
Google tag script and GA requests with `tid=G-XMQGDWGHL2`. Check GA4 Realtime
or DebugView for that same stream. If Realtime stays empty, inspect the deployed
bundle's ID, browser blocking, and whether the live deployment uses this build.
The repository does not identify the live deployment or prove the cause of zero
users.

On a local development server, add `?analytics_debug` to the URL. The browser
console shows `[GA4 event]` entries and GA4 receives `debug_mode=true`.
Production has no debug logging.

1. Load the landing page: expect standard GA4 `page_view` and automatic events.
2. Scroll to the inquiry and wait one second: expect `estimate_step_view` with
   `quick_inquiry` and step 1. A rerender should not repeat it.
3. Click a quote CTA: expect `quote_cta_click`. Change a form field: expect
   `estimate_start` once. Clicking the CTA alone must not start the estimate.
4. Click Call Us: expect `phone_click`. Click Text Kitchen Photos: expect
   `text_click`, each with its `link_url`.
5. Submit invalid values or simulate a failed POST locally: expect no
   `estimate_submit`. A real successful inquiry should send one
   `estimate_submit`, one retained `generate_lead`, and the Ads conversion.
   Avoid sending fake leads to the production endpoint.

In GA4 Admin, register event-scoped dimensions for `placement`, `section_name`,
`form_id`, `form_version`, `step_name`, and `step_number` if useful.
Mark `estimate_submit`, `phone_click`, and `text_click` as key events only
after verification. `estimate_start` and `quote_cta_click` are funnel events.
Generic automatic `click` is not a lead. If `generate_lead` is already a key
event, review it before also marking `estimate_submit` so a submission is not
counted twice as a primary lead.
