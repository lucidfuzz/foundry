// Navie themes for kids riding along with a grown-up (car, bike or walk). The guide talks to the whole car: short, warm,
// playful lines that never ask a child to do anything unsafe and never pull the driver's eyes off the road. Every fact is
// real. DRAFT: awaiting Jordan's approval. Format: nav/src/kit.js.
navTheme({
  id: 'dino', title: 'Dino Dig', blurb: 'A fossil-hunting expedition across sandy dig sites, with footprints for a marker and real dinosaur facts on the way.',
  ages: ['kids'], vibes: ['playful', 'nature'],
  fonts: { display: 'Lilita One', mono: 'Andika', weight: 400, query: 'family=Lilita+One&family=Andika:wght@400;700' },
  colorName: 'Sandstone',
  colors: { ground: '#ECD3A2', ink: '#3A2816', accent: '#E2602A', panel: '#FFF6E2', glow: '#F7C977', alert: '#C2362B', water: '#9FD3DD', park: '#CDE1A0', roads: '#FFFDF7' },
  colorways: [
    { name: 'Fern Valley', colors: { ground: '#E0EDCB', ink: '#1F3418', accent: '#EA6420', panel: '#F5FAEC', glow: '#FFD27A', water: '#9ED2D4', park: '#B6D78F' } },
    { name: 'Frosty Peaks', colors: { ground: '#E5EFF5', ink: '#1B3247', accent: '#E04E36', panel: '#F6FAFD', glow: '#A9D6F5', water: '#A6CBEA', park: '#D0E4D6' } },
    { name: 'Riverbed', colors: { ground: '#E2DFD6', ink: '#2A2C2D', accent: '#128A79', panel: '#F5F3EE', glow: '#9FD9CB', water: '#A2CADB', park: '#C7D7B0' } },
    { name: 'Volcano Night', colors: { ground: '#2E2320', ink: '#FCEADB', accent: '#FF7B3A', panel: '#3C2E2A', glow: '#8E3D1F', alert: '#FF5A4A', water: '#1D3740', park: '#303A22', roads: '#5A4640', highway: '#7A5A48' } }
  ],
  map: { texture: 'stipple', textureAlpha: 0.09, textureRole: 'ink', marker: 'footprint', route: 'outlined', routeWidth: 1.2, labels: 'Bold', labelSize: 1.05 },
  frame: 'bubble', scale: 1.1,
  voice: {
    speaker: 'Professor Pebble', channel: 'a crackly walkie-talkie from the dig tent', rate: 1, pitch: 1.05,
    L: { search: 'Where shall we dig?', routes: 'Pick a trail', start: 'Start the dig', end: 'End', eta: 'Arrive at', left: 'Time left', arrive: 'Dig site reached', reroute: 'New trail', then: 'Then' },
    depart: ['Hats on, brushes ready. The dig begins.', 'Expedition team, we\'re on our way.', 'Stomp, stomp. Off we go, explorers.', 'Map is ready. Let\'s go find some fossils.', 'Everybody buckled? Then the dig is on.', 'Off we go, like a herd on the move.'],
    arrive: ['We made it. Great digging, team.', 'Dig site reached. Fossil found.', 'We\'re here. Time for a tiny dino roar.', 'Expedition complete. Brushes down.', 'Arrived. That was a mighty good trip.', 'Here we are. Every explorer gets a gold star.'],
    reroute: ['New path. Even explorers take detours.', 'Oops, wrong trail. Here\'s a new one.', 'No problem. Digging up a new route.', 'We\'ll go around, like a herd around a lake.'],
    cruise: [
      'Fun fact: some dinosaurs had feathers.',
      'Fun fact: birds are dinosaurs. Every bird you see is a tiny cousin of the big ones.',
      'Fun fact: the word dinosaur means terrible lizard. They were not really lizards, though.',
      'Fun fact: dinosaurs laid eggs, just like birds do today.',
      'Fun fact: the very biggest dinosaurs only ate plants.',
      'Fun fact: some Tyrannosaurus teeth were as long as a banana.',
      'Fun fact: people who study fossils are called paleontologists. Can you say it? Pay-lee-on-tol-o-jists.',
      'Game time: count every truck you see. Trucks are the giant plant eaters of the road.',
      'Joke: what do you call a sleeping dinosaur? A dino-snore.',
      'Joke: what do you call a dinosaur who knows lots of words? A thesaurus.',
      'Quiet game: who can stay as still as a fossil? Starting now.'
    ],
    tags: ['Roar-some.', 'Dino-mite.', 'Stomp, stomp.', 'Dig it.', 'Nice tracks.', 'Good find.']
  },
  arrivals: [['Dig Site', 'Found!'], ['Fossil', 'Found'], ['Big Stomp', 'Arrival'], ['Expedition', 'Complete']]
});

