export interface DemoVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  module: string;
  moduleNumber: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  sport: 'skiing' | 'snowboarding';
  instructor: string;
  thumbnailVariant: number;
  isFree: boolean;
  isComplete: boolean;
  keyTakeaways: string[];
  aiCoachTip: string;
}

export const demoVideos: DemoVideo[] = [
  // ── BEGINNER SKIING (1-6 complete, 1-3 free) ──────────────────────────
  {
    id: 'beg-ski-01',
    title: 'Understanding Your Ski Boots: Flex, Fit, and Feel',
    description:
      'Your boots are the most important piece of equipment. Learn how proper flex rating, fit, and buckle tension directly affect your control on the mountain.',
    duration: '6:42',
    module: 'Gear Foundations',
    moduleNumber: 1,
    level: 'beginner',
    sport: 'skiing',
    instructor: 'Tyler Berglund',
    thumbnailVariant: 1,
    isFree: true,
    isComplete: true,
    keyTakeaways: [
      'Match boot flex to your weight and ability',
      'Two-finger rule for proper shell fit',
      'Buckle from top down for best control',
      'When to know your boots need professional fitting',
    ],
    aiCoachTip:
      'If your shins feel bruised after day one, your forward lean is too aggressive. Back off the top buckle one notch.',
  },
  {
    id: 'beg-ski-02',
    title: 'First Day on Snow: Balance and Stance',
    description:
      'Build a bulletproof athletic stance before you ever point downhill. We cover weight distribution, ankle flex, and the "tall and small" drill that accelerates learning.',
    duration: '8:15',
    module: 'Gear Foundations',
    moduleNumber: 1,
    level: 'beginner',
    sport: 'skiing',
    instructor: 'Tyler Berglund',
    thumbnailVariant: 2,
    isFree: true,
    isComplete: true,
    keyTakeaways: [
      '60/40 weight distribution front-to-back',
      'Hands always in your peripheral vision',
      'Flex ankles, not waist — stay stacked',
      'Practice the "tall and small" drill on flat terrain',
    ],
    aiCoachTip:
      'Film yourself from the side. If your hips are behind your heels, you are in the back seat — the #1 beginner mistake.',
  },
  {
    id: 'beg-ski-03',
    title: 'The Wedge Turn: Your First Real Turn',
    description:
      'The pizza/wedge turn is not just for kids. Master the physics of rotary movement and edge pressure that carry into every turn you will ever make.',
    duration: '10:08',
    module: 'Basic Turns',
    moduleNumber: 2,
    level: 'beginner',
    sport: 'skiing',
    instructor: 'Sarah Chen',
    thumbnailVariant: 6,
    isFree: true,
    isComplete: true,
    keyTakeaways: [
      'Steer with your feet, not your shoulders',
      'Pressure the inside edge of the outside ski',
      'Speed control comes from turn shape, not braking',
      'Link five clean wedge turns before moving on',
    ],
    aiCoachTip:
      'Count "one-Mississippi" in each turn. If you are rushing, your turns are too narrow and you are picking up speed.',
  },
  {
    id: 'beg-ski-04',
    title: 'Stopping with Confidence',
    description:
      'Reliable stopping is the gateway to confidence. Learn the hockey stop progression and how to scrub speed on any terrain without losing balance.',
    duration: '5:50',
    module: 'Basic Turns',
    moduleNumber: 2,
    level: 'beginner',
    sport: 'skiing',
    instructor: 'Tyler Berglund',
    thumbnailVariant: 0,
    isFree: false,
    isComplete: true,
    keyTakeaways: [
      'Wedge stop vs. parallel stop — when to use each',
      'Edge angle determines stopping distance',
      'Keep upper body facing downhill during stops',
    ],
    aiCoachTip:
      'Practice stopping at specific landmarks (a sign, a tree). Precision stops build real confidence faster than panic stops.',
  },
  {
    id: 'beg-ski-05',
    title: 'Reading the Mountain: Trail Signs and Safety',
    description:
      'Before exploring the mountain, understand trail ratings, right-of-way rules, slow zones, and how to read terrain so you always ski within your ability.',
    duration: '7:22',
    module: 'Mountain Navigation',
    moduleNumber: 3,
    level: 'beginner',
    sport: 'skiing',
    instructor: 'Sarah Chen',
    thumbnailVariant: 4,
    isFree: false,
    isComplete: true,
    keyTakeaways: [
      'Green, blue, black, double-black — what they really mean',
      'Responsibility Code and right-of-way',
      'How to identify ice, windblown, and variable snow',
      'Never stop where you cannot be seen from above',
    ],
    aiCoachTip:
      'Spend your first run each day on a green to warm up and read conditions. Pros do this too.',
  },
  {
    id: 'beg-ski-06',
    title: 'Riding the Chairlift Like a Pro',
    description:
      'Loading, riding, and unloading the chairlift can be intimidating. This lesson covers everything from the loading zone to a smooth exit at the top.',
    duration: '4:18',
    module: 'Mountain Navigation',
    moduleNumber: 3,
    level: 'beginner',
    sport: 'skiing',
    instructor: 'Marcus Rivera',
    thumbnailVariant: 5,
    isFree: false,
    isComplete: true,
    keyTakeaways: [
      'Skis straight ahead when loading',
      'Keep tips up when unloading',
      'How to ride a T-bar and surface lift',
    ],
    aiCoachTip:
      'When unloading, stand up and glide — do not push. Let the chair give you momentum.',
  },
  {
    id: 'beg-ski-07',
    title: 'Introduction to Parallel Skiing',
    description:
      'The transition from wedge to parallel is the biggest leap in skiing. Learn the "wedge-christie" bridge technique that makes the jump feel natural.',
    duration: '12:30',
    module: 'Parallel Progression',
    moduleNumber: 4,
    level: 'beginner',
    sport: 'skiing',
    instructor: 'Tyler Berglund',
    thumbnailVariant: 3,
    isFree: false,
    isComplete: false,
    keyTakeaways: [
      'Wedge the start, match the finish',
      'Inside ski steering is the key to parallel',
      'Use gentle terrain first — speed is not the goal',
      'Pole touch timing for rhythm',
    ],
    aiCoachTip:
      'Narrower wedge = closer to parallel. Shrink the wedge by 10% each run until skis are matching.',
  },

  // ── BEGINNER SNOWBOARDING (3 more beginner, 1 complete) ───────────────
  {
    id: 'beg-snb-01',
    title: 'Regular vs. Goofy: Finding Your Stance',
    description:
      'Your lead foot determines everything. Three simple tests to find your natural stance plus how to set up binding angles for maximum comfort and control.',
    duration: '5:10',
    module: 'Board Basics',
    moduleNumber: 1,
    level: 'beginner',
    sport: 'snowboarding',
    instructor: 'Marcus Rivera',
    thumbnailVariant: 1,
    isFree: false,
    isComplete: false,
    keyTakeaways: [
      'Slide test, stair test, and push test for stance',
      'Binding angle recommendations for beginners',
      'Why duck stance is popular and when to avoid it',
    ],
    aiCoachTip:
      'If both feet feel equal, try regular first. 70% of riders are regular. You will know within 30 minutes.',
  },
  {
    id: 'beg-snb-02',
    title: 'Heel Edge and Toe Edge: The Two Brakes',
    description:
      'Snowboarding has exactly two edges. Master the falling leaf drill on each edge and you can descend any groomed run safely.',
    duration: '9:44',
    module: 'Edge Control',
    moduleNumber: 2,
    level: 'beginner',
    sport: 'snowboarding',
    instructor: 'Marcus Rivera',
    thumbnailVariant: 2,
    isFree: false,
    isComplete: false,
    keyTakeaways: [
      'Heelside falling leaf — shift weight left/right',
      'Toeside falling leaf — look over your shoulder',
      'Edge angle vs. pressure — feel the difference',
      'How to get up after a fall (without exhausting yourself)',
    ],
    aiCoachTip:
      'Wear wrist guards your first three days. 80% of snowboard injuries are wrist fractures from catching falls.',
  },
  {
    id: 'beg-snb-03',
    title: 'Linking Your First S-Turns',
    description:
      'The moment it clicks. Transition from heelside to toeside and back in one fluid motion. This is where snowboarding goes from frustrating to addictive.',
    duration: '11:20',
    module: 'Edge Control',
    moduleNumber: 2,
    level: 'beginner',
    sport: 'snowboarding',
    instructor: 'Emma Larsson',
    thumbnailVariant: 6,
    isFree: false,
    isComplete: false,
    keyTakeaways: [
      'Flat base transition — the brief moment between edges',
      'Lead with your front knee and hips',
      'Look where you want to go, not at your feet',
      'Use a wide-open green run with no traffic',
    ],
    aiCoachTip:
      'If you keep catching your toe edge, you are rushing the transition. Slow it down — spend a full second flat-based.',
  },

  // ── INTERMEDIATE SKIING (2 complete) ──────────────────────────────────
  {
    id: 'int-ski-01',
    title: 'Short Radius Turns: Precision on Blue Runs',
    description:
      'Tighten your turn radius to control speed on steeper terrain. Focus on pole plant timing, edge engagement, and upper-lower body separation.',
    duration: '14:05',
    module: 'Dynamic Parallel',
    moduleNumber: 5,
    level: 'intermediate',
    sport: 'skiing',
    instructor: 'Tyler Berglund',
    thumbnailVariant: 3,
    isFree: false,
    isComplete: true,
    keyTakeaways: [
      'Pole plant initiates the turn — not an afterthought',
      'Separation: quiet upper body, active lower body',
      'Retraction turns for quick edge changes',
      'Drill: count turns across a run — aim for 20+',
    ],
    aiCoachTip:
      'If your shoulders are rotating with your skis, hold a pole horizontally across your chest. It forces separation.',
  },
  {
    id: 'int-ski-02',
    title: 'Carving 101: From Skidding to Slicing',
    description:
      'The difference between skidded and carved turns is night and day. Learn to trust your edges, increase inclination, and feel the G-forces of a clean arc.',
    duration: '16:32',
    module: 'Dynamic Parallel',
    moduleNumber: 5,
    level: 'intermediate',
    sport: 'skiing',
    instructor: 'Tyler Berglund',
    thumbnailVariant: 0,
    isFree: false,
    isComplete: true,
    keyTakeaways: [
      'Railroad tracks test — one clean line, no skid marks',
      'Tip the ski on edge before you steer it',
      'Higher edge angle = tighter turn radius',
      'Use a groomed blue with consistent pitch to practice',
    ],
    aiCoachTip:
      'Check your tracks in the snow. Two pencil-thin lines = carving. A smeared fan shape = skidding. Aim for pencil lines.',
  },
  {
    id: 'int-ski-03',
    title: 'Skiing Variable Snow: Crud, Chop, and Slush',
    description:
      'Real mountains do not have groomed runs everywhere. Build the reflexes and stance adjustments to handle broken snow, late-season slush, and wind-affected terrain.',
    duration: '11:48',
    module: 'All-Mountain Skills',
    moduleNumber: 6,
    level: 'intermediate',
    sport: 'skiing',
    instructor: 'Emma Larsson',
    thumbnailVariant: 4,
    isFree: false,
    isComplete: false,
    keyTakeaways: [
      'Narrow stance for crud — keep skis together',
      'Absorb with ankles and knees, not waist',
      'Speed is your friend in heavy snow — do not slow down',
      'Retract and extend: the shock absorber technique',
    ],
    aiCoachTip:
      'In crud, commit to each turn 100%. Half-hearted turns in variable snow are where people get thrown.',
  },
  {
    id: 'int-ski-04',
    title: 'Introduction to Moguls',
    description:
      'Moguls terrify intermediates but they are just rhythmic terrain. Learn the absorption turn, where to look, and how to find the "zipper line" through a bump field.',
    duration: '13:25',
    module: 'All-Mountain Skills',
    moduleNumber: 6,
    level: 'intermediate',
    sport: 'skiing',
    instructor: 'Sarah Chen',
    thumbnailVariant: 7,
    isFree: false,
    isComplete: false,
    keyTakeaways: [
      'Absorb the bump crest, extend into the trough',
      'Look two bumps ahead — never at your ski tips',
      'Hands forward and quiet at all times',
      'Start on the edge of the mogul field, not the center',
    ],
    aiCoachTip:
      'Find a small bump run first. If you can ski 10 bumps without stopping, you are ready for a full mogul field.',
  },

  // ── INTERMEDIATE SNOWBOARDING ─────────────────────────────────────────
  {
    id: 'int-snb-01',
    title: 'Carving on a Snowboard: Edge-to-Edge Power',
    description:
      'Move beyond skidded turns and lay real trenches. Learn how body angulation, edge pressure, and board flex create the perfect carved arc.',
    duration: '12:55',
    module: 'Advanced Riding',
    moduleNumber: 5,
    level: 'intermediate',
    sport: 'snowboarding',
    instructor: 'Marcus Rivera',
    thumbnailVariant: 5,
    isFree: false,
    isComplete: false,
    keyTakeaways: [
      'Angulate at the hips, not the waist',
      'Drive the front knee into each turn',
      'Toeside carves: press shins into boot tongue',
      'Euro-carve progression for the committed',
    ],
    aiCoachTip:
      'On heelside carves, lift your toes inside your boots. This forces deeper edge engagement.',
  },
  {
    id: 'int-snb-02',
    title: 'Switch Riding Fundamentals',
    description:
      'Riding switch opens up the entire mountain and is essential for freestyle progression. Rebuild your skills in the opposite direction with drills designed for fast adaptation.',
    duration: '10:30',
    module: 'Advanced Riding',
    moduleNumber: 5,
    level: 'intermediate',
    sport: 'snowboarding',
    instructor: 'Emma Larsson',
    thumbnailVariant: 6,
    isFree: false,
    isComplete: false,
    keyTakeaways: [
      'Start on flat terrain with switch skating',
      'Mirror your regular stance angles',
      'Falling leaf switch — retrain edge feel',
      'Commit 30% of each session to switch',
    ],
    aiCoachTip:
      'Set a timer: 20 minutes switch per hour of riding. Consistency beats marathon switch sessions.',
  },
  {
    id: 'int-snb-03',
    title: 'Riding Steeps: Confidence on Black Runs',
    description:
      'Steep terrain demands commitment. Learn how to manage speed with aggressive heel-toe transitions, how to side-slip safely, and when to point it.',
    duration: '9:18',
    module: 'All-Mountain Snowboarding',
    moduleNumber: 6,
    level: 'intermediate',
    sport: 'snowboarding',
    instructor: 'Marcus Rivera',
    thumbnailVariant: 4,
    isFree: false,
    isComplete: false,
    keyTakeaways: [
      'Lower your center of gravity on steep pitches',
      'Quick edge-to-edge transitions prevent runaway speed',
      'Controlled side-slip for the steepest sections',
      'Look for terrain features to make turns around',
    ],
    aiCoachTip:
      'On steep terrain, your first turn is the hardest. Commit to it fully — hesitation causes falls.',
  },
  {
    id: 'int-snb-04',
    title: 'Introduction to Freestyle: Your First 180',
    description:
      'The frontside 180 is the gateway trick. Master it on flat ground, then take it to small features. Covers pop, rotation, and landing switch.',
    duration: '8:40',
    module: 'Freestyle Foundations',
    moduleNumber: 7,
    level: 'intermediate',
    sport: 'snowboarding',
    instructor: 'Emma Larsson',
    thumbnailVariant: 3,
    isFree: false,
    isComplete: false,
    keyTakeaways: [
      'Wind up with shoulders, release at pop',
      'Spot your landing over your lead shoulder',
      'Pop off the tail — do not ollie for your first 180',
      'Practice on flat ground 50 times before taking it to snow',
    ],
    aiCoachTip:
      'Film your 180 from behind. If your shoulders open early, the rotation will stall at 90 degrees.',
  },

  // ── ADVANCED SKIING ───────────────────────────────────────────────────
  {
    id: 'adv-ski-01',
    title: 'Expert Carving: High-Edge-Angle Performance',
    description:
      'Push your carving to race-level angles. This lesson covers dynamic inclination, pressure management through the arc, and how to link GS-style turns on groomed runs.',
    duration: '18:20',
    module: 'Expert Technique',
    moduleNumber: 7,
    level: 'advanced',
    sport: 'skiing',
    instructor: 'Tyler Berglund',
    thumbnailVariant: 0,
    isFree: false,
    isComplete: false,
    keyTakeaways: [
      'Inclination vs. angulation — when to use each',
      'Progressive edge engagement through the turn',
      'Counter-rotation for high-performance carving',
      'Exit speed: how to accelerate out of each turn',
    ],
    aiCoachTip:
      'Use a steep groomer and try to touch the snow with your inside hand on each turn. If you can, your angles are elite.',
  },
  {
    id: 'adv-ski-02',
    title: 'Powder Skiing: Float, Flow, and Fat Skis',
    description:
      'Deep snow is every skier\'s dream but it demands different technique. Learn the retraction turn, centered stance, and rhythm that makes powder effortless.',
    duration: '15:45',
    module: 'Expert Technique',
    moduleNumber: 7,
    level: 'advanced',
    sport: 'skiing',
    instructor: 'Emma Larsson',
    thumbnailVariant: 2,
    isFree: false,
    isComplete: false,
    keyTakeaways: [
      'Center your weight — no more forward pressure',
      'Both skis act as one platform in powder',
      'Retract legs to initiate the turn',
      'Speed creates float — do not brake',
    ],
    aiCoachTip:
      'In deep powder, imagine you are bouncing on a trampoline. Up-unweight to start the turn, sink to finish it.',
  },
  {
    id: 'adv-ski-03',
    title: 'Zipper Line Moguls: Speed and Precision',
    description:
      'Run the zipper line like a freestyle mogul competitor. Advanced absorption, pole plant precision, and maintaining speed through a full mogul field.',
    duration: '14:10',
    module: 'Advanced All-Mountain',
    moduleNumber: 8,
    level: 'advanced',
    sport: 'skiing',
    instructor: 'Sarah Chen',
    thumbnailVariant: 7,
    isFree: false,
    isComplete: false,
    keyTakeaways: [
      'Absorb with knees to chest on each bump',
      'Pole plant on the crest — never in the trough',
      'Quiet upper body is non-negotiable',
      'Build speed gradually — consistency first',
    ],
    aiCoachTip:
      'Record video in slow motion. Your hands should stay at exactly the same height the entire run.',
  },
  {
    id: 'adv-ski-04',
    title: 'Steep Chutes and Couloirs',
    description:
      'Technical steep skiing demands jump turns, ice axe awareness, and mental commitment. Learn to assess, enter, and descend the most demanding inbounds terrain.',
    duration: '17:00',
    module: 'Advanced All-Mountain',
    moduleNumber: 8,
    level: 'advanced',
    sport: 'skiing',
    instructor: 'Tyler Berglund',
    thumbnailVariant: 5,
    isFree: false,
    isComplete: false,
    keyTakeaways: [
      'Assess the chute from above before entering',
      'Jump turns for the narrowest sections',
      'Slough management — let debris pass before continuing',
      'Commitment: once you drop in, ski with conviction',
    ],
    aiCoachTip:
      'Practice jump turns on a groomed black run first. If you cannot link 10 clean jump turns on groomers, the chute is not ready for you.',
  },

  // ── ADVANCED SNOWBOARDING ─────────────────────────────────────────────
  {
    id: 'adv-snb-01',
    title: 'Backcountry Snowboarding: Splitboard Essentials',
    description:
      'Earn your turns. Splitboard setup, skinning technique, transition efficiency, and the descents that make it all worth it.',
    duration: '20:15',
    module: 'Backcountry',
    moduleNumber: 8,
    level: 'advanced',
    sport: 'snowboarding',
    instructor: 'Marcus Rivera',
    thumbnailVariant: 7,
    isFree: false,
    isComplete: false,
    keyTakeaways: [
      'Splitboard setup and skin application',
      'Kick turns on steep skin tracks',
      'Transition from tour mode to ride mode in under 3 minutes',
      'Avalanche safety fundamentals (beacon, probe, shovel)',
    ],
    aiCoachTip:
      'Practice transitions in your yard or a parking lot. In the backcountry, slow transitions cost energy and daylight.',
  },
  {
    id: 'adv-snb-02',
    title: 'Advanced Freestyle: 360s and Beyond',
    description:
      'Take your freestyle to the next level with frontside and backside 360s. Covers approach speed, pop timing, grab sequencing, and stomping the landing.',
    duration: '16:40',
    module: 'Advanced Freestyle',
    moduleNumber: 9,
    level: 'advanced',
    sport: 'snowboarding',
    instructor: 'Emma Larsson',
    thumbnailVariant: 3,
    isFree: false,
    isComplete: false,
    keyTakeaways: [
      'Frontside 360: wind up, pop, spot, stomp',
      'Backside 360: blind landing technique',
      'Grab for style AND stability',
      'Build up: 180 comfortable, 270 drill, then commit to 360',
    ],
    aiCoachTip:
      'If you are under-rotating, you are not popping hard enough. Height creates time, and time creates rotation.',
  },
];
