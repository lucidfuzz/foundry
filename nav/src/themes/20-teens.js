// Navie themes for teens (some suit kids or grown-ups too). DRAFT: awaiting Jordan's approval. Format: nav/src/kit.js.
// Voice rules for this group: funny and a bit sarcastic, never mean; nothing about romance, drugs or alcohol; never cheers on
// speed or phone use (some listeners are brand new drivers, so a light safety nudge now and then is welcome).

navTheme({
  id: 'y2k', title: 'Glitter Flip', blurb: 'Chrome, butterflies and hot pink, like a flip phone covered in rhinestones. Your bestie is on speaker the whole way.',
  ages: ['teens'], vibes: ['retro', 'bright', 'cute'],
  fonts: { display: 'Bagel Fat One', mono: 'Comfortaa', weight: 400, query: 'family=Bagel+Fat+One&family=Comfortaa:wght@500;700' },
  colorName: 'Chrome',
  colors: { ground: '#E2ECF5', ink: '#2A1E4F', accent: '#FF2E9A', panel: '#F7FAFF', glow: '#A8EBFF', alert: '#E8204F', water: '#B5E3FF', park: '#DDF5C2', roads: '#FFFFFF', highway: '#D9CCFF' },
  colorways: [
    { name: 'Lime Gel', colors: { ground: '#EEF9CF', ink: '#2C3410', accent: '#D21F8C', panel: '#FBFFEC', glow: '#C8F06A', water: '#BDEBF5', park: '#D6F2A6', highway: '#FFC2E4' } },
    { name: 'Frosted Grape', colors: { ground: '#ECE2FF', ink: '#2E1A57', accent: '#0A9BAE', panel: '#F9F5FF', glow: '#C7B2FF', water: '#C6E0FF', park: '#E2F2D2', highway: '#A8F0F0' } },
    { name: 'Bubblegum', colors: { ground: '#FFE1F1', ink: '#4A1238', accent: '#2F5BFF', panel: '#FFF5FB', glow: '#FFA8D6', water: '#C9E4FF', park: '#E6F6D0', highway: '#BFD0FF' } },
    { name: 'Midnight Chrome', colors: { ground: '#17142B', ink: '#F3EEFF', accent: '#FF4FB0', panel: '#221D3D', glow: '#6FDDFF', alert: '#FF5A7A', water: '#1E2F55', park: '#1F3324', roads: '#3B3560', highway: '#5A3E78' } }
  ],
  map: { texture: 'sparkles', textureAlpha: 0.09, textureRole: 'accent', marker: 'butterfly', route: 'outlined', routeWidth: 1.15, labels: 'Bold' },
  frame: 'sticker',
  voice: {
    speaker: 'Starla', channel: 'a rhinestone flip phone on speaker, hands free', rate: 1.08, pitch: 1.2,
    L: { search: 'Where we going, bestie?', routes: 'Pick your route', start: "Let's start", end: 'End call', eta: 'Arriving', left: 'Time left', arrive: "You're here!", reroute: 'New route, no drama', then: 'Then' },
    depart: ["Okay, we are officially going places. Literally.", "Lip gloss on, seatbelt on. Let's go.", "Route loaded. It took like two seconds. So high tech.", "Phone stays in the holder. I'll do all the talking.", "And we're off. Cue the dramatic music video.", "Flip phone open. Adventure mode on."],
    arrive: ["You're here! Snap the phone shut, we did it.", "Arrived. That was iconic, honestly.", "Destination reached. It's going in my top friends.", "We made it. Glitter everywhere, zero regrets.", "You're here. Park first, then celebrate.", "Arrived. I rate that drive ten out of ten."],
    reroute: ["Plot twist. New route, same fabulous us.", "Oops. Don't worry, I already fixed it.", "Wrong turn? It's fine. Now we're fashionably late.", "Recalculating. That was very dramatic of you. Love it."],
    cruise: ["Status update. Still driving. Still cute.", "This road is longer than my away message.", "Fun fact. Glitter is basically forever. Ask any carpet.", "Eyes on the road. Any texts can totally wait.", "If this drive were a mixtape, we just hit the good song.", "Shoulders down. You're doing so good.", "The speed limit is the limit, not a suggestion. Just saying.", "Butterfly clips holding strong. So are you.", "My battery is on one bar, but my faith in you is full."],
    tags: ['Cute.', 'Iconic.', 'Obsessed.', 'So smooth.', 'Love that.', 'Totally.']
  },
  arrivals: [['Totally', 'Iconic'], ['Snap It', 'Shut'], ['We Made It,', 'Bestie'], ['Arrived', 'In Style']]
});

