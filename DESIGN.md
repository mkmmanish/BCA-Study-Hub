---
name: "BCA Study Hub"
description: "Academic course dashboard and resource register for BCA students and administrators."
colors:
  paper: "#f7f8fa"
  paper-strong: "#e9eef8"
  sheet: "#ffffff"
  sheet-alt: "#f0f3f8"
  ink: "#1d2734"
  ink-soft: "#475364"
  muted: "#738092"
  faint: "#98a2b1"
  line: "#e1e6ed"
  line-strong: "#cbd3dd"
  cobalt: "#2855d9"
  cobalt-deep: "#193fae"
  cobalt-tint: "#eaf0ff"
  coral: "#e86c54"
  coral-tint: "#fff0ec"
  green: "#397957"
  green-tint: "#e9f3ed"
  yellow: "#a96918"
  yellow-tint: "#fff3da"
  violet: "#7062c9"
  pink: "#af5267"
  slate: "#1d2430"
  dark-page: "#151a23"
  dark-sheet: "#1d2430"
  dark-ink: "#edf1f7"
typography:
  display:
    fontFamily: "Manrope, DM Sans, sans-serif"
    fontSize: "clamp(23px, 2.6vw, 40px)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.06em"
  headline:
    fontFamily: "Manrope, DM Sans, sans-serif"
    fontSize: "clamp(16px, 1.8vw, 23px)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.05em"
  body:
    fontFamily: "DM Sans, Segoe UI, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.6
  label:
    fontFamily: "DM Sans, Segoe UI, sans-serif"
    fontSize: "8px"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.14em"
rounded:
  sm: "2px"
  md: "8px"
  lg: "9px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.cobalt}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "0 15px"
  button-outline:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 15px"
  input:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "11px 12px"
---

# Design System: BCA Study Hub

## Direction Contract

### THESIS
BCA Study Hub is an academic operations desk: orderly, practical, and specific to a student year, semester, and subject, not a generic consumer dashboard.

### OWN-WORLD
The product lives in a light paper-and-register world. Cool white and blue-gray surfaces, thin rules, and school-archive details create a course catalog and semester map instead of a glossy SaaS app.

### STORY
Students move through their course as a sequence of subjects, learning resources, notices, quizzes, and deadlines. Administrators manage the same system from a parallel content desk, with the same academic framing but stricter controls.

### FIRST VIEWPORT
The first viewport is a split login scene: a paper-stack course scheme on the left and a crisp account form on the right. The visual promise is immediate: the system is built around the course, not around a generic product shell.

### FORM
The chosen direction is the grounded course-scheme form: document-like surfaces, square controls, strong course rails, and practical metadata. It is less visual fantasy and more durable academic utility.

## Overview

**Creative North Star: "The study desk, organized and specific."**

BCA Study Hub is shaped like a campus course register translated into a digital workspace. The visual system favors calm academic order over dramatic branding: paper-toned backgrounds, cool blue-gray neutrals, cobalt navigation, and coral as the alert and exam accent. The hierarchy is governed by semester structure, resource categories, and timely course actions rather than ornament.

The app reads like a course handbook with a modern control layer. Subject lists are explicit, resource rows are structured, and the dashboard feels like a working study station for a college program in motion. The design avoids heavy gradients or soft luxury styling; the emphasis is on clarity, finding the right material quickly, and understanding what matters next.

**Key characteristics:**
- light academic paper world with thin ruled registers and section dividers
- cool white and blue-gray foundations with cobalt as the functional active navigation accent
- coral callouts for deadlines, exam urgency, and action indicators
- strong course-year and semester structure embedded in the layout
- low-radius, square controls and a practical utility-first interaction model

## Colors

The palette is cool and academic, with white paper surfaces, blue-gray structure, cobalt for navigation and active states, and coral for urgency. Dark mode keeps the same logic but swaps into a deep slate and blue-gray environment.

