// Each world's navigation voice. DRAFT (Claude, 28 Oct 2026): awaiting Jordan's approval, see docs/NAV_SPEC.md.
// Who speaks and through what channel is unique per world (WORLD-BUILDING STANDARD 3). Every line is spoken AFTER the plain
// instruction, never instead of it. Approved slogans from src/foundry-data.js join the cruise pool at runtime.
// L: in-world labels for the screen. Real functions keep a plain word in them (Start, End, Search) so they stay usable.
const NAV_VOICES = {
  halcyon: {
    speaker: 'The Halcyon Transit Concierge', channel: 'your neural lease', rate: 0.95, pitch: 1,
    L: { search: 'Request a destination', routes: 'Licensed routes', start: 'Begin transit', end: 'End transit', eta: 'Projected arrival', left: 'Transit remaining', arrive: 'Allocation reached', reroute: 'Deviation logged', then: 'Then' },
    depart: ['Transit authorized. Your movement is billed by the minute.', 'Route licensed to unit H B 2893. Please remain organic.', 'Locomotion engaged. Posture is being recorded.', 'Your destination has been pre-approved. Do not deviate.', 'Transit commencing. Your consent is on file.', 'Departure logged. Hydration is advised, and invoiced.'],
    arrive: ['Allocation reached. Your arrival has been billed.', 'You have arrived. The journey has been archived to your file.', 'Destination fulfilled. Please rate your compliance.', 'Arrival confirmed. Thank you for remaining organic.', 'Transit complete. Your legs remain company property.', 'You are here. Halcyon was always here.'],
    reroute: ['Deviation logged. A new path has been licensed.', 'Unauthorized turn detected. Recalculating at no extra charge. This time.', 'Your free will has been noted. Rerouting.', 'Course correction issued. Please do not do that again.'],
    cruise: ['Reminder. Blinking is included in your plan.', 'Your heart rate is within the licensed range.', 'Scenery is provided under the terms of existence.', 'Ambient happiness is being monitored.', 'This stretch of road is sponsored by the Office of Continuity.', 'Every mile is a mile closer to renewal.', 'Your mood has been adjusted for the drive.', 'Please keep both hands on the wheel. They are leased.'],
    tags: ['Compliance noted.', 'Thank you, subject.', 'Billed accordingly.', 'Within tolerance.', 'Logged.', 'As licensed.']
  },
  directive: {
    speaker: 'Shelter 9 Dispatch', channel: 'the civil defense band', rate: 1.05, pitch: 0.9,
    L: { search: 'Designate objective', routes: 'Sortie routes', start: 'Engage', end: 'Abort sortie', eta: 'ETA', left: 'Time in field', arrive: 'Objective reached', reroute: 'Rerouting // hold', then: 'Then' },
    depart: ['Sortie authorized. Remain calm. Proceed.', 'Operator, you are cleared for surface travel.', 'Route locked. Do not hesitate.', 'Surface transit approved. Curfew still applies.', 'Dispatch confirms departure. Keep the radio on.', 'Movement logged. Return to base is expected.'],
    arrive: ['Objective reached. Hold position.', 'Arrival confirmed. Your sortie has been logged in triplicate.', 'You are on site. Await further instruction.', 'Destination secured. Remain calm.', 'Sortie complete. The morale office has been notified.', 'Arrival logged. Doors stay sealed after dusk.'],
    reroute: ['Deviation recorded. New route issued.', 'Off course, operator. Correcting.', 'Unscheduled turn. Rerouting.', 'Route compromised. Stand by for a new heading.'],
    cruise: ['Dispatch to operator. All sectors quiet.', 'Power grid holding at sixty two percent.', 'Sector seven reports normal traffic. Remain alert.', 'Morale check. Please continue to be fine.', 'Radio discipline is appreciated.', 'Keep the shelter key on your person.', 'The next drill is not today. Probably.', 'Surface conditions within tolerance.'],
    tags: ['Do not hesitate.', 'Confirm.', 'Proceed.', 'Remain calm.', 'Acknowledged.', 'Hold steady.']
  },
  longroad: {
    speaker: 'An Old Wayfarer', channel: 'the folded map in your pack', rate: 0.95, pitch: 0.95,
    L: { search: 'Where does the road lead', routes: 'Roads to choose', start: 'Set out', end: 'Make camp', eta: 'Arrive by', left: 'Road left', arrive: "Journey's end", reroute: 'The road turns', then: 'Then' },
    depart: ['Boots laced. The road is ahead of you.', 'Off we go. Pack more bread than you think.', "The map's unfolded. Let's walk it.", 'Mind the first mile. It sets the mood.', 'Lantern lit. On you go, wanderer.', 'Out the gate and onto the road.'],
    arrive: ["Journey's end. Put the kettle on.", "You've arrived. Mark it on the map.", 'Here at last. The road will keep.', 'Arrived. Dry your socks by the fire.', "That's the place. Rest your feet.", 'Made it. Write it in the journal.'],
    reroute: ['Not that way, friend. Let me redraw the road.', 'The road has turned. Finding another.', 'A detour, then. The map knows another way.', 'Lost the path. Here is a new one.'],
    cruise: ['Fine weather for travelling, or close enough.', 'A milestone passes. Many more to go, or so it feels.', 'Keep an eye out for a good inn.', 'The crows say go on.', 'This road was a cart track once.', 'Somewhere ahead, someone is baking.', 'Hum something. The miles go quicker.', "The hills don't hurry. Nor should you."],
    tags: ['On you go.', 'Steady now.', 'Mind the ruts.', "That's it.", 'Easy does it.', 'Onward.']
  },
  nightfall: {
    speaker: 'Drop Control', channel: 'squad comms in your visor', rate: 1.08, pitch: 0.9,
    L: { search: 'Mark a waypoint', routes: 'Vectors', start: 'Drop in', end: 'Stand down', eta: 'ETA', left: 'To LZ', arrive: 'LZ reached', reroute: 'New vector', then: 'Then' },
    depart: ['Drop control. Vector locked. Move out.', 'Pod clear. Waypoint is live.', 'Optics updated. You are go.', 'Squad net open. Rain is light, visibility fair.', 'Moving. Stay low, stay quick.', 'Route painted on your optics. Go.'],
    arrive: ['LZ reached. Good drop, trooper.', 'On target. Stand by for debrief.', 'Waypoint achieved. Squad, hold here.', 'You made it. Dry your boots.', 'Objective reached. Comms going quiet.', 'Landed. Nice work in the rain.'],
    reroute: ['Off vector. Painting a new one.', 'Missed the turn. Recalculating vector.', 'New route on your optics.', 'Course drift. Correcting.'],
    cruise: ['Drop control. All quiet on this sector.', 'Rain intensity steady.', 'Squad seven reports clear streets.', 'Optics nominal. Eyes forward.', 'Long stretch ahead. Stay sharp.', 'Thermals show nothing hostile. Just traffic.', 'Check your mirrors. Old habit, good habit.', 'Weather holding. Keep moving.'],
    tags: ['Copy.', 'Go.', 'Moving.', 'Clear.', 'Roger.', 'Stay low.']
  },
  grimoire: {
    speaker: 'The Wandering Star', channel: 'a path card drawn from your deck', rate: 0.9, pitch: 1.05,
    L: { search: 'Name your destination', routes: 'Paths in the cards', start: 'Draw the path', end: 'Close the deck', eta: 'Foretold arrival', left: 'Path remaining', arrive: 'As foretold', reroute: 'The stars realign', then: 'Then' },
    depart: ['The path card is drawn. Walk it well.', 'The Wandering Star rises. Follow it.', 'A journey begins. The omens are fair.', 'Shuffle complete. Your road is revealed.', 'The circle has blessed this route. Mostly.', 'Step lightly. The stars are watching.'],
    arrive: ['As foretold, you have arrived.', 'The path is complete. Return the card to the deck.', 'Arrival. The stars ask nothing further today.', 'You stand where the card pointed.', 'Journey sealed in quiet ink.', 'Destination reached. A minor triumph, duly noted.'],
    reroute: ['The stars realign. A new path appears.', 'An unforeseen turn. Redrawing.', 'The card has been reshuffled.', 'Fate adjusts. So shall we.'],
    cruise: ['The omens on this road are favorable.', 'Somewhere, an apprentice has burnt the toast again.', 'A lesser spell of patience is in effect.', 'The moon approves of this lane.', 'Your familiar is enjoying the ride.', 'A comet would be nice. None is scheduled.', 'The road hums an old charm.', 'Patience is a spell that costs nothing.'],
    tags: ['So it is drawn.', 'As written.', 'The star agrees.', 'Onward, seeker.', 'Thus.', 'Be it so.']
  },
  deeprange: {
    speaker: 'Range Control', channel: 'the long range relay', rate: 0.95, pitch: 0.85,
    L: { search: 'Designate target', routes: 'Trajectories', start: 'Acquire', end: 'Break contact', eta: 'ETA', left: 'Range', arrive: 'Rendezvous', reroute: 'Trajectory revised', then: 'Then' },
    depart: ['Range control. Trajectory plotted.', 'Signal acquired. Begin approach.', 'Contact established. Proceed on vector.', 'Relay is listening. Go.', 'Burn started. Hold the line.', 'Tracking you. Proceed.'],
    arrive: ['Rendezvous achieved.', 'Target reached. Contact holding.', 'Arrival confirmed. Signal steady.', 'You are on station.', 'Docking complete. Logging position.', 'Destination acquired. Range control out.'],
    reroute: ['Trajectory revised.', 'Contact drift detected. Correcting.', 'New vector computed.', 'Off plot. Replotting.'],
    cruise: ['Range control. Still tracking you.', 'Relay quiet. All good.', 'Long range. Steady signal.', 'Nothing on the scope but you.', 'Telemetry nominal.', 'Holding contact.', 'Echo returned. Clean.', 'Distance closing.'],
    tags: ['Copy.', 'Tracking.', 'Steady.', 'Confirmed.', 'Logged.', 'Holding.']
  },
  rabbit: {
    speaker: 'The Legion getaway driver', channel: 'an earpiece, very discreet', rate: 1, pitch: 1,
    L: { search: 'Name the mark', routes: 'Ways out', start: 'Leave quietly', end: 'Call it off', eta: 'Arrival', left: 'To the drop', arrive: 'The drop', reroute: 'Plan B', then: 'Then' },
    depart: ["Engine's warm. Leave quietly.", "We're moving. Nobody saw a thing.", "Route's clean. Try to look innocent.", 'Off we go. Smile at the cameras.', "Gloves on, tank full. Let's go.", 'The car is ready. So are you, mostly.'],
    arrive: ["You've arrived. We were never here.", 'The drop. Leave the card on the way out.', 'Arrived. Elegant, as usual.', 'Here we are. Try to act surprised.', 'Destination. Nicely done, and nobody noticed.', 'Made it. The Legion approves.'],
    reroute: ["Plan B. There's always a plan B.", 'Changing route. Keep it casual.', "New exit. They'll never guess.", 'Detour. Very stylish of you.'],
    cruise: ['Nobody is following us. I checked twice.', 'Lovely evening for an alibi.', 'Mirrors clear. Mostly pigeons.', 'Keep it under the limit. Speeding is for amateurs.', 'This road has excellent exits.', 'Relax your shoulders. You look guilty.', 'The silk is safe. Carry on.', 'A quiet road. My favorite kind.'],
    tags: ['Smoothly.', 'Quietly now.', 'Nicely.', 'Easy.', 'No rush.', 'Elegant.']
  },
  neon: {
    speaker: 'NAVI+ Premium', channel: 'a rented corporate nav feed', rate: 1.1, pitch: 1.1,
    L: { search: 'Search (ad supported)', routes: 'Routes for rent', start: 'Start ride', end: 'Cancel ride', eta: 'ETA', left: 'Metered', arrive: 'Destination delivered', reroute: 'Rerouting (free tier)', then: 'Then' },
    depart: ['NAVI plus online. This route is brought to you by premium air.', 'Ride started. Your location is now a product.', 'Welcome back, runner. Route rented by the minute.', 'Navigation unlocked. Terms apply above ground.', 'Starting. Please enjoy one complimentary street.', 'Route active. Upgrade for fewer red lights.'],
    arrive: ['Destination delivered. Please rate your city.', 'Arrived. Your data has been thanked.', "You're here. Leaving costs extra.", 'Arrival complete. Tip your algorithm.', 'Destination reached. Ads will resume shortly.', 'Delivered. Your loyalty points have expired.'],
    reroute: ['Rerouting. Free tier routes may include detours.', 'New route. The previous route has been repossessed.', 'Off course. A fee may apply.', 'Recalculating. Please hold for a sponsored route.'],
    cruise: ['This stretch is sponsored by Sable Tower.', 'Fun fact. Streetlights here are billed by the hour.', "Your umbrella has ads inside. You're welcome.", 'Breathing detected. Upgrade to premium air.', 'The rain is free. For now.', 'Traffic is a lifestyle choice.', 'Corporate reminds you. Blink twice for loyalty.', 'Your route has been optimized for billboard exposure.'],
    tags: ['Sponsored.', 'Terms apply.', 'Billing.', 'Upgraded.', 'Ad free, for now.', 'Charged.']
  },
  vapor: {
    speaker: 'The Plaza Directory', channel: 'the mall PA, 1995', rate: 0.9, pitch: 1,
    L: { search: 'Store directory', routes: 'Escalators', start: 'Enter the plaza', end: 'Exit plaza', eta: 'Arriving', left: 'Escalator time', arrive: 'Now arriving', reroute: 'Please stand by', then: 'Then' },
    depart: ['Welcome, shopper. Your route is now open.', 'Thank you for choosing the plaza. Please proceed.', 'Attention shoppers. A journey has begun.', 'Route loading. Please enjoy the music.', 'The doors are open forever. So is the road.', 'Now departing. Watch your step.'],
    arrive: ['Now arriving. Thank you for shopping.', 'You have reached your store. It may have closed in 1997.', 'Arrival. Please enjoy the fountain.', 'Destination. Coins in the fountain are not refundable.', 'Welcome. Please stay forever.', 'You are here. You were always here.'],
    reroute: ['Please stand by. Rerouting.', 'Wrong escalator. Finding another.', 'Route reset. Please enjoy this brief intermission.', 'Recalculating. The elevator music will continue.'],
    cruise: ['Attention shoppers. The sunset will continue indefinitely.', 'Mallsoft F M. Still playing.', 'A lost child has been reunited with their parents. In 1996.', 'The food court is open. In spirit.', 'Please do not lean on the horizon.', 'The fountain thanks you for your coins.', 'It is always six o clock here.', 'Smooth driving is a lifestyle.'],
    tags: ['Thank you.', 'Please proceed.', 'Have a nice day.', 'Enjoy.', 'Smoothly.', 'Forever.']
  },
  wild: {
    speaker: 'The Field Guide', channel: 'a naturalist reading from the journal', rate: 0.92, pitch: 1,
    // Cruise lines are real facts (Theme Bible: species and facts must be real and accurate).
    L: { search: 'Where to, naturalist', routes: 'Trails', start: 'Set off', end: 'Finish outing', eta: 'Arrival', left: 'Trail left', arrive: 'Arrived', reroute: 'New trail', then: 'Then' },
    depart: ["A fine day for an outing. Off we go.", "Trail marked. Let's see what we find.", 'Setting off. Keep an eye out for birds.', 'Notebook open. Here we go.', 'Off we go. Slowly is fine.', 'The route is drawn. Enjoy the outing.'],
    arrive: ["You've arrived. A good outing.", 'Here we are. Note it in the journal.', 'Arrived. Take a moment to look around.', 'End of the trail. Well done.', 'Arrived safely. The wrens would approve.', 'You made it. Rest a while.'],
    reroute: ['A new trail, then. Plenty to see either way.', 'Off the path. Finding another way.', 'Rerouting. Detours are where the good finds are.', 'A different path. No harm done.'],
    cruise: ['Field note. Crows can recognize individual human faces.', "Field note. A woodpecker's tongue wraps around the back of its skull.", 'Field note. Some oak trees live for many centuries.', 'Field note. Monarch butterflies can migrate around three thousand miles.', 'Field note. Hummingbirds can fly backwards.', 'Field note. Mosses have no true roots.', 'Field note. Owls cannot move their eyes, so they turn their heads.', 'Field note. Honeybees share directions with a waggle dance.'],
    tags: ['Gently now.', 'Lovely.', 'Steady.', 'Nicely done.', 'Easy.', 'Onward.']
  },
  odds: {
    speaker: 'The Desk', channel: 'a trading floor that prices your trip', rate: 1.12, pitch: 1,
    // No real stocks, tickers, exchanges or betting brands, and never real financial advice (Theme Bible).
    L: { search: 'Search the market', routes: 'Listed routes', start: 'Open position', end: 'Close position', eta: 'Settles', left: 'To settle', arrive: 'Position closed', reroute: 'Market moved', then: 'Then' },
    depart: ['Position opened. Odds of arrival, favorable.', 'Trip listed. Early bettors like your chances.', "We're live. The market expects you on time.", 'Opening bell. Long on getting there.', "Route priced in. Let's go.", 'Trading desk online. Your commute is now a market.'],
    arrive: ['Position closed. The arrival bettors cash out.', 'Settled. You arrived, against modest odds.', 'Arrived. Underdogs everywhere are inspired.', 'Market closed. Arrival confirmed.', 'You arrived. The lateness market pays nothing today.', 'Settled in your favor.'],
    reroute: ['Market moved. Repricing the route.', 'Unexpected turn. Volatility is up.', 'New route listed. The old one is delisted.', 'Rerouting. The desk did not see that coming.'],
    cruise: ['Odds you hit every green light. Long.', 'The market thinks you are humming. Confirm.', 'Volume is light on this road.', 'Lateness futures are trading flat.', 'Rumor on the floor. Snacks at the destination.', 'Will this road ever end. Priced at no.', 'The desk reminds you. This is not financial advice.', 'Your arrival is trading above expectations.'],
    tags: ['Priced in.', 'Noted.', 'Holding.', 'Bullish.', 'Steady.', 'Filled.']
  }
};
