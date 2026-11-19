# Immersive Gallery

A responsive WebXR art-gallery experience using A-Frame, ready for GitHub Pages and Meta Quest Browser.

## View the gallery

Open the HTTPS GitHub Pages URL after deployment. On Meta Quest, launch the site in the Meta Quest Browser and tap **Enter gallery**, then the VR button. The gallery is arranged around the inside of a large, corrugated grain-bin-shaped room, featuring holiday celebrations and festivals from around the world. Both Quest controllers are shown; point at an artwork and use the controller trigger to open it.

The headset provides 6DoF head tracking (look and physically move naturally). Use the **left controller's thumbstick** to walk around the gallery. Push up to move forward, down to move backward, left to move left, and right to move right. Movement follows the direction you're facing. Use the **right controller's thumbstick left/right** to smoothly turn in place.

## Add your own artwork

The gallery comes with photos of Diwali, Christmas, Lunar New Year, Hanukkah, Eid al-Fitr, Holi, Día de Muertos, and Rio Carnival. Their Wikimedia Commons source and license credits are shown when opening each artwork. Edit the `works` array in `app.js` to replace or add pieces. Each item can be:

- A photo: `{ title: 'My photo', type: 'photo', src: 'https://...' }`
- A YouTube video: `{ title: 'My film', type: 'youtube', src: 'https://www.youtube.com/watch?v=VIDEO_ID' }`

Use direct HTTPS image URLs. If a photo is hosted outside GitHub, its server must allow browser loading (CORS is only required for texture rendering in some cases).

For local media, place files in an `assets/` folder and use paths such as `assets/photo.jpg`.