navTheme({
  id: 'mochi', title: 'Mochi Cloud', blurb: 'Soft peach, squishy dots and a sleepy, cloud-shaped mochi who thinks about snacks a lot. Gentle, round and comfy.',
  ages: ['teens', 'kids'], vibes: ['cute', 'pastel', 'cozy'],
  fonts: { display: 'Mochiy Pop One', mono: 'M PLUS Rounded 1c', weight: 400, query: 'family=Mochiy+Pop+One&family=M+PLUS+Rounded+1c:wght@500;700' },
  colorName: 'Peach',
  colors: { ground: '#FFEDE4', ink: '#5A3442', accent: '#7B6CF6', panel: '#FFF8F3', glow: '#FFC6B3', alert: '#E5486A', water: '#CFEAF7', park: '#E3F3D8', roads: '#FFFFFF' },
  colorways: [
    { name: 'Mint', colors: { ground: '#E2F5EC', ink: '#24463A', accent: '#E2678A', panel: '#F4FCF8', glow: '#A9E3CB', water: '#CDEBF2', park: '#CDEBCF' } },
    { name: 'Taro', colors: { ground: '#ECE4F7', ink: '#3B2D55', accent: '#F07F5A', panel: '#F8F4FD', glow: '#CDB9F0', water: '#D4E3F7', park: '#E1EED9' } },
    { name: 'Vanilla', colors: { ground: '#FFF7DC', ink: '#4E3F20', accent: '#3E9BE0', panel: '#FFFDF2', glow: '#FFE7A0', water: '#D4EBF6', park: '#E8F2D2' } },
    { name: 'Cocoa', colors: { ground: '#2C2830', ink: '#F6EEF2', accent: '#FFA6C1', panel: '#3A353F', glow: '#8C7A92', alert: '#FF7A92', water: '#26313F', park: '#2E3A2E', roads: '#4A4450' } }
  ],
  map: { texture: 'polka', textureAlpha: 0.05, textureRole: 'accent', marker: 'cloud', markerRole: 'panel', route: 'outlined', routeWidth: 1.25, labels: 'Bold' },
  frame: 'pill',
  voice: {
    speaker: 'Puff', channel: 'a cloud-shaped mochi bun bobbing on the dashboard', rate: 0.95, pitch: 1.25,
    L: { search: 'Where should we float?', routes: 'Squishy routes', start: 'Start floating', end: 'End trip', eta: 'Arrive at', left: 'Time left', arrive: 'Soft landing', reroute: 'New route, no stress', then: 'Then' },
    depart: ["Boing. We're off, nice and soft.", "Cloud mode on. Floating to your destination.", "Okay, little bean. Let's roll gently.", "Seatbelt snug like a blanket. Let's go.", "Route ready. I packed us some imaginary snacks.", "Off we go. Slow and squishy wins the race."],
    arrive: ["Soft landing. You did so well.", "We're here. I'm so proud I could puff up.", "Arrived. Time for a real snack now.", "Destination reached. Tiny cloud applause.", "Here we are. Comfiest drive ever.", "You made it. Please give yourself a little squish."],
    reroute: ["Oopsie. I made us a new route.", "Little wobble. All fixed now.", "No stress. Floating a different way.", "A tiny detour. Clouds drift sometimes too."],
    cruise: ["Still floating. Everything is fine and fluffy.", "Fun fact. A big fluffy cloud can weigh as much as a hundred elephants. Not me, though.", "If you feel sleepy, let's stop somewhere safe and rest.", "I'm thinking about dumplings again. Sorry. Carry on.", "You're a very gentle driver. Cloud approved.", "Long road. Want to hum something soft?", "Squish level, perfect. Route status, also perfect.", "Watch for people crossing. Everyone deserves a soft day."],
    tags: ['Squish.', 'Softly.', 'Boing.', 'So comfy.', 'Yay.', 'Fluffy.']
  },
  arrivals: [['Soft', 'Landing'], ['Tiny Cloud', 'Applause'], ['Squishy', 'Success'], ['Made It,', 'Little Bean']]
});

