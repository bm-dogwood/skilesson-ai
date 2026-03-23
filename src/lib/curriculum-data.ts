// ============================================================
// Curriculum Data — SkiLesson.ai
// The single source of truth for all course content.
// ============================================================

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'interactive' | 'quiz';
  isFree: boolean;
}

export interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  lessons: Lesson[];
  level: 'beginner' | 'intermediate' | 'advanced';
  sport: 'skiing' | 'snowboarding' | 'both';
}

// ────────────────────────────────────────────────────────
// BEGINNER — SKIING (8 modules)
// ────────────────────────────────────────────────────────

const beginnerSkiing: Module[] = [
  {
    id: 'ski-beg-1',
    number: 1,
    title: 'Welcome to the Mountain',
    description:
      'Understand how ski resorts work, learn mountain etiquette, and build the safety awareness that keeps every run enjoyable.',
    level: 'beginner',
    sport: 'skiing',
    lessons: [
      {
        id: 'ski-beg-1-1',
        title: 'How a Ski Resort Works',
        description:
          'Trail maps, run ratings, base vs. summit, and how to read the signs that guide your day on the mountain.',
        duration: '8 min',
        type: 'video',
        isFree: true,
      },
      {
        id: 'ski-beg-1-2',
        title: 'Mountain Etiquette & the Skier Responsibility Code',
        description:
          'The unwritten (and written) rules every skier must follow — right-of-way, merging, and how to share the slopes safely.',
        duration: '7 min',
        type: 'video',
        isFree: true,
      },
      {
        id: 'ski-beg-1-3',
        title: 'Safety First: Helmets, Hydration & Sun Protection',
        description:
          'Why helmets are non-negotiable, how altitude affects hydration, and the gear that protects you from UV at 10,000 feet.',
        duration: '6 min',
        type: 'video',
        isFree: true,
      },
      {
        id: 'ski-beg-1-4',
        title: 'Knowledge Check: Mountain Basics',
        description:
          'Quick quiz covering trail ratings, right-of-way rules, and essential safety gear before you click into your skis.',
        duration: '5 min',
        type: 'quiz',
        isFree: true,
      },
    ],
  },
  {
    id: 'ski-beg-2',
    number: 2,
    title: 'Gear Up',
    description:
      'Everything you need to know about selecting, fitting, and caring for ski equipment so it works with you, not against you.',
    level: 'beginner',
    sport: 'skiing',
    lessons: [
      {
        id: 'ski-beg-2-1',
        title: 'Choosing the Right Skis & Bindings',
        description:
          'Ski length, waist width, rocker profiles, and binding DIN settings explained in plain language for first-time buyers and renters.',
        duration: '10 min',
        type: 'video',
        isFree: true,
      },
      {
        id: 'ski-beg-2-2',
        title: 'Boot Fitting That Actually Works',
        description:
          'How to find boots that fit properly, the flex index explained, and the single biggest mistake beginners make with boot sizing.',
        duration: '9 min',
        type: 'video',
        isFree: true,
      },
      {
        id: 'ski-beg-2-3',
        title: 'Layering & Outerwear for Comfort',
        description:
          'The three-layer system, moisture-wicking base layers, and why cotton will ruin your day on the hill.',
        duration: '7 min',
        type: 'video',
        isFree: true,
      },
      {
        id: 'ski-beg-2-4',
        title: 'Equipment Care & Storage',
        description:
          'End-of-day wipe-downs, seasonal waxing, edge tuning basics, and how to store gear so it lasts for years.',
        duration: '6 min',
        type: 'video',
        isFree: true,
      },
    ],
  },
  {
    id: 'ski-beg-3',
    number: 3,
    title: 'First Steps',
    description:
      'Get comfortable in your boots and on flat terrain before ever pointing downhill. Balance and confidence start here.',
    level: 'beginner',
    sport: 'skiing',
    lessons: [
      {
        id: 'ski-beg-3-1',
        title: 'Walking in Ski Boots',
        description:
          'How to walk on flat ground, up gentle slopes, and across lodge decks without tripping — your first win of the day.',
        duration: '5 min',
        type: 'video',
        isFree: true,
      },
      {
        id: 'ski-beg-3-2',
        title: 'Clicking In & Basic Flat-Ground Movement',
        description:
          'Step into your bindings with confidence, then practice sliding, sidestepping, and the herringbone walk on flat terrain.',
        duration: '8 min',
        type: 'interactive',
        isFree: true,
      },
      {
        id: 'ski-beg-3-3',
        title: 'Finding Your Balance Point',
        description:
          'Static and dynamic balance drills on flat ground that build the athletic stance you will use on every run.',
        duration: '7 min',
        type: 'video',
        isFree: true,
      },
    ],
  },
  {
    id: 'ski-beg-4',
    number: 4,
    title: 'The Basics',
    description:
      'Your first real downhill skills — the snowplow stop, speed control, and the fundamental movements that make skiing click.',
    level: 'beginner',
    sport: 'skiing',
    lessons: [
      {
        id: 'ski-beg-4-1',
        title: 'The Snowplow (Pizza) Position',
        description:
          'Form the wedge shape, feel the edges grip the snow, and learn the body position that gives you instant speed control.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-beg-4-2',
        title: 'Stopping with Confidence',
        description:
          'Drill the snowplow stop on gentle terrain until it becomes second nature — the most important skill in skiing.',
        duration: '7 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'ski-beg-4-3',
        title: 'Straight Runs & Gliding',
        description:
          'Practice gliding in a narrow wedge and a straight parallel stance to feel speed and develop comfort with momentum.',
        duration: '6 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-beg-4-4',
        title: 'Knowledge Check: Basic Skills',
        description:
          'Test your understanding of the snowplow, stopping mechanics, and proper body position before moving to turns.',
        duration: '5 min',
        type: 'quiz',
        isFree: false,
      },
    ],
  },
  {
    id: 'ski-beg-5',
    number: 5,
    title: 'Turning Foundations',
    description:
      'Learn wedge turns to change direction with control. This is where skiing truly begins to feel like skiing.',
    level: 'beginner',
    sport: 'skiing',
    lessons: [
      {
        id: 'ski-beg-5-1',
        title: 'Weight Shifting & the Falling Leaf',
        description:
          'Feel how shifting your weight from one ski to the other initiates a change of direction, even in a snowplow.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-beg-5-2',
        title: 'Your First Wedge Turns',
        description:
          'Link your first left and right turns down a gentle slope. Focus on rhythm, patience, and smooth weight transfer.',
        duration: '10 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'ski-beg-5-3',
        title: 'Direction Control Drills',
        description:
          'Practice turning toward a target, stopping in a specific zone, and navigating around cones to sharpen directional accuracy.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-beg-5-4',
        title: 'Common Turning Mistakes & Fixes',
        description:
          'The five most common errors beginners make when turning — and the simple corrections that solve each one instantly.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'ski-beg-6',
    number: 6,
    title: 'Riding the Lift',
    description:
      'Chair lifts can be intimidating. Master loading, riding, and unloading so you can access the entire mountain with confidence.',
    level: 'beginner',
    sport: 'skiing',
    lessons: [
      {
        id: 'ski-beg-6-1',
        title: 'Chair Lift Loading & Unloading',
        description:
          'Step-by-step breakdown of approaching the lift line, sitting down smoothly, lowering the bar, and standing up at the top.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-beg-6-2',
        title: 'What to Do If Something Goes Wrong',
        description:
          'Missed the chair? Fell at the top? The lift stopped? Stay calm — here is exactly what to do in every scenario.',
        duration: '6 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-beg-6-3',
        title: 'Lift Etiquette & Other Lift Types',
        description:
          'Singles lines, gondolas, T-bars, magic carpets, and the social norms that make lift rides pleasant for everyone.',
        duration: '5 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'ski-beg-7',
    number: 7,
    title: 'Green Runs',
    description:
      'Take everything you have learned and link turns down real green-circle terrain. Speed control and rhythm are your focus.',
    level: 'beginner',
    sport: 'skiing',
    lessons: [
      {
        id: 'ski-beg-7-1',
        title: 'Reading a Green Run',
        description:
          'Identify the fall line, spot flat sections, and plan your line before you push off — a habit that will serve you forever.',
        duration: '6 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-beg-7-2',
        title: 'Linking Turns with Rhythm',
        description:
          'Build a smooth, consistent turn cadence down a green run — left, right, left, right — feeling the flow of the mountain.',
        duration: '9 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'ski-beg-7-3',
        title: 'Speed Control on Real Terrain',
        description:
          'Use turn shape, edge angle, and the snowplow to manage speed when the slope gets steeper than the bunny hill.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-beg-7-4',
        title: 'Knowledge Check: Green Run Readiness',
        description:
          'Comprehensive quiz on turn linking, speed management, lift procedures, and mountain awareness before moving to intermediate.',
        duration: '5 min',
        type: 'quiz',
        isFree: false,
      },
    ],
  },
  {
    id: 'ski-beg-8',
    number: 8,
    title: 'Building Confidence',
    description:
      'Read terrain, understand weather conditions, and assess your readiness to progress beyond beginner slopes.',
    level: 'beginner',
    sport: 'skiing',
    lessons: [
      {
        id: 'ski-beg-8-1',
        title: 'Terrain Awareness & Trail Selection',
        description:
          'How to pick the right run for your ability, read trail map symbols, and know when a run is beyond your current level.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-beg-8-2',
        title: 'Weather & Snow Conditions for Beginners',
        description:
          'Groomed vs. ungroomed, morning hardpack vs. afternoon slush, and how temperature changes the snow under your skis.',
        duration: '6 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-beg-8-3',
        title: 'Am I Ready for Blue Runs?',
        description:
          'A self-assessment checklist and practical test to determine if your skills are solid enough for intermediate terrain.',
        duration: '8 min',
        type: 'interactive',
        isFree: false,
      },
    ],
  },
];

// ────────────────────────────────────────────────────────
// BEGINNER — SNOWBOARDING (8 modules)
// ────────────────────────────────────────────────────────

const beginnerSnowboarding: Module[] = [
  {
    id: 'snb-beg-1',
    number: 1,
    title: 'Welcome to the Mountain',
    description:
      'Understand how ski resorts work, learn mountain etiquette specific to snowboarders, and build essential safety awareness.',
    level: 'beginner',
    sport: 'snowboarding',
    lessons: [
      {
        id: 'snb-beg-1-1',
        title: 'How a Ski Resort Works for Snowboarders',
        description:
          'Trail maps, run ratings, terrain parks, and the resort features that matter most when you ride a board.',
        duration: '8 min',
        type: 'video',
        isFree: true,
      },
      {
        id: 'snb-beg-1-2',
        title: 'Mountain Etiquette & the Rider Responsibility Code',
        description:
          'Right-of-way, blind spots on your heel side, and how to share the mountain respectfully with skiers and other riders.',
        duration: '7 min',
        type: 'video',
        isFree: true,
      },
      {
        id: 'snb-beg-1-3',
        title: 'Safety First: Helmets, Wrist Guards & Impact Shorts',
        description:
          'The protective gear that dramatically reduces snowboard-specific injuries — wrists, tailbone, and head.',
        duration: '6 min',
        type: 'video',
        isFree: true,
      },
      {
        id: 'snb-beg-1-4',
        title: 'Knowledge Check: Mountain Basics',
        description:
          'Quick quiz covering trail ratings, rider responsibility, and essential safety gear before you strap in.',
        duration: '5 min',
        type: 'quiz',
        isFree: true,
      },
    ],
  },
  {
    id: 'snb-beg-2',
    number: 2,
    title: 'Gear Up',
    description:
      'Selecting, fitting, and caring for your snowboard, boots, and bindings so every piece of equipment supports your progression.',
    level: 'beginner',
    sport: 'snowboarding',
    lessons: [
      {
        id: 'snb-beg-2-1',
        title: 'Choosing the Right Snowboard',
        description:
          'Board length, width, flex, camber profiles, and why the right board for a beginner is different from what the pros ride.',
        duration: '10 min',
        type: 'video',
        isFree: true,
      },
      {
        id: 'snb-beg-2-2',
        title: 'Boots & Bindings That Fit',
        description:
          'Lacing systems, flex ratings, binding angles, and the stance width that matches your body — no more guessing.',
        duration: '9 min',
        type: 'video',
        isFree: true,
      },
      {
        id: 'snb-beg-2-3',
        title: 'Layering & Outerwear for Riders',
        description:
          'The three-layer system, waterproof ratings, and why snowboarders need more padding in specific areas than skiers.',
        duration: '7 min',
        type: 'video',
        isFree: true,
      },
      {
        id: 'snb-beg-2-4',
        title: 'Board Care & Storage',
        description:
          'Waxing your base, repairing scratches, edge maintenance, and proper off-season storage to extend your board life.',
        duration: '6 min',
        type: 'video',
        isFree: true,
      },
    ],
  },
  {
    id: 'snb-beg-3',
    number: 3,
    title: 'First Steps',
    description:
      'Get comfortable strapped to a single board on flat ground. Balance, stance, and basic movement before any slope.',
    level: 'beginner',
    sport: 'snowboarding',
    lessons: [
      {
        id: 'snb-beg-3-1',
        title: 'Regular or Goofy? Finding Your Stance',
        description:
          'Simple tests to determine which foot leads, then set up your bindings and stance width for maximum comfort.',
        duration: '6 min',
        type: 'interactive',
        isFree: true,
      },
      {
        id: 'snb-beg-3-2',
        title: 'Strapping In & Flat-Ground Skating',
        description:
          'How to strap into your bindings, skate with one foot free, and glide across flat terrain to the lift or lodge.',
        duration: '8 min',
        type: 'video',
        isFree: true,
      },
      {
        id: 'snb-beg-3-3',
        title: 'Balance Drills & the Athletic Stance',
        description:
          'Static and dynamic balance exercises on flat ground that build the centered, relaxed stance you need on every run.',
        duration: '7 min',
        type: 'video',
        isFree: true,
      },
    ],
  },
  {
    id: 'snb-beg-4',
    number: 4,
    title: 'The Basics',
    description:
      'Your first real downhill movements — sideslipping, falling leaf, and the heel-side and toe-side stops that keep you in control.',
    level: 'beginner',
    sport: 'snowboarding',
    lessons: [
      {
        id: 'snb-beg-4-1',
        title: 'Heel-Side Sideslip',
        description:
          'Face downhill, balance on your heel edge, and learn to slide straight down while controlling speed with edge pressure.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-beg-4-2',
        title: 'Toe-Side Sideslip',
        description:
          'Turn to face uphill, press into your toe edge, and master the same speed control from the opposite edge.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-beg-4-3',
        title: 'The Falling Leaf',
        description:
          'Traverse back and forth across the slope on one edge without turning — the key drill for edge awareness and balance.',
        duration: '9 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'snb-beg-4-4',
        title: 'How to Fall (and Get Back Up)',
        description:
          'Every snowboarder falls. Learn the techniques that protect your wrists, head, and tailbone — and how to stand up efficiently.',
        duration: '6 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'snb-beg-5',
    number: 5,
    title: 'Turning Foundations',
    description:
      'Transition from sideslipping to real turns. Master the heel-to-toe and toe-to-heel edge changes that unlock the mountain.',
    level: 'beginner',
    sport: 'snowboarding',
    lessons: [
      {
        id: 'snb-beg-5-1',
        title: 'Heel-Side to Toe-Side: Your First Turn',
        description:
          'The moment it clicks — flatten your board, shift your weight, and roll onto the opposite edge to change direction.',
        duration: '10 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-beg-5-2',
        title: 'Toe-Side to Heel-Side Transitions',
        description:
          'Complete the other half of the turn cycle so you can link full S-turns down a gentle slope.',
        duration: '9 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-beg-5-3',
        title: 'Linking Your First Turns',
        description:
          'Put heel-to-toe and toe-to-heel together into a flowing, linked sequence — the foundation of all snowboard riding.',
        duration: '10 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'snb-beg-5-4',
        title: 'Common Turning Mistakes & Fixes',
        description:
          'Counter-rotation, leaning uphill, and the dreaded "catching an edge" — what causes them and how to fix each one.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'snb-beg-6',
    number: 6,
    title: 'Riding the Lift',
    description:
      'Navigate chair lifts and surface lifts with your board — loading, riding, and unloading without catching an edge.',
    level: 'beginner',
    sport: 'snowboarding',
    lessons: [
      {
        id: 'snb-beg-6-1',
        title: 'Chair Lift Loading & Unloading with a Board',
        description:
          'Unbuckle your rear foot, skate to position, sit down smoothly, and glide off at the top without falling.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-beg-6-2',
        title: 'Recovering from Lift Mishaps',
        description:
          'What to do when you fall at the top, miss the chair, or the lift stops — stay calm and follow these steps.',
        duration: '5 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-beg-6-3',
        title: 'Surface Lifts, Gondolas & T-Bars',
        description:
          'How to ride pomas, T-bars, and magic carpets on a snowboard — plus gondola etiquette for boarders.',
        duration: '6 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'snb-beg-7',
    number: 7,
    title: 'Green Runs',
    description:
      'Apply your linked turns to real green-circle terrain. Build speed control, rhythm, and confidence on groomed slopes.',
    level: 'beginner',
    sport: 'snowboarding',
    lessons: [
      {
        id: 'snb-beg-7-1',
        title: 'Reading a Green Run on a Board',
        description:
          'Identify the fall line, flat spots that slow you down, and how to plan your line to maintain momentum.',
        duration: '6 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-beg-7-2',
        title: 'Linking Turns with Flow',
        description:
          'Build a smooth, rhythmic turn cadence down a green run — heel, toe, heel, toe — finding your natural riding style.',
        duration: '9 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'snb-beg-7-3',
        title: 'Speed Control on Real Terrain',
        description:
          'Use turn shape, edge angle, and sideslipping to manage speed when the slope gets steeper than the learning area.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-beg-7-4',
        title: 'Knowledge Check: Green Run Readiness',
        description:
          'Comprehensive quiz on linked turns, speed management, lift procedures, and mountain awareness.',
        duration: '5 min',
        type: 'quiz',
        isFree: false,
      },
    ],
  },
  {
    id: 'snb-beg-8',
    number: 8,
    title: 'Building Confidence',
    description:
      'Read terrain, understand conditions, and assess your readiness to progress to blue runs and beyond.',
    level: 'beginner',
    sport: 'snowboarding',
    lessons: [
      {
        id: 'snb-beg-8-1',
        title: 'Terrain Awareness & Trail Selection',
        description:
          'How to choose the right run, read trail signs, and avoid trails that are beyond your current riding ability.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-beg-8-2',
        title: 'Weather & Snow Conditions for Riders',
        description:
          'Groomed corduroy, afternoon slush, icy patches, and how changing conditions affect your board differently than skis.',
        duration: '6 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-beg-8-3',
        title: 'Am I Ready for Blue Runs?',
        description:
          'A self-assessment checklist and practical test to know if your edge control, turns, and confidence are blue-run ready.',
        duration: '8 min',
        type: 'interactive',
        isFree: false,
      },
    ],
  },
];

// ────────────────────────────────────────────────────────
// INTERMEDIATE — SKIING (10 modules)
// ────────────────────────────────────────────────────────

const intermediateSkiing: Module[] = [
  {
    id: 'ski-int-1',
    number: 1,
    title: 'Parallel Skiing',
    description:
      'Ditch the snowplow for good. Develop the parallel turn that separates beginners from real skiers.',
    level: 'intermediate',
    sport: 'skiing',
    lessons: [
      {
        id: 'ski-int-1-1',
        title: 'From Wedge to Parallel',
        description:
          'Progressive drills that narrow your snowplow until both skis are parallel through the entire turn.',
        duration: '10 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-int-1-2',
        title: 'Edge Engagement & Angulation',
        description:
          'How to tip your skis onto their edges and use hip angulation to carve clean arcs instead of skidding.',
        duration: '9 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-int-1-3',
        title: 'Pole Planting Fundamentals',
        description:
          'Timing, reach, and wrist action for pole plants that trigger clean turn initiation and rhythm.',
        duration: '8 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'ski-int-1-4',
        title: 'Parallel Turn Troubleshooting',
        description:
          'Diagnose and fix the most common parallel turn errors: A-framing, backseat skiing, and rushing the turn.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'ski-int-2',
    number: 2,
    title: 'Speed Management on Blue Runs',
    description:
      'Control your speed with technique, not fear. Master the tools that let you ski blue runs with authority.',
    level: 'intermediate',
    sport: 'skiing',
    lessons: [
      {
        id: 'ski-int-2-1',
        title: 'Turn Shape as Speed Control',
        description:
          'Rounder turns slow you down, straighter turns let you run. Learn to adjust your arc radius intentionally.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-int-2-2',
        title: 'The Hockey Stop',
        description:
          'A sharp, controlled stop using simultaneous edge engagement — essential for crowded slopes and sudden obstacles.',
        duration: '7 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'ski-int-2-3',
        title: 'Skiing in Traffic & Variable Pitch',
        description:
          'Handle crowded runs, sudden steeps, flat transitions, and trail intersections with confidence and awareness.',
        duration: '9 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'ski-int-3',
    number: 3,
    title: 'Mogul Basics',
    description:
      'Bumps are not obstacles — they are features. Learn the absorption and extension technique that makes moguls fun.',
    level: 'intermediate',
    sport: 'skiing',
    lessons: [
      {
        id: 'ski-int-3-1',
        title: 'Reading a Mogul Field',
        description:
          'How moguls form, the line options through them, and how to pick a path before you drop in.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-int-3-2',
        title: 'Absorption & Extension Technique',
        description:
          'Use your legs as shock absorbers — compress on the bump, extend in the trough — to maintain snow contact.',
        duration: '10 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-int-3-3',
        title: 'Turning on the Bump',
        description:
          'Use the top of each mogul as a pivot point for quick, efficient turns that control speed naturally.',
        duration: '9 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'ski-int-3-4',
        title: 'Mogul Endurance & Rhythm',
        description:
          'Build the leg stamina and rhythmic breathing to ski an entire mogul run without stopping halfway.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'ski-int-4',
    number: 4,
    title: 'Powder Fundamentals',
    description:
      'Your first taste of ungroomed snow. Adjust your technique for the floating, surfy feeling of fresh powder.',
    level: 'intermediate',
    sport: 'skiing',
    lessons: [
      {
        id: 'ski-int-4-1',
        title: 'Why Powder Feels Different',
        description:
          'The physics of skiing in soft snow — why your normal technique fails and what adjustments restore control.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-int-4-2',
        title: 'Stance & Weight Distribution in Powder',
        description:
          'Center your weight, keep both skis equally loaded, and use a slightly wider stance to float instead of sink.',
        duration: '9 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-int-4-3',
        title: 'Bouncing & Rhythm Turns',
        description:
          'Use the rebound of the snow to initiate turns with an up-and-down rhythm that makes powder skiing effortless.',
        duration: '10 min',
        type: 'interactive',
        isFree: false,
      },
    ],
  },
  {
    id: 'ski-int-5',
    number: 5,
    title: 'Variable Conditions',
    description:
      'Ice, crud, slush, and windpack — the mountain rarely gives you perfect groomed runs. Adapt to everything.',
    level: 'intermediate',
    sport: 'skiing',
    lessons: [
      {
        id: 'ski-int-5-1',
        title: 'Skiing on Ice & Hardpack',
        description:
          'Edge sharpness, subtle angulation, and the patience required to maintain grip when the snow fights back.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-int-5-2',
        title: 'Crud & Chopped-Up Snow',
        description:
          'When powder gets tracked out, it becomes crud. Learn the active leg movements that absorb the chaos.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-int-5-3',
        title: 'Spring Slush & Afternoon Conditions',
        description:
          'Soft, heavy, wet snow demands a different approach. Wider stance, forward pressure, and patience.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-int-5-4',
        title: 'Knowledge Check: All-Conditions Skiing',
        description:
          'Test your understanding of technique adjustments for ice, crud, powder, and slush.',
        duration: '5 min',
        type: 'quiz',
        isFree: false,
      },
    ],
  },
  {
    id: 'ski-int-6',
    number: 6,
    title: 'Terrain Park Intro',
    description:
      'Your first park laps. Learn park etiquette, basic jumps, and simple rail approaches safely and progressively.',
    level: 'intermediate',
    sport: 'skiing',
    lessons: [
      {
        id: 'ski-int-6-1',
        title: 'Park Etiquette & Safety',
        description:
          'One rider at a time, call your drop, check the landing — the rules that keep the park safe for everyone.',
        duration: '6 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-int-6-2',
        title: 'Small Jumps & Straight Airs',
        description:
          'Approach speed, pop timing, and balanced landings on XS and S jumps in the beginner park.',
        duration: '9 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-int-6-3',
        title: 'Box Slides & Rail Basics',
        description:
          'Start with wide boxes, progress to narrow rails — foot position, balance point, and how to bail safely.',
        duration: '10 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'ski-int-6-4',
        title: 'Rollers, Berms & Terrain Features',
        description:
          'Use the natural features in the park — rollers for speed, berms for turns — to flow through the course.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'ski-int-7',
    number: 7,
    title: 'Steeps',
    description:
      'Blue-black and single-black terrain. Overcome the intimidation of steep pitches with proper technique and mindset.',
    level: 'intermediate',
    sport: 'skiing',
    lessons: [
      {
        id: 'ski-int-7-1',
        title: 'Committing to the Fall Line',
        description:
          'Why leaning into the hill is the most dangerous instinct on steeps — and how to override it with proper stance.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-int-7-2',
        title: 'Short Turns on Steep Terrain',
        description:
          'Quick, aggressive edge-to-edge turns that bleed speed on steep pitches without traversing the entire width.',
        duration: '9 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'ski-int-7-3',
        title: 'Managing Fear on Black Diamonds',
        description:
          'Breathing techniques, visualization, and the progressive exposure method that builds genuine confidence.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'ski-int-8',
    number: 8,
    title: 'Tree Skiing',
    description:
      'Glades offer the best snow on the mountain. Learn to navigate tight spaces, variable light, and natural terrain.',
    level: 'intermediate',
    sport: 'skiing',
    lessons: [
      {
        id: 'ski-int-8-1',
        title: 'Choosing the Right Glade',
        description:
          'Tree density, pitch, snow coverage, and how to identify beginner-friendly glades vs. expert-only tree runs.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-int-8-2',
        title: 'Technique in the Trees',
        description:
          'Shorter turns, hands forward, eyes ahead — the specific adjustments that make tree skiing safe and thrilling.',
        duration: '9 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-int-8-3',
        title: 'Tree Safety & Tree Wells',
        description:
          'The real danger of tree skiing is tree wells. How to avoid them, how to escape them, and why you never ski trees alone.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'ski-int-9',
    number: 9,
    title: 'Mountain Navigation',
    description:
      'Use trail maps, GPS apps, and terrain features to explore the entire mountain without getting lost or stranded.',
    level: 'intermediate',
    sport: 'skiing',
    lessons: [
      {
        id: 'ski-int-9-1',
        title: 'Reading Trail Maps Like a Local',
        description:
          'Understand aspect, elevation changes, and how to find hidden runs that are not obvious on first glance.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-int-9-2',
        title: 'Using Ski Apps & GPS',
        description:
          'The best ski tracking apps, real-time trail status, and how GPS can help you find your group and navigate the resort.',
        duration: '6 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-int-9-3',
        title: 'Planning Your Mountain Day',
        description:
          'First tracks, midday strategy, afternoon wind-down — how to structure a ski day for maximum runs and minimum fatigue.',
        duration: '8 min',
        type: 'interactive',
        isFree: false,
      },
    ],
  },
  {
    id: 'ski-int-10',
    number: 10,
    title: 'Self-Assessment & Video Review',
    description:
      'Film your skiing, analyze your form, and create a structured improvement plan for continued progression.',
    level: 'intermediate',
    sport: 'skiing',
    lessons: [
      {
        id: 'ski-int-10-1',
        title: 'Filming Your Skiing Effectively',
        description:
          'Camera angles, phone mounts, and GoPro positions that capture the footage you actually need for analysis.',
        duration: '6 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'ski-int-10-2',
        title: 'Analyzing Your Form',
        description:
          'Frame-by-frame breakdown: what to look for in your stance, edge angle, pole plant, and body position.',
        duration: '9 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'ski-int-10-3',
        title: 'Building Your Improvement Plan',
        description:
          'Set specific, measurable goals for the rest of your season based on what your video review reveals.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
];

// ────────────────────────────────────────────────────────
// INTERMEDIATE — SNOWBOARDING (10 modules)
// ────────────────────────────────────────────────────────

const intermediateSnowboarding: Module[] = [
  {
    id: 'snb-int-1',
    number: 1,
    title: 'Linked Carving',
    description:
      'Move beyond skidded turns to true carving — clean edge-to-edge transitions that leave pencil-thin tracks in the snow.',
    level: 'intermediate',
    sport: 'snowboarding',
    lessons: [
      {
        id: 'snb-int-1-1',
        title: 'From Skidded Turns to Carved Turns',
        description:
          'The difference between sliding sideways and slicing through snow — and the body movements that make carving possible.',
        duration: '10 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-int-1-2',
        title: 'Heel-Side Carving',
        description:
          'Dial in your heel-side edge angle, knee bend, and hip position for clean, arcing heel-side carves.',
        duration: '9 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-int-1-3',
        title: 'Toe-Side Carving',
        description:
          'The toe-side carve demands more commitment. Build the ankle pressure and forward lean that locks your edge.',
        duration: '9 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'snb-int-1-4',
        title: 'Linking Carved Turns with Flow',
        description:
          'Seamless edge-to-edge transitions that create a smooth, rhythmic descent — the hallmark of an intermediate rider.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'snb-int-2',
    number: 2,
    title: 'Speed Management on Blue Runs',
    description:
      'Control speed through turn shape and edge technique, not braking. Ride blue terrain with composure.',
    level: 'intermediate',
    sport: 'snowboarding',
    lessons: [
      {
        id: 'snb-int-2-1',
        title: 'Turn Shape as Speed Control',
        description:
          'Wider, rounder turns bleed speed; tighter, straighter arcs let you run. Learn to dial speed with turn radius.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-int-2-2',
        title: 'The Power Slide Stop',
        description:
          'A sharp, controlled stop from both heel-side and toe-side — your emergency brake for any situation.',
        duration: '7 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'snb-int-2-3',
        title: 'Riding in Traffic & Variable Pitch',
        description:
          'Handle crowded runs, sudden steeps, flat transitions, and cat tracks with confidence and spatial awareness.',
        duration: '9 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'snb-int-3',
    number: 3,
    title: 'Mogul Basics',
    description:
      'Bumps on a snowboard require a different approach than skis. Learn the absorption technique that makes moguls rideable.',
    level: 'intermediate',
    sport: 'snowboarding',
    lessons: [
      {
        id: 'snb-int-3-1',
        title: 'Reading a Mogul Field on a Board',
        description:
          'How to pick a line through bumps on a snowboard — wider spacing, banking options, and trough riding.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-int-3-2',
        title: 'Absorption & Extension on a Board',
        description:
          'Compress your legs on top of the bump, extend in the trough, and maintain board-to-snow contact throughout.',
        duration: '10 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-int-3-3',
        title: 'Quick Turns Between Bumps',
        description:
          'Use the bump tops and troughs as turn points for rapid, controlled direction changes on a snowboard.',
        duration: '9 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'snb-int-3-4',
        title: 'Mogul Endurance for Riders',
        description:
          'Build the quad stamina and core engagement to ride an entire mogul run without your legs giving out.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'snb-int-4',
    number: 4,
    title: 'Powder Fundamentals',
    description:
      'Snowboards were made for powder. Adjust your stance, weight, and technique for the surfy, floating sensation of fresh snow.',
    level: 'intermediate',
    sport: 'snowboarding',
    lessons: [
      {
        id: 'snb-int-4-1',
        title: 'Why Powder Feels Different on a Board',
        description:
          'The physics of a snowboard in soft snow — nose dive prevention, speed requirements, and the surf analogy.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-int-4-2',
        title: 'Setback Stance & Weight Distribution',
        description:
          'Shift your weight to the rear foot, set your bindings back, and float your nose above the snow surface.',
        duration: '9 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-int-4-3',
        title: 'Powder Turns & Speed Maintenance',
        description:
          'Use bouncing rhythm turns and maintain enough speed to stay on top of the snow in deeper conditions.',
        duration: '10 min',
        type: 'interactive',
        isFree: false,
      },
    ],
  },
  {
    id: 'snb-int-5',
    number: 5,
    title: 'Variable Conditions',
    description:
      'Ice, crud, slush, and windpack — adapt your riding to whatever the mountain throws at your board.',
    level: 'intermediate',
    sport: 'snowboarding',
    lessons: [
      {
        id: 'snb-int-5-1',
        title: 'Riding on Ice & Hardpack',
        description:
          'Edge maintenance, subtle pressure control, and the balanced stance that keeps your board gripping on bulletproof snow.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-int-5-2',
        title: 'Crud & Tracked-Out Snow',
        description:
          'When powder gets chopped up, it fights back. Active leg movements and a centered stance to absorb the mess.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-int-5-3',
        title: 'Spring Slush & Heavy Snow',
        description:
          'Wet, heavy snow grabs your edges. Learn the speed, stance, and wax choices that handle spring conditions.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-int-5-4',
        title: 'Knowledge Check: All-Conditions Riding',
        description:
          'Test your understanding of technique adjustments across ice, crud, powder, and slush on a snowboard.',
        duration: '5 min',
        type: 'quiz',
        isFree: false,
      },
    ],
  },
  {
    id: 'snb-int-6',
    number: 6,
    title: 'Terrain Park Intro',
    description:
      'Your first park sessions. Learn park flow, basic jumps, and rail approaches with proper etiquette and safety.',
    level: 'intermediate',
    sport: 'snowboarding',
    lessons: [
      {
        id: 'snb-int-6-1',
        title: 'Park Etiquette & Safety',
        description:
          'One rider at a time, call your drop, inspect before you send — the rules that keep everyone safe in the park.',
        duration: '6 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-int-6-2',
        title: 'Small Jumps & Straight Airs',
        description:
          'Speed checks, ollie pop, stable air position, and stomped landings on XS and S jumps.',
        duration: '9 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-int-6-3',
        title: '50-50s & Board Slides',
        description:
          'Start with wide boxes, progress to rails — approach angle, balance point, and how to step off safely.',
        duration: '10 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'snb-int-6-4',
        title: 'Rollers, Berms & Flow Features',
        description:
          'Use rollers for air, berms for speed, and hips for style — flowing through the park with natural terrain features.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'snb-int-7',
    number: 7,
    title: 'Steeps',
    description:
      'Black diamond terrain on a snowboard. Overcome intimidation with proper body position and aggressive edge control.',
    level: 'intermediate',
    sport: 'snowboarding',
    lessons: [
      {
        id: 'snb-int-7-1',
        title: 'Dropping In on Steep Terrain',
        description:
          'Why leaning uphill on a board guarantees a fall — and the committed forward stance that keeps you in control.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-int-7-2',
        title: 'Quick Edge-to-Edge on Steeps',
        description:
          'Rapid, aggressive heel-to-toe transitions that scrub speed on steep pitches without traversing the entire run.',
        duration: '9 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'snb-int-7-3',
        title: 'Managing Fear on Black Diamonds',
        description:
          'Breathing techniques, visualization, and the progressive exposure approach that builds real steep-riding confidence.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'snb-int-8',
    number: 8,
    title: 'Tree Riding',
    description:
      'Glades offer untouched snow and natural features. Navigate tight trees, variable light, and natural terrain on a board.',
    level: 'intermediate',
    sport: 'snowboarding',
    lessons: [
      {
        id: 'snb-int-8-1',
        title: 'Choosing the Right Glade',
        description:
          'Tree spacing, pitch, snow depth, and how to identify rider-friendly glades vs. expert-only tree runs.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-int-8-2',
        title: 'Technique in the Trees',
        description:
          'Quick turns, centered stance, eyes two trees ahead — the adjustments that make tree riding safe and exhilarating.',
        duration: '9 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-int-8-3',
        title: 'Tree Safety & Tree Wells',
        description:
          'Tree wells are the hidden danger of tree riding. How to spot them, avoid them, and escape if you fall in.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'snb-int-9',
    number: 9,
    title: 'Mountain Navigation',
    description:
      'Explore the full mountain with confidence. Trail maps, GPS apps, and planning strategies for all-day riding.',
    level: 'intermediate',
    sport: 'snowboarding',
    lessons: [
      {
        id: 'snb-int-9-1',
        title: 'Reading Trail Maps Like a Local',
        description:
          'Aspect, elevation, hidden stashes, and the flat cat tracks that snowboarders need to avoid or plan for.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-int-9-2',
        title: 'Using Ride-Tracking Apps',
        description:
          'The best snowboard tracking apps, run logging, speed data, and how to find your crew on the mountain.',
        duration: '6 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-int-9-3',
        title: 'Planning Your Mountain Day',
        description:
          'First chair strategy, avoiding crowds, managing energy, and structuring a full day for maximum progression.',
        duration: '8 min',
        type: 'interactive',
        isFree: false,
      },
    ],
  },
  {
    id: 'snb-int-10',
    number: 10,
    title: 'Self-Assessment & Video Review',
    description:
      'Film your riding, analyze your form, and build a structured improvement plan for continued progression.',
    level: 'intermediate',
    sport: 'snowboarding',
    lessons: [
      {
        id: 'snb-int-10-1',
        title: 'Filming Your Riding Effectively',
        description:
          'Camera angles, helmet mounts, and follow-cam techniques that capture useful footage for self-analysis.',
        duration: '6 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'snb-int-10-2',
        title: 'Analyzing Your Form',
        description:
          'Frame-by-frame breakdown: what to look for in your stance, edge angle, body rotation, and arm position.',
        duration: '9 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'snb-int-10-3',
        title: 'Building Your Improvement Plan',
        description:
          'Set specific, measurable goals for the rest of your season based on what your video analysis reveals.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
];

// ────────────────────────────────────────────────────────
// ADVANCED — BOTH SPORTS (10 modules)
// ────────────────────────────────────────────────────────

const advanced: Module[] = [
  {
    id: 'adv-1',
    number: 1,
    title: 'Expert Carving',
    description:
      'Racing-grade technique. High-angle carves, clean edge transitions, and the body mechanics of truly elite turns.',
    level: 'advanced',
    sport: 'both',
    lessons: [
      {
        id: 'adv-1-1',
        title: 'High-Performance Edge Angles',
        description:
          'Extreme angulation and inclination — how to get your body close to the snow while maintaining balance and power.',
        duration: '10 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'adv-1-2',
        title: 'Pressure Management Through the Arc',
        description:
          'Build, maintain, and release edge pressure at precisely the right moments for a perfectly round carved turn.',
        duration: '9 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'adv-1-3',
        title: 'GS vs. Slalom Carving Technique',
        description:
          'The differences in body position, turn radius, and timing between giant slalom and slalom carving styles.',
        duration: '10 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'adv-1-4',
        title: 'Carving Drills for Precision',
        description:
          'On-snow drills used by racing coaches: railroad tracks, javelin turns, and the one-ski carving challenge.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'adv-2',
    number: 2,
    title: 'Extreme Terrain',
    description:
      'Double black diamonds, chutes, couloirs, and exposed lines. The skills and judgment required for expert-only terrain.',
    level: 'advanced',
    sport: 'both',
    lessons: [
      {
        id: 'adv-2-1',
        title: 'Assessing Extreme Terrain',
        description:
          'Evaluate a double black before you drop in: snow conditions, exposure, escape routes, and the go/no-go decision.',
        duration: '9 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'adv-2-2',
        title: 'Chutes & Couloirs',
        description:
          'Narrow, steep, and unforgiving. The specific techniques for navigating chutes — jump turns, sideslips, and commitment.',
        duration: '10 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'adv-2-3',
        title: 'Cliff Drops & Mandatory Air',
        description:
          'Scouting the landing, speed judgment, body position in the air, and absorbing impact on steep landings.',
        duration: '8 min',
        type: 'interactive',
        isFree: false,
      },
    ],
  },
  {
    id: 'adv-3',
    number: 3,
    title: 'Deep Powder Mastery',
    description:
      'Waist-deep and beyond. Advanced powder technique for the deepest days when ordinary methods are not enough.',
    level: 'advanced',
    sport: 'both',
    lessons: [
      {
        id: 'adv-3-1',
        title: 'Deep Powder Body Mechanics',
        description:
          'The extreme weight shift, rhythm, and leg action required when the snow is above your knees.',
        duration: '9 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'adv-3-2',
        title: 'Equipment Setup for Deep Days',
        description:
          'Fat skis, powder boards, rockered tips, and binding adjustments that make deep snow manageable.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'adv-3-3',
        title: 'Pillow Lines & Natural Features',
        description:
          'Read pillows, wind lips, and natural features to find the line of a lifetime through deep, untouched terrain.',
        duration: '10 min',
        type: 'interactive',
        isFree: false,
      },
    ],
  },
  {
    id: 'adv-4',
    number: 4,
    title: 'Park & Pipe',
    description:
      'Advanced freestyle. Spins, grabs, halfpipe technique, and the progression from basic tricks to competition-level riding.',
    level: 'advanced',
    sport: 'both',
    lessons: [
      {
        id: 'adv-4-1',
        title: 'Spin Mechanics: 360s & Beyond',
        description:
          'Approach, wind-up, pop, rotation, spot the landing, and stomp it — the biomechanics of aerial rotation.',
        duration: '10 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'adv-4-2',
        title: 'Grabs & Style',
        description:
          'Indy, mute, stalefish, method — the fundamental grabs that add style and stability to every aerial maneuver.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'adv-4-3',
        title: 'Halfpipe Fundamentals',
        description:
          'Dropping in, pumping for speed, hitting the lip, vertical air, and re-entry — the complete halfpipe toolkit.',
        duration: '11 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'adv-4-4',
        title: 'Rail Progression: Frontside, Backside & Switch',
        description:
          'Advanced rail approaches, direction changes, and switch-ups that elevate your jib game beyond the basics.',
        duration: '9 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'adv-5',
    number: 5,
    title: 'Racing Fundamentals',
    description:
      'GS and slalom racing technique, gate discipline, and the competitive edge that comes from racing-focused training.',
    level: 'advanced',
    sport: 'both',
    lessons: [
      {
        id: 'adv-5-1',
        title: 'Gate Approach & Line Selection',
        description:
          'Early vs. late apex, gate clearance, and the racing line that shaves tenths without increasing risk.',
        duration: '9 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'adv-5-2',
        title: 'Giant Slalom Technique',
        description:
          'Long-radius, high-speed carved turns with gate contact — the foundation of alpine racing technique.',
        duration: '10 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'adv-5-3',
        title: 'Slalom Technique',
        description:
          'Short, aggressive turns with quick edge transitions and pole blocking — the fastest discipline in alpine racing.',
        duration: '10 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'adv-5-4',
        title: 'Race Day Preparation',
        description:
          'Course inspection, warm-up routines, equipment prep, and the mental checklist that elite racers follow.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'adv-6',
    number: 6,
    title: 'Backcountry Essentials',
    description:
      'Beyond the resort boundary. Avalanche safety, route finding, and the equipment that keeps you alive in the backcountry.',
    level: 'advanced',
    sport: 'both',
    lessons: [
      {
        id: 'adv-6-1',
        title: 'Avalanche Awareness & Terrain Assessment',
        description:
          'Slope angle, aspect, snow layers, and the decision framework that prevents you from triggering a slide.',
        duration: '12 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'adv-6-2',
        title: 'Essential Backcountry Gear',
        description:
          'Beacon, probe, shovel — the holy trinity. Plus airbag packs, communication devices, and first aid essentials.',
        duration: '9 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'adv-6-3',
        title: 'Beacon Search & Rescue Drills',
        description:
          'Practice the systematic search pattern that locates a buried beacon in under five minutes — this skill saves lives.',
        duration: '11 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'adv-6-4',
        title: 'Route Finding & Decision Making',
        description:
          'Topographic maps, weather forecasting, group management, and the risk-assessment tools professionals use.',
        duration: '10 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'adv-7',
    number: 7,
    title: 'Teaching Others',
    description:
      'Share your skills. Learn how to teach beginners effectively, give clear feedback, and structure a productive lesson.',
    level: 'advanced',
    sport: 'both',
    lessons: [
      {
        id: 'adv-7-1',
        title: 'Principles of Effective Instruction',
        description:
          'The PSIA/AASI teaching model: assess, plan, execute, review — structured pedagogy for snow sports.',
        duration: '9 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'adv-7-2',
        title: 'Demonstrating & Giving Feedback',
        description:
          'Show, not tell. How to demonstrate movements clearly and deliver feedback that students actually absorb.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'adv-7-3',
        title: 'Structuring a Lesson Plan',
        description:
          'Warm-up, skill introduction, practice, application, cool-down — a complete lesson structure for any ability level.',
        duration: '10 min',
        type: 'interactive',
        isFree: false,
      },
    ],
  },
  {
    id: 'adv-8',
    number: 8,
    title: 'Fitness & Conditioning',
    description:
      'Off-mountain training that directly improves your on-snow performance. Legs, core, cardio, and mobility.',
    level: 'advanced',
    sport: 'both',
    lessons: [
      {
        id: 'adv-8-1',
        title: 'Leg Strength for Snow Sports',
        description:
          'Squats, lunges, wall sits, and plyometric drills that build the quad and glute endurance for all-day performance.',
        duration: '12 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'adv-8-2',
        title: 'Core Stability & Rotational Power',
        description:
          'Planks, Russian twists, medicine ball throws, and the anti-rotation exercises that stabilize every turn.',
        duration: '10 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'adv-8-3',
        title: 'Cardio & Altitude Preparation',
        description:
          'Interval training, VO2max development, and the acclimatization strategies for skiing at elevation.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'adv-8-4',
        title: 'Mobility & Injury Prevention',
        description:
          'Hip openers, ankle mobility, IT band work, and the pre-season screening that prevents common ski injuries.',
        duration: '9 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'adv-9',
    number: 9,
    title: 'Mental Game',
    description:
      'Visualization, fear management, focus techniques, and the sports psychology that separates good from great.',
    level: 'advanced',
    sport: 'both',
    lessons: [
      {
        id: 'adv-9-1',
        title: 'Visualization & Mental Rehearsal',
        description:
          'Guided visualization techniques used by Olympic athletes to rehearse perfect runs before dropping in.',
        duration: '9 min',
        type: 'interactive',
        isFree: false,
      },
      {
        id: 'adv-9-2',
        title: 'Fear Management & Commitment',
        description:
          'Understand the difference between rational caution and irrational fear, and build the tools to manage both.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'adv-9-3',
        title: 'Flow State & Focus',
        description:
          'The conditions that trigger flow — the zone where time slows down and skiing becomes effortless. How to access it.',
        duration: '10 min',
        type: 'video',
        isFree: false,
      },
    ],
  },
  {
    id: 'adv-10',
    number: 10,
    title: 'Season Planning',
    description:
      'Trip planning, resort selection, budget strategy, and how to structure a season for maximum progression and enjoyment.',
    level: 'advanced',
    sport: 'both',
    lessons: [
      {
        id: 'adv-10-1',
        title: 'Resort Selection & Trip Planning',
        description:
          'Match your skill goals to the right resorts. Terrain variety, snow records, crowds, and travel logistics.',
        duration: '8 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'adv-10-2',
        title: 'Pass Strategy & Budgeting',
        description:
          'Ikon vs. Epic vs. Indy — which pass fits your plans. Plus lodging, gear, and travel budget frameworks.',
        duration: '7 min',
        type: 'video',
        isFree: false,
      },
      {
        id: 'adv-10-3',
        title: 'Building a Season-Long Progression Plan',
        description:
          'Map your skill goals across the season: early season fundamentals, mid-season pushing limits, late season consolidation.',
        duration: '9 min',
        type: 'interactive',
        isFree: false,
      },
    ],
  },
];

// ────────────────────────────────────────────────────────
// AGGREGATED EXPORTS
// ────────────────────────────────────────────────────────

export const allModules: Module[] = [
  ...beginnerSkiing,
  ...beginnerSnowboarding,
  ...intermediateSkiing,
  ...intermediateSnowboarding,
  ...advanced,
];

export function getModulesByLevel(level: Module['level']): Module[] {
  return allModules.filter((m) => m.level === level);
}

export function getModulesBySport(sport: 'skiing' | 'snowboarding'): Module[] {
  return allModules.filter((m) => m.sport === sport || m.sport === 'both');
}

export function getModulesByLevelAndSport(
  level: Module['level'],
  sport: 'skiing' | 'snowboarding'
): Module[] {
  return allModules.filter(
    (m) => m.level === level && (m.sport === sport || m.sport === 'both')
  );
}

export function getModuleById(id: string): Module | undefined {
  return allModules.find((m) => m.id === id);
}

export function getTotalDurationMinutes(modules: Module[]): number {
  return modules.reduce((total, mod) => {
    return (
      total +
      mod.lessons.reduce((lessonTotal, lesson) => {
        return lessonTotal + parseInt(lesson.duration, 10);
      }, 0)
    );
  }, 0);
}

export function getLessonCount(modules: Module[]): number {
  return modules.reduce((total, mod) => total + mod.lessons.length, 0);
}

export const levelMeta = {
  beginner: {
    label: 'Beginner',
    tagline: 'From first timer to confident green-run cruiser',
    color: '#38bdf8',
    gradient: 'from-sky-400 to-cyan-500',
  },
  intermediate: {
    label: 'Intermediate',
    tagline: 'Blue runs, moguls, powder, and beyond',
    color: '#f59e0b',
    gradient: 'from-amber-400 to-orange-500',
  },
  advanced: {
    label: 'Advanced',
    tagline: 'Expert terrain, backcountry, racing, and mastery',
    color: '#f43f5e',
    gradient: 'from-rose-400 to-red-500',
  },
} as const;
