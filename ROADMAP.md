# AccraVerse development roadmap

## Milestone 1 — playable browser prototype
- [x] 3D neighbourhood and original citizen character
- [x] Keyboard and mobile joystick movement
- [x] Third-person camera and simple look controls
- [x] Responsive HUD and district label
- [ ] Test on actual Android devices and lower-end hardware
- [ ] Add collision with buildings and world props
- [ ] Add touch-drag camera look

## Milestone 2 — improve the city
- Replace placeholder geometry with optimised original models and textures
- Add NPC pedestrians, traffic, ambient audio and day/night lighting
- Add safe interactions: enter shops, talk to NPCs, take simple jobs
- Add settings for graphics quality and sound
- Profile frame rate and memory on target phones

## Milestone 3 — online foundations
- Choose a Node.js server and WebSocket-based networking approach
- Define server-authoritative player positions and movement validation
- Add rooms/areas so clients only receive nearby player updates
- Add reconnect handling, rate limits, validation and basic moderation
- Never trust money, inventory or progress values sent by the client

## Milestone 4 — life-simulator systems
- Player profile and save data
- Jobs, currency, inventory and purchasable items
- Homes and safe vehicle systems
- NPC schedules, missions and social activities
- Server-side persistence and backups

## Milestone 5 — Android release path
- Optimise models, textures, draw calls and effects
- Add installable Progressive Web App support if useful
- Evaluate a native wrapper or a game engine client if browser limits become a blocker
- Test device compatibility, battery usage and network conditions
- Prepare privacy, community and safety policies before public multiplayer

## Architecture principle
Build one small, fun district before expanding the map. Multiplayer and a realistic city are substantial projects; test each milestone with real players and low-cost Android devices before adding more scope.
