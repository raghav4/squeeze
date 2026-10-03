# Quickstart
npm ci
npm test
npm run build

Chrome: chrome://extensions -> Developer mode -> Load unpacked -> choose dist.
Open ordinary test tabs (no unsaved form work), pin one, group two, and open the Side Panel from the popup. Squeeze selections, restart Chrome, reopen records, verify URLs/pins/groups. Repeat with simulated failed storage in automated tests.

npm run dev provides a clearly labeled fixture-only preview, not live Chrome tabs.
No Web Store publishing is configured. No browser metadata leaves the device.
