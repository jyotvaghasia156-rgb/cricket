export const STORY_CHAPTERS = [
  {
    id: 1,
    title: "The Boy from West Delhi",
    year: "1998 - 2004",
    era: "Childhood & Academy",
    age: "10-15 Years Old",
    avatar: "teen",
    venue: "West Delhi Cricket Academy, Paschim Vihar",
    opponent: "Senior Academy Bowlers",
    situation: "Coach Rajkumar Sharma tests young Virat's backlift and courage against 18-year-old fast bowlers on rough net pitches.",
    pitchReport: {
      surface: "Dry Hard Concrete & Clay",
      weather: "42°C Scorching Summer Delhi Heat",
      atmosphere: "Dusty nets, cracking leather balls, intense academy discipline"
    },
    tacticalLore: "Coach Rajkumar placed a coin on top of the stumps. If Virat got bowled, he lost his batting turn for the day. Virat batted for 3 hours straight without letting his stumps be touched once.",
    storyText: [
      "Young Virat, affectionately nicknamed 'Cheeku' by his state coach Ajit Chaudhary after a cartoon rabbit, walked into West Delhi Cricket Academy in May 1998 holding his father Prem Kohli's hand. He was just 9 years old.",
      "Coach Rajkumar Sharma immediately noticed an unusual quality in the chubby kid: unlike other youngsters who flinched or backed away from short-pitched leather balls, Virat stepped forward into the line of the ball with his eyes locked on the seam.",
      "'He never wanted to bat in his own age group,' recalls Coach Rajkumar. 'While other 10-year-olds played with plastic balls, Cheeku demanded to face the 18-year-old club pacers on our fastest net pitches.'",
      "His father Prem Kohli drove him on his scooter every single morning before heading to his legal practice. Prem told Rajkumar: 'Coach Saab, don't give him any shortcuts. If he earns his place, let it be through sweat alone.'",
      "Today is your final selection trials for the Delhi Under-15 squad. The selectors are watching your stance, front-foot stride, and head balance. Master patience and execute the textbook cover drive."
    ],
    quotes: [
      { speaker: "Prem Kohli (Father)", text: "Cheeku, play with honesty. If you have real talent and work hard, nobody in this world can stop you." },
      { speaker: "Coach Rajkumar Sharma", text: "Elbow high, head over the ball! Never play across the line in my nets. Discipline is your superpower." },
      { speaker: "Young Virat (Age 12)", text: "I don't care how fast they bowl. I just want to hit the middle of the bat and score runs for Delhi." }
    ],
    challengeGoal: "Score 35 runs in 18 balls without losing more than 1 wicket",
    targetScore: 35,
    ballsAllowed: 18,
    wicketsAllowed: 1,
    bowlerName: "Senior Pacer (Academy)",
    bowlerType: "Medium Fast",
    bowlerSpeed: "128 km/h",
    rewardTitle: "The Prodigy Unlocked",
    rewardPerk: "Timing Window +15%",
    dialogueChoices: [
      {
        text: "Step out confidently and play the high-elbow cover drive past mid-off",
        outcome: "Coach nods with approval. Focus increased! (+10% shot timing)",
        statBonus: { focus: 10 }
      },
      {
        text: "Stay back, let the ball bounce and punch through covers off the backfoot",
        outcome: "Solid technique displayed. Stamina preserved! (+10% stamina)",
        statBonus: { stamina: 10 }
      }
    ]
  },
  {
    id: 2,
    title: "The Heart of Steel",
    year: "December 19, 2006",
    era: "Ranji Trophy Tragedy",
    age: "18 Years Old",
    avatar: "teen",
    venue: "Feroz Shah Kotla, Delhi",
    opponent: "Karnataka Ranji Team",
    situation: "Delhi is 103/5, facing follow-on. At 3:00 AM, Virat's father Prem Kohli passes away. At 8:00 AM, with tears in his eyes, Virat chooses duty and pads up to save his state.",
    pitchReport: {
      surface: "Damp Winter Seam Track",
      weather: "9°C Bitter Foggy Delhi Winter Morning",
      atmosphere: "Stunned silence in the dressing room; teammates weeping in admiration"
    },
    tacticalLore: "Karnataka bowlers Vinay Kumar and Venkatesh Prasad instructed their team not to sledge the 18-year-old boy. The entire stadium stood in absolute awe of his courage.",
    storyText: [
      "In the bitter winter chill of Delhi, 18-year-old Virat was unbeaten on 40 overnight against Karnataka in a crucial Ranji Trophy match. Delhi was reeling at 103/5, still needing 80 runs to avoid a humiliating follow-on.",
      "At 3:00 AM in their Vikas Puri home, his beloved father Prem Kohli suffered a sudden fatal brain stroke. The family was shattered in profound grief.",
      "His mother Saroj looked at her weeping son and told him softly: 'Son, your father gave his life to see you play for India. Do not leave your team in the lurch. Go save Delhi.'",
      "Virat called coach Rajkumar Sharma at 6:00 AM, weeping uncontrollably: 'Sir, papa is no more. What should I do?' The coach choked up and replied: 'If you can muster the courage, go bat. It is the greatest tribute you can give your father.'",
      "He walked out at Kotla with swollen, teary eyes at 8:00 AM. He batted for nearly 5 hours, scoring a hero's 90 runs before being wrongly given out. He saved Delhi from the follow-on, walked straight to his car, and drove directly to the electric crematorium for his father's final rites.",
      "That morning, Virat Kohli the boy died. Virat Kohli the indomitable warrior was born."
    ],
    quotes: [
      { speaker: "Virat Kohli", text: "I called my coach weeping. That day cricket stopped being a hobby. It became my religion, my tribute to my father." },
      { speaker: "Mithun Manhas (Delhi Captain)", text: "At 18, I saw the strongest human spirit I have ever witnessed on a cricket field. He didn't drop a single tear until he crossed the boundary rope." },
      { speaker: "Saroj Kohli (Mother)", text: "He became a mature man overnight. After that day, he lost all fear of failure." }
    ],
    challengeGoal: "Survive and score 45 runs off 20 balls to save Delhi from follow-on",
    targetScore: 45,
    ballsAllowed: 20,
    wicketsAllowed: 1,
    bowlerName: "Vinay Kumar",
    bowlerType: "Right-arm Medium Seam",
    bowlerSpeed: "133 km/h",
    rewardTitle: "Indomitable Spirit",
    rewardPerk: "Pressure Resilience +25%",
    dialogueChoices: [
      {
        text: "Channel the grief into laser-sharp focus for every single delivery",
        outcome: "A quiet resolve washes over you. Mental fortitude maxed! (+15% timing)",
        statBonus: { focus: 15 }
      },
      {
        text: "Bat aggressively to honor father's memory with boundary hits",
        outcome: "Fiery passion takes over! Power bonus active (+15% bat speed)",
        statBonus: { power: 15 }
      }
    ]
  },
  {
    id: 3,
    title: "Golden Boys of Malaysia",
    year: "March 2, 2008",
    era: "Under-19 World Cup Final",
    age: "19 Years Old",
    avatar: "young",
    venue: "Kinrara Academy Oval, Kuala Lumpur",
    opponent: "South Africa U-19",
    situation: "Rain-affected U-19 World Cup final! India bowled out for 159. Captain Kohli must rally the team with electric fielding and tactical captaincy.",
    pitchReport: {
      surface: "Moist Tropical Pitch under Rain Threat",
      weather: "Monsoon Downpour & Heavy Cloudcover",
      atmosphere: "Tense World Cup final atmosphere with D/L calculations"
    },
    tacticalLore: "Virat bowling his medium pacers took key wickets in the semi-final vs Kane Williamson's New Zealand. His aggressive field placements in the final forced 3 maiden overs under rain pressure.",
    storyText: [
      "Captain Virat Kohli arrived in Malaysia with aggressive swag, frosted hair tips, and an unquenchable hunger for world glory.",
      "Leading an Indian unit featuring Ravindra Jadeja, Manish Pandey, and Saurabh Tiwary, Kohli had already dismantled New Zealand in the semifinal with both bat and ball.",
      "In the rain-truncated final against Wayne Parnell's South Africa, India managed only a paltry 159 runs. As the rain poured over Kuala Lumpur, Kohli assembled his boys in a tight circle and roared: 'Every single run is gold today! We bleed for this cup!'",
      "With aggressive slip catchers, brilliant bowling rotations, and explosive fielding effort, India defended the revised target by 12 runs (D/L).",
      "Virat Kohli hoisted the ICC U-19 World Cup trophy high into the Malaysia sky, announcing his arrival to global cricket."
    ],
    quotes: [
      { speaker: "Virat Kohli", text: "We didn't come to Malaysia for a vacation. We came to lift that trophy, and we won't stop until it's in our hands." },
      { speaker: "Ian Bishop (Commentator)", text: "Remember the name: Virat Kohli. This young captain has fire in his belly and champion pedigree written all over him." },
      { speaker: "Ravindra Jadeja", text: "Virat's intensity in that huddle gave all of us goosebumps. We knew we couldn't lose." }
    ],
    challengeGoal: "Captain's Knock: Blast 40 runs in 16 balls to set a match-winning target",
    targetScore: 40,
    ballsAllowed: 16,
    wicketsAllowed: 2,
    bowlerName: "Wayne Parnell",
    bowlerType: "Left-arm Fast",
    bowlerSpeed: "140 km/h",
    rewardTitle: "World Champion Captain",
    rewardPerk: "Captaincy Morale Boost",
    dialogueChoices: [
      {
        text: "Attack the left-arm pacer over extra cover with lofted drives",
        outcome: "Dominant lofted shots! +10% power",
        statBonus: { power: 10 }
      },
      {
        text: "Rotate strike with sharp running between wickets, target the spinners",
        outcome: "Precision running! +15% running speed",
        statBonus: { running: 15 }
      }
    ]
  },
  {
    id: 4,
    title: "Carrying the Master - 2011 World Cup",
    year: "April 2, 2011",
    era: "World Cup Glory",
    age: "22 Years Old",
    avatar: "young",
    venue: "Wankhede Stadium, Mumbai",
    opponent: "Sri Lanka",
    situation: "World Cup Final: Chasing 275, India is in stunned silence at 31/2 after Sehwag and Tendulkar are dismissed by Malinga. 22-year-old Kohli walks into a cauldron.",
    pitchReport: {
      surface: "Flat Wankhede Track under Dew",
      weather: "29°C Humid Mumbai Night",
      atmosphere: "Deafening roar of 42,000 fans at Wankhede Stadium"
    },
    tacticalLore: "Kohli's 83-run partnership with Gautam Gambhir absorbed 15 overs of spin from Muralitharan and Randiv, turning the momentum back to India.",
    storyText: [
      "The entire nation went numb as Sachin Tendulkar edged Lasith Malinga and walked back to the pavilion. 31 for 2 in the World Cup final chasing 275.",
      "As Tendulkar crossed 22-year-old Virat on the boundary ropes, Sachin simply patted him on the back: 'Lage raho, partnership banao' (Stay at it, build a partnership).",
      "Kohli joined Gautam Gambhir. Under suffocating pressure, Kohli played a gritty, mature 35 off 49 balls, stitching an invaluable 83-run stand before taking an extraordinary diving caught-and-bowled by Dilshan.",
      "When MS Dhoni struck the winning six into the Wankhede night sky, Virat ran onto the field crying tears of ecstasy, hoisting Sachin Tendulkar on his shoulders for the historic victory lap.",
      "'Tendulkar has carried the burden of the nation for 21 years; it was time we carried him on our shoulders.'"
    ],
    quotes: [
      { speaker: "Virat Kohli (2011)", text: "Tendulkar has carried the burden of the nation for 21 years; it was time we carried him on our shoulders." },
      { speaker: "Gautam Gambhir", text: "Those 35 runs Virat scored that night were worth 100 in value. He soaked in all the pressure when the stadium went silent." },
      { speaker: "Sachin Tendulkar", text: "Seeing these young boys like Virat play with such passion made me realize Indian cricket is in safe hands." }
    ],
    challengeGoal: "Counter-attack Malinga and Murali: Score 42 runs in 18 balls without getting bowled",
    targetScore: 42,
    ballsAllowed: 18,
    wicketsAllowed: 1,
    bowlerName: "Lasith Malinga",
    bowlerType: "Slinging Yorker Specialist",
    bowlerSpeed: "142 km/h",
    rewardTitle: "The World Cup Ring",
    rewardPerk: "Boundary Magnet: +10% 4s chance",
    dialogueChoices: [
      {
        text: "Watch Malinga's toe-crusher sling from the hand and dig it out through midwicket",
        outcome: "Masterclass flick against yorkers unlocked!",
        statBonus: { focus: 15 }
      },
      {
        text: "Step out early to convert Malinga's yorker into a full toss",
        outcome: "Fearless audacity! High-risk high-reward power mode",
        statBonus: { power: 15 }
      }
    ]
  },
  {
    id: 5,
    title: "The Hobart Storm",
    year: "February 28, 2012",
    era: "The Chase Master is Born",
    age: "23 Years Old",
    avatar: "young",
    venue: "Bellerive Oval, Hobart, Australia",
    opponent: "Sri Lanka",
    situation: "CB Series: India must chase 321 in under 40 overs (for bonus point) to stay alive in the tournament. Kohli launches the greatest ODI assault of the decade.",
    pitchReport: {
      surface: "True Australian Hard Deck",
      weather: "18°C Cool Tasmanian Breeze",
      atmosphere: "Electrifying Australian venue under floodlights"
    },
    tacticalLore: "Kohli scored 24 runs off a single Lasith Malinga over: 6, 4, 4, 4, 2, 4! Malinga conceded 96 runs in 7.4 overs, the worst figures of his career.",
    storyText: [
      "The equation was virtually impossible: 321 runs needed in 40 overs against Lasith Malinga, Nuwan Kulasekara, and Angelo Mathews to earn a bonus point.",
      "A 23-year-old Virat Kohli walked in at number 4. What followed was utter carnage that reshaped ODI batting forever.",
      "Kohli tore Malinga to shreds, hitting 24 runs in a single over off the sling-arm yorker king: 6, 4, 4, 4, 2, 4! Lasith Malinga looked at the skies in sheer disbelief.",
      "Kohli finished on an astonishing 133* off just 86 balls with 16 fours and 2 sixes, as India chased down 321 in just 36.4 overs!",
      "The world had officially witnessed the arrival of the Greatest Chase Master in cricket history."
    ],
    quotes: [
      { speaker: "Tony Greig (Legendary Commentator)", text: "That is majestic! Pure, unadulterated batsmanship from this young Indian genius!" },
      { speaker: "Lasith Malinga", text: "I bowled my best yorkers, and he hit them for six over mid-wicket like it was nothing." },
      { speaker: "MS Dhoni", text: "When Virat is in that zone during a chase, even 400 is not safe for opposition bowlers." }
    ],
    challengeGoal: "Demolish Malinga: Blast 50 runs in 15 balls at a 300+ strike rate!",
    targetScore: 50,
    ballsAllowed: 15,
    wicketsAllowed: 2,
    bowlerName: "Lasith Malinga (Death Overs)",
    bowlerType: "Right-arm Fast Slinger",
    bowlerSpeed: "145 km/h",
    rewardTitle: "Chase Master Crown",
    rewardPerk: "Six-Hitting Power +20%",
    dialogueChoices: [
      {
        text: "Whip Malinga's toe-crusher off middle stump over deep square leg for six!",
        outcome: "Signature wrist flick! Maximum crowd roar (+20% power)",
        statBonus: { power: 20 }
      },
      {
        text: "Stand tall, open the blade and carve him through extra cover for consecutive fours",
        outcome: "Textbook boundary piercing! (+15% timing)",
        statBonus: { focus: 15 }
      }
    ]
  },
  {
    id: 6,
    title: "The King of Adelaide",
    year: "December 2014",
    era: "Test Captaincy Dawn",
    age: "26 Years Old",
    avatar: "prime",
    venue: "Adelaide Oval, Australia",
    opponent: "Australia (Johnson, Harris, Lyon)",
    situation: "First Test as Captain: India is set 364 to win on Day 5. While conventional wisdom says play for a draw, Kohli boldly commands the team to go for the win.",
    pitchReport: {
      surface: "Day 5 Turning Adelaide Deck with Rough Footmarks",
      weather: "32°C Hot Adelaide Sun",
      atmosphere: "High-octane Test match thriller under intense Australian heat"
    },
    tacticalLore: "Kohli scored twin centuries (115 & 141) in his Test captaincy debut, becoming only the second player in Test history to achieve this feat.",
    storyText: [
      "With MS Dhoni injured, Virat Kohli stepped out at Adelaide Oval as India's 32nd Test captain. He immediately stamped his aggressive DNA on Indian Test cricket.",
      "After hitting 115 in the first innings, India was set 364 to win on the final day on a turning Adelaide pitch against Mitchell Johnson firing 150 km/h bouncers.",
      "Virat gathered the team on Day 5 morning: 'We are not playing for a draw. If we go down, we go down swinging for a historic win.'",
      "Kohli produced a blistering 141 off 175 balls, hooking Mitchell Johnson for sixes and dancing down the track to Nathan Lyon. Although India fell just 48 runs short, Australian cricket knew a new sheriff was in town."
    ],
    quotes: [
      { speaker: "Virat Kohli", text: "At no point did we think about a draw. We play to win, anywhere in the world. That is our new identity." },
      { speaker: "Michael Clarke", text: "Virat didn't just captain India today; he announced the beginning of a fearless, aggressive era." },
      { speaker: "Mitchell Johnson", text: "I bowled at his badge at 150 km/h, and he didn't blink. He hooked me into the stands." }
    ],
    challengeGoal: "Hook Mitchell Johnson: Score 44 runs in 16 balls on Day 5 pitch",
    targetScore: 44,
    ballsAllowed: 16,
    wicketsAllowed: 1,
    bowlerName: "Mitchell Johnson",
    bowlerType: "Left-arm Express Pace",
    bowlerSpeed: "150 km/h",
    rewardTitle: "Test Dominance Badge",
    rewardPerk: "Hook & Pull Shot Perfection",
    dialogueChoices: [
      {
        text: "Stand outside the crease and hook Johnson's bouncer into the stands!",
        outcome: "Intimidation reversed! Fearless captaincy bonus active",
        statBonus: { power: 20 }
      },
      {
        text: "Drive through mid-on with high elbow dominance",
        outcome: "Adelaide classic strokeplay! +15% focus",
        statBonus: { focus: 15 }
      }
    ]
  },
  {
    id: 7,
    title: "Superhuman 2016: 973 Runs & 8 Stitches",
    year: "May 2016",
    era: "IPL God Mode & Peak Fitness",
    age: "27 Years Old",
    avatar: "prime",
    venue: "M. Chinnaswamy Stadium, Bengaluru",
    opponent: "Kings XI Punjab",
    situation: "Rain curtailed 15-over match. Virat has 8 stitches on his left split webbing. Despite intense pain, he plays and smashes a 47-ball hundred!",
    pitchReport: {
      surface: "Flat Chinnaswamy Belter under Rain Dampness",
      weather: "22°C Bengaluru Rain Shower",
      atmosphere: "Deafening RCB crowd chanting 'KOHLI! KOHLI!' in unison"
    },
    tacticalLore: "Virat scored 973 runs in 16 IPL innings with 4 centuries, 83 fours, and 38 sixes — an all-time world record unlikely to ever be broken.",
    storyText: [
      "In 2016, Virat Kohli attained a level of batting mastery the world had never witnessed before in T20 cricket.",
      "He overhauled his diet, dropped 8 kgs of fat, introduced the Yo-Yo test to Indian cricket, and turned into an athletic machine.",
      "Against KKR, he split his left webbing while fielding, requiring 8 stitches. Doctors advised rest. Virat looked at the bandage and said: 'If I can hold the bat with two fingers, I am playing.'",
      "Against Punjab in a 15-over rain game, he smashed 113 runs off just 50 balls with 12 fours and 8 sixes! He pointed to his stitched webbing as he celebrated his 4th century of the season, finishing with an untouchable record of 973 runs in one edition."
    ],
    quotes: [
      { speaker: "Virat Kohli", text: "Pain is only in the mind. When you are on the field with RCB fans cheering, you feel invincible." },
      { speaker: "AB de Villiers", text: "I have shared dressing rooms with the best in the world. What Virat did in 2016 was not human; it was divinity." },
      { speaker: "KL Rahul", text: "He was batting like a man possessed. 8 stitches on his hand and hitting sixes off medium pacers with ease." }
    ],
    challengeGoal: "Bat through pain: Smash 52 runs in 16 balls with 3 minimum Sixes!",
    targetScore: 52,
    ballsAllowed: 16,
    wicketsAllowed: 1,
    bowlerName: "Sandeep Sharma / Mohit",
    bowlerType: "Right-arm Medium Seam",
    bowlerSpeed: "135 km/h",
    rewardTitle: "God Mode 973",
    rewardPerk: "Extreme Stamina & Power Boost",
    dialogueChoices: [
      {
        text: "Ignore the throbbing hand stitches, launch full swing into every delivery",
        outcome: "Superhuman adrenaline surge! All shots hit with maximum exit velocity",
        statBonus: { power: 25 }
      },
      {
        text: "Use bottom hand whip to carve boundaries through deep mid-wicket",
        outcome: "Wrist magic unlocked! Perfect timing window",
        statBonus: { timing: 20 }
      }
    ]
  },
  {
    id: 8,
    title: "The Valley of Silence & The 71st",
    year: "September 8, 2022",
    era: "Resurrection",
    age: "33 Years Old",
    avatar: "legend",
    venue: "Dubai International Cricket Stadium",
    opponent: "Afghanistan (Rashid Khan, Fazalhaq)",
    situation: "1,020 days without an international century. After stepping down from captaincy and taking a mental health sabbatical, Virat re-emerges to conquer his demons.",
    pitchReport: {
      surface: "Skiddy Dubai Deck",
      weather: "34°C Humid Desert Night",
      atmosphere: "Emotional stadium audience witnessing a legend's rebirth"
    },
    tacticalLore: "Kohli scored 122* off 61 balls with 12 fours and 6 sixes, recording the highest T20I score by an Indian player.",
    storyText: [
      "For nearly three years, the century drought haunted headlines worldwide. Critics questioned his technique, form, and hunger.",
      "Virat took a brave 1-month sabbatical before the Asia Cup, opening up about mental fatigue: 'For the first time in 10 years, I didn't touch my bat for a month.'",
      "He returned with a peaceful mind, smiling at the crease. Against Afghanistan, opening the batting, the maestro flowed like water.",
      "He lofted Fazalhaq Farooqi over deep midwicket, scooped the pacers, and reached 122* off 61 balls! As the ball crossed the rope for the hundred, Virat kissed his wedding ring, looked up at the stars, and smiled. The 71st century had arrived."
    ],
    quotes: [
      { speaker: "Virat Kohli", text: "These last two and a half years have taught me a lot. I realized how much fake things were in my head. This century is for Anushka and Vamika." },
      { speaker: "Sunil Gavaskar", text: "The King never lost his crown; he was just preparing the empire for the greatest comeback." },
      { speaker: "Rohit Sharma", text: "We all knew it was coming. When Virat bats with that smile on his face, no bowling attack can stop him." }
    ],
    challengeGoal: "Break the 1020-day drought: Score 45 runs in 18 balls with zen-like flow",
    targetScore: 45,
    ballsAllowed: 18,
    wicketsAllowed: 2,
    bowlerName: "Rashid Khan",
    bowlerType: "Leg Break / Googly",
    bowlerSpeed: "96 km/h",
    rewardTitle: "Resurrected King",
    rewardPerk: "Zen Focus: Spin Bowling Mastery",
    dialogueChoices: [
      {
        text: "Read Rashid Khan's googly off the hand and loft inside-out over extra cover",
        outcome: "Flawless technical execution! Spin neutralization active",
        statBonus: { focus: 20 }
      },
      {
        text: "Flow freely without overthinking, trusting instinctive muscle memory",
        outcome: "Pure batting nirvana! Smooth timing bonus",
        statBonus: { timing: 20 }
      }
    ]
  },
  {
    id: 9,
    title: "The Shot of an Emperor: MCG 2022",
    year: "October 23, 2022",
    era: "The Miracle of Melbourne",
    age: "33 Years Old",
    avatar: "legend",
    venue: "Melbourne Cricket Ground (MCG), Australia",
    opponent: "Pakistan (Shaheen, Naseem, Rauf)",
    situation: "T20 World Cup: India is 31/4 chasing 160. 90,293 fans in roaring frenzy. 28 runs needed off 8 balls. Haris Rauf bowling express 148 km/h.",
    pitchReport: {
      surface: "Bouncy MCG Track with Seam Movement",
      weather: "16°C Cold Melbourne Night",
      atmosphere: "90,293 screaming fans in a Roman Colosseum frenzy"
    },
    tacticalLore: "ICC declared Kohli's straight back-foot lofted six off Haris Rauf (148 km/h) as 'The Shot of the Century'.",
    storyText: [
      "October 23, 2022. The biggest stage in cricket. 90,293 fans packed the MCG like a modern Colosseum.",
      "India was down and out at 31/4 against Pakistan's fiery pace quartet. Virat Kohli and Hardik Pandya built a rescue stand, but the equation boiled down to an impossible 28 runs required off the final 8 balls.",
      "Haris Rauf was steaming in at 148 km/h, having conceded just 3 runs in the over. Ball 18.5: Slower ball bouncer. Virat stood on his toes, and with pure wizardry, punched a lofted straight drive flat back over Haris Rauf's head into the sightscreen for SIX!",
      "It was voted by the ICC as the greatest T20 shot in history. Next ball: flick over fine leg for SIX. India won on the final ball. Virat fell to his knees, hitting the MCG turf in tears of sheer joy."
    ],
    quotes: [
      { speaker: "Virat Kohli", text: "I have no idea how that shot happened. I just stood tall and hit through the line. It was meant to be. God had a plan." },
      { speaker: "Nasser Hussain (Commentator)", text: "Virat Kohli has conjured magic out of the Melbourne night sky! A performance of unbelievable genius!" },
      { speaker: "Hardik Pandya", text: "I told him at the crease: 'If anyone in the world can pull this off, it's you.' And he did." }
    ],
    challengeGoal: "Perform the MCG Miracle: Score 28 runs in the final 8 balls off Haris Rauf!",
    targetScore: 28,
    ballsAllowed: 8,
    wicketsAllowed: 1,
    bowlerName: "Haris Rauf",
    bowlerType: "Right-arm Express Fast",
    bowlerSpeed: "148 km/h",
    rewardTitle: "Emperor of the MCG",
    rewardPerk: "Clutch King: +30% Power in Final 2 Overs",
    dialogueChoices: [
      {
        text: "Punch back-foot straight down the ground over the bowler's head for the legendary six!",
        outcome: "THE MCG SHOT! Physics defied! Stadium erupts into hysteria!",
        statBonus: { power: 30 }
      },
      {
        text: "Roll the wrists and flick the 148 km/h delivery over deep square leg",
        outcome: "Sublime flick of the wrists! Maximum distance!",
        statBonus: { timing: 30 }
      }
    ]
  },
  {
    id: 10,
    title: "50th Century & The Barbados World Crown",
    year: "Nov 2023 - June 2024",
    era: "The Living Legend",
    age: "35 Years Old",
    avatar: "legend",
    venue: "Kensington Oval, Barbados",
    opponent: "South Africa (World Cup Final)",
    situation: "World Cup 2024 Final: India is 34/3 in the powerplay. Virat plays his farewell T20I masterclass (76 off 59) to lift the ICC T20 World Cup Trophy!",
    pitchReport: {
      surface: "Windward Caribbean Track",
      weather: "28°C Tropical Breezy Barbados Evening",
      atmosphere: "Global audience of billions witnessing Virat's T20 farewell"
    },
    tacticalLore: "In Nov 2023 at Wankhede, Virat broke Sachin's 49 ODI centuries record by scoring his 50th ODI hundred, bowing to Sachin in the stands.",
    storyText: [
      "In November 2023 at Wankhede, Virat broke Sachin Tendulkar's immortal world record by scoring his 50th ODI Century, bowing with hands folded to his childhood idol in the stands.",
      "In June 2024, in the hurricane breezes of Barbados, India reached the T20 World Cup Final against South Africa. India was trembling at 34/3.",
      "King Kohli anchored like a titan. He absorbed the pressure, accelerated in the death overs, and scored 76 off 59 balls to guide India to a match-winning 176.",
      "As India defended the total in a nail-biting final over, Virat Kohli broke down in tears, wrapped himself in the Indian tricolor, and announced his retirement from T20 internationals as a World Champion.",
      "From a chubby boy at West Delhi Academy to the greatest cricketer of his generation, the circle of greatness was complete."
    ],
    quotes: [
      { speaker: "Virat Kohli", text: "This was my last T20 World Cup. We wanted to lift that trophy so badly. It is time for the next generation to take over." },
      { speaker: "Sachin Tendulkar", text: "To see you surpass my 49 ODI centuries and lift the World Cup with that passion makes my heart swell with pride, Virat." },
      { speaker: "Rohit Sharma", text: "Virat has given his sweat and blood to Indian cricket for 15 years. Lifting this trophy with him is the greatest moment of our lives." }
    ],
    challengeGoal: "Anchor & Finish: Score 48 runs in 16 balls to win the ICC World Cup Final!",
    targetScore: 48,
    ballsAllowed: 16,
    wicketsAllowed: 1,
    bowlerName: "Kagiso Rabada / Anrich Nortje",
    bowlerType: "Right-arm Fast",
    bowlerSpeed: "146 km/h",
    rewardTitle: "Undisputed King of Cricket",
    rewardPerk: "All Batsman Attributes Maxed",
    dialogueChoices: [
      {
        text: "Stabilize with wrist-work, then unleash lofted extra-cover drives in the death overs",
        outcome: "The World Cup Anchor Masterclass executed! Immense pride!",
        statBonus: { focus: 25 }
      },
      {
        text: "Charge the South African pacers with fearless pull shots over midwicket",
        outcome: "Explosive championship aggression unleashed! World Cup sealed!",
        statBonus: { power: 25 }
      }
    ]
  }
];