navTheme({
  id: 'rocket', title: 'Rocket Club', blurb: 'Blast off with mission control. A starry map, a little rocket marker and real space facts for the crew in the back.',
  ages: ['kids'], vibes: ['scifi', 'playful'],
  fonts: { display: 'Russo One', mono: 'Titillium Web', weight: 400, query: 'family=Russo+One&family=Titillium+Web:wght@400;600' },
  colorName: 'Deep Space',
  colors: { ground: '#1C2452', ink: '#F3F5FF', accent: '#FFB224', panel: '#252E63', glow: '#5866D8', alert: '#FF5D5D', water: '#122D66', park: '#1E4652', roads: '#3A4686', highway: '#56629F' },
  colorways: [
    { name: 'Moon Base', colors: { ground: '#E8EAF0', ink: '#1B2040', accent: '#D9441C', panel: '#FFFFFF', glow: '#F7A48A', alert: '#C62828', water: '#BACFEF', park: '#D4E5D6', roads: '#FFFFFF', highway: '#F2C7B8' } },
    { name: 'Mars Camp', colors: { ground: '#F6D9C4', ink: '#3B1A0E', accent: '#2B57D6', panel: '#FFF3EA', glow: '#F4A27C', alert: '#C62828', water: '#BCD7EA', park: '#E5DDB0', roads: '#FFF9F4', highway: '#C9D4F5' } },
    { name: 'Nebula', colors: { ground: '#281A48', ink: '#FBF2FF', accent: '#46EBC9', panel: '#36265E', glow: '#A35BD6', water: '#1C2766', park: '#2A3A50', roads: '#4A3A7A', highway: '#6A55A0' } },
    { name: 'Launch Day', colors: { ground: '#DDEEFF', ink: '#0F2747', accent: '#E0441F', panel: '#F5FAFF', glow: '#FFC24D', alert: '#C62828', water: '#A6CFF4', park: '#CDEBCF', roads: '#FFFFFF', highway: '#FFD9A8' } }
  ],
  map: { texture: 'stars', textureAlpha: 0.16, textureRole: 'ink', marker: 'rocket', route: 'glow', routeWidth: 1.15, labels: 'Bold', labelSize: 1.05, buildings: 'outline' },
  frame: 'sticker', scale: 1.1,
  voice: {
    speaker: 'Flight Director Ollie', channel: 'the mission control headset', rate: 1.04, pitch: 1.08,
    L: { search: 'Where to, crew?', routes: 'Pick a flight path', start: 'Start mission', end: 'End', eta: 'Landing at', left: 'Time left', arrive: 'Touchdown', reroute: 'New flight path', then: 'Then' },
    depart: ['Five, four, three, two, one. Liftoff.', 'Mission control here. All systems go.', 'Rocket Club crew, we have liftoff.', 'Engines on, seatbelts on. Away we go.', 'Crew, we are cleared for launch. Off we go.', 'Countdown done. Blasting off, nice and smooth.'],
    arrive: ['Touchdown. Welcome back, crew.', 'We have landed. Mission complete.', 'Landing gear down. We\'re here.', 'Mission accomplished. Crew, you were stellar.', 'Docking complete. Unbuckle when your grown-up says so.', 'Safe landing. Great flying, everyone.'],
    reroute: ['Course correction. New flight path ready.', 'Small wobble. Mission control has a new route.', 'Changing orbit. We\'re still on our way.', 'No problem, crew. Plotting a new course.'],
    cruise: [
      'Space fact: the Sun is a star. It\'s the closest star to us.',
      'Space fact: a day on Mars is just a little longer than a day on Earth.',
      'Space fact: Jupiter is the biggest planet. All the other planets could fit inside it.',
      'Space fact: there is no air to breathe in space, so astronauts wear space suits.',
      'Space fact: astronauts float on the space station, so they sleep in sleeping bags tied to the wall.',
      'Space fact: there is no wind on the Moon, so footprints there can last a very long time.',
      'Crew game: count the blue cars. Each one is a little planet Earth.',
      'Look out for the Moon. Sometimes you can see it in the daytime too.',
      'Joke: how do you throw a party in space? You planet.',
      'Mission control check: snacks secure, crew happy, rocket steady.'
    ],
    tags: ['Roger that.', 'Smooth orbit.', 'Copy, crew.', 'Right on course.', 'Nice piloting.', 'Stellar.']
  },
  arrivals: [['Mission', 'Complete'], ['Touchdown,', 'Crew!'], ['We Have', 'Landed'], ['Stellar', 'Flying']]
});