navTheme({
  id: 'pixelquest', title: 'Pixel Quest', blurb: 'A chunky 8-bit overworld with a bard in a dialog box. Every trip is a quest, every arrival a saved game.',
  ages: ['teens', 'kids'], vibes: ['retro', 'playful'], upper: true,
  fonts: { display: 'Pixelify Sans', mono: 'Space Mono', weight: 500, query: 'family=Pixelify+Sans:wght@500;700&family=Space+Mono:wght@400;700' },
  colorName: 'Overworld',
  colors: { ground: '#D4EBA6', ink: '#1E2A14', accent: '#D9342B', panel: '#F6F1DA', glow: '#F5C542', alert: '#B0201A', water: '#6BC0F0', park: '#A6D673', roads: '#F3E2B0', highway: '#E8B860' },
  colorways: [
    { name: 'Dungeon', colors: { ground: '#24222E', ink: '#EDE6D2', accent: '#FFC93C', panel: '#2F2C3B', glow: '#8A6D1F', alert: '#FF5A4E', water: '#1F3550', park: '#2B3A2A', roads: '#4A4658', highway: '#6A6070' } },
    { name: 'Desert', colors: { ground: '#F2DFAE', ink: '#3A2412', accent: '#2E6FD8', panel: '#FBF1D6', glow: '#F2A93B', water: '#7FC4E0', park: '#C9D98E', roads: '#FFF4D6', highway: '#E6B070' } },
    { name: 'Ice Cave', colors: { ground: '#DDEFF7', ink: '#13314A', accent: '#8E3BD9', panel: '#F4FBFE', glow: '#9FD8F0', water: '#7DB8E8', park: '#CFE6E0', roads: '#FFFFFF', highway: '#C7B4F0' } },
    { name: 'Handheld', colors: { ground: '#C4CFA1', ink: '#1F2A12', accent: '#3A5418', panel: '#D8E0B8', glow: '#8A9A5B', alert: '#7A2E1E', water: '#8FA77A', park: '#A9B985', roads: '#E2E8C8', highway: '#9DAE72' } }
  ],
  map: { texture: 'pixels', textureAlpha: 0.07, textureRole: 'ink', marker: 'pixel', route: 'solid', routeWidth: 1.45, labels: 'Bold', upper: true },
  frame: 'square',
  voice: {
    speaker: 'Byte the Bard', channel: 'a dialog box that pops up at the bottom of the screen', rate: 1.05, pitch: 1.1,
    L: { search: 'Choose your quest', routes: 'Pick a path', start: 'Press start', end: 'End quest', eta: 'Arrive at', left: 'Time left', arrive: 'Quest complete', reroute: 'New path found', then: 'Then' },
    depart: ["Quest accepted. Your party has one member and one car.", "Press start. Adventure is loading.", "A new quest begins. Reward, being somewhere else.", "Level one, the driveway. Easy mode.", "Off we go, hero. No grinding, just driving.", "The path is drawn. The tutorial is now over."],
    arrive: ["Quest complete. You gained one hundred experience points.", "Destination reached. Saving your game.", "You win. Insert snack to continue.", "Arrived. The treasure was the journey. Also the parking.", "Level cleared. No continues used.", "Victory. Cue the tiny trumpet."],
    reroute: ["Wrong warp. Loading a new path.", "Side quest unlocked, apparently. Rerouting.", "That door was locked. Trying another.", "Respawning the route. No lives lost."],
    cruise: ["Achievement unlocked. Stayed on the road.", "Hearts full. Keep it that way and drive carefully.", "Random encounter. It's a stop sign. Defeat it by stopping.", "Speed boosts are for games. Out here we stick to the limit.", "This stretch looks like a filler level.", "The background music is in your head. Hum it.", "Fun fact. Old game consoles could only play a few sounds at once.", "Your quest log says, keep driving. Very detailed quest log."],
    tags: ['Nice combo.', 'Plus ten.', 'Level up.', 'Critical hit.', 'Bonus.', 'Clean move.']
  },
  arrivals: [['Quest', 'Complete'], ['Level', 'Cleared'], ['Game', 'Saved'], ['You Win,', 'Hero']]
});

