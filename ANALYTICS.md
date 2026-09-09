# Visitor journey tracking

## Enable reporting

The existing AW-16582460982 tag is a Google Ads destination. Journey events
are routed separately to a Google Analytics 4 web stream.

1. The site defaults to web stream `G-XMQGDWGHL2`. To override it, set
   `VITE_GA4_MEASUREMENT_ID=G-...` in `.env.local` locally or in the
   production build environment. An explicitly empty value disables tracking.
2. Rebuild and deploy. Vite embeds this public ID at build time.
3. In GA4 Admin > Custom definitions, create event-scoped dimensions for
   `section_name`, `form_id`, `step_name`, and `step_number`.
4. Check Realtime/DebugView with a test visit, then create an Explore > Funnel
   exploration using the events below. Custom dimensions can take 24–48 hours
   to become available in reports.

With an empty or invalid measurement ID override, journey tracking is disabled. The existing
Google Ads conversion continues to fire only after a successful submission.
Only `generate_lead` should be designated a lead key event; section views,
step views, and submit attempts are not leads. Disable GA4 enhanced-measurement
form interactions if enabled, or exclude its automatic form events from these
reports; this custom wizard uses the explicit events below.

## Events

| Event | Meaning / parameters |
| --- | --- |
| `section_view` | `section_name`: introduction, inspiration_gallery, process, reviews, estimate_form, general_information |
| `estimate_step_view` | A form screen was visible; `form_id`, `step_name`, `step_number` |
| `estimate_start` | First interaction with a form input or button per page load |
| `estimate_step_complete` | Validated Next action from a screen |
| `estimate_validation_error` | Validation blocked progress; no entered values included |
| `estimate_submit_attempt` | Valid submission request started |
| `estimate_submit_error` | Request failed or returned a non-success HTTP status |
| `generate_lead` | Server returned HTTP success; `form_id=estimate` |

A view requires one continuous second in a visible browser tab, with at least
half the element or one quarter of the usable viewport visible, whichever is
smaller. The fixed 80px header is excluded. Sections count once per page load.
Form screens count once per appearance, including returning with Back, so the
event sequence preserves the last screen actually viewed. Simply rendering the
offscreen form does not count as reaching it. A view indicates exposure, not
proof that the person read the content.

| Step number | Step name |
| --- | --- |
| 1 | project_dimensions |
| 2 | existing_backsplash |
| 3 | tile_material |
| 4 | tile_pattern |
| 5 | contact_information |
| 6 | review |

## Reports

- Section reach: use `section_view`, break down by `section_name`, and count
  users. People can jump directly to the form, so do not require them to view
  every earlier section in a closed funnel.
- Form funnel: use `estimate_step_view` filtered by each step name, ending in
  `generate_lead`. Use indirectly followed steps. Solid-panel visitors skip
  tile_pattern intentionally: use a main funnel 1 → 2 → 3 → 5 → 6 → success,
  and inspect the pattern branch separately.
- Drop-off: inspect the last `estimate_step_view` in a session without
  `generate_lead`. This is inferred abandonment after the session ends, not an
  unreliable browser-close event. A visitor may return later. Use event order
  rather than the highest step number, because visitors can go Back.
- Traffic origin: break reports down by GA4 Session source / medium or Session
  campaign. Use tagged campaign URLs, for example
  `?utm_source=newsletter&utm_medium=email&utm_campaign=fall`, and preserve these
  parameters through redirects. GA4 handles attribution; form values are never
  added to the custom event payloads.

## Verification

With a configured test stream, load the top of the page and wait one second:
only introduction should register. Scroll or jump to each section and verify
its name. A quick pass or hidden tab should not qualify. Reach the form, use
Next and Back, and check actual screen names. Test solid panels to verify the
pattern screen is absent. Invalid fields and failed POSTs must not generate a
lead or Google Ads conversion; a successful POST should generate each once.
Analytics being unavailable must not prevent submission. Do not submit fake
leads to the production endpoint; mock the endpoint for these checks.

References:
- https://developers.google.com/tag-platform/gtagjs/routing
- https://support.google.com/analytics/answer/14240153
- https://support.google.com/analytics/answer/9327974
