import React, { useState, useRef, useEffect } from 'react';
import { STORY_CHAPTERS } from '../data/storyChapters';
import { Cricket3DEngine } from '../engine/Cricket3DEngine';
import { StoryCutsceneEngine } from '../engine/StoryCutsceneEngine';
import { RealCricketControlsOverlay } from './RealCricketControlsOverlay';
import { FieldingRadar } from './FieldingRadar';
import { audio } from '../utils/audio';
import { SaveManager } from '../utils/saveManager';
import confetti from 'canvas-confetti';
import {
  Trophy,
  ChevronRight,
  ChevronLeft,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  FastForward,
  Award,
  CheckCircle,
  AlertCircle,
  Film
} from 'lucide-react';

export const StoryMode = ({ onBackToMenu }) => {
  const initialSave = SaveManager.loadSave();
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(initialSave.lastPlayedChapter || 0);
  const [gameState, setGameState] = useState('narrative'); // 'narrative', 'cutscene', 'playing', 'victory', 'defeat'
  const [chapterProgress, setChapterProgress] = useState(initialSave.chapterProgress);
  const [chapterStars, setChapterStars] = useState(initialSave.chapterStars || {});
  const [bonusStats, setBonusStats] = useState({ focus: 0, power: 0, stamina: 0, timing: 0 });
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState(null);

  // Play Match State
  const [runsScored, setRunsScored] = useState(0);
  const [ballsBowled, setBallsBowled] = useState(0);
  const [wicketsLost, setWicketsLost] = useState(0);
  const [isBallInPlay, setIsBallInPlay] = useState(false);
  const [recentCommentary, setRecentCommentary] = useState([]);
  const [cameraView, setCameraView] = useState('behind');
  const [isMuted, setIsMuted] = useState(false);
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState(0);
  const [isPlayingCutscene, setIsPlayingCutscene] = useState(true);
  
  // Game Feel states
  const [impactEffect, setImpactEffect] = useState(null); // 'six', 'four', 'wicket'
  const [shotFeedback, setShotFeedback] = useState(null); // { score, type }

  const matchContainerRef = useRef(null);
  const cutsceneContainerRef = useRef(null);
  const engineRef = useRef(null);
  const cutsceneRef = useRef(null);
  
  // Real-time refs to avoid stale closures in event handlers
  const statsRef = useRef({ runs: 0, balls: 0, wickets: 0, sixes: 0 });

  const currentChapter = STORY_CHAPTERS[selectedChapterIndex];

  useEffect(() => {
    SaveManager.updateLastPlayed(selectedChapterIndex);
  }, [selectedChapterIndex]);

  // Initialize 3D Story Cutscene in Narrative mode
  useEffect(() => {
    if ((gameState === 'narrative' || gameState === 'cutscene') && cutsceneContainerRef.current) {
      if (cutsceneRef.current) {
        cutsceneRef.current.destroy();
      }
      cutsceneRef.current = new StoryCutsceneEngine(cutsceneContainerRef.current, currentChapter);
    }

    return () => {
      if (cutsceneRef.current) {
        cutsceneRef.current.destroy();
        cutsceneRef.current = null;
      }
    };
  }, [gameState, selectedChapterIndex]);

  // Initialize 3D Cricket Engine when entering 'playing' mode
  useEffect(() => {
    if (gameState === 'playing' && matchContainerRef.current) {
      if (engineRef.current) {
        engineRef.current.destroy();
      }

      engineRef.current = new Cricket3DEngine(matchContainerRef.current, handleEngineEvent);
      engineRef.current.setBatsmanEra(currentChapter.avatar);
      setRunsScored(0);
      setBallsBowled(0);
      setWicketsLost(0);
      statsRef.current = { runs: 0, balls: 0, wickets: 0, sixes: 0 };
      setRecentCommentary([`Challenge Begins: ${currentChapter.challengeGoal}`]);
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, [gameState, selectedChapterIndex]);

  const handleEngineEvent = (event) => {
    if (event.type === 'ball_delivered') {
      setIsBallInPlay(true);
      setShotFeedback(null);
      addCommentary(`Bowler releases at ${event.speed} km/h!`);
    } else if (event.type === 'bat_impact') {
      setShotFeedback({ score: event.timingScore, type: event.shotType });
      if (event.isSix) {
        setImpactEffect('six');
        setTimeout(() => setImpactEffect(null), 1000);
      } else if (event.isFour) {
        setImpactEffect('four');
        setTimeout(() => setImpactEffect(null), 1000);
      }
    } else if (event.type === 'wicket_impact') {
      setImpactEffect('wicket');
      setTimeout(() => setImpactEffect(null), 1500);
    } else if (event.type === 'shot_complete') {
      setIsBallInPlay(false);
      const runs = event.runs;
      
      const nextRuns = statsRef.current.runs + runs;
      const nextBalls = statsRef.current.balls + 1;
      statsRef.current.runs = nextRuns;
      statsRef.current.balls = nextBalls;
      
      setRunsScored(nextRuns);
      setBallsBowled(nextBalls);
      
      if (runs === 6) {
        statsRef.current.sixes += 1;
        addCommentary(`💥 SIX! Lofted clean into the upper tier! (+6)`);
      }
      else if (runs === 4) addCommentary(`🏏 FOUR! Exquisite timing along the carpet! (+4)`);
      else if (runs > 0) addCommentary(`⚡ Quick single taken! (+${runs})`);
      else addCommentary(`Dot ball! Straight to the fielder.`);

      checkWinCondition(nextRuns, nextBalls, statsRef.current.wickets);
    } else if (event.type === 'wicket') {
      setIsBallInPlay(false);
      
      const nextWickets = statsRef.current.wickets + 1;
      const nextBalls = statsRef.current.balls + 1;
      statsRef.current.wickets = nextWickets;
      statsRef.current.balls = nextBalls;
      
      setWicketsLost(nextWickets);
      setBallsBowled(nextBalls);
      checkLossCondition(nextWickets, nextBalls, statsRef.current.runs);
      
      addCommentary(`🚨 ${event.message}`);
    } else if (event.type === 'dot_ball') {
      setIsBallInPlay(false);
      
      const nextBalls = statsRef.current.balls + 1;
      statsRef.current.balls = nextBalls;
      
      setBallsBowled(nextBalls);
      checkLossCondition(statsRef.current.wickets, nextBalls, statsRef.current.runs);
      
      addCommentary(`Dot ball: Beaten by pace outside off.`);
    }
  };

  const addCommentary = (msg) => {
    setRecentCommentary(prev => [msg, ...prev.slice(0, 5)]);
  };

  const checkWinCondition = (currentRuns, currentBalls, currentWickets) => {
    if (currentRuns >= currentChapter.targetScore) {
      setTimeout(() => {
        setGameState('victory');
        audio.playVictoryFanfare();
        confetti({ particleCount: 140, spread: 85, origin: { y: 0.6 } });
        
        let stars = 1;
        if (currentBalls <= currentChapter.ballsAllowed * 0.7) stars = 2;
        if (currentBalls <= currentChapter.ballsAllowed - 10 && statsRef.current.sixes >= 2) stars = 3;
        
        SaveManager.updateChapterProgress(currentChapter.id, true, stars);
        SaveManager.updateCareerStats(statsRef.current.runs, statsRef.current.balls, statsRef.current.sixes);
        
        const save = SaveManager.loadSave();
        setChapterProgress(save.chapterProgress);
        setChapterStars(save.chapterStars);
      }, 1000);
    }
  };

  const checkLossCondition = (currentWickets, currentBalls, currentRuns) => {
    if (currentWickets >= currentChapter.wicketsAllowed || currentBalls >= currentChapter.ballsAllowed) {
      if (currentRuns < currentChapter.targetScore) {
        setTimeout(() => {
          setGameState('defeat');
          audio.playCrowdGasp();
        }, 1200);
      }
    }
  };

  // Auto-advance video subtitles and voice narration
  useEffect(() => {
    let timer;
    if (gameState === 'narrative' && isPlayingCutscene) {
      const sentences = currentChapter.storyText;
      if (sentences[activeSubtitleIndex]) {
        // Speak active sentence
        if ('speechSynthesis' in window && !isMuted) {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(sentences[activeSubtitleIndex]);
          u.rate = 1.05;
          window.speechSynthesis.speak(u);
        }
      }

      timer = setInterval(() => {
        setActiveSubtitleIndex(prev => (prev + 1) % currentChapter.storyText.length);
      }, 7000);
    }

    return () => {
      if (timer) clearInterval(timer);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [gameState, selectedChapterIndex, activeSubtitleIndex, isPlayingCutscene, isMuted, currentChapter]);

  const handleBowlNextBall = () => {
    if (!engineRef.current || isBallInPlay) return;
    const lengths = ['full', 'good', 'short', 'yorker'];
    const chosenLen = lengths[Math.floor(Math.random() * lengths.length)];
    const speed = parseInt(currentChapter.bowlerSpeed) || 140;

    engineRef.current.startDelivery({
      speed: speed + Math.floor(Math.random() * 6 - 3),
      length: chosenLen,
      line: (Math.random() - 0.5) * 0.4
    });
  };

  const handlePlayShot = (shotType, timing, options = {}) => {
    if (!engineRef.current) return;
    engineRef.current.playShot(shotType, timing, options);
  };

  const handleChangeCamera = (cam) => {
    setCameraView(cam);
    if (engineRef.current) {
      engineRef.current.setCameraView(cam, true);
    }
  };

  const handleSelectChoice = (idx, choice) => {
    audio.playClick();
    setSelectedChoiceIdx(idx);
    setBonusStats(prev => ({ ...prev, ...choice.statBonus }));
  };

  const handleStartPlay = () => {
    audio.playClick();
    setGameState('playing');
  };

  const handleNextChapter = () => {
    if (selectedChapterIndex < STORY_CHAPTERS.length - 1) {
      setSelectedChapterIndex(prev => prev + 1);
      setGameState('narrative');
      setSelectedChoiceIdx(null);
    }
  };



  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      
      {/* Screen Shake Container */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transform: impactEffect === 'six' ? 'translate(2px, 2px) rotate(0.5deg)' : 'none',
        transition: 'transform 0.05s ease-in-out',
        animation: impactEffect === 'six' || impactEffect === 'four' ? 'shake 0.3s ease-in-out' : 'none'
      }}>
        {/* 3D Match Canvas Container */}
        <div
          ref={matchContainerRef}
          style={{
            width: '100%',
            height: '100%',
            display: gameState === 'playing' ? 'block' : 'none'
          }}
        />
      </div>

      {/* Hit Impact Flash Overlays */}
      {impactEffect === 'six' && (
        <div style={{ position: 'absolute', inset: 0, background: 'white', opacity: 0.8, animation: 'fadeOut 0.8s ease-out forwards', pointerEvents: 'none', zIndex: 15 }} />
      )}
      {impactEffect === 'four' && (
        <div style={{ position: 'absolute', inset: 0, border: '16px solid #FCD34D', opacity: 0.8, animation: 'fadeOut 0.5s ease-out forwards', pointerEvents: 'none', zIndex: 15 }} />
      )}
      {impactEffect === 'wicket' && (
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, transparent 40%, rgba(239, 68, 68, 0.7) 100%)', opacity: 0, animation: 'fadeInOut 1.5s ease-out forwards', pointerEvents: 'none', zIndex: 15 }} />
      )}

      {/* Inline Styles for Animations */}
      <style>{`
        @keyframes fadeOut {
          from { opacity: 0.8; }
          to { opacity: 0; }
        }
        @keyframes fadeInOut {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
      `}</style>

      {/* Top Header Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        background: 'rgba(7, 11, 25, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button className="btn-secondary" onClick={onBackToMenu} style={{ padding: '6px 14px', fontSize: 13 }}>
            ← Main Menu
          </button>
          <div>
            <div style={{ fontSize: 11, color: '#38BDF8', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              STORY MODE • AUTOBIOGRAPHY CINEMATIC MOVIE
            </div>
            <div className="font-heading" style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>
              Chapter {currentChapter.id}: {currentChapter.title} ({currentChapter.year})
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="btn-secondary"
            onClick={() => {
              const muted = audio.toggleMute();
              setIsMuted(muted);
              if (muted && 'speechSynthesis' in window) window.speechSynthesis.cancel();
            }}
            style={{ padding: '8px 12px' }}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <span className="badge-gold">
            ERA: {currentChapter.era} ({currentChapter.age})
          </span>
        </div>
      </div>

      {/* Narrative & Animated Cutscene Screen */}
      {(gameState === 'narrative' || gameState === 'cutscene') && (
        <div style={{
          position: 'absolute',
          top: 64,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          overflow: 'hidden',
          backgroundColor: '#040714'
        }}>
          {/* Full-Screen 3D Animated Video Cutscene Canvas */}
          <div
            ref={cutsceneContainerRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1
            }}
          />

          {/* Cinematic Vignette Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, transparent 40%, rgba(4, 7, 20, 0.82) 90%)',
            pointerEvents: 'none',
            zIndex: 2
          }} />

          {/* Left: Chapter Sidebar */}
          <div style={{
            width: 290,
            zIndex: 10,
            borderRight: '1px solid rgba(56, 189, 248, 0.2)',
            background: 'rgba(8, 14, 28, 0.85)',
            backdropFilter: 'blur(16px)',
            overflowY: 'auto',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.08em' }}>
              AUTOBIOGRAPHY CHAPTERS (10)
            </div>
            {STORY_CHAPTERS.map((ch, idx) => {
              const isUnlocked = chapterProgress[ch.id] || idx === 0;
              const isSelected = idx === selectedChapterIndex;
              return (
                <div
                  key={ch.id}
                  onClick={() => {
                    if (!isUnlocked) return;
                    audio.playClick();
                    setSelectedChapterIndex(idx);
                    setSelectedChoiceIdx(null);
                    setActiveSubtitleIndex(0);
                    setIsPlayingCutscene(true);
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    background: isSelected
                      ? 'linear-gradient(90deg, rgba(2, 132, 199, 0.35) 0%, rgba(37, 99, 235, 0.25) 100%)'
                      : 'rgba(15, 23, 42, 0.4)',
                    border: isSelected
                      ? '1px solid #38BDF8'
                      : '1px solid rgba(148, 163, 184, 0.1)',
                    opacity: isUnlocked ? 1 : 0.45,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#38BDF8' }}>CH {ch.id} • {ch.year}</span>
                    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      {chapterStars[ch.id] > 0 && (
                        <span style={{ fontSize: 10, color: '#FCD34D', marginRight: 4 }}>
                          {'⭐'.repeat(chapterStars[ch.id])}
                        </span>
                      )}
                      {chapterProgress[ch.id + 1] && <CheckCircle size={14} color="#10B981" />}
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#F1F5F9', marginTop: 4 }}>
                    {ch.title}
                  </div>
                  <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
                    {ch.venue}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: 3D Video Player Overlay */}
          <div style={{
            flex: 1,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 24,
            pointerEvents: 'none'
          }}>
            {/* Top Chapter Tag */}
            <div style={{ display: 'flex', gap: 10, pointerEvents: 'auto' }}>
              <span className="badge-cyan">{currentChapter.era}</span>
              <span className="badge-gold">VENUE: {currentChapter.venue}</span>
              <span className="badge-cyan">VS: {currentChapter.opponent}</span>
              <span className="badge-gold" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Film size={14} /> 🎬 3D ANIMATED MOVIE CUTSCENE
              </span>
            </div>

            {/* Mindset Choice Card Overlay at Center */}
            <div style={{
              margin: '0 auto',
              maxWidth: 720,
              width: '100%',
              background: 'rgba(10, 16, 32, 0.92)',
              backdropFilter: 'blur(16px)',
              border: '2px solid rgba(245, 158, 11, 0.5)',
              borderRadius: 16,
              padding: 20,
              boxShadow: '0 0 35px rgba(245, 158, 11, 0.3)',
              pointerEvents: 'auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Sparkles size={18} color="#F59E0B" />
                <h3 className="font-heading" style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  CHOOSE VIRAT'S MINDSET IN THIS MOMENT
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {currentChapter.dialogueChoices.map((choice, cIdx) => (
                  <div
                    key={cIdx}
                    onClick={() => handleSelectChoice(cIdx, choice)}
                    style={{
                      background: selectedChoiceIdx === cIdx ? 'rgba(245, 158, 11, 0.28)' : 'rgba(15, 23, 42, 0.75)',
                      border: selectedChoiceIdx === cIdx ? '2px solid #F59E0B' : '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 10,
                      padding: 12,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF', marginBottom: 2 }}>
                      "{choice.text}"
                    </div>
                    <div style={{ fontSize: 11, color: '#10B981', fontWeight: 600 }}>
                      ✓ {choice.outcome}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Cinematic Movie Subtitle & Player Control Bar */}
            <div style={{
              background: 'rgba(8, 14, 28, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: 16,
              padding: '14px 20px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)',
              pointerEvents: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 10
            }}>
              {/* Movie Subtitles Display */}
              <div style={{ textTransform: 'none', textAlign: 'center', minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#FCD34D',
                  margin: 0,
                  lineHeight: 1.5,
                  textShadow: '0 2px 10px rgba(0,0,0,0.9)',
                  letterSpacing: '0.02em'
                }}>
                  💬 "{currentChapter.storyText[activeSubtitleIndex]}"
                </p>
              </div>

              {/* Video Player Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <button
                    onClick={() => {
                      audio.playClick();
                      setIsPlayingCutscene(prev => !prev);
                    }}
                    style={{
                      background: isPlayingCutscene ? '#0284C7' : '#10B981',
                      border: 'none',
                      color: '#FFFFFF',
                      borderRadius: 8,
                      padding: '6px 14px',
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    {isPlayingCutscene ? <><VolumeX size={14} /> ⏸ PAUSE VIDEO</> : <><Play size={14} /> ▶ PLAY VIDEO</>}
                  </button>

                  <button
                    onClick={() => {
                      audio.playClick();
                      setActiveSubtitleIndex(prev => (prev + 1) % currentChapter.storyText.length);
                    }}
                    style={{
                      background: 'rgba(30, 41, 59, 0.7)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#FFFFFF',
                      borderRadius: 8,
                      padding: '6px 12px',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <FastForward size={14} /> NEXT SCENE
                  </button>
                </div>

                <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 600 }}>
                  SCENE {activeSubtitleIndex + 1} OF {currentChapter.storyText.length}
                </div>

                <button
                  className="btn-gold"
                  onClick={handleStartPlay}
                  style={{ padding: '10px 22px', fontSize: 14 }}
                >
                  <Play size={16} fill="#0F172A" /> ENTER ARENA MATCH
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* In-Game 3D Overlay HUD when playing */}
      {gameState === 'playing' && (
        <>
          {/* Scorebug Header */}
          <div style={{
            position: 'absolute',
            top: 76,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(10, 16, 32, 0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: 14,
            padding: '10px 24px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
            zIndex: 10,
            gap: 20
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                VIRAT KOHLI (BATSMAN)
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', fontFamily: 'Rajdhani' }}>
                {runsScored} <span style={{ fontSize: 14, color: '#94A3B8' }}>/ target {currentChapter.targetScore}</span>
              </div>
            </div>

            <div style={{ width: 1, height: 36, background: 'rgba(255, 255, 255, 0.15)' }} />

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                BALLS REMAINING
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#FCD34D', fontFamily: 'Rajdhani' }}>
                {currentChapter.ballsAllowed - ballsBowled} <span style={{ fontSize: 14, color: '#94A3B8' }}>balls</span>
              </div>
            </div>

            <div style={{ width: 1, height: 36, background: 'rgba(255, 255, 255, 0.15)' }} />

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                WICKETS IN HAND
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: currentChapter.wicketsAllowed - wicketsLost <= 1 ? '#EF4444' : '#10B981', fontFamily: 'Rajdhani' }}>
                {currentChapter.wicketsAllowed - wicketsLost}
              </div>
            </div>

            <div style={{ width: 1, height: 36, background: 'rgba(255, 255, 255, 0.15)' }} />

            <button
              className="btn-primary"
              disabled={isBallInPlay}
              onClick={handleBowlNextBall}
              style={{ padding: '8px 18px', fontSize: 14 }}
            >
              <Play size={16} /> FORCE BOWL NOW
            </button>
          </div>

          {/* Commentary Feed */}
          <div style={{
            position: 'absolute',
            top: 76,
            right: 16,
            width: 280,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: 12,
            padding: 12,
            zIndex: 10,
            pointerEvents: 'none'
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', marginBottom: 6 }}>
              LIVE COMMENTARY
            </div>
            {recentCommentary.map((text, idx) => (
              <div key={idx} style={{
                fontSize: 12,
                color: idx === 0 ? '#FFFFFF' : '#94A3B8',
                fontWeight: idx === 0 ? 600 : 400,
                marginBottom: 4,
                lineHeight: 1.4
              }}>
                • {text}
              </div>
            ))}
          </div>

          {/* Real Cricket 24 2D Fielding Radar (Top Left under topbar) */}
          <div style={{ position: 'absolute', top: 155, left: 16, zIndex: 12 }}>
            <FieldingRadar fieldPreset="balanced" />
          </div>

          <RealCricketControlsOverlay
            onPlayShot={handlePlayShot}
            isBallInPlay={isBallInPlay}
            cameraView={cameraView}
            onChangeCamera={handleChangeCamera}
            shotFeedback={shotFeedback}
          />
        </>
      )}

      {/* Victory Celebration Modal */}
      {gameState === 'victory' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(3, 7, 18, 0.88)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div className="glass-panel-gold" style={{ padding: 36, maxWidth: 540, width: '90%', textAlign: 'center' }}>
            <Trophy size={64} color="#F59E0B" style={{ margin: '0 auto 16px' }} />
            <span className="badge-gold">CHAPTER {currentChapter.id} CONQUERED</span>

            <h2 className="font-heading" style={{ fontSize: 32, fontWeight: 900, color: '#FFFFFF', margin: '12px 0 8px' }}>
              VICTORY!
            </h2>
            
            <div style={{ fontSize: 24, letterSpacing: '0.2em', marginBottom: 12 }}>
              {'⭐'.repeat(chapterStars[currentChapter.id] || 1)}
              <span style={{ opacity: 0.3 }}>{'⭐'.repeat(3 - (chapterStars[currentChapter.id] || 1))}</span>
            </div>

            <p style={{ fontSize: 16, color: '#CBD5E1', marginBottom: 20 }}>
              You scored <b style={{ color: '#FCD34D' }}>{runsScored} runs</b> in {ballsBowled} balls and completed the legendary feat of "{currentChapter.title}".
            </p>

            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              <div style={{ fontSize: 13, color: '#94A3B8' }}>Reward Unlocked:</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#FCD34D', marginTop: 2 }}>
                ★ {currentChapter.rewardTitle}: {currentChapter.rewardPerk}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                className="btn-secondary"
                onClick={() => setGameState('narrative')}
              >
                Chapter Select
              </button>
              {selectedChapterIndex < STORY_CHAPTERS.length - 1 && (
                <button
                  className="btn-gold"
                  onClick={handleNextChapter}
                >
                  Next Chapter ({selectedChapterIndex + 2}) <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Defeat Modal */}
      {gameState === 'defeat' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(3, 7, 18, 0.88)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div className="glass-panel" style={{ padding: 36, maxWidth: 500, width: '90%', textAlign: 'center', borderColor: '#EF4444' }}>
            <AlertCircle size={60} color="#EF4444" style={{ margin: '0 auto 16px' }} />
            <h2 className="font-heading" style={{ fontSize: 28, fontWeight: 900, color: '#FFFFFF', margin: '8px 0' }}>
              CHALLENGE INCOMPLETE
            </h2>
            <p style={{ fontSize: 15, color: '#94A3B8', marginBottom: 20 }}>
              You scored {runsScored} / {currentChapter.targetScore} runs. Learn from every delivery and strike back harder.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                className="btn-secondary"
                onClick={() => setGameState('narrative')}
              >
                Back to Story
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  audio.playClick();
                  setGameState('playing');
                }}
              >
                <RotateCcw size={16} /> Retry Challenge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