navTheme({
  id: 'synth', title: 'Midnight Synth', blurb: 'A night highway under a sunset grid, roads glowing magenta, and a mellow late-night DJ keeping you company.',
  ages: ['teens', 'adults'], vibes: ['retro', 'dark'], upper: true,
  fonts: { display: 'Audiowide', mono: 'Exo 2', weight: 400, query: 'family=Audiowide&family=Exo+2:wght@500;700' },
  colorName: 'Midnight',
  colors: { ground: '#0E1233', ink: '#FFE9D6', accent: '#FF8A3D', panel: '#171B45', glow: '#FF4D8D', alert: '#FF5B5B', water: '#14245C', park: '#13283A', roads: '#3C2A6E', highway: '#B8407A' },
  colorways: [
    { name: 'Sunset Strip', colors: { ground: '#2A1238', ink: '#FFEBDD', accent: '#FFC24B', panel: '#36184A', glow: '#FF6B6B', water: '#22204F', park: '#2A2238', roads: '#5A2A5E', highway: '#E05A70' } },
    { name: 'Ocean Highway', colors: { ground: '#071E2A', ink: '#E6FBFF', accent: '#4FF0D0', panel: '#0D2A38', glow: '#1FB8C9', water: '#0B3550', park: '#0E2A2A', roads: '#163E52', highway: '#2C8FB0' } },
    { name: 'Tail Lights', colors: { ground: '#120A12', ink: '#FFE3E3', accent: '#FF3B4E', panel: '#1E1018', glow: '#FF8A00', alert: '#FFB020', water: '#1A1430', park: '#1A1A16', roads: '#3A1E2A', highway: '#8A2A3A' } },
    { name: 'First Light', colors: { ground: '#F6E6E0', ink: '#2A1A3A', accent: '#E0461F', panel: '#FFF5F0', glow: '#F8A07A', alert: '#C0182E', water: '#C9D4F2', park: '#E8DCE6', roads: '#FFFFFF', highway: '#F2A0B8' } }
  ],
  map: { texture: 'finegrid', textureAlpha: 0.08, textureRole: 'glow', marker: 'car', route: 'glow', routeWidth: 1.15, roadGlow: true, labels: 'Bold', upper: true, buildings: 'outline' },
  frame: 'neon',
  voice: {
    speaker: 'Juno Static', channel: 'Night Drive 88.8, a station only your car can pick up', rate: 0.92, pitch: 0.88,
    L: { search: 'Where to tonight?', routes: "Tonight's routes", start: 'Start the drive', end: 'End the show', eta: 'Arriving', left: 'Airtime left', arrive: "That's a wrap", reroute: 'New route, new track', then: 'Then' },
    depart: ["Good evening, night owl. You're listening to the midnight drive.", "Volume at a sensible level. Your ears will thank me later. Let's cruise.", "This next stretch goes out to you, the driver. Let's roll.", "The city's asleep and the road is ours. Gently, now.", "Dial locked in. Settle back, it's a long song.", "Starting the drive. The sunset's long gone, but the mood stayed."],
    arrive: ["And that's the end of the set. Thanks for driving with me.", "You've arrived. Fade out, applause, station break.", "Destination reached. Same time tomorrow, night owl?", "That's a wrap. Park it smooth and take a bow.", "You made it. The last chord rings out.", "Arrived. This has been the midnight drive. Sleep well, eventually."],
    reroute: ["Little static on the line. Tuning in a new route.", "Skipped a track. No problem, new route queued.", "Off the dial for a second. Back on frequency now.", "Change of plan. The best songs have a key change anyway."],
    cruise: ["No requests tonight. Just good roads.", "Shout out to everyone driving the speed limit. You're the real stars.", "Fun fact. Radio waves travel at the speed of light. You don't have to.", "Long stretch, steady pace. This is the slow jam of the trip.", "Getting sleepy? Pull over somewhere safe. The show will wait.", "Caller on line one says you're doing great. Okay, it's me. I'm the caller.", "The grid goes on forever. The road, thankfully, does not.", "Leave the phone alone. I've got the playlist covered.", "Eyes on the road. The stars aren't going anywhere."],
    tags: ['Smooth.', 'Stay tuned.', 'Nice and easy.', 'On the dial.', 'Mellow.', 'Cruising.']
  },
  arrivals: [["That's A", 'Wrap'], ['End Of', 'The Set'], ['Fade', 'Out'], ['Signing', 'Off']]
});

