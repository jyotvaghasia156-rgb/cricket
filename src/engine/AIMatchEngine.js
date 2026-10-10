// Full Cricket AI Match Simulation & Captaincy Engine

export const TEAMS = {
  IND: {
    id: "IND",
    name: "India",
    color: "#0284C7",
    players: [
      { name: "Rohit Sharma", role: "batsman", skill: 92, style: "Aggressive Opener" },
      { name: "Shubman Gill", role: "batsman", skill: 88, style: "Anchor" },
      { name: "Virat Kohli", role: "batsman", skill: 98, isUser: true, style: "Master Chaser" },
      { name: "Shreyas Iyer", role: "batsman", skill: 85, style: "Spin Destroyer" },
      { name: "KL Rahul (wk)", role: "wicketkeeper", skill: 87, style: "Middle Order Anchor" },
      { name: "Hardik Pandya", role: "allrounder", skill: 88, style: "Power Finisher" },
      { name: "Ravindra Jadeja", role: "allrounder", skill: 89, style: "Left-arm Spinner" },
      { name: "Kuldeep Yadav", role: "bowler", skill: 88, style: "Left-arm Wrist Spin" },
      { name: "Mohammed Shami", role: "bowler", skill: 90, style: "Seam Pacer" },
      { name: "Jasprit Bumrah", role: "bowler", skill: 96, style: "Yorker Specialist" },
      { name: "Mohammed Siraj", role: "bowler", skill: 87, style: "Outswing Pacer" }
    ]
  },
  AUS: {
    id: "AUS",
    name: "Australia",
    color: "#EAB308",
    players: [
      { name: "David Warner", role: "batsman", skill: 90, style: "Aggressive Opener" },
      { name: "Travis Head", role: "batsman", skill: 91, style: "Attacking Opener" },
      { name: "Steve Smith", role: "batsman", skill: 94, style: "Defensive Anchor" },
      { name: "Marnus Labuschagne", role: "batsman", skill: 86, style: "Anchor" },
      { name: "Glenn Maxwell", role: "allrounder", skill: 90, style: "Explosive Finisher" },
      { name: "Josh Inglis (wk)", role: "wicketkeeper", skill: 82, style: "Wicketkeeper" },
      { name: "Marcus Stoinis", role: "allrounder", skill: 84, style: "Pace Allrounder" },
      { name: "Pat Cummins (c)", role: "bowler", skill: 93, style: "Fast Bowler" },
      { name: "Mitchell Starc", role: "bowler", skill: 94, style: "Express Left-arm Fast" },
      { name: "Adam Zampa", role: "bowler", skill: 87, style: "Leg Spinner" },
      { name: "Josh Hazlewood", role: "bowler", skill: 92, style: "Accurate Seamer" }
    ]
  },
  PAK: {
    id: "PAK",
    name: "Pakistan",
    color: "#16A34A",
    players: [
      { name: "Babar Azam", role: "batsman", skill: 92, style: "Classical Anchor" },
      { name: "Mohammad Rizwan (wk)", role: "wicketkeeper", skill: 89, style: "Reliable Chaser" },
      { name: "Fakhar Zaman", role: "batsman", skill: 86, style: "Power Hitter" },
      { name: "Iftikhar Ahmed", role: "allrounder", skill: 82, style: "Finisher" },
      { name: "Shadab Khan", role: "allrounder", skill: 85, style: "Leg Spinner" },
      { name: "Imad Wasim", role: "allrounder", skill: 83, style: "Left-arm Spinner" },
      { name: "Shaheen Shah Afridi", role: "bowler", skill: 94, style: "Left-arm Inswing Fast" },
      { name: "Naseem Shah", role: "bowler", skill: 89, style: "Express Pacer" },
      { name: "Haris Rauf", role: "bowler", skill: 91, style: "150 km/h Pacer" },
      { name: "Aamer Jamal", role: "bowler", skill: 81, style: "Medium Pacer" },
      { name: "Abrar Ahmed", role: "bowler", skill: 83, style: "Mystery Spinner" }
    ]
  },
  ENG: {
    id: "ENG",
    name: "England",
    color: "#DC2626",
    players: [
      { name: "Jos Buttler", role: "batsman", skill: 91, style: "Power Opener" },
      { name: "Phil Salt", role: "batsman", skill: 88, style: "Ultra Aggressive" },
      { name: "Jonny Bairstow", role: "batsman", skill: 87, style: "Hard Hitter" },
      { name: "Harry Brook", role: "batsman", skill: 89, style: "Attacking Middle" },
      { name: "Liam Livingstone", role: "allrounder", skill: 86, style: "Big Hitter" },
      { name: "Moeen Ali", role: "allrounder", skill: 85, style: "Off Spinner" },
      { name: "Sam Curran", role: "allrounder", skill: 84, style: "Left-arm Swing" },
      { name: "Chris Jordan", role: "bowler", skill: 82, style: "Death Specialist" },
      { name: "Adil Rashid", role: "bowler", skill: 89, style: "Leg Spinner" },
      { name: "Jofra Archer", role: "bowler", skill: 93, style: "Express Pace" },
      { name: "Mark Wood", role: "bowler", skill: 91, style: "150 km/h Thunderbolt" }
    ]
  }
};