### Primary
- **Academic Cobalt** (#2855D9): the system accent. Used for navigation states, semester marks, selected tabs, primary action buttons, and active course references.
- **Coral Exam Accent** (#E86C54): used sparingly for deadlines, exam urgency, and emphasis in notices or time-critical states.

### Neutral
- **Paper** (#F7F8FA): main page background in light mode.
- **Sheet** (#FFFFFF): primary panels, dashboard surfaces, and resource containers.
- **Sheet Alt** (#F0F3F8): subtle utility panels, grouped lists, and alternating surface support.
- **Ink** (#1D2734): primary text and dense interface labels.
- **Ink Soft** (#475364): secondary text and less urgent labels.
- **Muted** (#738092): tertiary labels, metadata, and quiet interface copy.
- **Line** (#E1E6ED): separators, dividers, and structural edges.
- **Line Strong** (#CBD3DD): stronger rule lines in registers and tables.

### Supporting
- **Cobalt Tint** (#EAF0FF): active sidebar states and dense selected backgrounds.
- **Coral Tint** (#FFF0EC): highlight surfaces for notices, quick guidance, and exam callouts.
- **Green** (#397957) and **Green Tint** (#E9F3ED): success and completion states in study checklists and quiz results.
- **Yellow** (#A96918) and **Yellow Tint** (#FFF3DA): optional academic warmth for practical or informational tags.
- **Violet** (#7062C9) and **Pink** (#AF5267): material-type encoding and supportive surface color cues.

### Named Rules
**The Utility Accent Rule.** Cobalt is the system anchor; coral exists as a controlled alarm color, never a broad background fill. The design stays mostly cool and neutral so the course content remains primary.

### Contextual Color Exceptions
The core interface uses the semantic CSS variables above. A few component-scoped colors remain literal by design: the sign-in course-sheet illustration keeps a light, print-like paper appearance in dark mode; welcome strips use their own quiet stationery tones; material stamps use distinct category tints; and avatar/error states use explicit foreground and background pairs. These are local illustration or semantic-state colors, not additional global accents, so keep them within their existing components.

## Typography

**Display Font:** Manrope, with DM Sans and system sans fallbacks.
**Body Font:** DM Sans, with Segoe UI and system sans fallbacks.
**Label Font:** DM Sans for caps-heavy metadata and utility labels.

The type system is deliberately practical and high-legibility rather than editorial or whimsical. Manrope carries the bold academic weight for headings and year and semester markers, while DM Sans keeps the interface readable for forms, metadata, and resource listings.

### Hierarchy
- **Display** (800, clamp(23px, 2.6vw, 40px), 1.2): primary page headings and welcome language.
- **Headline** (800, clamp(16px, 1.8vw, 23px), 1.2): section titles, dashboard headings, and semester labels.
- **Title** (700 to 800, 10 to 12px): row labels, subject titles, and compact module names within registers.
- **Compact metadata** (7 to 9px, usually 700 for overlines): register headings, dates, secondary identity details, and tightly grouped course-position labels. This range is reserved for nonessential metadata; student names and other primary content remain distinct.
- **Body** (500, 11px, 1.6): all app copy, metadata, resource descriptions, and form text.
- **Label** (700, 8px, 0.14em): uppercase metadata, surface overlines, and compact system labels.

### Named Rules
**The Readability Rule.** Labels and metadata stay small, dense, and exact; headings never become decorative. The interface is structured for scanning, not for visual flourish.

## Layout

The app is built as a desktop-first academic workspace with a persistent left sidebar and a main content column. On desktop, the sidebar is roughly 254px wide and stays sticky while the page scrolls. The top bar carries the current context and reads the available system actions while preserving a clear left-to-right study workflow.

The main content is a generous information grid: welcome blocks, semester sheets, dashboard panels, and structured resource sections. The student dashboard blends overview cards with a right-hand study rhythm and notice column; admin surfaces use statistics, grouped resource registers, and structured form blocks instead of full-width cards.

Responsive behavior preserves the academic grid. The course rail and subject list compress into a slim, stackable panel on smaller screens, while the forms and desktop layouts shift into single-column or compact view states. Search and navigation remain keyboard- and focus-accessible; the mobile sidebar acts like a sliding course rail rather than an entirely different system.

## Elevation & Depth

Depth is conveyed through separation lines, tonal shifts, column structure, and restrained shadows rather than dramatic material lift. Panels sit on paper-like backgrounds, and the system mostly appears flat by default, with subtle edge contrast to keep the academic register feeling controlled.

The deeper surfaces feel more like a static document stack than a glossy app shell. Shadows are soft and limited to specific overlays such as notice popovers, auth paper stacks, and modal dialogs; they serve as structural emphasis, not endless elevation.

### Shadow Vocabulary
- **Panel Shadow** (`0 18px 48px rgba(32, 49, 77, .12), 0 3px 10px rgba(32, 49, 77, .06)`): used for major popovers and dialog overlays.
- **Dark Shadow** (`0 18px 48px rgba(0, 0, 0, .3), 0 3px 10px rgba(0, 0, 0, .16)`): dark-mode equivalents for surfaces, dialog emphasis, and overlay hierarchy.

### Named Rules
**The Flat-By-Default Rule.** The system relies on rule lines and color contrast for depth; large shadows are rare and only appear as a response to interaction or floating UI.

## Shapes

The form language is square and low-radius. Inputs, buttons, and controls generally use sharp 2px corners, with only small rounding at the edges of some utility surfaces. This is intentionally more ledger-like than mobile-app soft. The app avoids pill shapes, rounded cards, and soft curves as the primary metaphor.

The sign-in panel uses a document stack illustration with a rotated paper-sheet motif, reinforcing the academic paper world. Material rows and subject registers are long, narrow, and linear; they are meant to feel like categories and slips in a folder, not polished cards in a social UI.

## Components

### Buttons
- **Shape:** 2px corners; brief hover lift only for utility, not dramatic motion.
- **Primary:** cobalt fill, white text, compact height, used for key tasks like sign-in, save actions, and onboarding steps.
- **Outline / Secondary:** white or transparent background with strong border and neutral text for secondary actions.
- **State treatment:** hover backgrounds deepen significantly but remain within the academic palette; focus states use a clear cobalt outline ring.

### Navigation
- **Style:** the sidebar uses a calm, thin register system with active items in cobalt boxes and neutral metadata. Each item is highly legible and compact.
- **Course rail:** year and semester markers are numbered and compact, reinforcing semesters as a map rather than a generic tab set.

### Resource Rows / Registers
- **Style:** each item is a horizontal row with a type stamp, subject text, metadata, and an arrow action.
- **Behavior:** these rows behave like document slips in a course register; the interface prioritizes finding the right item quickly.

### Forms and Inputs
- **Style:** thin borders, 2px corners, neutral backgrounds, with clear labeling and structured field groups.
- **Focus:** outlines remain crisp and cobalt-led to preserve accessibility without decorative glow.

### Dialogs and Popovers
- **Style:** floating surfaces use light borders and soft shadows only when the modal or notice is elevated above the application surface.
- **Purpose:** they are utility overlays, not luxury cards.

## Do and Do Not

### Do
- **Do** keep the system grounded in course structure: year, semester, subject, topic, deadline.
- **Do** use cobalt for navigation and selection, and coral sparingly for exam and deadline urgency.
- **Do** keep surfaces mostly white, blue-gray, and paper-toned; preserve the ruled-register feeling.
- **Do** maintain sharp corners and clear dividers so the product stays legible and admin-friendly.
- **Do** keep dark mode as a direct inversion of the same system, not a different visual identity.

### Do Not
- **Do Not** introduce soft luxury gradients, heavy drop shadows, glossy surfaces, or playful interface motifs.
- **Do Not** overload the system with multiple competing accent colors; the design is cool and disciplined.
- **Do Not** lose the academic context behind a generic dashboard shell.
- **Do Not** use overly rounded controls or decorative serif typography; the interface should read as organized study infrastructure.
- **Do Not** let the dark theme become visually glamorous at the expense of the course-register logic.
