# AccraVerse 🇬🇭

**An original Ghanaian open-world life simulator — early browser prototype.**

Explore a small 3D neighbourhood inspired by the colour, streets, kiosks, architecture and everyday energy of Accra. This is an original project, not a copy of another game's code or assets.

## Play it

### Option A — open locally
Because the project uses JavaScript modules, run it through a local web server instead of opening `index.html` directly.

1. Install Node.js (LTS).
2. In this folder run `npm install`.
3. Run `npm run dev`.
4. Open the local URL shown in your terminal.

### Option B — GitHub Pages
The project uses Three.js from a CDN. In the repository, open **Settings → Pages**, select the `main` branch and `/(root)`, then save. After publishing, open the URL GitHub Pages provides.

## Controls
- **W / A / S / D** or **arrow keys**: move
- **Drag with mouse**: rotate view
- **Mobile**: on-screen joystick and look buttons
- **Map icon**: neighbourhood information

## What's included
- Lightweight 3D scene using Three.js
- Third-person citizen character and follow camera
- Original low-rise shops, kiosks, road markings, streetlights and trees
- Responsive HUD and mobile controls
- Daytime clock and district label

## Important scope note
This is **Milestone 1: a local single-player prototype**. It is not yet a full realistic city, a multiplayer service, or a native Android app. The first priority is making movement and the scene work reliably across desktop and mobile browsers. Online multiplayer needs a server-authoritative backend, player accounts/session handling, synchronisation and abuse protection. Android packaging comes after the browser prototype is stable.

## Tech
- HTML, CSS, JavaScript
- Three.js via CDN import map

## Project plan
See [ROADMAP.md](./ROADMAP.md).

## Licence
No licence has been selected yet. Add one before accepting outside contributions or distributing the game.