export class AIMatchEngine {
  constructor(matchConfig = {}) {
    this.format = matchConfig.format || "5_overs"; // "super_over", "5_overs", "20_overs"
    this.totalOvers = this.format === "super_over" ? 1 : (this.format === "5_overs" ? 5 : 20);
    this.userTeam = TEAMS[matchConfig.userTeamId || "IND"];
    this.opponentTeam = TEAMS[matchConfig.opponentTeamId || "AUS"];

    // Match Status
    this.currentInnings = 1; // 1 = first innings, 2 = chase
    this.target = matchConfig.target || 0;
    this.runs = 0;
    this.wickets = 0;
    this.balls = 0; // Current balls in innings (over = Math.floor(balls/6), ballInOver = balls % 6)
    this.commentary = [];

    // Batsmen at crease
    this.strikerIndex = 0; // Index in batting lineup
    this.nonStrikerIndex = 1;
    this.nextBatterIndex = 2;

    // Current Bowler
    this.currentBowlerIndex = 9;

    // Captaincy Settings (Controlled by User)
    this.fieldPreset = "balanced"; // "aggressive", "balanced", "defensive"
    this.teamIntent = "moderate";  // "cautious", "moderate", "aggressive"

    // Individual scorecards
    this.battingScorecard = {};
    this.bowlingScorecard = {};

    this.initScorecards();
  }

  initScorecards() {
    this.userTeam.players.forEach(p => {
      this.battingScorecard[p.name] = { runs: 0, balls: 0, fours: 0, sixes: 0, out: false, dismissText: "not out" };
      this.bowlingScorecard[p.name] = { overs: 0, maidens: 0, runsConceded: 0, wickets: 0 };
    });
    this.opponentTeam.players.forEach(p => {
      this.battingScorecard[p.name] = { runs: 0, balls: 0, fours: 0, sixes: 0, out: false, dismissText: "not out" };
      this.bowlingScorecard[p.name] = { overs: 0, maidens: 0, runsConceded: 0, wickets: 0 };
    });
  }

  isUserOnStrike() {
    const currentBatters = this.getBattingTeam().players;
    const striker = currentBatters[this.strikerIndex];
    return striker && striker.isUser;
  }

  getBattingTeam() {
    return this.currentInnings === 1 ? this.opponentTeam : this.userTeam;
  }

  getBowlingTeam() {
    return this.currentInnings === 1 ? this.userTeam : this.opponentTeam;
  }

  getStriker() {
    return this.getBattingTeam().players[this.strikerIndex];
  }

  getNonStriker() {
    return this.getBattingTeam().players[this.nonStrikerIndex];
  }

  getCurrentBowler() {
    return this.getBowlingTeam().players[this.currentBowlerIndex];
  }

