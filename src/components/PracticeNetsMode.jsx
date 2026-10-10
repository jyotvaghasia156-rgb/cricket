import React, { useState, useRef, useEffect } from 'react';
import { Cricket3DEngine } from '../engine/Cricket3DEngine';
import { RealCricketControlsOverlay } from './RealCricketControlsOverlay';
import { FieldingRadar } from './FieldingRadar';
import { audio } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Play, RotateCcw, Volume2, VolumeX, Flame, Zap, Activity, Gauge, Compass } from 'lucide-react';

export const PracticeNetsMode = ({ onBackToMenu }) => {
  const [runs, setRuns] = useState(0);
  const [balls, setBalls] = useState(0);
  const [fours, setFours] = useState(0);
  const [sixes, setSixes] = useState(0);
  const [isBallInPlay, setIsBallInPlay] = useState(false);
  const [cameraView, setCameraView] = useState('behind');
  const [isMuted, setIsMuted] = useState(false);
  const [lastShotTelemetry, setLastShotTelemetry] = useState(null);
  const [recentLog, setRecentLog] = useState(['Welcome to Training Academy Nets: Select shot or press shortcut keys [C], [S], [P], [F], [Space]']);

  const containerRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      if (engineRef.current) engineRef.current.destroy();
      engineRef.current = new Cricket3DEngine(containerRef.current, handleEngineEvent);
      engineRef.current.setBatsmanEra('prime');
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, []);

  const handleEngineEvent = (event) => {
    if (event.type === 'ball_delivered') {
      setIsBallInPlay(true);
      addLog(`Bowler delivers at ${event.speed} km/h!`);
    } else if (event.type === 'shot_complete') {
      setIsBallInPlay(false);
      const r = event.runs;
      setRuns(prev => prev + r);
      setBalls(prev => prev + 1);

      // Shot Telemetry Data
      const exitVel = Math.round(110 + event.timingScore * 48);
      const dist = Math.round(35 + event.timingScore * 60);
      const launchAngle = event.shotType === 'lofted_six' ? 38 : (event.shotType === 'pull' ? 22 : 12);
      
      setLastShotTelemetry({
        exitVel,
        dist,
        launchAngle,
        precision: Math.round(event.timingScore * 100)
      });

      if (r === 6) {
        setSixes(prev => prev + 1);
        addLog(`💥 SIX! High into the upper stands! (${dist}m, ${exitVel} km/h)`);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      } else if (r === 4) {
        setFours(prev => prev + 1);
        addLog(`🏏 FOUR! Clean boundary split! (${dist}m, ${exitVel} km/h)`);
      } else if (r > 0) {
        addLog(`Single/Twos taken. (+${r})`);
      } else {
        addLog(`Dot ball.`);
      }
    } else if (event.type === 'wicket') {
      setIsBallInPlay(false);
      setBalls(prev => prev + 1);
      addLog(`🚨 ${event.message}`);
    } else if (event.type === 'dot_ball') {
      setIsBallInPlay(false);
      setBalls(prev => prev + 1);
      addLog(`Beaten by line and length.`);
    }
  };

  const addLog = (text) => {
    setRecentLog(prev => [text, ...prev.slice(0, 5)]);
  };

  const handleBowl = () => {
    if (!engineRef.current || isBallInPlay) return;
    const lengths = ['full', 'good', 'short', 'yorker'];
    const chosen = lengths[Math.floor(Math.random() * lengths.length)];
    engineRef.current.startDelivery({
      speed: 138 + Math.floor(Math.random() * 12),
      length: chosen,
      line: (Math.random() - 0.5) * 0.4
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* 3D Canvas */}
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Top Header */}
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
              TRAINING ACADEMY NETS • VIRAT KOHLI #18
            </div>
            <div className="font-heading" style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>
              Infinite 3D Batting & Shot Telemetry Analyzer
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

      {/* Score HUD */}
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
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>RUNS SCORED</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', fontFamily: 'Rajdhani' }}>
            {runs} <span style={{ fontSize: 14, color: '#94A3B8' }}>({balls} balls)</span>
          </div>
        </div>

        <div style={{ width: 1, height: 36, background: 'rgba(255, 255, 255, 0.15)' }} />

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>BOUNDARIES</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#FCD34D', fontFamily: 'Rajdhani' }}>
            {fours} x 4s • {sixes} x 6s
          </div>
        </div>

        <div style={{ width: 1, height: 36, background: 'rgba(255, 255, 255, 0.15)' }} />

        <button
          className="btn-gold"
          disabled={isBallInPlay}
          onClick={handleBowl}
          style={{ padding: '10px 20px', fontSize: 14 }}
        >
          <Play size={16} fill="#0F172A" /> FORCE BOWL NOW
        </button>
      </div>

      {/* Shot Telemetry Card (Middle Left) */}
      {lastShotTelemetry && (
        <div style={{
          position: 'absolute',
          top: 76,
          left: 16,
          width: 240,
          background: 'rgba(10, 16, 32, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: 12,
          padding: 14,
          zIndex: 10
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#FCD34D', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Gauge size={14} /> SHOT TELEMETRY
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <div style={{ fontSize: 10, color: '#94A3B8' }}>EXIT VELOCITY</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF', fontFamily: 'Rajdhani' }}>
                {lastShotTelemetry.exitVel} <span style={{ fontSize: 10 }}>km/h</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10, color: '#94A3B8' }}>DISTANCE</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#38BDF8', fontFamily: 'Rajdhani' }}>
                {lastShotTelemetry.dist} <span style={{ fontSize: 10 }}>meters</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10, color: '#94A3B8' }}>SWEETSPOT</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#10B981', fontFamily: 'Rajdhani' }}>
                {lastShotTelemetry.precision}%
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10, color: '#94A3B8' }}>LAUNCH ANGLE</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#F59E0B', fontFamily: 'Rajdhani' }}>
                {lastShotTelemetry.launchAngle}°
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Feed (Middle Right) */}
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
          PRACTICE LOG
        </div>
        {recentLog.map((t, idx) => (
          <div key={idx} style={{
            fontSize: 12,
            color: idx === 0 ? '#FFFFFF' : '#94A3B8',
            marginBottom: 4,
            lineHeight: 1.4
          }}>
            • {t}
          </div>
        ))}
      </div>

      {/* 2D Mini-Field Radar */}
      <div style={{ position: 'absolute', bottom: 155, left: 16, zIndex: 12 }}>
        <FieldingRadar fieldPreset="balanced" />
      </div>

      <RealCricketControlsOverlay
        onPlayShot={(shot, timing, options) => {
          if (engineRef.current) engineRef.current.playShot(shot, timing, options);
        }}
        isBallInPlay={isBallInPlay}
        cameraView={cameraView}
        onChangeCamera={(cam) => {
          setCameraView(cam);
          if (engineRef.current) engineRef.current.setCameraView(cam, true);
        }}
      />
    </div>
  );
};
