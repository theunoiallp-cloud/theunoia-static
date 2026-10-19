# THEUNOiA website (React)

The theunoia.com site as a **Vite + React + React Router** app. It looks and behaves exactly like the HTML version: same sections, the same animations, the same scroll locks and the hanging folders.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production files in dist/
npm run preview    # check the production build locally
```

Node 18 or newer is needed.

## Pages (routes)

| Route | Component |
|---|---|
| `/` | `src/pages/Home.jsx` |
| `/story` | `src/pages/Story.jsx` (the book) |
| `/team` | `src/pages/Team.jsx` |
| `/hivh` | `src/pages/Hivh.jsx` |
| `/hunhar` | `src/pages/Hunhar.jsx` |
| `/blog` | `src/pages/Blog.jsx` |
| `/contact` | `src/pages/Contact.jsx` |

Any unknown address goes back to `/`.

## Home page sections

`src/pages/Home.jsx` lists the sections top to bottom. Each one is a component in `src/sections/home/`:

| Component | Section |
|---|---|
| `Hero` | headline, the gentleman with the computer head, pixel skyline |
| `ParticleStory` | slide 2: "Our Story" in seven particle designs (three.js) |
| `MeetTheunoia` | opening animation, the note, the nine drawers |
| `AimVision` | Our Vision / Our Mission with the town |
| `Luna` | LUNA poster, Since 2025, Revolution map |
| `Products` | Hunhar and Hivh cards |
| `Inspirations` | Our Inspirations |
| `Squad` | Meet the Squad rotating photo cards |
| `Independence` | the river scene and the two hands |
| `DoodleStrip` | "Nagpur Builds" strip |
| `SiteFooter` | navy footer |

The middle sections are wrapped in `<Sheet id label>` (`src/sections/home/Sheet.jsx`): the paper folder with its tab. The tilt and swing come from `src/content/home/sheets.js`.

## Where to edit things

Each section's content lives in `src/content/<area>/<name>/`:

- `markup.html`: the section's HTML (text, links, images)
- `style.css`: its styles. They load only while that page is open, so pages never affect each other's look.
- `script-N.js`: its animation code, as it ran on the HTML site
- `meta.json`: the section's outer element, and the page title for pages

Examples:

- **Change text on the Hivh page:** edit `src/content/pages/hivh/markup.html`.
- **Edit team members** (names, roles, dates, photos): the `people` list at the top of `src/content/pages/team/script-1.js`.
- **Slide 2 story text:** the `secs` list in `src/content/home/particle-story/script-1.js`.
- **Drawer contents in Meet THEUNOiA:** the `DR` list in `src/content/home/meet-theunoia/script-1.js`.

Images are in `public/assets/img/` and are referenced as `/assets/img/<file>`.

## How the animation code runs inside React

`src/lib/Legacy.jsx` renders a section: its outer element, its HTML and its styles. It then runs the section's scripts through `src/lib/runLegacy.js`.

`runLegacy` gives every script its own tracked versions of `addEventListener`, `requestAnimationFrame`, timers and observers. When a visitor leaves a page, everything that page started is stopped and removed. When they come back, it starts fresh, so nothing piles up while moving between pages.

## Hosting

The app is a single-page app, so the host must send every address (`/team`, `/hivh` …) to `index.html`. Settings for this are included:

- **Vercel:** `vercel.json`
- **Netlify:** `public/_redirects`
- **Apache / cPanel hosting:** `public/.htaccess`

Build with `npm run build` and upload the contents of `dist/`.
