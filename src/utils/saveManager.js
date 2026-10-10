export const SaveManager = {
  SAVE_KEY: 'chasemaster_save_v1',

  getDefaultSave() {
    return {
      chapterProgress: { 1: true },
      chapterStars: {}, // { chapterId: stars }
      careerStats: {
        totalRuns: 0,
        highestScore: 0,
        sixes: 0,
        ballsFaced: 0,
      },
      lastPlayedChapter: 0,
    };
  },

  loadSave() {
    try {
      const data = localStorage.getItem(this.SAVE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return { ...this.getDefaultSave(), ...parsed };
      }
    } catch (e) {
      console.warn("Could not load save data", e);
    }
    return this.getDefaultSave();
  },

  saveGame(data) {
    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn("Could not save game data", e);
    }
  },

  updateChapterProgress(chapterId, isComplete, stars = 0) {
    const save = this.loadSave();
    if (isComplete) {
      save.chapterProgress[chapterId + 1] = true;
    }
    const currentStars = save.chapterStars[chapterId] || 0;
    if (stars > currentStars) {
      save.chapterStars[chapterId] = stars;
    }
    this.saveGame(save);
  },

  updateCareerStats(runs, balls, sixesCount) {
    const save = this.loadSave();
    save.careerStats.totalRuns += runs;
    save.careerStats.ballsFaced += balls;
    save.careerStats.sixes += sixesCount;
    if (runs > save.careerStats.highestScore) {
      save.careerStats.highestScore = runs;
    }
    this.saveGame(save);
  },
  
  updateLastPlayed(chapterIndex) {
    const save = this.loadSave();
    save.lastPlayedChapter = chapterIndex;
    this.saveGame(save);
  }
};