navTheme({
  id: 'reef', title: 'Bubble Reef', blurb: 'Swim through a sunny lagoon with a friendly octopus. Coral routes, little bubbles and true ocean facts.',
  ages: ['kids'], vibes: ['nature', 'bright'],
  fonts: { display: 'Baloo 2', mono: 'Mulish', weight: 800, query: 'family=Baloo+2:wght@700;800&family=Mulish:wght@500;700' },
  colorName: 'Lagoon',
  colors: { ground: '#D9F4F1', ink: '#0E3846', accent: '#DE3E2C', panel: '#F4FFFD', glow: '#8FE3E0', alert: '#C92A2A', water: '#7CC8E4', park: '#B4E4BF', roads: '#FFFFFF', highway: '#FFC9B8' },
  colorways: [
    { name: 'Sunny Shallows', colors: { ground: '#FFF2CF', ink: '#3A2A0A', accent: '#D93468', panel: '#FFFBEE', glow: '#FFD36B', water: '#8FD3EA', park: '#D3EBAA', highway: '#FFC3D6' } },
    { name: 'Kelp Forest', colors: { ground: '#DCEFD2', ink: '#173520', accent: '#D5461C', panel: '#F4FBEF', glow: '#A8DE8A', water: '#86C9DA', park: '#A9D98D', highway: '#FFCDB0' } },
    { name: 'Coral Pink', colors: { ground: '#FFE5E0', ink: '#4A1A1A', accent: '#0A7C8E', panel: '#FFF6F4', glow: '#FFB3A6', water: '#9ED7EA', park: '#CFEBC4', highway: '#A9DDE6' } },
    { name: 'Deep Sea', colors: { ground: '#0B2A44', ink: '#E6F7FF', accent: '#FFD23F', panel: '#12395A', glow: '#2BB3C9', alert: '#FF6B5A', water: '#051B30', park: '#0F3E3A', roads: '#1F4C6E', highway: '#2E6B8A' } }
  ],
  map: { texture: 'bubbles', textureAlpha: 0.08, textureRole: 'ink', waterTexture: 'bubbles', marker: 'fish', route: 'solid', routeWidth: 1.25, labels: 'Bold', labelSize: 1.05 },
  frame: 'rounded', scale: 1.1,
  voice: {
    speaker: 'Wobble the octopus', channel: 'bubbles that pop into words', rate: 0.98, pitch: 1.15,
    L: { search: 'Where shall we swim?', routes: 'Pick a current', start: 'Start swimming', end: 'End', eta: 'Arrive at', left: 'Time left', arrive: 'Splash, we\'re here', reroute: 'New current', then: 'Then' },
    depart: ['Fins ready? Let\'s swim.', 'Into the big blue we go.', 'Bubbles up. Off we swim.', 'Hold on to your seashells. Here we go.', 'The tide is with us. Let\'s go.', 'All little fish buckled in? Swim time.'],
    arrive: ['We made it to the reef.', 'Splash. We\'re here.', 'Here we are. What a lovely swim.', 'Arrived. Every fish in the school made it.', 'Bubble-tastic. That\'s the end of our swim.', 'We\'re here. Wave hello with all your fins.'],
    reroute: ['Swirly current. A new way is ready.', 'Oops, wrong rock. Swimming another way.', 'No worries. Even fish take a wrong turn.', 'A new current will carry us there.'],
    cruise: [
      'Ocean fact: an octopus like me has three hearts.',
      'Ocean fact: an octopus can taste things with its arms.',
      'Ocean fact: coral looks like a plant, but it is really an animal.',
      'Ocean fact: seahorse dads carry the babies until they hatch.',
      'Ocean fact: a group of fish is called a school.',
      'Ocean fact: sea stars have no brain, and some can grow back a lost arm.',
      'Ocean fact: the blue whale is the biggest animal we know of, ever.',
      'Ocean fact: sea turtles live in water, but they come up to breathe air.',
      'Bubble game: spot something blue. The sky, a car or a sign all count.',
      'Joke: why are fish so smart? Because they live in schools.',
      'Quiet game: be as quiet as a fish. Ready, set, glub.'
    ],
    tags: ['Blub blub.', 'Splish.', 'Swimmingly.', 'Fin-tastic.', 'Bubbly.', 'Sea-sational.']
  },
  arrivals: [['Splash!', 'We Made It'], ['Fin-tastic', 'Swim'], ['Welcome To', 'The Reef'], ['Bubbles', 'Up!']]
});

