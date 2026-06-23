# CSS Matrix3D Perspective Calculator

A browser-based tool for generating CSS `matrix3d()` transforms with perspective projection. Define 4 corners on a field and a widget size — get ready-to-use CSS code.

**Keywords:** CSS matrix3d, perspective transform, 3D CSS, homography, quadrilateral mapping, CSS transform generator, perspective projection, CSS 3D effects

## Usage

Open `index.html` in a browser (no build step required).

- **Edit** — drag corners on the SVG field, adjust field and widget sizes
- **Preview** — see the live matrix3d() transform result

Copy the CSS from the "CSS Output" section and paste into your project.

## Features

- Pure math — homography-based matrix3d() calculation
- Live preview with real-time updates
- Drag-and-drop corner positioning
- Editable field dimensions with aspect ratio lock
- Rescale coordinates option when resizing the field
- Zero dependencies, runs in any modern browser

## Use Cases

- **Presentations & landing pages** — render a widget or screenshot on a monitor at any angle
- **Carousels & galleries** — show product cards with perspective deformation
- **Interactive infographics** — overlay data on maps or charts with perspective
- **App previews** — place mobile UI on a device background
- **Scroll-based effects** — animate matrix3d for 3D effects without WebGL
- **Mockups & prototypes** — visually place interfaces in context (on a wall, laptop, banner)

## Project Structure

```text
├── index.html
├── style.css
└── js/
    ├── main.js          — entry point
    ├── state.js         — state management
    ├── homography.js    — homography math
    ├── svg-renderer.js  — SVG rendering
    ├── drag.js          — drag handling
    ├── inputs.js        — input fields
    ├── preview.js       — live preview
    └── ui.js            — buttons and modes
```

## How It Works

The tool uses [homography](https://en.wikipedia.org/wiki/Homography_(computer_vision)) to compute a 3D perspective transform from 4 corresponding points. The resulting `matrix3d()` CSS property maps a rectangular widget onto an arbitrary quadrilateral defined by the user.

## License

MIT
