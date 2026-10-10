import React, { useState, useEffect } from 'react';
import { audio } from '../utils/audio';
import { Shield, Zap, Flame, Wind, Activity, Target, Disc, Move } from 'lucide-react';

export const RealCricketControlsOverlay = ({ onPlayShot, isBallInPlay, cameraView, onChangeCamera, shotFeedback }) => {
  const [timingVal, setTimingVal] = useState(50);
  const [selectedDirection, setSelectedDirection] = useState('cover_drive');
  const [isLofted, setIsLofted] = useState(true); // Loft vs Ground Push
  const [footwork, setFootwork] = useState('front_foot'); // 'front_foot', 'back_foot', 'advance'
  const [activeShotFlash, setActiveShotFlash] = useState(false);

  // 8 Directions around the pitch
  const directions = [
    { id: 'cover_drive', label: 'Cover', angle: -45, keyHint: 'C / 1' },
    { id: 'straight_drive', label: 'Straight', angle: 0, keyHint: 'S / 2' },
    { id: 'flick', label: 'Mid-Wicket', angle: 45, keyHint: 'F / 4' },
    { id: 'pull', label: 'Square Leg', angle: 90, keyHint: 'P / 3' },
    { id: 'defend', label: 'Block', angle: 180, keyHint: 'D / 6' },
    { id: 'lofted_six', label: 'Lofted Six', angle: -10, keyHint: 'Space / 5' }
  ];

  // Oscillating timing needle
  useEffect(() => {
    let animId;
    let dir = 1;
    let pos = 50;
    const speed = 2.6;

    const loop = () => {
      pos += dir * speed;
      if (pos >= 100) {
        pos = 100;
        dir = -1;
      } else if (pos <= 0) {
        pos = 0;
        dir = 1;
      }
      setTimingVal(pos);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleExecuteShot = (shotOverride) => {
    audio.playClick();
    setActiveShotFlash(true);
    setTimeout(() => setActiveShotFlash(false), 300);

    const shotType = shotOverride || (isLofted ? (selectedDirection === 'defend' ? 'defend' : 'lofted_six') : selectedDirection);

    const distFromCenter = Math.abs(timingVal - 50);
    let timingScore = 1.0 - (distFromCenter / 50);
    timingScore = Math.max(0.2, timingScore);

    onPlayShot(shotType, timingScore, {
      direction: selectedDirection,
      isLofted,
      footwork
    });
  };

  const [showHelpModal, setShowHelpModal] = useState(false);

  // Keyboard shortcut triggers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Tab') e.preventDefault();

      if (e.key === '1' || e.key === 'c' || e.key === 'C') {
        setSelectedDirection('cover_drive');
        handleExecuteShot('cover_drive');
      } else if (e.key === '2' || e.key === 's' || e.key === 'S') {
        setSelectedDirection('straight_drive');
        handleExecuteShot('straight_drive');
      } else if (e.key === '3' || e.key === 'p' || e.key === 'P') {
        setSelectedDirection('pull');
        handleExecuteShot('pull');
      } else if (e.key === '4' || e.key === 'f' || e.key === 'F') {
        setSelectedDirection('flick');
        handleExecuteShot('flick');
      } else if (e.key === '5' || e.key === ' ') {
        setSelectedDirection('lofted_six');
        handleExecuteShot('lofted_six');
      } else if (e.key === '6' || e.key === 'd' || e.key === 'D') {
        setSelectedDirection('defend');
        handleExecuteShot('defend');
      } else if (e.key === 'l' || e.key === 'L' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setIsLofted(true);
        audio.playClick();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' || e.key === 'g' || e.key === 'G') {
        setIsLofted(false);
        audio.playClick();
      } else if (e.key === 'ArrowLeft') {
        setSelectedDirection('cover_drive');
        audio.playClick();
      } else if (e.key === 'ArrowRight') {
        setSelectedDirection('pull');
        audio.playClick();
      } else if (e.key === 'Enter') {
        handleExecuteShot();
      } else if (e.key === 'z' || e.key === 'Z') {
        setFootwork('front_foot');
      } else if (e.key === 'x' || e.key === 'X') {
        setFootwork('back_foot');
      } else if (e.key === 'a' || e.key === 'A') {
        setFootwork('advance');
      } else if (e.key === 'v' || e.key === 'V' || e.key === 'Tab') {
        const cams = ['helmet_cam', 'pro_batting', 'broadcast', 'chase_cam', 'bowler_pov', 'side'];
        const idx = cams.indexOf(cameraView);
        const nextCam = cams[(idx + 1) % cams.length];
        onChangeCamera(nextCam);
      } else if (e.key === 'h' || e.key === 'H' || e.key === '?') {
        setShowHelpModal(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [timingVal, selectedDirection, isLofted, footwork, cameraView]);

  return (
    <>
      {/* 1. First-Person Helmet Visor Frame Overlay (Active in Helmet POV) */}
      {cameraView === 'helmet_cam' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          boxShadow: 'inset 0 0 110px 45px rgba(0, 0, 0, 0.88)',
          border: '16px solid rgba(15, 23, 42, 0.7)',
          borderRadius: 24,
          zIndex: 1
        }}>
          {/* Top Helmet Foam Padding Bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            right: '15%',
            height: 22,
            background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0) 100%)',
            borderBottom: '2px solid rgba(56, 189, 248, 0.4)',
            display: 'flex',
            justify: 'center',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: 9, fontWeight: 900, color: '#38BDF8', letterSpacing: '0.12em' }}>
              🪖 VIRAT KOHLI HELMET POV - IMMERSIVE CREASE VISION
            </span>
          </div>
        </div>
      )}

      {/* 2. Post-Shot Timing Arc Feedback */}
      {shotFeedback && (
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'timingFadeInOut 1.5s ease-out forwards',
          pointerEvents: 'none',
          zIndex: 50
        }}>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background Arc */}
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(15, 23, 42, 0.6)" strokeWidth="10" />
            {/* Progress Arc */}
            <circle cx="60" cy="60" r="50" fill="none" 
              stroke={shotFeedback.score > 0.8 ? '#10B981' : (shotFeedback.score > 0.55 ? '#F59E0B' : '#EF4444')} 
              strokeWidth="10" 
              strokeDasharray="314" 
              strokeDashoffset={314 - (314 * shotFeedback.score)} 
              strokeLinecap="round" 
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 22,
            fontWeight: 900,
            color: '#FFFFFF',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            fontFamily: 'Rajdhani'
          }}>
            {Math.round(shotFeedback.score * 100)}
          </div>
          <div style={{
            marginTop: 8,
            fontSize: 12,
            fontWeight: 800,
            textTransform: 'uppercase',
            color: shotFeedback.score > 0.8 ? '#10B981' : (shotFeedback.score > 0.55 ? '#F59E0B' : '#EF4444'),
            background: 'rgba(0,0,0,0.6)',
            padding: '4px 10px',
            borderRadius: 12,
            border: `1px solid ${shotFeedback.score > 0.8 ? '#10B981' : (shotFeedback.score > 0.55 ? '#F59E0B' : '#EF4444')}`
          }}>
            {shotFeedback.score > 0.8 ? 'PERFECT' : (shotFeedback.score > 0.55 ? 'GOOD' : 'POOR')}
          </div>
        </div>
      )}

      {/* Inline Styles for Animations */}
      <style>{`
        @keyframes timingFadeInOut {
          0% { opacity: 0; transform: translate(-50%, -45%) scale(0.9); }
          15% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
          30% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -55%) scale(0.9); }
        }
      `}</style>


      {/* Top Right Quick Controls Guide Trigger Button */}
      <button
        onClick={() => setShowHelpModal(true)}
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          zIndex: 10,
          pointerEvents: 'auto',
          background: 'rgba(8, 14, 28, 0.92)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #38BDF8',
          borderRadius: 8,
          padding: '6px 12px',
          color: '#38BDF8',
          fontSize: 11,
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '0 0 15px rgba(56, 189, 248, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}
      >
        <span>⌨️ KEYBOARD CONTROLS (H)</span>
      </button>

      {/* Full Keyboard Controls Guide Modal Overlay */}
      {showHelpModal && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(4, 8, 20, 0.88)',
          backdropFilter: 'blur(16px)',
          zIndex: 99,
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          padding: 20,
          pointerEvents: 'auto'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0B132B 0%, #1C2541 100%)',
            border: '2px solid #38BDF8',
            borderRadius: 18,
            padding: 26,
            maxWidth: 680,
            width: '100%',
            boxShadow: '0 0 40px rgba(56, 189, 248, 0.4)',
            color: '#FFFFFF'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#38BDF8', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                ⌨️ KING KOHLI CRICKET CONTROLS GUIDE
              </h2>
              <button
                onClick={() => setShowHelpModal(false)}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid #EF4444',
                  color: '#EF4444',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                ✕ CLOSE (H / ESC)
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 13 }}>
              {/* Shot Selection Keys */}
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: 12, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ fontSize: 13, color: '#F59E0B', marginTop: 0, marginBottom: 8, textTransform: 'uppercase' }}>
                  🏏 SHOT SELECTION KEYS
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div><kbd style={{ background: '#38BDF8', color: '#0F172A', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>Space / 5</kbd> : 🔥 Lofted Six (High Power)</div>
                  <div><kbd style={{ background: '#38BDF8', color: '#0F172A', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>C / 1</kbd> : 🎯 Signature Cover Drive</div>
                  <div><kbd style={{ background: '#38BDF8', color: '#0F172A', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>S / 2</kbd> : ⚡ Straight Drive</div>
                  <div><kbd style={{ background: '#38BDF8', color: '#0F172A', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>P / 3</kbd> : 💥 Pull Shot (Square Leg)</div>
                  <div><kbd style={{ background: '#38BDF8', color: '#0F172A', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>F / 4</kbd> : 🏏 Mid-Wicket Flick</div>
                  <div><kbd style={{ background: '#38BDF8', color: '#0F172A', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>D / 6</kbd> : 🛡️ Defensive Block</div>
                </div>
              </div>

              {/* Toggles & Camera Keys */}
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: 12, borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ fontSize: 13, color: '#10B981', marginTop: 0, marginBottom: 8, textTransform: 'uppercase' }}>
                  🎥 CAMERA & FOOTWORK KEYS
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div><kbd style={{ background: '#10B981', color: '#0F172A', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>V / Tab</kbd> : 🪖 Switch Camera Views</div>
                  <div><kbd style={{ background: '#10B981', color: '#0F172A', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>L</kbd> : Toggle High Loft vs Ground Push</div>
                  <div><kbd style={{ background: '#10B981', color: '#0F172A', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>Z</kbd> : Front Foot Stance</div>
                  <div><kbd style={{ background: '#10B981', color: '#0F172A', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>X</kbd> : Back Foot Stance</div>
                  <div><kbd style={{ background: '#10B981', color: '#0F172A', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>A</kbd> : Step Out / Advance Pitch</div>
                  <div><kbd style={{ background: '#10B981', color: '#0F172A', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>H / ?</kbd> : Toggle Controls Help Guide</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14, fontSize: 11, color: '#94A3B8', textAlign: 'center', background: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 8 }}>
              💡 <strong>PRO TIP:</strong> Watch the <strong>Sweetspot Needle Gauge</strong> at top center. Hit when needle enters the green central zone for Maximum Distance & Perfect Timing!
            </div>
          </div>
        </div>
      )}

      <div style={{
        position: 'absolute',
        bottom: 14,
        left: 14,
        right: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        pointerEvents: 'none',
        zIndex: 2
      }}>
      {/* Top Center: Real Cricket 24 Timing Arc Gauge */}
      <div style={{
        margin: '0 auto',
        width: '100%',
        maxWidth: 520,
        background: 'rgba(8, 14, 28, 0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(56, 189, 248, 0.4)',
        borderRadius: 14,
        padding: '8px 18px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)',
        pointerEvents: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ⚡ SHOT TIMING SWEETSPOT
          </span>
          <span style={{
            fontSize: 12,
            fontWeight: 800,
            fontFamily: 'Rajdhani',
            color: Math.abs(timingVal - 50) <= 7 ? '#10B981' : (Math.abs(timingVal - 50) <= 15 ? '#F59E0B' : '#EF4444')
          }}>
            {Math.abs(timingVal - 50) <= 7 ? '★ PERFECT SWEETSPOT' : (Math.abs(timingVal - 50) <= 15 ? 'GOOD TIMING' : 'EARLY / LATE')}
          </span>
        </div>

        <div style={{
          position: 'relative',
          height: 12,
          borderRadius: 6,
          background: 'linear-gradient(90deg, #EF4444 0%, #F59E0B 35%, #10B981 50%, #F59E0B 65%, #EF4444 100%)',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            left: '42%',
            width: '16%',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.45)',
            boxShadow: '0 0 10px #FFFFFF'
          }} />

          <div style={{
            position: 'absolute',
            left: `${timingVal}%`,
            top: 0,
            bottom: 0,
            width: 4,
            background: '#FFFFFF',
            boxShadow: '0 0 10px #FFFFFF',
            transform: 'translateX(-50%)'
          }} />
        </div>
      </div>

      {/* Main Real Cricket 24 Controls Layout: Left Joystick + Right Action Toggles */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        pointerEvents: 'auto',
        padding: '0 10px'
      }}>
        {/* Left Side: 360° Interactive Shot Direction Wheel */}
        <div style={{
          position: 'relative',
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: 'rgba(10, 16, 32, 0.88)',
          backdropFilter: 'blur(12px)',
          border: '2px solid rgba(56, 189, 248, 0.4)',
          boxShadow: '0 0 25px rgba(56, 189, 248, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            position: 'absolute',
            fontSize: 9,
            fontWeight: 800,
            color: '#38BDF8',
            top: 6,
            letterSpacing: '0.06em'
          }}>
            SHOT JOYSTICK
          </div>

          {/* Directional Sector Buttons */}
          {directions.map(dir => {
            const isSelected = selectedDirection === dir.id;
            const rad = (dir.angle * Math.PI) / 180;
            const r = 44;
            const x = Math.sin(rad) * r;
            const y = -Math.cos(rad) * r;

            return (
              <button
                key={dir.id}
                onClick={() => {
                  audio.playClick();
                  setSelectedDirection(dir.id);
                  handleExecuteShot(dir.id);
                }}
                style={{
                  position: 'absolute',
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                  padding: '4px 8px',
                  fontSize: 10,
                  fontWeight: 800,
                  borderRadius: 6,
                  background: isSelected ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'rgba(30, 41, 59, 0.7)',
                  border: isSelected ? '1px solid #FCD34D' : '1px solid rgba(255,255,255,0.1)',
                  color: isSelected ? '#0F172A' : '#FFFFFF',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 0 12px #F59E0B' : 'none'
                }}
              >
                {dir.label}
              </button>
            );
          })}
        </div>

        {/* Center: Camera Angle Selector Bar */}
        <div style={{
          display: 'flex',
          gap: 5,
          background: 'rgba(8, 14, 28, 0.9)',
          padding: '5px 10px',
          borderRadius: 10,
          border: '1px solid rgba(56, 189, 248, 0.3)'
        }}>
          {[
            { id: 'helmet_cam', label: '🪖 HELMET POV' },
            { id: 'pro_batting', label: '🎥 PRO SHOULDER' },
            { id: 'broadcast', label: '📺 BROADCAST' },
            { id: 'chase_cam', label: '🎯 CHASE' },
            { id: 'bowler_pov', label: '⚡ BOWLER' },
            { id: 'side', label: '📐 SIDE' }
          ].map(cam => (
            <button
              key={cam.id}
              onClick={() => {
                audio.playClick();
                onChangeCamera(cam.id);
              }}
              style={{
                padding: '5px 9px',
                fontSize: 10,
                fontWeight: 800,
                borderRadius: 6,
                background: cameraView === cam.id ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)' : 'rgba(15, 23, 42, 0.7)',
                border: cameraView === cam.id ? '1px solid #38BDF8' : '1px solid rgba(148, 163, 184, 0.2)',
                color: cameraView === cam.id ? '#FFFFFF' : '#94A3B8',
                cursor: 'pointer',
                boxShadow: cameraView === cam.id ? '0 0 10px rgba(56,189,248,0.5)' : 'none'
              }}
            >
              {cam.label}
            </button>
          ))}
        </div>

        {/* Right Side: Pro Cricket Batting Controls (Vertical Axis Loft + Footwork + Big STRIKE) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Vertical Axis Elevation Slider: Authentic Real Cricket / WCC Dual Pillar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(8, 14, 28, 0.92)',
            backdropFilter: 'blur(16px)',
            padding: '6px 5px',
            borderRadius: 16,
            border: '2px solid rgba(56, 189, 248, 0.35)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            width: 72
          }}>
            <div style={{
              fontSize: 8,
              fontWeight: 900,
              color: '#38BDF8',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 4
            }}>
              ELEVATION
            </div>

            {/* Vertical Toggle Track */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              width: '100%',
              background: 'rgba(15, 23, 42, 0.85)',
              borderRadius: 12,
              padding: 3
            }}>
              {/* LOFT (UPPER AXIS) */}
              <button
                onClick={() => {
                  audio.playClick();
                  setIsLofted(true);
                }}
                title="Aerial Boundary Shot (W / ↑ / L)"
                style={{
                  height: 48,
                  width: '100%',
                  borderRadius: 9,
                  background: isLofted
                    ? 'linear-gradient(180deg, #EF4444 0%, #DC2626 100%)'
                    : 'transparent',
                  border: isLofted ? '1px solid #FCA5A5' : '1px solid transparent',
                  color: isLofted ? '#FFFFFF' : '#64748B',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: isLofted ? '0 0 16px rgba(239, 68, 68, 0.65)' : 'none',
                  transition: 'all 0.18s ease'
                }}
              >
                <Flame size={16} color={isLofted ? '#FFF' : '#64748B'} />
                <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.04em' }}>LOFT</span>
              </button>

              {/* Slider Divider Indicator */}
              <div style={{
                height: 2,
                margin: '1px 6px',
                background: 'rgba(255, 255, 255, 0.12)',
                borderRadius: 1
              }} />

              {/* GROUND (LOWER AXIS) */}
              <button
                onClick={() => {
                  audio.playClick();
                  setIsLofted(false);
                }}
                title="Ground Drive / Safe Placement (S / ↓ / G)"
                style={{
                  height: 48,
                  width: '100%',
                  borderRadius: 9,
                  background: !isLofted
                    ? 'linear-gradient(180deg, #0284C7 0%, #0369A1 100%)'
                    : 'transparent',
                  border: !isLofted ? '1px solid #7DD3FC' : '1px solid transparent',
                  color: !isLofted ? '#FFFFFF' : '#64748B',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: !isLofted ? '0 0 16px rgba(2, 132, 199, 0.65)' : 'none',
                  transition: 'all 0.18s ease'
                }}
              >
                <Shield size={15} color={!isLofted ? '#FFF' : '#64748B'} />
                <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.04em' }}>GROUND</span>
              </button>
            </div>
            
            <span style={{ fontSize: 7, fontWeight: 700, color: '#94A3B8', marginTop: 3 }}>
              [W / S]
            </span>
          </div>

          {/* Right Action Column: Footwork Pill + Grand STRIKE Trigger Button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            {/* Footwork Selector */}
            <div style={{
              display: 'flex',
              gap: 4,
              background: 'rgba(8, 14, 28, 0.92)',
              backdropFilter: 'blur(12px)',
              padding: '4px 6px',
              borderRadius: 10,
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}>
              {[
                { id: 'front_foot', label: 'FRONT FOOT', key: 'Z' },
                { id: 'back_foot', label: 'BACK FOOT', key: 'X' },
                { id: 'advance', label: 'STEP OUT', key: 'A' }
              ].map(fw => (
                <button
                  key={fw.id}
                  onClick={() => {
                    audio.playClick();
                    setFootwork(fw.id);
                  }}
                  style={{
                    padding: '5px 9px',
                    fontSize: 9,
                    fontWeight: 900,
                    borderRadius: 6,
                    background: footwork === fw.id
                      ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                      : 'rgba(15, 23, 42, 0.6)',
                    border: footwork === fw.id ? '1px solid #FCD34D' : '1px solid transparent',
                    color: footwork === fw.id ? '#0F172A' : '#94A3B8',
                    cursor: 'pointer',
                    boxShadow: footwork === fw.id ? '0 0 10px rgba(245, 158, 11, 0.5)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {fw.label}
                </button>
              ))}
            </div>

            {/* BIG ACTION STRIKE TRIGGER BUTTON */}
            <button
              onClick={() => handleExecuteShot()}
              style={{
                width: 140,
                height: 58,
                borderRadius: 16,
                background: activeShotFlash
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : isLofted
                    ? 'linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)'
                    : 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                border: activeShotFlash
                  ? '2px solid #34D399'
                  : isLofted
                    ? '2px solid #FCD34D'
                    : '2px solid #7DD3FC',
                color: activeShotFlash ? '#FFFFFF' : (isLofted ? '#0F172A' : '#FFFFFF'),
                fontFamily: 'Rajdhani',
                fontSize: 19,
                fontWeight: 900,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                boxShadow: activeShotFlash
                  ? '0 0 35px #10B981'
                  : isLofted
                    ? '0 0 25px rgba(245, 158, 11, 0.65)'
                    : '0 0 25px rgba(2, 132, 199, 0.65)',
                transform: activeShotFlash ? 'scale(1.08)' : 'scale(1)',
                transition: 'all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                textTransform: 'uppercase'
              }}
            >
              <Zap size={22} fill={activeShotFlash ? '#FFF' : (isLofted ? '#0F172A' : '#FFF')} />
              <span>STRIKE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
);
};