navTheme({
  id: 'ribbon', title: 'Ribbon & Pearl', blurb: 'Bows, pearls and blush pink on ivory, with a music box guide who has lovely manners and calls everyone darling.',
  ages: ['teens', 'adults'], vibes: ['cute', 'pastel', 'luxe'],
  fonts: { display: 'Gilda Display', mono: 'Karla', weight: 400, query: 'family=Gilda+Display&family=Karla:wght@400;600' },
  colorName: 'Pearl',
  colors: { ground: '#F7EFEA', ink: '#4A2832', accent: '#C23B6A', panel: '#FFFAF7', glow: '#F2C4D0', alert: '#B3203F', water: '#DCE6F0', park: '#E6EBDC', roads: '#FFFFFF' },
  colorways: [
    { name: 'Ballet Slipper', colors: { ground: '#FBE4E8', ink: '#552A36', accent: '#9C2752', panel: '#FFF4F6', glow: '#F5B8C8', water: '#DDE3F2', park: '#EDEBDC' } },
    { name: 'Dove Gray', colors: { ground: '#ECEAEC', ink: '#2E2A33', accent: '#B0466E', panel: '#F9F8F9', glow: '#D9C5CF', water: '#D4DEE8', park: '#E0E5DA' } },
    { name: 'Red Ribbon', colors: { ground: '#FAF1E4', ink: '#3E1A1E', accent: '#C8102E', panel: '#FFFBF4', glow: '#F2B5B5', water: '#D8E4EA', park: '#E5EAD6' } },
    { name: 'Jewel Box', colors: { ground: '#2A1820', ink: '#FBEFF2', accent: '#F4A6BF', panel: '#3A2230', glow: '#8F4A64', alert: '#FF6B8A', water: '#22263A', park: '#2C2A22', roads: '#4E3440' } }
  ],
  map: { texture: 'petals', textureAlpha: 0.08, textureRole: 'accent', marker: 'bow', route: 'outlined', routeWidth: 1.1, labels: 'Italic' },
  frame: 'double',
  voice: {
    speaker: 'Mirabelle', channel: 'a little music box on the dashboard', rate: 0.95, pitch: 1.12,
    L: { search: 'Where to, darling?', routes: 'Choose a route, dear', start: 'Shall we start?', end: 'End the outing', eta: 'Arriving at', left: 'Time left', arrive: 'Arrived, darling', reroute: 'A new route, dear', then: 'Then' },
    depart: ["Ribbon tied, pearls on. Shall we?", "Off we go, darling. Gracefully, of course.", "Posture lovely, seatbelt fastened. Let us begin.", "The route is ready, tied up in a neat little bow.", "A pleasant outing awaits. Do drive gently.", "Away we go. There is no rush when one is this elegant."],
    arrive: ["We have arrived. Do make an entrance.", "Here we are, darling. Not a curl out of place.", "Arrived. Simply lovely driving.", "Destination reached. I shall write about it in my diary.", "You're here. A little curtsy for you, darling.", "Arrived. Pearls intact, dignity intact."],
    reroute: ["Oh dear. Not to worry, I have another route.", "A small detour. How charmingly unplanned.", "We'll go the long way, darling. More time to look lovely.", "Retying the ribbon. New route ready."],
    cruise: ["Lovely weather for a drive. Or at least lovely company.", "Do keep both hands on the wheel. Very proper.", "Fun fact. A pearl grows one thin layer at a time, for years. Patience, darling.", "Ignore your phone, darling. Let them wonder where you are.", "One does not tailgate. It's terribly impolite.", "I'm humming a waltz. You may hum along.", "Still on the right road. Of course we are.", "Chin up, shoulders back, eyes on the road."],
    tags: ['Lovely.', 'Darling.', 'How elegant.', 'Gracefully.', 'Charming.', 'Perfectly done.']
  },
  arrivals: [['Simply', 'Lovely'], ['Tied With', 'A Bow'], ['Make An', 'Entrance'], ['Pearls', 'Intact']]
});

