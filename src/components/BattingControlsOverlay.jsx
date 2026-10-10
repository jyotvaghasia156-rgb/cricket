import React, { useState, useEffect } from 'react';
import { audio } from '../utils/audio';
import { Shield, Zap, Flame, Wind, Activity } from 'lucide-react';

export const BattingControlsOverlay = ({ onPlayShot, isBallInPlay, cameraView, onChangeCamera }) => {
  const [timingVal, setTimingVal] = useState(50);
  const [activeShotFlash, setActiveShotFlash] = useState(null);

  // Continuously oscillating dynamic timing needle
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

  const handleShotTrigger = (shotType) => {
    audio.playClick();
    setActiveShotFlash(shotType);
    setTimeout(() => setActiveShotFlash(null), 300);

    // Calculate timing score based on sweet spot distance (40% to 60%)
    const distFromCenter = Math.abs(timingVal - 50);
    let timingScore = 1.0 - (distFromCenter / 50);
    timingScore = Math.max(0.2, timingScore);

    onPlayShot(shotType, timingScore);
  };

  // Keyboard shortcut listener (Instantaneous responsive trigger)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent scrolling on spacebar
      if (e.key === ' ') {
        e.preventDefault();
      }

      if (e.key === '1' || e.key === 'c' || e.key === 'C') {
        handleShotTrigger('cover_drive');
      } else if (e.key === '2' || e.key === 's' || e.key === 'S') {
        handleShotTrigger('straight_drive');
      } else if (e.key === '3' || e.key === 'p' || e.key === 'P') {
        handleShotTrigger('pull');
      } else if (e.key === '4' || e.key === 'f' || e.key === 'F') {
        handleShotTrigger('flick');
      } else if (e.key === '5' || e.key === ' ' || e.key === 'l' || e.key === 'L') {
        handleShotTrigger('lofted_six');
      } else if (e.key === '6' || e.key === 'd' || e.key === 'D') {
        handleShotTrigger('defend');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [timingVal]);

  return (
    <div style={{
      position: 'absolute',
      bottom: 16,
      left: 16,
      right: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      pointerEvents: 'none'
    }}>
      {/* Timing Bar HUD */}
      <div style={{
        margin: '0 auto',
        width: '100%',
        maxWidth: 560,
        background: 'rgba(10, 16, 32, 0.9)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(56, 189, 248, 0.4)',
        borderRadius: 14,
        padding: '10px 20px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)',
        pointerEvents: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
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

        {/* Needle Gauge */}
        <div style={{
          position: 'relative',
          height: 14,
          borderRadius: 7,
          background: 'linear-gradient(90deg, #EF4444 0%, #F59E0B 35%, #10B981 50%, #F59E0B 65%, #EF4444 100%)',
          overflow: 'hidden'
        }}>
          {/* Target Sweet Spot Highlight */}
          <div style={{
            position: 'absolute',
            left: '42%',
            width: '16%',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.45)',
            boxShadow: '0 0 10px #FFFFFF'
          }} />

          {/* Indicator Needle */}
          <div style={{
            position: 'absolute',
            left: `${timingVal}%`,
            top: 0,
            bottom: 0,
            width: 5,
            background: '#FFFFFF',
            boxShadow: '0 0 10px #FFFFFF',
            transform: 'translateX(-50%)'
          }} />
        </div>
      </div>

      {/* Batting Shot Execution Pad */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        pointerEvents: 'auto'
      }}>
        <button
          className="btn-gold"
          onClick={() => handleShotTrigger('cover_drive')}
          style={{
            minWidth: 145,
            padding: '12px 16px',
            fontSize: 14,
            transform: activeShotFlash === 'cover_drive' ? 'scale(1.08)' : 'scale(1)',
            boxShadow: activeShotFlash === 'cover_drive' ? '0 0 25px #F59E0B' : '0 4px 18px rgba(245, 158, 11, 0.4)'
          }}
        >
          <Zap size={16} /> Cover Drive [C]
        </button>

        <button
          className="btn-primary"
          onClick={() => handleShotTrigger('straight_drive')}
          style={{
            minWidth: 145,
            padding: '12px 16px',
            fontSize: 14,
            transform: activeShotFlash === 'straight_drive' ? 'scale(1.08)' : 'scale(1)',
            boxShadow: activeShotFlash === 'straight_drive' ? '0 0 25px #38BDF8' : '0 4px 14px rgba(2, 132, 199, 0.35)'
          }}
        >
          <Activity size={16} /> Straight Drive [S]
        </button>

        <button
          className="btn-primary"
          onClick={() => handleShotTrigger('pull')}
          style={{
            minWidth: 140,
            padding: '12px 16px',
            fontSize: 14,
            transform: activeShotFlash === 'pull' ? 'scale(1.08)' : 'scale(1)'
          }}
        >
          <Flame size={16} /> Pull Shot [P]
        </button>

        <button
          className="btn-primary"
          onClick={() => handleShotTrigger('flick')}
          style={{
            minWidth: 140,
            padding: '12px 16px',
            fontSize: 14,
            transform: activeShotFlash === 'flick' ? 'scale(1.08)' : 'scale(1)'
          }}
        >
          <Wind size={16} /> Wrist Flick [F]
        </button>

        <button
          className="btn-gold"
          onClick={() => handleShotTrigger('lofted_six')}
          style={{
            minWidth: 165,
            padding: '12px 18px',
            fontSize: 15,
            background: 'linear-gradient(135deg, #DC2626 0%, #EA580C 100%)',
            color: '#FFFFFF',
            transform: activeShotFlash === 'lofted_six' ? 'scale(1.08)' : 'scale(1)',
            boxShadow: activeShotFlash === 'lofted_six' ? '0 0 30px #EF4444' : '0 4px 20px rgba(220, 38, 38, 0.5)'
          }}
        >
          <Flame size={18} /> LOFTED SIX [SPACE]
        </button>

        <button
          className="btn-secondary"
          onClick={() => handleShotTrigger('defend')}
          style={{
            minWidth: 125,
            padding: '12px 16px',
            fontSize: 14,
            transform: activeShotFlash === 'defend' ? 'scale(1.08)' : 'scale(1)'
          }}
        >
          <Shield size={16} /> Defend [D]
        </button>
      </div>

      {/* Broadcast Camera Switching Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 8,
        pointerEvents: 'auto'
      }}>
        <span style={{ fontSize: 11, color: '#94A3B8', alignSelf: 'center', marginRight: 4 }}>CAMERA VIEW:</span>
        {['behind', 'broadcast', 'side', 'drone'].map((cam) => (
          <button
            key={cam}
            onClick={() => {
              audio.playClick();
              onChangeCamera(cam);
            }}
            style={{
              padding: '5px 12px',
              fontSize: 11,
              fontWeight: 800,
              borderRadius: 6,
              background: cameraView === cam ? 'rgba(56, 189, 248, 0.4)' : 'rgba(15, 23, 42, 0.7)',
              border: cameraView === cam ? '1px solid #38BDF8' : '1px solid rgba(148, 163, 184, 0.2)',
              color: cameraView === cam ? '#FFFFFF' : '#94A3B8',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            {cam}
          </button>
        ))}
      </div>
    </div>
  );
};
