# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-07-21
- Primary product surfaces: `index.html` single-page personal introduction
- Evidence reviewed: `index.html`, `profile.jpg`, `Eschocolat.png`, `README.md`, `CNAME`, current desktop browser render, Ghost-backed writing and `/now` content, public GitHub profile

## Brand
- Personality: curious, thoughtful, quietly ambitious, personal rather than corporate
- Trust signals: real portrait, specific writing, active `/now` log, direct external profiles, honest work-in-progress language
- Avoid: portfolio-template cards, résumé inflation, generic gradients, vague “passionate developer” copy, decorative motion that hides content
- Avoid (copy): dossier/archive cosplay (“PERSONAL FILE 001”, “FIG. 01”), headings that announce their own depth (“저를 이루는 세 가지 동사”), aphorisms in place of plain statements, and repeating a slogan in more than one place. Say the ordinary thing.
- Location: Jihoon does not want a city or region attributed to him anywhere on the site.

## Product goals
- Goals: explain who Jihoon is within one viewport; connect software, writing, and taste as one coherent practice; make Blog and contact actions obvious; retain live content without making it a dependency
- Non-goals: exhaustive résumé, project-management dashboard, deep technical case studies, visual imitation of the prior deep-sea experience
- Success signals: visitors can state Jihoon’s role and point of view after the hero; latest writing and contact are reachable without hunting; the page remains useful when remote APIs or JavaScript fail

## Personas and jobs
- Primary personas: potential collaborators, peers, readers, friends-of-friends
- User jobs: understand who Jihoon is, sample his writing, see what he is doing now, find the right way to reach him
- Key contexts of use: shared link on mobile, profile follow-through on desktop, quick scan from social or GitHub

## Information architecture
- Primary navigation: About, Writing, Now, Contact
- Core routes/screens: one page plus outbound Blog, `/now`, GitHub, LinkedIn, X, email
- Content hierarchy: identity and thesis → three practices → selected writing → current focus → invitation to connect

## Design principles
- Principle 1: Meaning before atmosphere. Identity and value proposition remain visible without interaction.
- Principle 2: A personal site should feel authored. Use editorial composition, specific language, and one memorable visual device.
- Tradeoffs: compress the prior immersive scroll in favor of clarity and re-readability; keep personality through rhythm, typography, and tactile details.

## Visual language
- Color: warm paper, near-black ink, Eschocolat coral red, acid chartreuse as a small live-status accent
- Typography: expressive Korean serif for statements, sturdy Korean sans for reading, condensed mono labels for structure
- Spacing/layout rhythm: editorial 12-column grid, hard rules, oversized type, deliberate asymmetry
- Shape/radius/elevation: mostly square, paper-like borders, minimal radius, no generic floating cards
- Motion: short page-entry sequence, restrained image and link hover, scroll reveal as progressive enhancement only
- Imagery/iconography: the existing monochrome portrait, cropped like an editorial contact sheet; typographic arrows rather than icon libraries

## Components
- Existing components to reuse: portrait asset, logo asset as social preview, Ghost Content API fallback pattern, social/contact destinations
- New/changed components: masthead, hero statement, portrait contact sheet, practice ledger, writing index, now dispatch, contact footer
- Variants and states: external-link hover/focus, live/fallback content state, navigation open state on small screens
- Token/component ownership: CSS custom properties and component styles remain local to `index.html`

## Accessibility
- Target standard: WCAG 2.2 AA where applicable
- Keyboard/focus behavior: visible high-contrast focus, semantic links/buttons, dismissible mobile navigation
- Contrast/readability: solid ink/paper palette and minimum body size; color is not the sole status signal
- Screen-reader semantics: landmarks, ordered headings, useful image alt text, live content updates are not announced noisily
- Reduced motion and sensory considerations: disable reveal, marquee, and transforms under `prefers-reduced-motion`; all content stays visible

## Responsive behavior
- Supported breakpoints/devices: 360px mobile through wide desktop
- Layout adaptations: 12-column desktop collapses to one column; oversized type clamps; portrait moves below the thesis; writing rows stack cleanly
- Touch/hover differences: hover decoration is additive; all controls have adequate tap targets and no hover-only content

## Interaction states
- Loading: static fallback writing and now copy render immediately
- Empty: static fallback remains if Ghost returns no usable content
- Error: remote request failures are silent and never remove useful content
- Success: fetched writing and now content replace fallback without layout collapse
- Disabled: not applicable
- Offline/slow network, if applicable: local content and assets remain complete; remote fonts fall back to serif/sans/mono families

## Content voice
- Tone: direct, warm, observant, lightly playful
- Terminology: “software engineer”, “writer”, “making”, “recording”, “taste”, “now”
- Core identity (Jihoon's own framing): not “몰입하는 사람” but “좋아하는 것을 자기 방식으로 구현하는 사람”. The arc is 좋아함 → 깊이 → 구현 → 가치 → 리듬. Avoid leading with “몰입” — he finds it abstract and job-descriptiony. “가치 있게 만든다” means reinterpretation (clearer, more human, less clutter, lasting), not adding features.
- Microcopy rules: prefer concrete verbs and first person; no inflated claims; Korean first with compact English labels as editorial metadata

## Implementation constraints
- Framework/styling system: dependency-free static HTML/CSS/JavaScript on GitHub Pages
- Design-token constraints: reuse the existing coral identity color; all new values use CSS custom properties
- Performance constraints: no framework or new package; one existing local portrait; remote fonts are non-blocking
- Compatibility constraints: modern evergreen browsers with graceful fallback when `fetch`, `IntersectionObserver`, or view transitions are unavailable
- Test/screenshot expectations: validate HTML, links, console, desktop and mobile viewport screenshots, keyboard/focus, reduced-motion behavior

## Open questions
- [x] Replace placeholder WIP labels with named projects when Jihoon wants to publish them / Jihoon / resolved 2026-07-21: workbench items now mirror the themes of the live `/now` page (sustainable focus, daily writing, shipping publicly) instead of invented placeholders
- [ ] Refresh the `/now` page itself — the source was last updated 2025-10-28, so the section's fallback date is ~21 months stale / Jihoon / affects credibility of the Now section
- [ ] Add a Korean/English language switch only if an international audience becomes a primary persona / Jihoon / affects copy and layout width