navTheme({
  id: 'comic', title: 'Pow!', blurb: 'Halftone dots, bold ink and a booming narrator who thinks your drive to the store is an epic saga. It sort of is.',
  ages: ['teens', 'kids'], vibes: ['bright', 'playful'], upper: true,
  fonts: { display: 'Bangers', mono: 'Comic Neue', weight: 400, query: 'family=Bangers&family=Comic+Neue:wght@400;700' },
  colorName: 'Issue One',
  colors: { ground: '#FFF4CC', ink: '#141414', accent: '#E8212E', panel: '#FFFFFF', glow: '#3FA9F5', alert: '#FF6A00', water: '#9ED8F5', park: '#C4E58A', roads: '#FFFFFF', highway: '#FFD23F' },
  colorways: [
    { name: 'Villain Night', colors: { ground: '#1E1433', ink: '#F4FFE8', accent: '#7DFF4A', panel: '#2A1C46', glow: '#B04AFF', alert: '#FF4A6E', water: '#251E55', park: '#1E3020', roads: '#46366E', highway: '#7A4AB0' } },
    { name: 'Pop Art', colors: { ground: '#E3F4FF', ink: '#10141F', accent: '#E8137A', panel: '#FFFFFF', glow: '#FFE000', water: '#8CCFFF', park: '#BFEAA0', highway: '#FFE45C' } },
    { name: 'Golden Age', colors: { ground: '#EFE2C2', ink: '#2A1D12', accent: '#1F4FB0', panel: '#F8EED6', glow: '#D9A440', alert: '#B2281C', water: '#A9C9D6', park: '#C8D29A', roads: '#FBF4E2', highway: '#E8B85A' } },
    { name: 'Inked', colors: { ground: '#EFEFEF', ink: '#000000', accent: '#E01E2B', panel: '#FFFFFF', glow: '#9A9A9A', alert: '#E01E2B', water: '#CFCFCF', park: '#DDDDDD', highway: '#BDBDBD' } }
  ],
  map: { texture: 'halftone', textureAlpha: 0.07, textureRole: 'ink', marker: 'bolt', route: 'outlined', routeWidth: 1.3, labels: 'Bold', upper: true },
  frame: 'bubble',
  voice: {
    speaker: 'The Thundering Narrator', channel: 'caption boxes in the corner of every panel', rate: 1.02, pitch: 0.85,
    L: { search: 'Where to, hero?', routes: 'Choose your story', start: 'Start the issue', end: 'The End', eta: 'Arriving', left: 'Time left', arrive: 'Mission accomplished', reroute: 'Plot twist! New route', then: 'Then' },
    depart: ["Our hero sets out. The city holds its breath.", "Issue one. The journey begins.", "And so, with the click of a seatbelt, the adventure starts.", "Meanwhile, in this very car, a legend is driving.", "Cape on. Well, seatbelt on. Same energy.", "Our story opens on a hero, a car and a destination. Dun dun dun."],
    arrive: ["And so our hero arrives. Victory, and decent parking.", "Destination reached. The crowd goes mild.", "Kapow. You made it.", "The end. Or is it? It is. You're here.", "Our hero arrives, triumphant and only slightly hungry.", "Arrived. Next issue, the return trip."],
    reroute: ["Plot twist. Our hero takes another road.", "A shocking turn of events. Recalculating.", "Little did our hero know, there was a better way.", "Rewrite. That turn never happened. New route."],
    cruise: ["Meanwhile, nothing dramatic is happening. Perfect.", "Our hero obeys the speed limit. The villains are furious.", "This panel is just road. The artist needed a break.", "Narrator's note. Real heroes keep their eyes on the road.", "Our hero's greatest power? Using turn signals.", "Elsewhere, a cat is stuck in a tree. Not our problem today.", "Tension builds. Will the next light be green?", "Our hero checks the mirrors. Truly, a master of the craft.", "The phone buzzes. Our hero, wisely, ignores it."],
    tags: ['Pow.', 'Zap.', 'Heroic.', 'Kablam.', 'Bam.', 'Whoosh.']
  },
  arrivals: [['Kapow!', 'You Made It'], ['Mission', 'Accomplished'], ['The', 'End'], ['To Be', 'Continued']]
});

