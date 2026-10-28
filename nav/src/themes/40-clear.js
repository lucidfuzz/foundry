// Easy-to-read Navie themes: larger text, strong contrast, a slower and calmer guide. For older drivers, low vision, glare,
// night driving or anyone who wants less going on. DRAFT: awaiting Jordan's approval. Format: nav/src/kit.js.
navTheme({
  id: 'clearday', title: 'Clear Day', blurb: 'Big letters, strong colors and a calm, plain voice. Made to be read at a glance in bright light.',
  ages: ['clear', 'adults'], vibes: ['minimal', 'calm'],
  fonts: { display: 'Atkinson Hyperlegible', mono: 'Lexend', weight: 700, query: 'family=Atkinson+Hyperlegible:wght@400;700&family=Lexend:wght@400;600' },
  colorName: 'Daylight',
  colors: { ground: '#F4F4EF', ink: '#000000', accent: '#0047FF', panel: '#FFFFFF', glow: '#7FA8FF', alert: '#C00000', water: '#A9D3FF', park: '#CDE8C8', roads: '#FFFFFF' },
  colorways: [
    { name: 'Warm Paper', colors: { ground: '#F6EFE2', ink: '#1A1206', accent: '#B33A00', panel: '#FFFBF4', water: '#B9D6E8', park: '#D9E6C3' } },
    { name: 'Green Route', colors: { accent: '#007A33', glow: '#7FD3A0' } },
    { name: 'Purple Route', colors: { accent: '#6A00D9', glow: '#B98CFF' } },
    { name: 'Soft Gray', colors: { ground: '#E4E6EA', ink: '#000000', accent: '#0047FF', panel: '#F7F8FA', water: '#B3CCE6', park: '#CFDCCB' } }
  ],
  map: { texture: 'none', marker: 'bigarrow', route: 'outlined', routeWidth: 1.35, labels: 'Bold', labelSize: 1.3 },
  frame: 'clear', scale: 1.3,
  voice: {
    speaker: 'Your plain guide', channel: 'a clear, unhurried voice', rate: 0.88, pitch: 1,
    L: { search: 'Where to?', routes: 'Choose a route', start: 'Start', end: 'End', eta: 'Arrive at', left: 'Time left', arrive: 'You have arrived', reroute: 'New route', then: 'Then' },
    depart: ['Take your time. I will tell you each turn early.', 'We are on our way.', 'All set. I will speak before every turn.', 'Starting the route now.', 'Off we go, at your own pace.', 'Route ready. Drive safely.'],
    arrive: ['Well done.', 'Safely there.', 'That is the end of the route.', 'Nicely driven.', 'You are there. Take a moment before getting out.', 'Arrived safely.'],
    reroute: ['That is fine. Here is a new route.', 'No problem. Taking another way.', 'A new route is ready.', 'All right. Finding a different way.'],
    cruise: ['Still on the right road.', 'Nothing to do for a while. Just keep going.', 'You are doing fine.', 'This road continues for some time.', 'Keep a steady pace.', 'All is well on this stretch.', 'I will let you know before the next turn.', 'Good, steady driving.'],
    tags: ['Good.', 'Very good.', 'That is right.', 'Fine.', 'Steady.', 'Nicely.']
  },
  arrivals: [['Safely', 'There'], ['Well', 'Done'], ['You Have', 'Arrived'], ['Nicely', 'Driven']]
});
navTheme({
  id: 'clearnight', title: 'Clear Night', blurb: 'Black map, bright yellow route, nothing to squint at. Kind to your eyes after dark and in glare.',
  ages: ['clear', 'adults'], vibes: ['dark', 'minimal', 'calm'],
  fonts: { display: 'Lexend', mono: 'Atkinson Hyperlegible', weight: 600, query: 'family=Lexend:wght@600&family=Atkinson+Hyperlegible:wght@400;700' },
  colorName: 'Yellow',
  colors: { ground: '#000000', ink: '#FFFFFF', accent: '#FFD400', panel: '#141414', glow: '#8A7400', alert: '#FF5A5A', water: '#0B2742', park: '#0D2610', roads: '#3C3C3C', highway: '#5A5A5A' },
  colorways: [
    { name: 'Cyan', colors: { accent: '#00E5FF', glow: '#00707D' } },
    { name: 'White', colors: { accent: '#FFFFFF', glow: '#777777' } },
    { name: 'Amber', colors: { accent: '#FF9F1A', ink: '#FFE9C7', glow: '#7A4A00' } },
    { name: 'Navy', colors: { ground: '#06122A', panel: '#0E1C3A', roads: '#24345A', highway: '#3A4E7C', water: '#0A2A55', park: '#0B2A22' } }
  ],
  map: { texture: 'none', marker: 'car', markerRole: 'accent', route: 'glow', routeWidth: 1.35, labels: 'Bold', labelSize: 1.3, buildings: 'none' },
  frame: 'clear', scale: 1.3,
  voice: {
    speaker: 'The night guide', channel: 'a low, steady voice for dark roads', rate: 0.9, pitch: 0.95,
    L: { search: 'Where to?', routes: 'Choose a route', start: 'Start', end: 'End', eta: 'Arrive at', left: 'Time left', arrive: 'You have arrived', reroute: 'New route', then: 'Then' },
    depart: ['Lights on. We are on our way.', 'Route ready. Easy does it in the dark.', 'Starting now. I will call every turn early.', 'Off we go. Watch for people crossing.', 'All set for the night drive.', 'On our way. Take it gently.'],
    arrive: ['Home safe, or close to it.', 'You made it through the dark.', 'Arrived. Mind your step getting out.', 'Safely there tonight.', 'End of the route. Well driven.', 'There you are. Rest your eyes.'],
    reroute: ['New route ready. No rush.', 'All right, another way it is.', 'Found a different road.', 'That works too. New route.'],
    cruise: ['Still on the right road.', 'If you feel tired, find a safe place to stop.', 'Long stretch. Keep a steady speed.', 'Watch for animals near the road edges.', 'All good so far.', 'Nothing to do for a while.', 'Dim the screen if it feels too bright.', 'Steady and calm.'],
    tags: ['Good.', 'Easy.', 'That is it.', 'Gently.', 'Fine.', 'Steady now.']
  },
  arrivals: [['Safely', 'Home'], ['Through', 'The Dark'], ['Rest Your', 'Eyes'], ['Well', 'Driven']]
});
navTheme({
  id: 'calmseas', title: 'Calm Seas', blurb: 'Soft blues, slow words and very little chatter. For nervous drivers and anyone who likes it quiet.',
  ages: ['clear', 'adults', 'teens'], vibes: ['calm', 'pastel', 'nature'],
  fonts: { display: 'Quicksand', mono: 'Lexend', weight: 600, query: 'family=Quicksand:wght@600&family=Lexend:wght@400' },
  colorName: 'Shallows',
  colors: { ground: '#E7F1F5', ink: '#12303D', accent: '#1F6FB2', panel: '#F6FAFC', glow: '#9CC9E6', alert: '#B33A3A', water: '#B8DDF0', park: '#D6ECDD', roads: '#FFFFFF' },
  colorways: [
    { name: 'Sea Glass', colors: { ground: '#E2F2EC', ink: '#173B30', accent: '#2C8A6B', glow: '#9ED6C2', water: '#BFE3E0', park: '#D2EBD4' } },
    { name: 'Lavender Mist', colors: { ground: '#EEEAF6', ink: '#2A2440', accent: '#6650B8', glow: '#C3B6EC', water: '#CFDDF2', park: '#DDEBDD' } },
    { name: 'Sand', colors: { ground: '#F3EDE2', ink: '#33291A', accent: '#2F6F9F', glow: '#E3CFA8', water: '#C2DCEA', park: '#E0E6CC' } },
    { name: 'Deep Water', colors: { ground: '#0F2430', ink: '#E3F1F7', accent: '#6CC3FF', panel: '#16303F', glow: '#2C6E96', water: '#0A3550', park: '#123326', roads: '#2C4757' } }
  ],
  map: { texture: 'waves', textureAlpha: 0.05, textureRole: 'accent', marker: 'shell', route: 'outlined', routeWidth: 1.2, labels: 'Regular', labelSize: 1.2 },
  frame: 'rounded', scale: 1.2,
  voice: {
    speaker: 'Tide', channel: 'a slow, quiet voice like the sea', rate: 0.86, pitch: 0.98,
    L: { search: 'Where to?', routes: 'Gentle routes', start: 'Begin', end: 'End', eta: 'Arrive at', left: 'Time left', arrive: 'You are there', reroute: 'A new way', then: 'Then' },
    depart: ['Breathe in. Breathe out. Let us go.', 'Nice and slow. We have time.', 'We are on our way, gently.', 'Easy start. I am right here.', 'Off we go, calm and steady.', 'The route is ready. No hurry.'],
    arrive: ['You are there. Take a breath.', 'Arrived. That went well.', 'Calmly done.', 'You got here safely.', 'All done. Unclench those shoulders.', 'Here at last. Well done.'],
    reroute: ['That is all right. A new way is ready.', 'No harm done. Another road.', 'Easy. Here is a different route.', 'All fine. Changing course gently.'],
    cruise: ['Relax your grip a little.', 'Breathe slowly. You are doing well.', 'Nothing to do for a while.', 'The road is quiet here.', 'Steady, like the tide.', 'You are safe and on track.', 'Loosen your shoulders.', 'Plenty of time.'],
    tags: ['Gently.', 'Good.', 'Calmly.', 'Well done.', 'Easy.', 'Softly.']
  },
  arrivals: [['Take A', 'Breath'], ['Calmly', 'Done'], ['Safe', 'Harbor'], ['Still', 'Water']]
});