  setFieldPreset(preset) {
    this.fieldPreset = preset;
    this.addCommentary(`Tactical: Captain set the field to ${preset.toUpperCase()}!`);
  }

  setTeamIntent(intent) {
    this.teamIntent = intent;
    this.addCommentary(`Tactical: Batsmen instructed to play with ${intent.toUpperCase()} intent.`);
  }

  addCommentary(text) {
    const overNum = `${Math.floor(this.balls / 6)}.${this.balls % 6}`;
    this.commentary.unshift({
      over: overNum,
      text,
      timestamp: Date.now()
    });
    if (this.commentary.length > 50) {
      this.commentary.pop();
    }
  }

  // Simulate a single ball played by AI (when non-striker or opponent is batting)
  simulateAIBall() {
    if (this.isMatchOver()) return null;

    const striker = this.getStriker();
    const bowler = this.getCurrentBowler();
    if (!striker || !bowler) return null;

    const strikerSkill = striker.skill;
    const bowlerSkill = bowler.skill;

    // Captaincy modifiers
    let wicketProbability = 0.05 + (bowlerSkill - strikerSkill) * 0.002;
    if (this.fieldPreset === "aggressive") wicketProbability += 0.04;
    if (this.fieldPreset === "defensive") wicketProbability -= 0.02;
    if (this.teamIntent === "aggressive") wicketProbability += 0.03;

    // Outcome roll
    const roll = Math.random();
    let outcome = { runs: 0, isWicket: false, desc: "" };

    if (roll < wicketProbability) {
      // Wicket
      outcome.isWicket = true;
      const dismissals = ["c & b", "caught at deep cover", "caught behind", "lbw", "bowled clean through the gate"];
      const chosen = dismissals[Math.floor(Math.random() * dismissals.length)];
      outcome.desc = `WICKET! ${striker.name} ${chosen} by ${bowler.name}!`;
    } else {
      // Run probabilities based on intent
      let r = Math.random();
      if (this.teamIntent === "aggressive") {
        if (r < 0.28) outcome.runs = 0;
        else if (r < 0.50) outcome.runs = 1;
        else if (r < 0.65) outcome.runs = 2;
        else if (r < 0.85) outcome.runs = 4;
        else outcome.runs = 6;
      } else if (this.teamIntent === "cautious") {
        if (r < 0.45) outcome.runs = 0;
        else if (r < 0.85) outcome.runs = 1;
        else if (r < 0.95) outcome.runs = 2;
        else outcome.runs = 4;
      } else {
        // Moderate
        if (r < 0.35) outcome.runs = 0;
        else if (r < 0.68) outcome.runs = 1;
        else if (r < 0.82) outcome.runs = 2;
        else if (r < 0.94) outcome.runs = 4;
        else outcome.runs = 6;
      }

      if (outcome.runs === 6) outcome.desc = `SIX! ${striker.name} launches ${bowler.name} deep into the stands!`;
      else if (outcome.runs === 4) outcome.desc = `FOUR! Beautifully timed through the gap by ${striker.name}!`;
      else if (outcome.runs === 2) outcome.desc = `Good running, punched in the gap for a brace.`;
      else if (outcome.runs === 1) outcome.desc = `Pushed into the covers for a quick single.`;
      else outcome.desc = `Dot ball! Solid defense from ${striker.name}.`;
    }

    this.processBallOutcome(outcome);
    return outcome;
  }

