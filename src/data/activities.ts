export type Category = 'Creative' | 'Physical' | 'Mental' | 'Social' | 'Digital' | 'Clean';
export type TimeFrame = '5min' | '15min' | '30min' | '1hr+';
export type EnergyLevel = 'Low' | 'Medium' | 'High';

export interface Activity {
  id: string;
  title: string;
  description: string;
  time: TimeFrame;
  energy: EnergyLevel;
  category: Category;
  steps: string[];
}

export const activities: Activity[] = [
  {
    id: '1',
    title: 'Speed Sketching',
    description: 'Pick an object in the room and sketch it in under 2 minutes.',
    time: '5min',
    energy: 'Low',
    category: 'Creative',
    steps: [
      'Find a pen and paper.',
      'Choose a random object in your line of sight.',
      'Set a timer for 2 minutes.',
      'Draw it without lifting your pen if possible.',
      'Don\'t worry about quality, focus on speed.'
    ]
  },
  {
    id: '2',
    title: 'Desktop Zero',
    description: 'Organize your digital workspace. A clear desktop equals a clear mind.',
    time: '5min',
    energy: 'Low',
    category: 'Digital',
    steps: [
      'Close all unused browser tabs.',
      'Delete or move screenshots from your desktop.',
      'Empty the trash bin.',
      'Update your computer if needed.'
    ]
  },
  {
    id: '3',
    title: 'The "Plank" Challenge',
    description: 'Re-energize your body with a quick core workout.',
    time: '5min',
    energy: 'High',
    category: 'Physical',
    steps: [
      'Find a clear space on the floor.',
      'Get into a push-up position but rest on your forearms.',
      'Hold your body straight like a plank.',
      'See how long you can hold (aim for 1 minute).',
      'Rest and repeat once.'
    ]
  },
  {
    id: '4',
    title: 'Learn a Magic Trick',
    description: 'Master a simple sleight of hand to impress friends.',
    time: '15min',
    energy: 'Medium',
    category: 'Mental',
    steps: [
      'Search "simple coin vanish tutorial" on YouTube.',
      'Grab a coin.',
      'Practice the "French Drop" move in front of a mirror.',
      'Repeat until smooth.'
    ]
  },
  {
    id: '5',
    title: 'Wikipedia Rabbit Hole',
    description: 'Start at a random article and try to navigate to "Philosophy" just by clicking links.',
    time: '15min',
    energy: 'Low',
    category: 'Digital',
    steps: [
      'Go to Wikipedia and click "Random Article".',
      'Click a link in the main text of that article.',
      'Repeat, aiming for broad concepts.',
      'See how many clicks it takes to reach "Philosophy".'
    ]
  },
  {
    id: '6',
    title: '15-Minute Declutter',
    description: 'Pick one drawer or shelf and organize it perfectly.',
    time: '15min',
    energy: 'Medium',
    category: 'Clean',
    steps: [
      'Choose the "junk drawer" or a messy shelf.',
      'Take everything out.',
      'Throw away trash immediately.',
      'Group similar items.',
      'Put back only what belongs there.'
    ]
  },
  {
    id: '7',
    title: 'Write a Haiku',
    description: 'Capture a moment in 5-7-5 syllables.',
    time: '5min',
    energy: 'Low',
    category: 'Creative',
    steps: [
      'Look out the window or at a photo.',
      'Write 3 lines.',
      'First line: 5 syllables.',
      'Second line: 7 syllables.',
      'Third line: 5 syllables.'
    ]
  },
  {
    id: '8',
    title: 'Learn the NATO Phonetic Alphabet',
    description: 'Never struggle to spell your email over the phone again.',
    time: '30min',
    energy: 'Medium',
    category: 'Mental',
    steps: [
      'Alpha, Bravo, Charlie, Delta...',
      'Write down your full name in NATO phonetics.',
      'Memorize the first 5 letters.',
      'Practice spelling words you see around you.'
    ]
  },
  {
    id: '9',
    title: 'Digital Detox Walk',
    description: 'Leave your phone behind and observe the world.',
    time: '30min',
    energy: 'Medium',
    category: 'Physical',
    steps: [
      'Leave your phone at home or turn it off.',
      'Walk around your block.',
      'Notice 5 things you\'ve never seen before.',
      'Listen to the ambient sounds.',
      'Breathe deeply.'
    ]
  },
  {
    id: '10',
    title: 'Cook a New Dish',
    description: 'Use whatever ingredients you have to make something new.',
    time: '1hr+',
    energy: 'High',
    category: 'Creative',
    steps: [
      'Check your fridge and pantry.',
      'Pick 3 random ingredients.',
      'Search for a recipe using them or improvise.',
      'Focus on plating and presentation.'
    ]
  },
  {
    id: '11',
    title: 'Read a Longform Article',
    description: 'Deep dive into a topic you know nothing about.',
    time: '30min',
    energy: 'Low',
    category: 'Mental',
    steps: [
      'Visit "Longform.org" or "The Sunday Long Read".',
      'Pick a headline that intrigues you.',
      'Read without skimming.',
      'Take notes on 3 key takeaways.'
    ]
  },
  {
    id: '12',
    title: 'Origami Crane',
    description: 'Turn a square piece of paper into a bird.',
    time: '15min',
    energy: 'Low',
    category: 'Creative',
    steps: [
      'Get a square piece of paper.',
      'Follow an origami crane diagram or video.',
      'Focus on precise folds.',
      'Make a second one from memory.'
    ]
  },
  {
    id: '13',
    title: 'Reach Out',
    description: 'Send a thoughtful message to someone you haven\'t spoken to in a while.',
    time: '5min',
    energy: 'Low',
    category: 'Social',
    steps: [
      'Scroll through your contacts.',
      'Find an old friend.',
      'Send a text saying "Thinking of you, hope you\'re well."',
      'No pressure to start a long conversation.'
    ]
  },
  {
    id: '14',
    title: 'Bodyweight Circuit',
    description: 'Get your heart rate up without equipment.',
    time: '15min',
    energy: 'High',
    category: 'Physical',
    steps: [
      '10 Push-ups.',
      '20 Squats.',
      '30 Jumping Jacks.',
      'Rest 1 minute.',
      'Repeat 3 times.'
    ]
  },
  {
    id: '15',
    title: 'Box Breathing',
    description: 'Reset your nervous system with a Navy SEAL technique.',
    time: '5min',
    energy: 'Low',
    category: 'Mental',
    steps: [
      'Inhale for 4 seconds.',
      'Hold for 4 seconds.',
      'Exhale for 4 seconds.',
      'Hold empty for 4 seconds.',
      'Repeat for 4 rounds.'
    ]
  }
];
