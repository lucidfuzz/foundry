// Navie themes for grown-ups (some suit teens too). DRAFT: awaiting Jordan's approval. Format: nav/src/kit.js.
navTheme({
  id: 'strawberry', title: 'Strawberry Milk', blurb: 'Pink milk, cream roads and a little heart that leads the way. Soft, sweet, never shouty.',
  ages: ['teens', 'adults'], vibes: ['cute', 'pastel'],
  fonts: { display: 'Fredoka', mono: 'Nunito', weight: 600, query: 'family=Fredoka:wght@600&family=Nunito:wght@500;700' },
  colorName: 'Strawberry',
  colors: { ground: '#FFE3EC', ink: '#5A2A3C', accent: '#F2547D', panel: '#FFF5F8', glow: '#FFB3C7', alert: '#E0315E', water: '#CFE6F7', park: '#E6F4DC', roads: '#FFFFFF' },
  colorways: [
    { name: 'Banana', colors: { ground: '#FFF4CF', ink: '#4D3A12', accent: '#E89B1C', panel: '#FFFBEA', glow: '#FFE07A', water: '#D4EAF5', park: '#E7F2D3' } },
    { name: 'Pistachio', colors: { ground: '#E6F0DA', ink: '#2F3D24', accent: '#5F9E46', panel: '#F6FAF0', glow: '#BFDDA8', water: '#D2E8EC', park: '#D3E6BF' } },
    { name: 'Blueberry', colors: { ground: '#E3E6FB', ink: '#262C5A', accent: '#5463E8', panel: '#F5F6FF', glow: '#B7BFF7', water: '#CFE0F5', park: '#E2F0E0' } },
    { name: 'Chocolate', colors: { ground: '#3B2620', ink: '#FCE9E1', accent: '#FF8FB1', panel: '#4A3029', glow: '#B86F7F', water: '#2D3A44', park: '#3A3A26', roads: '#6A4A40' } }
  ],
  map: { texture: 'hearts', textureAlpha: 0.06, textureRole: 'accent', marker: 'heart', route: 'outlined', labels: 'Bold' },
  frame: 'pill',
  voice: {
    speaker: 'Berry', channel: 'a strawberry milk carton with a very small speaker', rate: 1, pitch: 1.12,
    L: { search: 'Where are we going?', routes: 'Pick a sweet route', start: "Let's go", end: 'Stop', eta: 'Arriving', left: 'Left to go', arrive: 'Made it', reroute: 'New route, no worries', then: 'Then' },
    depart: ['Okay, cutie. We are on our way.', 'Seatbelt on, snacks ready. Let us go.', 'Route all set. Sip and go.', 'Here we go. You look great, by the way.', 'Off we go, nice and easy.', 'Pink route loaded. Enjoy the ride.'],
    arrive: ['You made it. That deserves a treat.', 'We are here. Lovely driving.', 'Arrived. Time for a little reward.', 'Destination reached, sweetly done.', 'Here we are. Gold star for you.', 'You are here. That went so smoothly.'],
    reroute: ['No worries, new route coming up.', 'Little detour. We still get there.', 'Found another way for you.', 'All good. Taking the scenic route now.'],
    cruise: ['Still on track. Doing great.', 'Long stretch ahead. Maybe some music?', 'Remember to drink some water later.', 'Smooth sailing so far.', 'You are a very calm driver. I noticed.', 'Halfway feelings. Keep going.', 'This road is behaving nicely.', 'Shoulders down, jaw relaxed. There you go.'],
    tags: ['Nice.', 'Lovely.', 'There you go.', 'Smooth.', 'Perfect.', 'Easy.']
  },
  arrivals: [['Sweet', 'Arrival'], ['You Made', 'It, Cutie'], ['Treat', 'Yourself'], ['Smooth', 'And Sweet']]
});
