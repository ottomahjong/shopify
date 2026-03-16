# Changelog — Otto Mahjong Shopify Theme

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] — 2026-03-16

### Initial Release — Full Theme Build

#### Assets
- `assets/style.css` — Complete design-system stylesheet: CSS custom properties for the full Otto
  color palette (ink, bone, warm-white, walnut family, stone, night, forest, accent, linen),
  typography scale (Cormorant Garamond + Futura/Jost stack), layout utilities, and all component
  styles (header, footer, hero, product grid, cart, FAQ accordion, waitlist form, etc.)
- `assets/script.js` — Vanilla JS IIFE module: announcement-bar dismiss with localStorage,
  scroll-triggered sticky header, mobile nav with focus-trap and Escape-close, IntersectionObserver
  scroll-reveal, FAQ accordion with ARIA and arrow-key navigation, waitlist form async submit,
  Shopify Ajax cart count, add-to-cart with feedback states, variant selector, product image gallery,
  product tabs, cart quantity steppers, and smooth scroll.
- `assets/otto-logo.svg` — Brand wordmark SVG.

#### Layout
- `layout/theme.liquid` — Full HTML shell: locale meta, theme-color, Google Fonts preconnect for
  Cormorant Garamond, `content_for_header`, inline CSS custom-property block driven by
  `settings_schema` color/type settings, `style.css` link, skip-to-content landmark, conditional
  announcement bar, header section, `<main>` with `content_for_layout`, footer section,
  cart-notification live region, and `script.js` tag.

#### Sections — Core Layout
- `sections/announcement-bar.liquid` — Dismissible top bar with configurable text, link,
  background/text colors, and close button.
- `sections/header.liquid` — Sticky-capable site header with logo (image or SVG fallback), up-to-5
  nav links, cart icon with count badge, hamburger toggle, and inline mobile drawer menu with
  sub-links and overlay.
- `sections/footer.liquid` — Multi-column footer: brand column with logo/tagline/social icons,
  configurable link columns (up to 8 links each), newsletter signup, and legal row with copyright
  and policy links.

#### Sections — Homepage
- `sections/hero-split.liquid` — Split-panel hero: left dark panel with heading, subhead, eyebrow,
  and inline waitlist form; right light panel with 8-slot tile image grid.
- `sections/brand-story.liquid` — Editorial brand narrative with large heading, em-word highlight,
  three body paragraphs, four design-pillar callouts, and two story blocks.
- `sections/founder.liquid` — Founder quote and two-paragraph founder letter with attribution.
- `sections/product-grid.liquid` — Four-card product preview grid with name, description, price,
  availability badge, and CTA button per card.
- `sections/presale-banner.liquid` — Full-bleed presale section with heading, body copy, inline
  waitlist form, and footnote.
- `sections/faq-accordion.liquid` — Blocks-based FAQ with accessible accordion triggers (ARIA
  expanded, controlled panels), keyboard navigation (arrow keys, Home/End).
- `sections/waitlist.liquid` — Dedicated waitlist section with configurable heading, subhead, and
  centered waitlist form.

#### Sections — Collection / Product
- `sections/collection-hero.liquid` — Collection landing hero that falls back gracefully when no
  image is set; pulls from collection metafields or schema settings.
- `sections/main-collection.liquid` — Collection product grid with filtering placeholder, product
  cards, pagination, and empty-state messaging.
- `sections/main-product.liquid` — Full product detail section: image gallery with thumbnails,
  product info (title, price, description), variant selector buttons, quantity toggle, add-to-cart
  form (`data-atc-form`/`data-atc-btn`), and product tabs (details, care, shipping).
- `sections/product-feature.liquid` — Single product feature highlight with image, eyebrow, heading,
  body, and CTA.

#### Sections — Cart / Account / Search
- `sections/main-cart.liquid` — Cart page with line-item rows, quantity steppers (`qty-stepper`),
  remove buttons, order note textarea, subtotal display, checkout button, and empty-state.
- `sections/main-account.liquid` — Customer account: order history table and account details panel.
- `sections/main-login.liquid` — Customer login/register forms with Shopify customer form tags.
- `sections/main-search.liquid` — Search results grid with result count and empty-state.
- `sections/main-404.liquid` — 404 error page with navigation suggestions.

#### Sections — Pages
- `sections/main-page.liquid` — Generic page content renderer for unassigned pages.
- `sections/page-about.liquid` — About page: mission statement, pillar grid, founder letter, and
  philosophy close.
- `sections/page-contact.liquid` — Contact page with Shopify native contact form and studio info
  sidebar.
- `sections/page-faq.liquid` — Standalone FAQ page using the shared FAQ accordion component.
- `sections/page-little-table.liquid` — Little Table children's game landing page with game
  description, age/level info, rule overview, and waitlist form.
- `sections/page-reference-cards.liquid` — Reference Cards product page with feature breakdown,
  dual-sided card description, and presale CTA.

#### Templates
- `templates/index.json` — Homepage section configuration: announcement, hero-split, brand-story,
  founder, product-grid, presale-banner, faq-accordion — all pre-populated with Otto copy.
- `templates/product.json` — Product page template wiring `main-product` section.
- `templates/collection.json` — Collection template wiring `collection-hero` + `main-collection`.
- `templates/cart.json` — Cart template wiring `main-cart`.
- `templates/product.liquid` — Liquid product template fallback.
- `templates/collection.liquid` — Liquid collection template fallback.
- `templates/page.liquid` — Generic page template.
- `templates/page.about.liquid` — About page alternate template.
- `templates/page.contact.liquid` — Contact page alternate template.
- `templates/page.faq.liquid` — FAQ page alternate template.
- `templates/page.little-table.liquid` — Little Table page alternate template.
- `templates/page.reference-cards.liquid` — Reference Cards page alternate template.
- `templates/search.liquid` — Search results template.
- `templates/customers/account.liquid` — Customer account template.
- `templates/customers/login.liquid` — Customer login template.

#### Snippets
- `snippets/waitlist-form.liquid` — Reusable waitlist email form: renders the `<form>` with email
  input, submit button, and message slot; accepts `section_id`, `placeholder`, `button_label`, and
  `dark` parameters.
- `snippets/icon-sprite.liquid` — SVG icon library rendered inline for zero-request icons
  (otto-logo, cart, hamburger, close, arrow, check, mail, social icons).

#### Config
- `config/settings_schema.json` — Theme settings: Colors (full Otto palette with defaults),
  Typography (display font picker + base size), Logo (image upload + width + alt), Social Media
  (up to 4 social URL fields), Announcement Bar (enable toggle, text, link), Footer, Cart.
- `config/settings_data.json` — Default settings data.

#### Locales
- `locales/en.default.json` — English strings for general UI, navigation, cart, product, account,
  forms, search, 404, and pagination.

---

## Design Decisions

- **No jQuery, no build step.** Vanilla JS only, IIFE module pattern, no npm dependencies.
  The theme ships as static files: one CSS, one JS.
- **CSS custom properties for all tokens.** Color, spacing, and type scale all use `--var` tokens
  driven by `settings_schema`, making the palette fully customizable from the Shopify theme editor
  without touching code.
- **Progressive enhancement.** All interactive features (accordion, mobile nav, cart) degrade
  gracefully without JS. Core content is accessible and readable from HTML alone.
- **Accessibility-first interactive patterns.** ARIA roles, expanded states, live regions, focus
  management, and keyboard navigation on all interactive components.
- **Pre-sale / waitlist architecture.** The theme is built around a pre-launch state — no products
  are on sale yet. The primary CTA across all pages is an email waitlist form routed through
  Shopify's native contact form endpoint.
