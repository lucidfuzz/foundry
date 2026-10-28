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
navTheme({
  id: 'mono', title: 'Quiet Mono', blurb: 'Black, white and one bright line. Almost no words. For people who want the map and nothing else.',
  ages: ['adults', 'teens'], vibes: ['minimal', 'calm'],
  fonts: { display: 'Inter Tight', mono: 'IBM Plex Mono', weight: 600, query: 'family=Inter+Tight:wght@600&family=IBM+Plex+Mono:wght@400;500' },
  colorName: 'White',
  colors: { ground: '#F4F4F2', ink: '#111111', accent: '#E03C00', panel: '#FFFFFF', glow: '#FFB48F', alert: '#D0021B', water: '#DADAD8', park: '#EAEAE7', roads: '#FFFFFF', highway: '#D2D2CF' },
  colorways: [
    { name: 'Black', colors: { ground: '#0E0E0E', ink: '#F2F2F2', accent: '#FF5A1F', panel: '#181818', glow: '#7A2A0A', alert: '#FF4D4D', water: '#1F1F1F', park: '#151515', roads: '#2E2E2E', highway: '#454545' } },
    { name: 'Blue', colors: { accent: '#0038FF', glow: '#9DB0FF' } },
    { name: 'Concrete', colors: { ground: '#D8D8D4', ink: '#0A0A0A', accent: '#C4161C', panel: '#EDEDEA', glow: '#E89A9C', water: '#C2C2BE', park: '#CDCDC9', roads: '#F2F2EF', highway: '#B5B5B1' } },
    { name: 'Yellow', colors: { ground: '#1C1C1C', ink: '#F4F4F4', accent: '#FFE100', panel: '#242424', glow: '#6E6200', alert: '#FF5A5A', water: '#2A2A2A', park: '#222222', roads: '#3A3A3A', highway: '#505050' } }
  ],
  map: { texture: 'none', marker: 'chevron', route: 'solid', routeWidth: 1.15, labels: 'Regular', buildings: 'none' },
  frame: 'square',
  voice: {
    speaker: 'Nil', channel: 'a voice with the volume most of the way down', rate: 1, pitch: 0.95,
    L: { search: 'Search', routes: 'Routes', start: 'Start', end: 'End', eta: 'ETA', left: 'Left', arrive: 'Arrived', reroute: 'Rerouted', then: 'Then' },
    depart: ['Go.', 'Route set.', 'Underway.', 'Off we go.', 'Ready when you are. Which is now.', 'Starting. That is all.'],
    arrive: ['Here.', 'Arrived.', 'Done.', 'End of route.', 'That was it.', 'You are here. So am I, briefly.'],
    reroute: ['New route.', 'Adjusted.', 'Other way, then.', 'Fixed. No comment.'],
    cruise: ['Straight on.', 'Nothing to report.', 'Still right.', 'Quiet road.', 'Carry on.', 'No turns yet.', 'Silence is included.', 'All fine.'],
    tags: ['Good.', 'Yes.', 'Right.', 'Noted.', 'Fine.', 'Okay.']
  },
  arrivals: [['Here.', 'Done.'], ['End Of', 'Route'], ['That', 'Was It'], ['You Are', 'Here']]
});
navTheme({
  id: 'gilded', title: 'Gilded Night', blurb: 'Black lacquer, gold lines and a chauffeur who lets you take the wheel tonight. Art deco, after dark.',
  ages: ['adults'], vibes: ['luxe', 'dark', 'retro'], upper: true,
  fonts: { display: 'Limelight', mono: 'Josefin Sans', weight: 400, query: 'family=Limelight&family=Josefin+Sans:wght@400;600' },
  colorName: 'Onyx',
  colors: { ground: '#0C0B09', ink: '#F3E6C4', accent: '#D9B140', panel: '#15130F', glow: '#8A6D1F', alert: '#E0533C', water: '#13202E', park: '#161A12', roads: '#2C271B', highway: '#4D4125' },
  colorways: [
    { name: 'Emerald', colors: { ground: '#06231B', ink: '#F2E8CC', accent: '#E6BE52', panel: '#0B2E24', glow: '#7E6A26', water: '#08303A', park: '#0A2C20', roads: '#1F4438', highway: '#3C5A3E' } },
    { name: 'Sapphire', colors: { ground: '#0A1430', ink: '#F1E7CF', accent: '#E8C35C', panel: '#111D40', glow: '#7D6A30', water: '#0C1F4A', park: '#0E1E2C', roads: '#243358', highway: '#45496A' } },
    { name: 'Ivory', colors: { ground: '#F3ECDC', ink: '#1A1408', accent: '#8C6410', panel: '#FFFBF0', glow: '#E2C77A', alert: '#B0301C', water: '#D7DEDF', park: '#E5E3CD', roads: '#FFFFFF', highway: '#E6D6A8' } },
    { name: 'Rose Gold', colors: { ground: '#1A1114', ink: '#F6E2D8', accent: '#EBAA8E', panel: '#241820', glow: '#7E4A3E', water: '#1A1A26', park: '#1C1A16', roads: '#3A2A2D', highway: '#5A3E3A' } }
  ],
  map: { texture: 'lattice', textureAlpha: 0.06, textureRole: 'accent', marker: 'crown', route: 'solid', routeWidth: 1.15, labels: 'Regular', upper: true, buildings: 'outline' },
  frame: 'deco',
  voice: {
    speaker: 'Lowell', channel: 'the partition glass, lowered an inch', rate: 0.94, pitch: 0.9,
    L: { search: 'Where to, tonight?', routes: 'Choose your route', start: 'Start the car', end: 'End', eta: 'Arriving', left: 'Remaining', arrive: 'We have arrived', reroute: 'A new route', then: 'Then' },
    depart: ['The car is yours tonight. I shall sit back and advise.', 'Mirrors set, seat adjusted. Shall we?', 'A fine evening for it. Proceed, if you please.', 'Route engraved, so to speak. Off we go.', 'Smoothly now. The best arrivals start unhurried.', 'The city is lit up for us. Do enjoy it.'],
    arrive: ['We have arrived. Do make an entrance.', 'Destination reached. I would open your door if I could.', 'Here we are, and not a hair out of place.', 'Arrived. Splendidly done.', 'Your evening awaits. Mind the step.', 'Delivered in style, as promised.'],
    reroute: ['A slight change of plan. Nobody need know.', 'Another route, equally elegant.', 'We shall take the long way round, gracefully.', 'Recalculated. Composure is everything.'],
    cruise: ['A good driver is never in a hurry. You are a good driver.', 'Steady hands. Very proper.', 'The city looks rather fine tonight.', 'A long, polished stretch ahead.', 'Eyes on the road, please. The view will wait for us.', 'Every streetlight is gold if you squint. Please do not squint.', 'Shoulders back, hands easy. Lovely.', 'Quiet road. I shall say nothing further. For now.'],
    tags: ['Splendid.', 'Very good.', 'Quite right.', 'Elegantly done.', 'Indeed.', 'Most proper.']
  },
  arrivals: [['Make An', 'Entrance'], ['Delivered', 'In Style'], ['Your Evening', 'Awaits'], ['Arrived', 'Splendidly']]
});
navTheme({
  id: 'hedgerow', title: 'Hedgerow Cottage', blurb: 'Cream paper, jam-red route and wildflowers in the lanes. A cottage baker sees you home with flour on her hands.',
  ages: ['adults', 'teens'], vibes: ['cozy', 'nature', 'pastel'],
  fonts: { display: 'Caprasimo', mono: 'Lora', weight: 400, query: 'family=Caprasimo&family=Lora:wght@400;600' },
  colorName: 'Raspberry Jam',
  colors: { ground: '#FBF2E2', ink: '#3E2C1E', accent: '#C0392F', panel: '#FFFAF0', glow: '#F2B8A8', alert: '#A61E1E', water: '#CDE2E6', park: '#DCEAC6', roads: '#FFFFFF', highway: '#EED9A6' },
  colorways: [
    { name: 'Elderflower', colors: { ground: '#F6F4E3', ink: '#33361F', accent: '#5E7E2E', glow: '#D6E3A8', water: '#D3E6E2', park: '#DEE9C2' } },
    { name: 'Blue Gingham', colors: { ground: '#EDF1F6', ink: '#22314A', accent: '#2F58A3', panel: '#F9FBFE', glow: '#B4C8EA', water: '#C6DAEE', park: '#DCE8D2' } },
    { name: 'Plum Crumble', colors: { ground: '#F4E8EC', ink: '#3D2335', accent: '#8A3470', panel: '#FCF6F8', glow: '#DDB0CC', water: '#D4DEEC', park: '#E2EAD3' } },
    { name: 'Hearth', colors: { ground: '#2B211A', ink: '#F6E8D3', accent: '#F2A65E', panel: '#362A21', glow: '#9B5C3A', alert: '#FF7060', water: '#1F2D33', park: '#2C3322', roads: '#4A3A2E', highway: '#6A5236' } }
  ],
  map: { texture: 'paper', textureAlpha: 0.07, textureRole: 'ink', marker: 'flower', route: 'outlined', routeWidth: 1.1, labels: 'Regular' },
  frame: 'stitch',
  voice: {
    speaker: 'Hattie Bramble', channel: 'the kitchen radio on the windowsill', rate: 0.97, pitch: 1.06,
    L: { search: 'Where are we off to?', routes: 'Pick a lane', start: 'Off we go', end: 'Stop', eta: 'Home by', left: 'Still to go', arrive: 'Here we are', reroute: 'Another lane', then: 'Then' },
    depart: ['Kettle off, door latched. Away we go.', 'Basket packed. Lovely day for a drive.', 'Off you pop. I have saved you a scone.', 'Right then, petal. Nice and gentle down the lane.', 'Bread is proving, so there is no rush.', 'Wildflowers either side. Let us go and see them.'],
    arrive: ['Here we are. Wipe your boots.', 'Arrived, warm as a fresh loaf.', 'There you go, love. Safe and sound.', 'Made it. That calls for a slice of something.', 'Home and dry, or near enough.', 'All done. Put your feet up a minute.'],
    reroute: ['Bit of a muddy patch. Round the other way.', 'No bother. Another lane will do.', 'Wrong side of the hedge. Happens to us all.', 'New way found. The jam will keep.'],
    cruise: ['Lovely bit of road, this.', 'Hedges are heavy with blackberries this time of year.', 'Steady as a rolling pin.', 'Give the cyclists plenty of room, they are only out for the air.', 'Nothing to do for a while but enjoy the green.', 'Gentle hands. Like folding in flour.', 'Window down if you fancy. Smell that?', 'Still on track, petal.'],
    tags: ['Lovely.', 'There we are.', 'Nicely done.', 'Good as gold.', 'Sweet as jam.', 'Just so.']
  },
  arrivals: [['Safe And', 'Sound'], ['Wipe Your', 'Boots'], ['Fresh From', 'The Oven'], ['Kettle', 'On']]
});
navTheme({
  id: 'blueprint', title: 'Blueprint', blurb: 'Deep blue sheets, white linework and a site foreman on the radio. Your trip, drawn to scale and built to plan.',
  ages: ['adults', 'teens'], vibes: ['minimal', 'retro'], upper: true,
  fonts: { display: 'Architects Daughter', mono: 'Overpass Mono', weight: 400, query: 'family=Architects+Daughter&family=Overpass+Mono:wght@400;600' },
  colorName: 'Cyanotype',
  colors: { ground: '#0F3B78', ink: '#F2F7FF', accent: '#FFC93C', panel: '#0B3168', glow: '#5E8FD6', alert: '#FF6B5C', water: '#0A2E62', park: '#16468A', roads: '#5F89C6', highway: '#A9C3EA' },
  colorways: [
    { name: 'Drafting Table', colors: { ground: '#F3F0E6', ink: '#1C2A44', accent: '#D0412A', panel: '#FFFDF7', glow: '#F0A898', alert: '#B3261E', water: '#D3E1EE', park: '#E2E8D3', roads: '#FFFFFF', highway: '#D9DCE2' } },
    { name: 'Diazo', colors: { ground: '#EEE8F4', ink: '#2C1F5C', accent: '#D23A72', panel: '#FAF7FD', glow: '#E8A6C0', alert: '#B3261E', water: '#D6D9F0', park: '#E1E6DA', roads: '#FFFFFF', highway: '#D6CFE6' } },
    { name: 'Vellum', colors: { ground: '#E4ECF1', ink: '#0F2A44', accent: '#1C5BD0', panel: '#F5F9FB', glow: '#9EBCF0', alert: '#B3261E', water: '#C3D6E4', park: '#D5E3DE', roads: '#FFFFFF', highway: '#C8D6E2' } },
    { name: 'Night Shift', colors: { ground: '#0B1220', ink: '#CFE3FF', accent: '#3CF0C8', panel: '#111A2C', glow: '#1D7A68', water: '#0D1A33', park: '#0F1B27', roads: '#2B3A55', highway: '#41557C' } }
  ],
  map: { texture: 'grid', textureAlpha: 0.12, textureRole: 'ink', marker: 'ring', route: 'solid', routeWidth: 1.1, labels: 'Regular', upper: true, buildings: 'outline' },
  frame: 'square',
  voice: {
    speaker: 'Foreman Dolores', channel: 'a walkie-talkie clipped to the drawings', rate: 1.04, pitch: 0.92,
    L: { search: 'Search site address', routes: 'Pick a plan', start: 'Start work', end: 'Stop', eta: 'Handover', left: 'Time left', arrive: 'Signed off', reroute: 'Revised plan', then: 'Then' },
    depart: ['Plans are approved. Let us build this trip.', 'Measure twice, drive once. Go.', 'Site is clear. Rolling out.', 'Footings are poured. Off we go.', 'Copy that, route is on the drawings.', 'Hard hats on. Day one of the job.'],
    arrive: ['Topped out. Nice work.', 'Signed off and handed over.', 'Job done, on time and on spec.', 'That is a wrap on this phase.', 'Inspection passed. You are here.', 'Built to plan. Go take a look.'],
    reroute: ['Change order. Revised drawings coming up.', 'Detour around the works. No sweat.', 'Plans changed. That is construction.', 'Revision B is ready.'],
    cruise: ['Long straight run. Easy does it.', 'Everything is plumb and level so far.', 'Hold this line. Next junction is on sheet two.', 'Slow down for road crews. They have families.', 'Load-bearing driving, this. Steady.', 'Within tolerance. Keep going.', 'Coffee break later. Road first.', 'Square, true and on schedule.'],
    tags: ['Copy.', 'Solid.', 'Plumb.', 'Square.', 'Spot on.', 'To spec.']
  },
  arrivals: [['Signed', 'Off'], ['Built To', 'Plan'], ['Topped', 'Out'], ['On Time,', 'On Spec']]
});
navTheme({
  id: 'watercolor', title: 'Watercolor Wash', blurb: 'Soft painted washes on cotton paper, a route that bleeds a little at the edges and a gentle painter at your side.',
  ages: ['adults', 'teens'], vibes: ['pastel', 'calm'],
  fonts: { display: 'Caveat', mono: 'Mulish', weight: 600, query: 'family=Caveat:wght@600&family=Mulish:wght@400;600' },
  colorName: 'Cerulean',
  colors: { ground: '#F6F1E9', ink: '#2E3140', accent: '#3B6CB4', panel: '#FFFDF9', glow: '#A9C4EA', alert: '#C2364F', water: '#BBD5EE', park: '#D3E6C4', roads: '#FFFFFF', highway: '#EDE3D0' },
  colorways: [
    { name: 'Rose Madder', colors: { ground: '#F8EEEE', ink: '#3F2630', accent: '#B8476A', glow: '#EDB3C4', water: '#D6E2EF', park: '#E5EDD8' } },
    { name: 'Sap Green', colors: { ground: '#EEF3E8', ink: '#26331F', accent: '#467A34', glow: '#B8D8A6', water: '#CFE4E2', park: '#D3E5C3' } },
    { name: 'Yellow Ochre', colors: { ground: '#F7EFDD', ink: '#3A2E18', accent: '#AD5F14', glow: '#EBC48E', water: '#D4E3EA', park: '#E3E7C6' } },
    { name: 'Indigo Night', colors: { ground: '#1D2235', ink: '#ECE8F2', accent: '#A3BAFF', panel: '#262C42', glow: '#4B5D9A', alert: '#FF7A8C', water: '#18294A', park: '#22302E', roads: '#39405A', highway: '#6A5470' } }
  ],
  map: { texture: 'waves', textureAlpha: 0.07, textureRole: 'accent', marker: 'leaf', route: 'glow', routeWidth: 1.3, labels: 'Regular', buildings: 'none' },
  frame: 'rounded',
  voice: {
    speaker: 'Ottilie', channel: 'a soft voice from behind the easel', rate: 0.93, pitch: 1.04,
    L: { search: 'Where shall we paint?', routes: 'Choose a line', start: 'Start', end: 'End', eta: 'Arriving', left: 'Still to go', arrive: 'Finished', reroute: 'A new line', then: 'Then' },
    depart: ['Wet the brush. We start with a light wash.', 'A clean page and a good route. Off we go.', 'Loose wrists, eyes on the road. Lovely.', 'First stroke down. Here we go.', 'We will let the journey bleed in gently.', 'Colors mixed. Away we go.'],
    arrive: ['And that is the final stroke.', 'Here we are. Let it dry a moment.', 'Arrived. Sign the corner, it is yours.', 'Finished, and it turned out beautifully.', 'We made it. Step back and admire.', 'There. Not a single muddy patch.'],
    reroute: ['A happy accident. We will paint around it.', 'The color ran a little. New route.', 'No need to start over. Just a new line.', 'Lift it out and try another way.'],
    cruise: ['Look how the light falls on the road ahead.', 'Soft focus on the scenery, sharp focus on the road.', 'Long, even strokes. Just like this.', 'The sky is doing half the work today.', 'Steady hand. Nothing to fix.', 'Every road is a different grey, if you look.', 'Let the colors settle. We have a while.', 'Not too much water on the brush. Not too much on the pedal.'],
    tags: ['Beautiful.', 'Gently.', 'Oh, nice.', 'Mm, yes.', 'Pretty.', 'Clean edge.']
  },
  arrivals: [['The Final', 'Stroke'], ['Let It', 'Dry'], ['Sign The', 'Corner'], ['Painted', 'And Done']]
});
navTheme({
  id: 'desert', title: 'Desert Bloom', blurb: 'Sun-baked sand, cactus flowers and golden hour radio. A boho road trip with the windows down and nowhere to be.',
  ages: ['adults', 'teens'], vibes: ['nature', 'retro'],
  fonts: { display: 'Shrikhand', mono: 'Work Sans', weight: 400, query: 'family=Shrikhand&family=Work+Sans:wght@400;600' },
  colorName: 'Golden Hour',
  colors: { ground: '#F6DDBF', ink: '#3A2218', accent: '#B5306A', panel: '#FFF3E3', glow: '#F5A65B', alert: '#A8261B', water: '#A6D2CE', park: '#E0DCAE', roads: '#FFF6EA', highway: '#F2B97A' },
  colorways: [
    { name: 'Terracotta', colors: { ground: '#E8C0A2', ink: '#36190F', accent: '#1F6E69', panel: '#F8E4D4', glow: '#7FC4BC', water: '#9CC8C4', park: '#D6CFA0', roads: '#F7E3D2', highway: '#D98F62' } },
    { name: 'Sagebrush', colors: { ground: '#E5E6D0', ink: '#2D3324', accent: '#B8481E', panel: '#F6F6EA', glow: '#E8A57E', water: '#B5D6D2', park: '#D0D9B4', roads: '#FAFAF1', highway: '#D9C796' } },
    { name: 'Painted Sky', colors: { ground: '#F5D7CF', ink: '#3D2030', accent: '#5E3C9E', panel: '#FDEEEA', glow: '#C2A8E8', water: '#BCD3E6', park: '#E6DCB6', roads: '#FFF4F0', highway: '#F0B49E' } },
    { name: 'Desert Night', colors: { ground: '#1E1A2E', ink: '#F6E3C8', accent: '#FFB347', panel: '#29233C', glow: '#A35C3A', alert: '#FF6F61', water: '#1C2A44', park: '#262A2A', roads: '#3D3550', highway: '#5C4A5E' } }
  ],
  map: { texture: 'dots', textureAlpha: 0.06, textureRole: 'ink', marker: 'sun', route: 'outlined', routeWidth: 1.15, labels: 'Bold' },
  frame: 'ticket',
  voice: {
    speaker: 'Sunny Mesa', channel: 'golden hour radio, somewhere past mile marker 90', rate: 1.02, pitch: 1.02,
    L: { search: 'Where to, road friend?', routes: 'Pick your road', start: 'Hit the road', end: 'End trip', eta: 'Arriving', left: 'Left to go', arrive: 'You made it', reroute: 'Detour time', then: 'Then' },
    depart: ['Windows down, playlist on. Here we go, road friend.', 'Sun is low and the road is long. Let us ride.', 'This is golden hour radio, and you are rolling with me.', 'Tank full, water bottle full. Hit it.', 'Dust off those boots. We are moving.', 'The desert is in bloom and so are you. Let us go.'],
    arrive: ['And that is the last song of the drive.', 'You made it, sunshine. Stretch those legs.', 'Arrived, right on golden hour.', 'Pull up a lawn chair. We are here.', 'That is a wrap from the open road.', 'Destination reached. Go catch that sunset.'],
    reroute: ['Road closed? No worries, the desert has other plans.', 'New route. Every detour has a view.', 'Swinging around the long way, nice and easy.', 'Tumbleweed in the way. Rerouting.'],
    cruise: ['Miles of open road and nothing but sky.', 'Sip some water when you stop. The air is dry out here.', 'A request from the road: keep it steady.', 'The cactus flowers will still be there later. Eyes ahead.', 'Golden light, easy miles.', 'Sunglasses on if the glare gets you.', 'Heat shimmer on the horizon. Nothing to worry about.', 'Still on route, still in bloom.'],
    tags: ['Far out.', 'Right on.', 'Groovy.', 'Golden.', 'Sweet ride.', 'Nice and easy.']
  },
  arrivals: [['Catch That', 'Sunset'], ['Golden', 'Arrival'], ['Road Trip', 'Complete'], ['Stretch', 'Your Legs']]
});
navTheme({
  id: 'academia', title: 'Oak & Ink', blurb: 'Dark oak, brass lamps and tweed. The head librarian keeps your route in the catalogue and whispers every turn.',
  ages: ['adults', 'teens'], vibes: ['dark', 'cozy'],
  fonts: { display: 'Playfair Display SC', mono: 'Crimson Pro', weight: 700, query: 'family=Playfair+Display+SC:wght@700&family=Crimson+Pro:wght@400;600' },
  colorName: 'Oak',
  colors: { ground: '#2A1F18', ink: '#EFE3CC', accent: '#E39B45', panel: '#33261D', glow: '#8C6A2E', alert: '#E06A5F', water: '#1E2A2E', park: '#2B2E1F', roads: '#4A382B', highway: '#6A5038' },
  colorways: [
    { name: 'Green Lamp', colors: { ground: '#14251E', ink: '#EDE6D0', accent: '#E0B354', panel: '#1B3128', glow: '#7A6A2E', water: '#10202A', park: '#1C3020', roads: '#2E4438', highway: '#4A5A3E' } },
    { name: 'Oxblood', colors: { ground: '#2B1215', ink: '#F2E2D4', accent: '#E8B86E', panel: '#361A1D', glow: '#8A5A34', water: '#1C1E28', park: '#2A2418', roads: '#4A2A2C', highway: '#664038' } },
    { name: 'Reading Room', colors: { ground: '#EEE5D2', ink: '#2A1E14', accent: '#8B2F2F', panel: '#F8F1E2', glow: '#D9A97A', alert: '#A3261E', water: '#C9D5D3', park: '#D9D8BC', roads: '#FBF6EA', highway: '#D8C49E' } },
    { name: 'Midnight Study', colors: { ground: '#151A26', ink: '#E8E0CC', accent: '#DE9460', panel: '#1C2232', glow: '#7A4A30', water: '#0F1A2E', park: '#1A2420', roads: '#2E3648', highway: '#4A4A50' } }
  ],
  map: { texture: 'hatch', textureAlpha: 0.05, textureRole: 'ink', marker: 'feather', route: 'outlined', routeWidth: 1.1, labels: 'Regular' },
  frame: 'double',
  voice: {
    speaker: 'Miss Ashgrove', channel: 'a whisper across the reading room', rate: 0.92, pitch: 0.96,
    L: { search: 'Search the catalogue', routes: 'Choose a passage', start: 'Begin', end: 'End', eta: 'Due at', left: 'Remaining', arrive: 'The end', reroute: 'Revised edition', then: 'Then' },
    depart: ['Quietly now. We are leaving the stacks.', 'Your route has been checked out. Due back on arrival.', 'Coat on, scarf on, off we go.', 'Shh. The journey begins.', 'Everything else is shelved. Let us go.', 'Chapter one: the driveway.'],
    arrive: ['And so concludes this volume.', 'Arrived. Do return your route in good condition.', 'The end. A satisfying one, too.', 'Here we are. Mind the creaky step.', 'Well read. I mean, well driven.', 'Arrived on time. No late fees.'],
    reroute: ['We seem to have skipped a page. Turning back.', 'A revised edition, just for you.', 'Misfiled. I have found the right shelf now.', 'Cross-referencing. New route ready.'],
    cruise: ['A long passage. Settle in.', 'Silence in the car, please. Except for me.', 'This road is better written than most.', 'Still on the right page.', 'Footnote: you are doing very well.', 'The lamps are lit and the road is clear.', 'Patience is a scholarly virtue.', 'Nothing to annotate for a while.'],
    tags: ['Precisely.', 'Correct.', 'Exemplary.', 'Duly noted.', 'Quite.', 'Top marks.']
  },
  arrivals: [['The', 'End'], ['No Late', 'Fees'], ['Chapter', 'Closed'], ['Well', 'Read']]
});
