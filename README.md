# CSS Matrix3D Perspective Calculator

[Русская версия](README_ru.md)

A browser-based tool for generating CSS `matrix3d()` transforms with perspective projection. Define 4 corners on a field and a widget size — get ready-to-use CSS code.

**Keywords:** CSS matrix3d, perspective transform, 3D CSS, homography, quadrilateral mapping, CSS transform generator, perspective projection, CSS 3D effects, background image, perspective mockup, CSS perspective tool

## Usage

[Open in browser](https://ku6epxboctuk.is-a.dev/css-matrix-calc/) — no build step required.

- **Edit** — drag corners on the SVG field, adjust field and widget sizes
- **Preview** — see the live matrix3d() transform result

Copy the CSS from the "CSS Output" section and paste into your project.

## Step-by-Step Example

Place a widget onto a screen in a background image using perspective transform.

### 1. Upload background image

Load a background photo onto the field. This will be your visual reference for positioning corners.

<img src="images/background.jpg" width="600">

### 2. Upload widget image

Load the widget (e.g. a UI panel or screenshot) that you want to place on the screen.

<img src="images/widget.png" width="400">

### 3. Align corners to the target area

Drag the 4 corners on the SVG field to match the edges of the screen (or any quadrilateral surface) in the background image. The preview updates in real time.

### 4. Get the result

The widget is rendered with the correct perspective, matching the screen angle in the background.

<img src="images/result.jpg" width="600">

Copy the generated `matrix3d()` CSS and paste it into your project.

## Features

- Pure math — homography-based matrix3d() calculation
- Live preview with real-time updates
- Drag-and-drop corner positioning
- Editable field dimensions with aspect ratio lock
- Rescale coordinates option when resizing the field
- **Background image upload** — load an image onto the field for visual reference
- **Widget image upload** — load an image into the widget with auto-sizing
- Three upload methods: file picker, Ctrl+V paste, drag & drop
- **Object-fit options** — contain, cover, fill, none, scale-down
- Zero dependencies, runs in any modern browser

## Background Image

Load a background image onto the field to use as a reference when positioning corners. Useful for matching perspective of existing screenshots or photos.

**How to upload:**

- Click "Load Image" and select a file
- Press Ctrl+V to paste from clipboard
- Drag & drop an image file onto the left column or the Background panel

**Adjust fit:**

- Use the object-fit dropdown to control how the image scales: contain, cover, fill, none, or scale-down

## Widget Image

Load an image directly into the widget. When an image is loaded, the widget dimensions (W/H) automatically match the image size and become locked.

**How to upload:**

- Click "Load Image" in the Widget panel
- Click the paste input field and press Ctrl+V
- Drag & drop an image file onto the Widget panel

**To remove:**

- Click "Remove" to clear the widget image and unlock dimensions

## Use Cases

- **Presentations & landing pages** — render a widget or screenshot on a monitor at any angle
- **Carousels & galleries** — show product cards with perspective deformation
- **Interactive infographics** — overlay data on maps or charts with perspective
- **App previews** — place mobile UI on a device background
- **Scroll-based effects** — animate matrix3d for 3D effects without WebGL
- **Mockups & prototypes** — visually place interfaces in context (on a wall, laptop, banner)
- **Perspective matching** — load a photo of a screen, align corners, get the exact CSS transform

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
    └── ui.js            — buttons, modes, image upload
```

## How It Works

The tool uses [homography](<https://en.wikipedia.org/wiki/Homography_(computer_vision)>) to compute a 3D perspective transform from 4 corresponding points. The resulting `matrix3d()` CSS property maps a rectangular widget onto an arbitrary quadrilateral defined by the user.

## License

MIT
