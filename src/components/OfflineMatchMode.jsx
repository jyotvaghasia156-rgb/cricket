import React, { useState, useRef, useEffect } from 'react';
import { TEAMS, AIMatchEngine } from '../engine/AIMatchEngine';
import { Cricket3DEngine } from '../engine/Cricket3DEngine';
import { RealCricketControlsOverlay } from './RealCricketControlsOverlay';
import { FieldingRadar } from './FieldingRadar';
import { audio } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Play,
  FastForward,
  SkipForward,
  RotateCcw,
  Shield,
  Volume2,
  VolumeX,
  Users,
  Award,
  Zap,
  Activity,
  ChevronRight,
  Sun,
  Wind,
  Layers,
  Compass
} from 'lucide-react';

export const OfflineMatchMode = ({ onBackToMenu }) => {
  const [matchStage, setMatchStage] = useState('setup'); // 'setup', 'toss', 'match', 'result'
  const [format, setFormat] = useState('5_overs');
  const [userTeamId, setUserTeamId] = useState('IND');
  const [opponentTeamId, setOpponentTeamId] = useState('AUS');

  // Toss State
  const [tossChoice, setTossChoice] = useState('heads');
  const [tossResult, setTossResult] = useState(null);
  const [isFlippingCoin, setIsFlippingCoin] = useState(false);

  // Match Engine Instance
  const [engine, setEngine] = useState(null);
  const [matchState, setMatchState] = useState(null);
  const [isBallInPlay, setIsBallInPlay] = useState(false);
  const [cameraView, setCameraView] = useState('behind');
  const [isMuted, setIsMuted] = useState(false);
  const [ballFlightProgress, setBallFlightProgress] = useState(null);
  const [ballZ, setBallZ] = useState(null);
  const [runningDecision, setRunningDecision] = useState(null);
  const [partnerCallBanner, setPartnerCallBanner] = useState(null);
  const [shotFeedback, setShotFeedback] = useState(null);

  const containerRef = useRef(null);
  const cricket3DRef = useRef(null);

  const handleTossLaunch = () => {
    audio.playClick();
    setMatchStage('toss');
  };

  const handleExecuteToss = () => {
    audio.playClick();
    setIsFlippingCoin(true);

    setTimeout(() => {
      setIsFlippingCoin(false);
      const won = Math.random() > 0.3; // High chance for player feel
      const resultText = won
        ? `TOSS WON! India won the toss and elected to BAT first!`
        : `${TEAMS[opponentTeamId].name} won the toss and elected to BOWL first!`;
      setTossResult(resultText);

      setTimeout(() => {
        startMatchEngine();
      }, 1800);
    }, 1500);
  };

  const startMatchEngine = () => {
    const newEngine = new AIMatchEngine({
      format,
      userTeamId,
      opponentTeamId
    });

    // Innings 1: Opponent bats first, sets target
    newEngine.simulateCompleteInnings();
    const targetSet = newEngine.runs + 1;

    // Innings 2: User team chases!
    newEngine.currentInnings = 2;
    newEngine.target = targetSet;
    newEngine.runs = 0;
    newEngine.wickets = 0;
    newEngine.balls = 0;
    newEngine.commentary = [];
    newEngine.initScorecards();
    newEngine.addCommentary(`Innings 2: India begins chase of ${targetSet} runs!`);

    setEngine(newEngine);
    setMatchState(newEngine.getMatchState());
    setMatchStage('match');
  };

  useEffect(() => {
    if (matchStage === 'match' && containerRef.current) {
      if (cricket3DRef.current) {
        cricket3DRef.current.destroy();
      }
      cricket3DRef.current = new Cricket3DEngine(containerRef.current, handle3DEvent);
      cricket3DRef.current.setBatsmanEra('prime');
    }

    return () => {
      if (cricket3DRef.current) {
        cricket3DRef.current.destroy();
        cricket3DRef.current = null;
      }
    };
  }, [matchStage]);

  const handle3DEvent = (event) => {
    if (!engine) return;

    if (event.type === 'ball_delivered') {
      setIsBallInPlay(true);
      setRunningDecision(null);
    } else if (event.type === 'ball_flight') {
      setBallFlightProgress(event.progress);
      setBallZ(event.ballZ);
    } else if (event.type === 'running_decision') {
      setRunningDecision({
        possibleRuns: event.possibleRuns,
        shotType: event.shotType
      });
    } else if (event.type === 'partner_call') {
      setPartnerCallBanner(event.message);
      setTimeout(() => setPartnerCallBanner(null), 3500);
      engine.addCommentary(`🗣️ ${event.message}`);
      refreshMatch();
    } else if (event.type === 'bat_impact') {
      setShotFeedback({
        score: event.timingScore,
        type: event.shotType,
        isSix: event.isSix,
        isFour: event.isFour
      });
      setTimeout(() => setShotFeedback(null), 2500);
    } else if (event.type === 'shot_complete') {
      setIsBallInPlay(false);
      setBallFlightProgress(null);
      setBallZ(null);
      setRunningDecision(null);
      engine.processBallOutcome({
        runs: event.runs,
        isWicket: false,
        desc: event.runs === 6
          ? `SIX! Virat Kohli smashes it out of the stadium!`
          : (event.runs === 4 ? `FOUR! Exquisite placement by Virat!` : (event.runs > 0 ? `Virat runs hard for ${event.runs} run(s).` : `Dot ball: Virat declined the run.`))
      });
      refreshMatch();
    } else if (event.type === 'wicket') {
      setIsBallInPlay(false);
      setBallFlightProgress(null);
      setBallZ(null);
      setRunningDecision(null);
      engine.processBallOutcome({
        runs: 0,
        isWicket: true,
        desc: `OUT! Virat Kohli is dismissed!`
      });
      refreshMatch();
    } else if (event.type === 'dot_ball') {
      setIsBallInPlay(false);
      setBallFlightProgress(null);
      setBallZ(null);
      setRunningDecision(null);
      engine.processBallOutcome({
        runs: 0,
        isWicket: false,
        desc: `Dot ball! Beaten outside off.`
      });
      refreshMatch();
    }
  };

  const handleConfirmRun = (shouldRun, potentialRuns) => {
    if (cricket3DRef.current) {
      cricket3DRef.current.confirmRunningChoice(shouldRun, potentialRuns);
    }
    setRunningDecision(null);
  };

  const refreshMatch = () => {
    if (!engine) return;
    const state = engine.getMatchState();
    setMatchState(state);

    if (state.isOver) {
      setTimeout(() => {
        setMatchStage('result');
        if (state.runs >= state.target) {
          audio.playVictoryFanfare();
          confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
        } else {
          audio.playCrowdGasp();
        }
      }, 1500);
    }
  };

  const handleBowlNextBall = () => {
    if (!cricket3DRef.current || isBallInPlay) return;
    cricket3DRef.current.startDelivery({
      speed: 142 + Math.floor(Math.random() * 8 - 4),
      length: ['full', 'good', 'short'][Math.floor(Math.random() * 3)],
      line: (Math.random() - 0.5) * 0.4
    });
  };

  const handlePlayShot = (shotType, timing, options = {}) => {
    if (!cricket3DRef.current) return;
    cricket3DRef.current.playShot(shotType, timing, options);
  };

  const handleSimulateNextBall = () => {
    if (!engine) return;
    audio.playClick();
    engine.simulateAIBall();
    refreshMatch();
  };

  const handleSkipToVirat = () => {
    if (!engine) return;
    audio.playClick();
    engine.simulateUntilUserStrike();
    refreshMatch();
  };

  const handleSimulateOver = () => {
    if (!engine) return;
    audio.playClick();
    engine.simulateRestOfOver();
    refreshMatch();
  };

  const handleSimulateMatchEnd = () => {
    if (!engine) return;
    audio.playClick();
    engine.simulateCompleteInnings();
    refreshMatch();
  };

  const handleCaptaincyField = (preset) => {
    if (!engine) return;
    audio.playClick();
    engine.setFieldPreset(preset);
    refreshMatch();
  };

  const handleTeamIntent = (intent) => {
    if (!engine) return;
    audio.playClick();
    engine.setTeamIntent(intent);
    refreshMatch();
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* 3D Canvas View */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          display: matchStage === 'match' ? 'block' : 'none'
        }}
      />

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
              QUICK CRICKET MATCH • BROADCAST PRESENTATION
            </div>
            <div className="font-heading" style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>
              {TEAMS[userTeamId]?.name} vs {TEAMS[opponentTeamId]?.name} ({format.replace('_', ' ').toUpperCase()})
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="btn-secondary"
            onClick={() => {
              const muted = audio.toggleMute();
              setIsMuted(muted);
            }}
            style={{ padding: '8px 12px' }}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>

      {/* 1. Setup Screen */}
      {matchStage === 'setup' && (
        <div style={{
          position: 'absolute',
          top: 64,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 30%, #0F172A 0%, #050811 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          overflowY: 'auto'
        }}>
          <div className="glass-panel" style={{ maxWidth: 860, width: '100%', padding: 36 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <span className="badge-cyan">EXHIBITION MATCH PRESENTATION</span>
              <h2 className="font-heading" style={{ fontSize: 32, fontWeight: 900, color: '#FFFFFF', marginTop: 8 }}>
                Configure Teams & Match Options
              </h2>
              <p style={{ fontSize: 14, color: '#94A3B8', marginTop: 4 }}>
                Play as Virat Kohli with full 3D batting control. Teammates and opponents driven by dynamic AI.
              </p>
            </div>

            {/* Teams Picker */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: 18, borderRadius: 14, border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', marginBottom: 10 }}>
                  YOUR SQUAD (VIRAT KOHLI #18)
                </div>
                <button className="btn-primary" style={{ width: '100%', padding: '12px' }}>
                  🇮🇳 India (Virat Kohli 98 OVR)
                </button>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: 18, borderRadius: 14, border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 10 }}>
                  OPPONENT SQUAD
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {['AUS', 'PAK', 'ENG'].map(tId => (
                    <button
                      key={tId}
                      onClick={() => {
                        audio.playClick();
                        setOpponentTeamId(tId);
                      }}
                      style={{
                        padding: '10px 8px',
                        fontSize: 13,
                        fontWeight: 700,
                        borderRadius: 8,
                        background: opponentTeamId === tId ? 'rgba(56, 189, 248, 0.3)' : 'rgba(30, 41, 59, 0.5)',
                        border: opponentTeamId === tId ? '1px solid #38BDF8' : '1px solid rgba(255,255,255,0.08)',
                        color: opponentTeamId === tId ? '#FFFFFF' : '#94A3B8',
                        cursor: 'pointer'
                      }}
                    >
                      {tId === 'AUS' ? '🇦🇺 Australia' : (tId === 'PAK' ? '🇵🇰 Pakistan' : '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pitch & Atmosphere Report */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: 14, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 11, color: '#38BDF8', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Layers size={14} /> PITCH CONDITION
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', marginTop: 4 }}>
                  Hard Green Top (Pace & Bounce)
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: 14, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 11, color: '#F59E0B', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sun size={14} /> ATMOSPHERE
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', marginTop: 4 }}>
                  26°C Clear Floodlit Stadium
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: 14, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: 11, color: '#10B981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Compass size={14} /> DEW FACTOR
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', marginTop: 4 }}>
                  Moderate Dew in 2nd Innings
                </div>
              </div>
            </div>

            {/* Launch Coin Toss */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                className="btn-gold"
                onClick={handleTossLaunch}
                style={{ padding: '16px 48px', fontSize: 18 }}
              >
                PROCEED TO COIN TOSS <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Interactive Coin Toss Screen */}
      {matchStage === 'toss' && (
        <div style={{
          position: 'absolute',
          top: 64,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 40%, #0F172A 0%, #050811 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24
        }}>
          <div className="glass-panel-gold" style={{ maxWidth: 540, width: '100%', padding: 36, textAlign: 'center' }}>
            <span className="badge-gold">MATCH PRESENTATION • COIN TOSS</span>
            <h2 className="font-heading" style={{ fontSize: 32, fontWeight: 900, color: '#FFFFFF', margin: '10px 0' }}>
              Call the Coin Toss
            </h2>

            {/* Spinning Coin */}
            <div style={{
              width: 110,
              height: 110,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 50%, #B45309 100%)',
              border: '4px solid #FFE4E6',
              margin: '24px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 900,
              color: '#0F172A',
              fontFamily: 'Rajdhani',
              boxShadow: '0 0 30px rgba(245, 158, 11, 0.6)',
              transform: isFlippingCoin ? 'rotateY(720deg) scale(1.1)' : 'rotateY(0deg)',
              transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              {tossChoice.toUpperCase()}
            </div>

            {!tossResult ? (
              <>
                <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 24 }}>
                  <button
                    onClick={() => setTossChoice('heads')}
                    className={tossChoice === 'heads' ? 'btn-gold' : 'btn-secondary'}
                    style={{ minWidth: 120 }}
                  >
                    HEADS
                  </button>
                  <button
                    onClick={() => setTossChoice('tails')}
                    className={tossChoice === 'tails' ? 'btn-gold' : 'btn-secondary'}
                    style={{ minWidth: 120 }}
                  >
                    TAILS
                  </button>
                </div>

                <button
                  className="btn-gold"
                  disabled={isFlippingCoin}
                  onClick={handleExecuteToss}
                  style={{ padding: '14px 36px', fontSize: 16 }}
                >
                  <Play size={18} fill="#0F172A" /> FLIP THE COIN
                </button>
              </>
            ) : (
              <div style={{ fontSize: 18, fontWeight: 800, color: '#FCD34D', marginTop: 16 }}>
                {tossResult}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Live Match Screen */}
      {matchStage === 'match' && matchState && (
        <>
          <div style={{
            position: 'absolute',
            top: 76,
            left: 16,
            right: 16,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(9, 15, 32, 0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: 14,
            padding: '12px 20px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.7)',
            zIndex: 10,
            gap: 16
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#38BDF8', textTransform: 'uppercase' }}>
                  CHASE INNINGS • {matchState.runs} / {matchState.wickets}
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', fontFamily: 'Rajdhani' }}>
                  OVERS {matchState.oversText} <span style={{ fontSize: 14, color: '#94A3B8' }}>/ {matchState.totalOvers}.0</span>
                </div>
              </div>

              <div style={{ width: 1, height: 36, background: 'rgba(255, 255, 255, 0.15)' }} />

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                  TARGET
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#FCD34D', fontFamily: 'Rajdhani' }}>
                  {matchState.target} <span style={{ fontSize: 13, color: '#CBD5E1' }}>({matchState.target - matchState.runs} to win)</span>
                </div>
              </div>

              <div style={{ width: 1, height: 36, background: 'rgba(255, 255, 255, 0.15)' }} />

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                  REQ RUN RATE
                </div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#EF4444', fontFamily: 'Rajdhani' }}>
                  {matchState.requiredRunRate || '-'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                background: matchState.isUserOnStrike ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: matchState.isUserOnStrike ? '1px solid #F59E0B' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '6px 12px'
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#38BDF8' }}>STRIKER {matchState.isUserOnStrike && '★ (YOU)'}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#FFFFFF' }}>
                  {matchState.striker?.name} ({matchState.battingScorecard[matchState.striker?.name]?.runs} off {matchState.battingScorecard[matchState.striker?.name]?.balls})
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: 8,
                padding: '6px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8' }}>PARTNER (NON-STRIKER)</div>
                  {matchState.partnerInsight && (
                    <span style={{
                      fontSize: 9,
                      fontWeight: 900,
                      color: '#FCD34D',
                      background: 'rgba(245, 158, 11, 0.2)',
                      padding: '1px 6px',
                      borderRadius: 4
                    }}>
                      {matchState.partnerInsight.posture}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#CBD5E1' }}>
                  {matchState.nonStriker?.name} ({matchState.battingScorecard[matchState.nonStriker?.name]?.runs} off {matchState.battingScorecard[matchState.nonStriker?.name]?.balls || 0}b)
                </div>
                {matchState.partnerInsight?.advice && (
                  <div style={{ fontSize: 10, color: '#38BDF8', fontStyle: 'italic', maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    "{matchState.partnerInsight.advice}"
                  </div>
                )}
              </div>
            </div>
          </div>

          {partnerCallBanner && (
            <div style={{
              position: 'absolute',
              top: 145,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
              border: '2px solid #38BDF8',
              borderRadius: 30,
              padding: '8px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 0 30px rgba(56, 189, 248, 0.6)',
              zIndex: 30
            }}>
              <span style={{ fontSize: 18 }}>🗣️</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#FCD34D', letterSpacing: '0.04em' }}>
                {partnerCallBanner}
              </span>
            </div>
          )}

          <div style={{
            position: 'absolute',
            top: 170,
            left: 16,
            width: 250,
            background: 'rgba(10, 16, 32, 0.88)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: 14,
            padding: 14,
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase' }}>
              CAPTAINTCY TACTICS
            </div>

            <div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>FIELD SETTING:</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                {['aggressive', 'balanced', 'defensive'].map(f => (
                  <button
                    key={f}
                    onClick={() => handleCaptaincyField(f)}
                    style={{
                      padding: '4px 6px',
                      fontSize: 10,
                      fontWeight: 700,
                      borderRadius: 6,
                      background: matchState.fieldPreset === f ? '#0284C7' : 'rgba(30, 41, 59, 0.6)',
                      border: 'none',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#FCD34D', textTransform: 'uppercase', marginBottom: 6 }}>
                SKIP / FAST-FORWARD
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button
                  className="btn-gold"
                  disabled={matchState.isUserOnStrike}
                  onClick={handleSkipToVirat}
                  style={{ padding: '6px 10px', fontSize: 12, width: '100%' }}
                >
                  <Zap size={14} /> Skip to Virat's Strike
                </button>
                <button
                  className="btn-secondary"
                  disabled={matchState.isUserOnStrike}
                  onClick={handleSimulateNextBall}
                  style={{ padding: '6px 10px', fontSize: 11, width: '100%' }}
                >
                  <Play size={12} /> Simulate 1 Ball
                </button>
                <button
                  className="btn-secondary"
                  onClick={handleSimulateOver}
                  style={{ padding: '6px 10px', fontSize: 11, width: '100%' }}
                >
                  <FastForward size={12} /> Simulate Over
                </button>
              </div>
            </div>
          </div>

          <div style={{
            position: 'absolute',
            top: 170,
            right: 16,
            width: 280,
            maxHeight: 240,
            overflowY: 'auto',
            background: 'rgba(10, 16, 32, 0.88)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: 14,
            padding: 14,
            zIndex: 10
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', marginBottom: 8 }}>
              LIVE BALL-BY-BALL
            </div>
            {matchState.commentary.slice(0, 7).map((c, idx) => (
              <div key={idx} style={{
                fontSize: 12,
                color: idx === 0 ? '#FFFFFF' : '#94A3B8',
                marginBottom: 6,
                lineHeight: 1.4
              }}>
                <span style={{ color: '#38BDF8', fontWeight: 700 }}>[{c.over}]</span> {c.text}
              </div>
            ))}
          </div>

          {matchState.isUserOnStrike && (
            <>
              {/* Bowl Button (Neatly placed near top right under scorecard, no longer blocking bottom controls) */}
              <div style={{
                position: 'absolute',
                top: 86,
                right: 310,
                zIndex: 25
              }}>
                <button
                  className="btn-gold"
                  disabled={isBallInPlay}
                  onClick={handleBowlNextBall}
                  style={{
                    padding: '8px 18px',
                    fontSize: 13,
                    boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)',
                    opacity: isBallInPlay ? 0.6 : 1
                  }}
                >
                  <Play size={15} fill="#0F172A" /> {isBallInPlay ? 'BALL IN PLAY...' : 'BOWLER RUN UP'}
                </button>
              </div>

              {/* 2D Mini-Field Radar */}
              <div style={{ position: 'absolute', top: 510, left: 16, zIndex: 12 }}>
                <FieldingRadar fieldPreset={matchState.fieldPreset} />
              </div>

              <RealCricketControlsOverlay
                onPlayShot={handlePlayShot}
                isBallInPlay={isBallInPlay}
                cameraView={cameraView}
                onChangeCamera={(cam) => {
                  setCameraView(cam);
                  if (cricket3DRef.current) cricket3DRef.current.setCameraView(cam, true);
                }}
                shotFeedback={shotFeedback}
                ballFlightProgress={ballFlightProgress}
                ballZ={ballZ}
                runningDecision={runningDecision}
                onConfirmRun={handleConfirmRun}
              />
            </>
          )}
        </>
      )}

      {/* Result Screen */}
      {matchStage === 'result' && matchState && (
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
          padding: 24,
          zIndex: 50,
          overflowY: 'auto'
        }}>
          <div className="glass-panel" style={{ maxWidth: 760, width: '100%', padding: 32 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Trophy size={54} color={matchState.runs >= matchState.target ? '#F59E0B' : '#94A3B8'} style={{ margin: '0 auto 10px' }} />
              <h2 className="font-heading" style={{ fontSize: 32, fontWeight: 900, color: '#FFFFFF' }}>
                {matchState.runs >= matchState.target
                  ? `INDIA WON BY ${10 - matchState.wickets} WICKETS!`
                  : `${TEAMS[opponentTeamId]?.name.toUpperCase()} WON BY ${matchState.target - matchState.runs - 1} RUNS`}
              </h2>
              <p style={{ fontSize: 15, color: '#CBD5E1', marginTop: 4 }}>
                India scored {matchState.runs}/{matchState.wickets} in {matchState.oversText} overs (Target: {matchState.target})
              </p>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', marginBottom: 10 }}>
                INDIA BATTING SCORECARD
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {TEAMS.IND.players.slice(0, 6).map(player => {
                  const stat = matchState.battingScorecard[player.name];
                  if (!stat) return null;
                  return (
                    <div key={player.name} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: 13,
                      padding: '6px 8px',
                      background: player.isUser ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                      borderRadius: 6
                    }}>
                      <div style={{ fontWeight: 700, color: player.isUser ? '#FCD34D' : '#F1F5F9' }}>
                        {player.name} {player.isUser && '★ (You)'}
                        <span style={{ fontSize: 11, color: '#94A3B8', marginLeft: 8 }}>{stat.dismissText}</span>
                      </div>
                      <div style={{ fontWeight: 800, color: '#FFFFFF' }}>
                        {stat.runs} <span style={{ fontSize: 11, color: '#94A3B8' }}>({stat.balls}b, {stat.fours}x4, {stat.sixes}x6)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
              <button className="btn-secondary" onClick={() => setMatchStage('setup')}>
                <RotateCcw size={16} /> Play Another Match
              </button>
              <button className="btn-primary" onClick={onBackToMenu}>
                Return to Main Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