navTheme({
  id: 'crayon', title: 'Crayon Town', blurb: 'A whole town drawn in crayon on fresh paper. Scribbly roads, a crayon marker and color games for little artists.',
  ages: ['kids'], vibes: ['playful', 'bright'],
  fonts: { display: 'Schoolbell', mono: 'Patrick Hand', weight: 400, query: 'family=Schoolbell&family=Patrick+Hand' },
  colorName: 'Red Crayon',
  colors: { ground: '#FFFDF4', ink: '#24304A', accent: '#E2362C', panel: '#FFFFFF', glow: '#FFD84D', alert: '#C2410C', water: '#92C9F2', park: '#A9DB8F', roads: '#FFD35C', highway: '#FF9F43' },
  colorways: [
    { name: 'Blue Crayon', colors: { accent: '#1E5ED6', glow: '#9BC4FF', alert: '#D63A2C', roads: '#FFCF5A', highway: '#7FB0FF' } },
    { name: 'Kraft Paper', colors: { ground: '#EBD7B5', ink: '#33220F', accent: '#1F7A3A', panel: '#F7EBD5', glow: '#F3B04C', water: '#8FBFDF', park: '#A6CC86', roads: '#FFF6E0', highway: '#F6C77A' } },
    { name: 'Rainbow Box', colors: { ground: '#FFF7FC', ink: '#2E2140', accent: '#8A2BE2', glow: '#FFB3E0', water: '#9EDCF7', park: '#B9EA9C', roads: '#FFC2DD', highway: '#FFA45C' } },
    { name: 'Night Drawing', colors: { ground: '#1F2A44', ink: '#FFFFFF', accent: '#FFD23F', panel: '#2A3657', glow: '#FF8FB1', alert: '#FF6B5A', water: '#1E4E78', park: '#2C4B37', roads: '#44507A', highway: '#6B5F9E' } }
  ],
  map: { texture: 'zigzag', textureAlpha: 0.06, textureRole: 'accent', marker: 'crayon', route: 'dashed', routeWidth: 1.3, labels: 'Bold', labelSize: 1.1, buildings: 'outline' },
  frame: 'tape', scale: 1.15,
  voice: {
    speaker: 'Scribbly', channel: 'words drawn right onto the map', rate: 1.02, pitch: 1.12,
    L: { search: 'What shall we draw to?', routes: 'Pick a line', start: 'Start drawing', end: 'End', eta: 'Arrive at', left: 'Time left', arrive: 'Picture finished', reroute: 'New line', then: 'Then' },
    depart: ['Paper is ready. Let\'s draw our way there.', 'Crayons out. Let\'s go.', 'Here comes the first line of our drawing.', 'Ready, set, scribble. Off we go.', 'A brand new page. Here we go.', 'Pick a color in your head. That\'s our lucky color today.'],
    arrive: ['Ta-da. Our picture is finished.', 'We\'re here. Sign your name at the bottom.', 'That drawing goes right on the fridge.', 'Arrived. Every line led right here.', 'All done. What a colorful trip.', 'We made it. Crayons back in the box.'],
    reroute: ['Oops. Erasing and drawing a new line.', 'Wiggly line? No problem. A new one is coming.', 'Turn the page. Here\'s a new way.', 'Every artist makes squiggles. New route ready.'],
    cruise: [
      'Color hunt: who can spot something red?',
      'Shape spotter: look for a circle. Wheels count.',
      'Count the yellow cars. Each one is a sunshine car.',
      'Did you know? Blue and yellow mixed together make green.',
      'Did you know? Red and yellow mixed together make orange.',
      'Spot a stop sign. It\'s an octagon, a shape with eight sides.',
      'Draw it in your head: a house, a tree and a big round sun.',
      'Joke: why did the crayon go to school? To get a little sharper.',
      'Name a color for every car that goes by. Silver counts.',
      'Quiet coloring time. Think of your favorite color and keep it a secret.'
    ],
    tags: ['Nice line.', 'Colorful.', 'Scribble, scribble.', 'So bright.', 'Ta-da.', 'Wiggle, wiggle.']
  },
  arrivals: [['Ta-Da!', 'All Done'], ['Fridge', 'Worthy'], ['What A', 'Picture'], ['All', 'Colored In']]
});

