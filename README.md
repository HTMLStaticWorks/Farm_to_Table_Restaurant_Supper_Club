# Harvest & Hearth — Farm-to-Table Restaurant & Supper Club

A high-end, editorial, and organic Farm-to-Table Restaurant & Supper Club website template built with pure HTML5, vanilla CSS, and modern ES6+ JavaScript. Designed specifically for boutique culinary establishments, seasonal dining rooms, intimate supper clubs, and regenerative agriculture food experiences.

---

## 🌾 Design System & Aesthetics

- **Aesthetic Direction**: *Editorial Luxury Organic* — warm earth tones, tactile culinary textures, bespoke serif headings, generous whitespace, and fluid 60fps micro-animations.
- **Strict 3-Color Palette (Tokens in `:root`)**:
  - `Primary`: Hearth Forest Green (`#253324`)
  - `Secondary`: Terracotta Ember (`#BA5D38`)
  - `Accent`: Sunlit Harvest Honey (`#D4A373`)
  - `Neutrals`: Warm Linen (`#FAF7F2`) and Dark Hearth Soil (`#111711`)
- **Strict Typography System**:
  - Headings: `'Fraunces', Georgia, serif` (Variable font, strictly capped below 600 weight; `H1: 580`, `H2: 540`, `H3: 520`)
  - Body & UI: `'Plus Jakarta Sans', sans-serif` (`Body: 420`, `Buttons: 510`, `Labels: 470`)
- **Global Single Radius**: `12px` globally applied across cards, buttons, media, and inputs.
- **Global Single Shadow**: `0 12px 32px -4px rgba(37, 51, 36, 0.08)` (Light) and `0 14px 36px -6px rgba(0, 0, 0, 0.45)` (Dark).
- **Icons**: Remix Icon CDN (`remixicon@4.3.0`).

---

## 📱 Breakpoint & Navbar Behavior

| Viewport | Behavior |
|---|---|
| **> 1024px (Desktop)** | Full horizontal navbar — all links visible, RTL toggle (⇆) and Dark/Light theme toggle visible on right side of top bar. |
| **≤ 1024px (Tablet / Mobile)** | Hamburger button trigger appears. Header actions simplify; Theme Toggle and RTL Toggle are relocated **inside the slide-in drawer**. |
| **360px (Small Mobile)** | Full-width slide-drawer, perfectly centered card elements, zero horizontal scroll, touch-friendly min 44px link heights. |

---

## 🌐 Complete Page Overview

1. `index.html`: Primary homepage featuring an animated hero with background zoom and live count-up metrics, 3 signature services, the farm story with floating Michelin Green Star badge, pillars of integrity, an interactive testimonials slider, and a full-width communal table CTA.
2. `home2.html`: Alternative layout featuring a split-screen hero with live evening seating counters, an interactive 4-season harvest explorer (Autumn, Winter, Spring, Summer) that updates dish recommendations in real-time, patron community spotlights, and a communal dining gallery.
3. `services.html`: Gastronomic experiences (Fireside Tasting, Supper Club, Chef's Hearth Counter, Biodynamic Cellar, Greenhouse Buyouts, Foraging Walks), current tasting menu course breakdown, membership tiers, and an experience comparison matrix table.
4. `about.html`: Origin story, regenerative farming charter, team profiles (Executive Chef, Master Forager, Cellar Master), an interactive milestone timeline from 2018 to 2026, and partner organic grower collective.
5. `blog.html`: The Hearth Journal with interactive category filter pills (All, Foraging, Fermentation, Farming, Wine), reading times, author tags, and an inline validated newsletter form.
6. `blog-single.html`: Editorial essay on winter lacto-fermentation and wild foraged roots, pull quotes, ingredient guide, author bio, and validated reader reflection form.
7. `contact.html`: Reservation inquiry form with real-time field validation, farmstead hours, direct email/phone, and a responsive Google Maps integration card.
8. `login.html`: Centered vertical and horizontal authentication card (no window scroll, no theme toggle, no back button), email and password validation, official Google and Apple branded SVG buttons, and link to register.
9. `register.html`: Centered vertical and horizontal registration card with name, email, password, confirm password validation, mandatory terms checkbox, and Google/Apple OAuth buttons.
10. `dashboard.html`: Dual-portal experience with a switcher between **Guest Portal** (reservations, cancellation simulation, dietary profile, saved menus, chef chat) and **Kitchen & Admin Portal** (4 KPI stat cards, live table manifest with status dropdowns, morning farm inflow tracker, hearth temperatures).
11. `404.html`: Custom error page with botanical motif, editorial headline, and return home button.
12. `coming-soon.html`: Spring Equinox ticket release countdown clock (live ticking seconds/minutes/hours/days) and priority alert signup form.

---

## 🔄 RTL & Dark Mode Support

- **RTL**: Click the ⇆ double-arrow icon in the navbar (desktop) or drawer (mobile). Sets `dir="rtl"` on `<html>` and toggles `.rtl` on `<body>`. All layouts mirror cleanly, and the drawer slides in smoothly from the **LEFT**.
- **Dark Theme**: Click the sun/moon icon. Detects `prefers-color-scheme` automatically and persists user choice in `localStorage`.
- **Auth Isolation**: Theme toggle and back buttons are intentionally suppressed on `login.html` and `register.html` per design specifications.

---

## 🚀 Running Locally

Open any `.html` file directly in any modern browser, or run a local HTTP server:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .
```
Navigate to `http://localhost:8000/index.html`.