  // Process any ball outcome (AI or User)
  processBallOutcome(outcome) {
    const striker = this.getStriker();
    const bowler = this.getCurrentBowler();

    this.balls += 1;
    this.runs += outcome.runs;

    // Update batting scorecard
    if (striker && this.battingScorecard[striker.name]) {
      const batStat = this.battingScorecard[striker.name];
      batStat.balls += 1;
      batStat.runs += outcome.runs;
      if (outcome.runs === 4) batStat.fours += 1;
      if (outcome.runs === 6) batStat.sixes += 1;
      if (outcome.isWicket) {
        batStat.out = true;
        batStat.dismissText = outcome.desc;
      }
    }

    // Update bowling scorecard
    if (bowler && this.bowlingScorecard[bowler.name]) {
      const bowlStat = this.bowlingScorecard[bowler.name];
      bowlStat.runsConceded += outcome.runs;
      if (outcome.isWicket) bowlStat.wickets += 1;
    }

    this.addCommentary(outcome.desc);

    if (outcome.isWicket) {
      this.wickets += 1;
      if (this.wickets < 10 && this.nextBatterIndex < this.getBattingTeam().players.length) {
        this.strikerIndex = this.nextBatterIndex;
        this.nextBatterIndex += 1;
      }
    } else {
      // Strike rotation on odd runs
      if (outcome.runs % 2 === 1) {
        const temp = this.strikerIndex;
        this.strikerIndex = this.nonStrikerIndex;
        this.nonStrikerIndex = temp;
      }
    }

    // Over completion (change bowler and rotate strike)
    if (this.balls % 6 === 0) {
      const temp = this.strikerIndex;
      this.strikerIndex = this.nonStrikerIndex;
      this.nonStrikerIndex = temp;

      // Select next bowler
      this.rotateBowler();
    }
  }

  rotateBowler() {
    const bowlingTeam = this.getBowlingTeam().players;
    const bowlers = bowlingTeam.filter(p => p.role === "bowler" || p.role === "allrounder");
    if (bowlers.length > 0) {
      const randomBowler = bowlers[Math.floor(Math.random() * bowlers.length)];
      this.currentBowlerIndex = bowlingTeam.indexOf(randomBowler);
    }
  }

  // Fast-Forward Until User (Virat Kohli) is on strike
  simulateUntilUserStrike() {
    const maxSafetySteps = 120;
    let steps = 0;
    while (!this.isUserOnStrike() && !this.isMatchOver() && steps < maxSafetySteps) {
      this.simulateAIBall();
      steps++;
    }
    return { stepsSimulated: steps, isUserStrike: this.isUserOnStrike() };
  }

  // Fast-Forward Rest of Current Over
  simulateRestOfOver() {
    const ballsRemaining = 6 - (this.balls % 6);
    let count = 0;
    for (let i = 0; i < ballsRemaining; i++) {
      if (this.isMatchOver()) break;
      this.simulateAIBall();
      count++;
    }
    return count;
  }

  // Complete Entire Innings Fast-Forward
  simulateCompleteInnings() {
    const totalBallsMax = this.totalOvers * 6;
    while (this.balls < totalBallsMax && this.wickets < 10) {
      if (this.currentInnings === 2 && this.runs > this.target) break;
      this.simulateAIBall();
    }
  }

  isMatchOver() {
    const totalBallsMax = this.totalOvers * 6;
    if (this.balls >= totalBallsMax || this.wickets >= 10) {
      return true;
    }
    if (this.currentInnings === 2 && this.runs > this.target) {
      return true;
    }
    return false;
  }

  getMatchState() {
    const oversText = `${Math.floor(this.balls / 6)}.${this.balls % 6}`;
    const runRate = this.balls > 0 ? ((this.runs / this.balls) * 6).toFixed(2) : "0.00";
    const requiredRunRate = (this.currentInnings === 2 && (this.totalOvers * 6 - this.balls) > 0)
      ? (((this.target - this.runs + 1) / (this.totalOvers * 6 - this.balls)) * 6).toFixed(2)
      : null;

    return {
      format: this.format,
      totalOvers: this.totalOvers,
      currentInnings: this.currentInnings,
      runs: this.runs,
      wickets: this.wickets,
      balls: this.balls,
      oversText,
      target: this.target,
      runRate,
      requiredRunRate,
      striker: this.getStriker(),
      nonStriker: this.getNonStriker(),
      bowler: this.getCurrentBowler(),
      isUserOnStrike: this.isUserOnStrike(),
      fieldPreset: this.fieldPreset,
      teamIntent: this.teamIntent,
      commentary: this.commentary,
      isOver: this.isMatchOver(),
      battingScorecard: this.battingScorecard,
      bowlingScorecard: this.bowlingScorecard
    };
  }
}