navTheme({
  id: 'barnyard', title: 'Barnyard Buddies', blurb: 'A friendly farm with gingham fields, a red barn route and a happy farm dog who knows every animal.',
  ages: ['kids'], vibes: ['cozy', 'nature'],
  fonts: { display: 'Chewy', mono: 'Delius', weight: 400, query: 'family=Chewy&family=Delius' },
  colorName: 'Barn Red',
  colors: { ground: '#F7F0DB', ink: '#3E2A1C', accent: '#C43D2C', panel: '#FFFCF2', glow: '#F4CB6A', alert: '#B33224', water: '#A6D3E8', park: '#C2DD9C', roads: '#FFFFFF', highway: '#F6C9A8' },
  colorways: [
    { name: 'Blue Gingham', colors: { ground: '#EEF3F7', ink: '#1E2C3D', accent: '#2F62B0', panel: '#FBFDFF', glow: '#A9C7EC', alert: '#C43D2C', water: '#A9D2EC', park: '#CFE3C2', highway: '#B9CFEF' } },
    { name: 'Meadow', colors: { ground: '#E6F1D6', ink: '#24361A', accent: '#C24E1A', panel: '#F7FBF0', glow: '#F5D06A', water: '#A3D3E3', park: '#BEDD99', highway: '#F4CDA0' } },
    { name: 'Sunflower', colors: { ground: '#FFF2C2', ink: '#3E2D08', accent: '#2E6F3E', panel: '#FFFAE6', glow: '#FFC93C', water: '#A9D7EA', park: '#CFE59E', highway: '#BFDDB0' } },
    { name: 'Sundown', colors: { ground: '#2D2433', ink: '#FFF3DF', accent: '#FFB347', panel: '#3B3043', glow: '#A0583A', alert: '#FF6B5A', water: '#233A5C', park: '#2F3D2B', roads: '#564A5E', highway: '#7A5E5A' } }
  ],
  map: { texture: 'gingham', textureAlpha: 0.05, textureRole: 'accent', marker: 'paw', route: 'solid', routeWidth: 1.25, labels: 'Regular', labelSize: 1.05 },
  frame: 'stitch', scale: 1.1,
  voice: {
    speaker: 'Clover the farm dog', channel: 'the radio in the old red barn', rate: 1, pitch: 1.06,
    L: { search: 'Where to, farmhand?', routes: 'Pick a path', start: 'Start trotting', end: 'End', eta: 'Arrive at', left: 'Time left', arrive: 'We\'re here', reroute: 'New path', then: 'Then' },
    depart: ['Gates open. Let\'s mosey.', 'Everybody in the wagon? Off we go.', 'The rooster said go, so we\'re going.', 'Tails up. Let\'s trot.', 'Hay there, friends. Off we go.', 'Hello from the farm. Time for a ride.'],
    arrive: ['Whoa there. We have arrived.', 'We made it. Every buddy is here.', 'That was a happy trot. We\'re here.', 'Arrived. Good job, farmhands.', 'Barn doors open. We\'re here.', 'Here we are. Wag, wag.'],
    reroute: ['Wrong field. Let\'s try another gate.', 'A little detour around the duck pond.', 'No problem. A new path through the meadow.', 'Oops, that\'s the pig pen. New route ready.'],
    cruise: [
      'Farm fact: a cow has a stomach with four parts.',
      'Farm fact: a baby goat is called a kid. Just like you.',
      'Farm fact: pigs roll in mud to keep cool on hot days.',
      'Farm fact: sheep wool keeps growing, so sheep get a haircut called shearing.',
      'Farm fact: horses can sleep standing up.',
      'Farm fact: a good hen can lay almost one egg a day.',
      'Animal game: spot a cow, a horse or a dog. Dogs in cars count.',
      'Count the trucks. A farmer would love a big one.',
      'Joke: what do you call a sleeping bull? A bulldozer.',
      'Quiet game: who can do the quietest, tiniest moo?'
    ],
    tags: ['Woof.', 'Good trot.', 'Moo-velous.', 'Egg-cellent.', 'Hay, hay.', 'Wag, wag, wag.']
  },
  arrivals: [['Whoa There,', 'We Made It'], ['Egg-cellent', 'Trip'], ['Hay Hay,', 'Hooray'], ['Every Buddy', 'Is Here']]
});

