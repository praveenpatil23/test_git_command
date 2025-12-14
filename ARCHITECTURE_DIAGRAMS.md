# Architecture Diagram - Header Optimization

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    WEBSITE HEADER ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────────┘

                            ┌──────────────────┐
                            │  USER'S BROWSER  │
                            └────────┬─────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
         ┌──────────▼───┐   ┌────────▼──────┐   ┌────▼──────────┐
         │ index.html   │   │ pages/*.html   │   │ Other Pages   │
         │              │   │                │   │               │
         │ <div id=     │   │ <div id=       │   │ <div id=      │
         │  header-     │   │  header-       │   │  header-      │
         │  container>  │   │  container>    │   │  container>   │
         │ </div>       │   │ </div>         │   │ </div>        │
         └──────────────┘   └────────────────┘   └────────────────┘
                    │                │                │
                    └────────────────┼────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │     jQuery AJAX Request         │
                    │  $.ajax({url: 'includes/...'})  │
                    └────────────────┬────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │   includes/header.html          │
                    │   ────────────────────          │
                    │                                 │
                    │  <header class="header-..">     │
                    │    ├─ Title Section             │
                    │    │  └─ "Bhagwan Shailja.."    │
                    │    └─ Navigation Menu           │
                    │       ├─ Home                   │
                    │       ├─ Vilay                  │
                    │       ├─ Opinion                │
                    │       ├─ News                   │
                    │       └─ Contact                │
                    │  </header>                      │
                    │                                 │
                    └────────────────┬────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │  jQuery Functions:              │
                    │  1. loadHeader()                │
                    │  2. setActiveNavLink()          │
                    │  3. updateNavLinks()            │
                    └────────────────┬────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │  Insert HTML into container     │
                    │  & Activate Navigation          │
                    └────────────────┬────────────────┘
                                     │
                    ┌────────────────▼────────────────┐
                    │  Header Rendered on Page        │
                    │  with Active Link Highlighted   │
                    └────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     PAGE LOAD FLOW                              │
└─────────────────────────────────────────────────────────────────┘

    1. PAGE LOAD
    ───────────
    Browser loads HTML
         │
         ├─ <head> section
         │  ├─ CSS files
         │  ├─ Meta tags
         │  └─ Viewport
         │
         └─ <body> section
            ├─ <div id="header-container"></div>  ← EMPTY
            │
            └─ Main content
                 │
                 ├─ Slider
                 ├─ Content sections
                 ├─ Footer
                 │
                 └─ <scripts> section (at bottom)
                    ├─ jQuery 3.6.0
                    ├─ Bootstrap 5.3.0
                    └─ script.js
                         │
                         ▼
    2. HEADER LOADING
    ────────────────
    loadHeader() function executes
         │
         ├─ Detect location:
         │  ├─ If root: path = 'includes/header.html'
         │  └─ If /pages/: path = '../includes/header.html'
         │
         └─ AJAX request to fetch header.html
            │
            ▼
         Successfully loaded?
         ├─ YES → Continue to step 3
         └─ NO  → Log error, still continue
                 │
                 ▼
    3. HEADER INSERTION
    ──────────────────
    Insert HTML into #header-container
         │
         ├─ <header class="header-section">
         │  ├─ <h1>Bhagwan Shailja Narayan</h1>
         │  ├─ <nav class="navbar">
         │  │  └─ 5 navigation links with data-page
         │  └─ ...
         │
         └─ Call setActiveNavLink()
            │
            ▼
    4. ACTIVE LINK DETECTION
    ───────────────────────
    Determine current page:
         │
         ├─ Get current URL: window.location.pathname
         ├─ Extract filename: 'news.html'
         │
         └─ Map to page identifier:
            'news.html' → 'news'
                 │
                 ▼
         Highlight active link:
         └─ $('.nav-link[data-page="news"]').addClass('active')
            │
            ▼
    5. LINK PATH CORRECTION
    ──────────────────────
    Call updateNavLinks():
         │
         ├─ Detect current directory:
         │  ├─ In root? → Use 'pages/vilay.html'
         │  └─ In /pages/? → Use 'vilay.html'
         │
         └─ Update each nav link href:
            ├─ $('[data-page="home"]').attr('href', '../index.html')
            ├─ $('[data-page="vilay"]').attr('href', 'vilay.html')
            ├─ $('[data-page="news"]').attr('href', 'news.html')
            ├─ $('[data-page="opinion"]').attr('href', 'opinion.html')
            └─ $('[data-page="contact"]').attr('href', 'contact.html')
                 │
                 ▼
    6. PAGE READY
    ────────────
    Header fully loaded and functional
    All jQuery features activate
    Page ready for user interaction
```

---

## File Relationship Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                   FILE DEPENDENCIES                           │
└──────────────────────────────────────────────────────────────┘

index.html
├─ Loads: js/script.js
│        ├─ Requires: jQuery
│        └─ Loads: includes/header.html (via AJAX)
│
├─ Loads: css/style.css
│        └─ Styles: Header & Navigation
│
└─ Loads: Bootstrap 5.3.0
         └─ Required by: Navbar functionality


pages/news.html, contact.html, opinion.html, vilay.html
├─ Loads: ../js/script.js (shared)
│        ├─ Requires: jQuery
│        └─ Loads: ../includes/header.html (via AJAX)
│
├─ Loads: ../css/style.css
│        └─ Styles: Header & Navigation
│
└─ Loads: Bootstrap 5.3.0
         └─ Required by: Navbar functionality


includes/header.html (SHARED)
├─ Contains: Complete header markup
├─ Used by: All HTML pages
├─ Styling: css/style.css
└─ Behavior: script.js


js/script.js (SHARED)
├─ Functions:
│  ├─ loadHeader()        → Fetches header.html
│  ├─ setActiveNavLink()  → Highlights current page
│  └─ updateNavLinks()    → Corrects navigation URLs
│
├─ Requires: jQuery 3.6.0
├─ Requires: Bootstrap 5.3.0
├─ Loads: includes/header.html
└─ Dependencies: All other functionality


css/style.css (SHARED)
├─ Styles: .header-section, .nav-link, etc.
└─ Used by: All pages
```

---

## Navigation State Machine

```
┌──────────────────────────────────────────┐
│     NAVIGATION STATE MACHINE              │
└──────────────────────────────────────────┘

                    START
                      │
                      ▼
        ┌─────────────────────────┐
        │ User visits any page    │
        │ (index, news, contact,  │
        │  opinion, vilay)        │
        └──────────────┬──────────┘
                       │
                       ▼
        ┌─────────────────────────┐
        │ getCurrentPage() called  │
        │ Extracts filename from  │
        │ window.location.path    │
        └──────────────┬──────────┘
                       │
                       ▼
        ┌─────────────────────────────────────────┐
        │ Maps filename to page identifier:       │
        │                                         │
        │ index.html     → 'home'                 │
        │ index_2.html   → 'home'                 │
        │ vilay.html     → 'vilay'                │
        │ opinion.html   → 'opinion'              │
        │ news.html      → 'news'                 │
        │ contact.html   → 'contact'              │
        └──────────────┬──────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────────┐
        │ For each nav link:                       │
        │                                          │
        │ IF data-page === currentPageKey          │
        │   ADD class 'active'                     │
        │   ADD attribute 'active' to link         │
        │ ELSE                                     │
        │   REMOVE class 'active'                  │
        │   REMOVE attribute 'active' from link    │
        └──────────────┬───────────────────────────┘
                       │
                       ▼
        ┌─────────────────────────────────────────┐
        │ CSS styling applies:                    │
        │                                         │
        │ .nav-link.active {                      │
        │   color: [primary color];               │
        │   font-weight: bold;                    │
        │   border-bottom: [highlight];           │
        │ }                                       │
        └──────────────┬──────────────────────────┘
                       │
                       ▼
        ┌─────────────────────────────────────────┐
        │ Visual Indicator Updated                │
        │ Current page link now highlighted       │
        │ User knows which page they're on        │
        └──────────────┬──────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────────┐
        │ User clicks navigation link              │
        │ (AJAX or standard navigation)            │
        │                                          │
        │ New page loads...                        │
        │ (Repeat from START)                      │
        └──────────────────────────────────────────┘
```

---

## Responsive Design Flow

```
┌────────────────────────────────────────┐
│      RESPONSIVE BEHAVIOR               │
└────────────────────────────────────────┘

DESKTOP VIEW (md and above)
┌──────────────────────────────────────┐
│ ┌──────────────┐  ┌────────────────┐ │
│ │              │  │                │ │
│ │  Logo/Title  │  │  Nav Links     │ │
│ │              │  │  (Visible)     │ │
│ │              │  │                │ │
│ └──────────────┘  └────────────────┘ │
└──────────────────────────────────────┘
          Width: 100%
    Navbar uses col-md-6 layout


TABLET VIEW (sm to md)
┌──────────────────────────────────────┐
│ ┌──────────────┐  ┌────────────────┐ │
│ │              │  │                │ │
│ │  Logo/Title  │  │  Toggle Button │ │
│ │              │  │     (≡)        │ │
│ │              │  │                │ │
│ ├──────────────┴──┴────────────────┤ │
│ │  Dropdown Menu                   │ │
│ │  • Home                          │ │
│ │  • Vilay                         │ │
│ │  • Opinion                       │ │
│ │  • News                          │ │
│ │  • Contact                       │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
    Toggle triggers on small screens
    Dropdown expands/collapses


MOBILE VIEW (xs)
┌────────────────────────┐
│ ┌──────────────────┐   │
│ │ Logo/Title       │ ≡ │ ← Toggle Button
│ │ (Stacked)        │   │
│ └──────────────────┘   │
│ ┌──────────────────┐   │
│ │ Dropdown Menu    │   │
│ │ • Home           │   │
│ │ • Vilay          │   │
│ │ • Opinion        │   │
│ │ • News           │   │
│ │ • Contact        │   │
│ └──────────────────┘   │
└────────────────────────┘
   Width: 100% (full screen)
   Stacked layout for smaller screens
```

---

## Page Load Timeline

```
Timeline (in milliseconds)

0ms     ▼ HTML starts loading
        ┌─────────────────────────────────────┐
        │ User clicks link / enters URL        │
        └─────────────────────┬───────────────┘

50ms    │
        ├─ Browser parses HTML head
        │  ├─ CSS files loaded
        │  ├─ Meta tags processed
        │  └─ Bootstrap CDN starts

100ms   │
        ├─ Browser renders body
        │  ├─ Empty #header-container visible
        │  ├─ Main content starts loading
        │  └─ Placeholder space shows

150ms   │
        ├─ jQuery finishes loading
        │  └─ $ function available

200ms   │
        ├─ Bootstrap finishes loading
        │  └─ Navbar components available

250ms   │
        ├─ Custom script.js starts
        │  ├─ $(document).ready() fires
        │  └─ loadHeader() AJAX begins

300ms   │
        ├─ AJAX request to includes/header.html
        │  └─ File transferred over network

350ms   │
        ├─ includes/header.html arrives
        │  └─ HTML parsed and ready

400ms   │
        ├─ setActiveNavLink() executes
        │  ├─ Current page detected
        │  └─ Active class applied

450ms   │
        ├─ updateNavLinks() executes
        │  └─ Href attributes updated

500ms   │
        ├─ Header fully rendered
        │  ├─ Navigation links functional
        │  ├─ Mobile menu works
        │  └─ All styles applied

550ms   │
        ├─ Remaining JavaScript functions
        │  ├─ Smooth scroll
        │  ├─ Form validation
        │  ├─ Carousel
        │  └─ Other features

600ms   │
        ├─ Page fully interactive
        ├─ All event listeners attached
        └─ Ready for user interaction

              ▼ Page fully loaded and ready
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────┐
│        ERROR HANDLING FLOW              │
└─────────────────────────────────────────┘

loadHeader() called
      │
      └─ AJAX request initiated
         │
         ├─ SUCCESS ─────────┐
         │                   │
         │                   ▼
         │            HTML inserted
         │            setActiveNavLink()
         │            Page renders normally
         │                   │
         │                   └──→ [USER SEES FULL PAGE]
         │
         └─ FAILURE ─────────┐
                             │
                             ▼
                      Console error logged:
                      "Failed to load header"
                             │
                             ▼
                      initializeComponents() still called
                      (.fail() callback)
                             │
                             ▼
                      Page renders without header
                      (Graceful degradation)
                             │
                             └──→ [USER SEES CONTENT WITHOUT HEADER]
                                  (Can still use page)
```

---

**Diagram Version:** 1.0
**Last Updated:** December 11, 2025
**Status:** Complete ✅