navTheme({
  id: 'thorn', title: 'Velvet Thorn', blurb: 'Black lace, deep red roses and a crescent moon. Gloomy, romantic and a bit dramatic, with a guide who whispers from a locket.',
  ages: ['teens', 'adults'], vibes: ['dark', 'spooky', 'luxe'],
  fonts: { display: 'Texturina', mono: 'Crimson Pro', weight: 600, query: 'family=Texturina:wght@600&family=Crimson+Pro:wght@400;600' },
  colorName: 'Black Rose',
  colors: { ground: '#150A10', ink: '#F3E4E8', accent: '#E8435F', panel: '#21111A', glow: '#7A1E36', alert: '#FFB347', water: '#1B1726', park: '#1A1814', roads: '#3A2430', highway: '#5E2A3C' },
  colorways: [
    { name: 'Candlelight', colors: { ground: '#1A120A', ink: '#F7E7CC', accent: '#F2A93B', panel: '#261A10', glow: '#8A5A1E', alert: '#FF6A55', water: '#1A1A22', park: '#1C1C12', roads: '#3E2E1E', highway: '#6A4A24' } },
    { name: 'Ivy', colors: { ground: '#0F1611', ink: '#E6EFE3', accent: '#E8435F', panel: '#18221A', glow: '#2E5A3A', water: '#121C22', park: '#152418', roads: '#2A382C', highway: '#46304A' } },
    { name: 'Nightshade', colors: { ground: '#0E0B12', ink: '#EDE6FA', accent: '#C9A2FF', panel: '#1A1524', glow: '#4A2E7A', water: '#141A30', park: '#16201A', roads: '#2E2648', highway: '#4E3A78' } },
    { name: 'Bone China', colors: { ground: '#EEE8E0', ink: '#1C1220', accent: '#9E1B3B', panel: '#F8F5F0', glow: '#C9B4BC', alert: '#C2410C', water: '#CCD2D8', park: '#DADCCF', roads: '#FFFFFF', highway: '#D9C2CA' } }
  ],
  map: { texture: 'weave', textureAlpha: 0.06, textureRole: 'ink', marker: 'moon', route: 'glow', routeWidth: 1.1, labels: 'Italic', buildings: 'outline' },
  frame: 'notch',
  voice: {
    speaker: 'Lady Hollowmere', channel: 'a silver locket that whispers', rate: 0.9, pitch: 0.92,
    L: { search: 'Where shall we wander?', routes: 'Paths through the dark', start: 'Start, if you dare', end: 'End the night', eta: 'Arriving', left: 'Time left', arrive: 'Arrived at last', reroute: 'The path twists', then: 'Then' },
    depart: ["The night is young. Let us go.", "Candles lit, seatbelt fastened. We depart.", "Into the evening we go. Gloomily, but safely.", "A journey begins. How wonderfully mysterious.", "The roses have wilted in approval. Drive on.", "Off we go, my gloomy friend. Gently, now."],
    arrive: ["Arrived at last. The ravens are mildly impressed.", "We are here. How poetic.", "The journey ends, as all things must. Nicely parked, though.", "Destination reached. I shall compose a sonnet about it.", "You've arrived. A dramatic exit is optional.", "Here we are. The night thanks you for your service."],
    reroute: ["The path twists, as paths so often do.", "A wrong turn. How tragic. I have another.", "The fog shifts. A new road appears.", "Lost in the dark for a moment. Found again."],
    cruise: ["The moon is following us. It does that.", "I wore black today. I wear black every day.", "Drive gently. Haste is terribly unromantic.", "A raven on the wire just nodded at you. Probably.", "Somewhere, an organ plays in a minor key. Just for us.", "Eyes on the road, my dear. The shadows can wait.", "Roses have thorns. Roads have speed limits. Respect both.", "This street would make a fine setting for a ghost story. A friendly one.", "If you are tired, rest somewhere safe. Even night owls need sleep."],
    tags: ['Darkly done.', 'Exquisite.', 'How grim. I love it.', 'Hauntingly smooth.', 'Very gothic.', 'Splendid.']
  },
  arrivals: [['Arrived', 'At Last'], ['How', 'Poetic'], ['The Night', 'Is Ours'], ['Darkly', 'Done']]
});