navTheme({
  id: 'sprinkle', title: 'Sprinkle Sky', blurb: 'Float over candy clouds with a balloon marker, sprinkles on the map and a soft little cloud to guide you.',
  ages: ['kids', 'teens'], vibes: ['cute', 'pastel', 'fantasy'],
  fonts: { display: 'Sour Gummy', mono: 'Varela Round', weight: 700, query: 'family=Sour+Gummy:wght@600;700&family=Varela+Round' },
  colorName: 'Cotton Candy',
  colors: { ground: '#F6EEFF', ink: '#3D2459', accent: '#E3359A', panel: '#FFFFFF', glow: '#9FE3FF', alert: '#D6336C', water: '#BEE5FF', park: '#D6F5CB', roads: '#FFFFFF', highway: '#FFD0EA' },
  colorways: [
    { name: 'Lemon Drop', colors: { ground: '#FFF7D6', ink: '#403413', accent: '#8B4FD8', glow: '#FFE27A', water: '#BFE5F7', park: '#DDF3C4', highway: '#E2CCFA' } },
    { name: 'Mint Swirl', colors: { ground: '#E4F8EF', ink: '#1E3B33', accent: '#E2457E', glow: '#A5EBD0', water: '#BCE2F5', park: '#BDE9C8', highway: '#FFD0E0' } },
    { name: 'Peach Fizz', colors: { ground: '#FFEADF', ink: '#4A2418', accent: '#1F7FD0', glow: '#FFB89A', water: '#C4E3F7', park: '#E2F0CC', highway: '#C9E1F7' } },
    { name: 'Starlight', colors: { ground: '#2A2148', ink: '#FFF4FB', accent: '#FF8AD8', panel: '#362B5C', glow: '#7FD7FF', alert: '#FF6B8A', water: '#1E2D66', park: '#2B3E4D', roads: '#4B3F78', highway: '#6E5A9E' } }
  ],
  map: { texture: 'sprinkles', textureAlpha: 0.09, textureRole: 'accent', marker: 'balloon', route: 'outlined', routeWidth: 1.2, labels: 'Bold', labelSize: 1.05 },
  frame: 'bubble', scale: 1.1,
  voice: {
    speaker: 'Nimbus the candy cloud', channel: 'a balloon floating along beside the car', rate: 0.98, pitch: 1.2,
    L: { search: 'Where shall we float?', routes: 'Pick a sky path', start: 'Start floating', end: 'End', eta: 'Arrive at', left: 'Time left', arrive: 'Soft landing', reroute: 'New sky path', then: 'Then' },
    depart: ['Balloons up. Off we float.', 'Sprinkles on. Here we go.', 'Hold your string. We\'re floating off.', 'Sweet skies ahead. Let\'s go.', 'Candy clouds, here we come.', 'Float time. Is everybody comfy?'],
    arrive: ['We floated all the way here.', 'Soft landing. We\'re here.', 'Arrived. Sprinkles for everyone.', 'Here we are, sweet as can be.', 'Balloon down, gently. We made it.', 'The sky says well done.'],
    reroute: ['A breezy bump. A new way is ready.', 'The wind changed. Floating another way.', 'No worries. Here\'s a new cloud path.', 'Oops, wrong cloud. Here\'s a better one.'],
    cruise: [
      'Cloud game: can you find a cloud shaped like an animal?',
      'Sky fact: clouds are made of tiny drops of water, or tiny bits of ice.',
      'Sky fact: you can only see a rainbow when the sun is behind you and rain is in front.',
      'Count the pink things you see. Pink cars get extra points.',
      'Pretend snack: a big cloud of cotton candy. Take a pretend bite. Mmm.',
      'Can you say all the rainbow colors? Red, orange, yellow, green, blue and purple.',
      'Joke: what kind of candy is never on time? Choco-late.',
      'Floaty quiet time: let\'s all be as soft and quiet as a cloud.',
      'Look up at the next stop. Is the sky blue, gray or a little bit pink?'
    ],
    tags: ['Sweet.', 'Floaty.', 'Sprinkly.', 'Puff, puff.', 'Yum.', 'Wheee.']
  },
  arrivals: [['Soft', 'Landing'], ['Sprinkles', 'For All'], ['Sweet', 'Skies'], ['Floated', 'All The Way']]
});
