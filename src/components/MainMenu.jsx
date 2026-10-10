import React, { useState, useRef, useEffect } from 'react';
import { Menu3DScene } from '../engine/Menu3DScene';
import { audio } from '../utils/audio';
import {
  Trophy,
  Play,
  Clock,
  Sparkles,
  Shield,
  Volume2,
  VolumeX,
  Zap,
  BookOpen,
  Activity,
  Flame,
  Award,
  ChevronRight,
  Globe
} from 'lucide-react';

export const MainMenu = ({ onSelectMode }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedEra, setSelectedEra] = useState('prime'); // 'teen', 'young', 'prime', 'legend'
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  // Initialize 3D Background Scene
  useEffect(() => {
    if (containerRef.current) {
      sceneRef.current = new Menu3DScene(containerRef.current);
      sceneRef.current.setEra(selectedEra);
    }

    return () => {
      if (sceneRef.current) {
        sceneRef.current.destroy();
        sceneRef.current = null;
      }
    };
  }, []);

  // Update era jersey on 3D model
  const handleEraChange = (eraKey) => {
    audio.playClick();
    setSelectedEra(eraKey);
    if (sceneRef.current) {
      sceneRef.current.setEra(eraKey);
    }
  };

  const menuOptions = [
    {
      id: 'story',
      title: 'STORY CAMPAIGN',
      subtitle: 'The 10-Chapter Autobiography of King Kohli',
      desc: 'Play from West Delhi 1998, Ranji tragedy, U-19 World Cup, Hobart 133*, to MCG 2022!',
      badge: 'BIOGRAPHY',
      color: '#0284C7',
      icon: BookOpen
    },
    {
      id: 'offline',
      title: 'OFFLINE MATCH',
      subtitle: 'Exhibition & Tournament (AI Co-Op Engine)',
      desc: 'Bat as Virat Kohli in 3D. Teammates & opponents simulated by AI with captaincy controls.',
      badge: 'MATCH MODE',
      color: '#F59E0B',
      icon: Flame
    },
    {
      id: 'practice',
      title: 'NETS PRACTICE',
      subtitle: 'Instant 3D Batting Drill & Timing Trainer',
      desc: 'Step into the nets right now. Face unlimited deliveries to master cover drives & pulls.',
      badge: 'QUICK PLAY',
      color: '#DC2626',
      icon: Zap
    },
    {
      id: 'timeline',
      title: 'TIMELINE & ERAS',
      subtitle: 'Visual Transformation Archive (1998 - 2025)',
      desc: 'Inspect Virat Kohli across 4 distinct eras, physical stats, gear evolution & 80 tons records.',
      badge: 'ARCHIVE',
      color: '#10B981',
      icon: Clock
    },
    {
      id: 'tournament',
      title: 'TOURNAMENT MODE',
      subtitle: 'World Cups & T20 Leagues',
      desc: 'Lead your team to glory in the biggest tournaments around the globe.',
      badge: 'CHAMPIONSHIP',
      color: '#A855F7',
      icon: Globe
    }
  ];

  const handleStartGame = () => {
    audio.playClick();
    audio.playBatHit('six', 1.0);
    setHasStarted(true);
  };

  const handleSelectOption = (modeId) => {
    audio.playClick();
    onSelectMode(modeId);
  };

  // Keyboard navigation for authentic console feeling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!hasStarted) {
        handleStartGame();
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        audio.playClick();
        setSelectedMenuIndex(prev => (prev > 0 ? prev - 1 : menuOptions.length - 1));
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        audio.playClick();
        setSelectedMenuIndex(prev => (prev < menuOptions.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Enter') {
        handleSelectOption(menuOptions[selectedMenuIndex].id);
      } else if (e.key === '1') {
        handleSelectOption('story');
      } else if (e.key === '2') {
        handleSelectOption('offline');
      } else if (e.key === '3') {
        handleSelectOption('practice');
      } else if (e.key === '4') {
        handleSelectOption('timeline');
      } else if (e.key === '5') {
        handleSelectOption('tournament');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, selectedMenuIndex]);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#040814',
      userSelect: 'none'
    }}>
      {/* Live 3D Three.js Stadium & Virat Kohli in Background */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      />

      {/* Atmospheric Vignette & Color Gradients */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, rgba(4, 8, 20, 0.92) 0%, rgba(4, 8, 20, 0.65) 45%, rgba(4, 8, 20, 0.3) 100%)',
        pointerEvents: 'none',
        zIndex: 2
      }} />

      {/* 1. INITIAL PRESS-START TITLE SCREEN */}
      {!hasStarted ? (
        <div
          onClick={handleStartGame}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '48px 36px',
            cursor: 'pointer',
            background: 'radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.4) 0%, rgba(4, 8, 20, 0.85) 100%)'
          }}
        >
          {/* Top Logo Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="badge-gold" style={{ fontSize: 13, letterSpacing: '0.12em', padding: '6px 16px' }}>
              ★ EA / 2K STYLE CRICKET CHRONICLES ★
            </span>
          </div>

          {/* Central Epic Title */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'clamp(14px, 2vw, 18px)',
              fontWeight: 800,
              color: '#38BDF8',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginBottom: 8,
              textShadow: '0 0 15px rgba(56, 189, 248, 0.6)'
            }}>
              OFFICIAL AUTOBIOGRAPHY 3D GAME
            </div>

            <h1 className="font-heading" style={{
              fontSize: 'clamp(46px, 8vw, 92px)',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              textTransform: 'uppercase',
              textShadow: '0 10px 40px rgba(0, 0, 0, 0.9)'
            }}>
              CHASE MASTER
            </h1>

            <div className="font-heading" style={{
              fontSize: 'clamp(28px, 5vw, 62px)',
              fontWeight: 900,
              letterSpacing: '0.04em',
              background: 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 50%, #FFFFFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              marginTop: -6
            }}>
              KING KOHLI 18
            </div>

            <p style={{
              fontSize: 16,
              color: '#94A3B8',
              marginTop: 14,
              maxWidth: 620,
              margin: '14px auto 0',
              fontWeight: 500
            }}>
              Experience the legend in stunning 3D. Dynamic batting, real career memoirs, offline AI matches, and the complete transformation.
            </p>
          </div>

          {/* Pulsing "Press to Enter" prompt */}
          <div className="pulse-glow" style={{ textAlign: 'center' }}>
            <div style={{
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.5)',
              borderRadius: 30,
              padding: '12px 36px',
              fontSize: 16,
              fontWeight: 800,
              color: '#FFFFFF',
              fontFamily: 'Rajdhani',
              letterSpacing: '0.12em',
              boxShadow: '0 0 25px rgba(56, 189, 248, 0.3)'
            }}>
              [ PRESS ANY KEY OR CLICK TO ENTER THE ARENA ]
            </div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 10 }}>
              Use Keyboard or Mouse to Play
            </div>
          </div>
        </div>
      ) : (
        /* 2. AUTHENTIC CONSOLE GAME HUB MENU */
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 36px'
        }}>
          {/* Top Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #0284C7 0%, #F59E0B 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)'
              }}>
                <Trophy size={24} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#38BDF8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  VIRAT KOHLI #18 • AAA CRICKET SIMULATOR
                </div>
                <div className="font-heading" style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>
                  CHASE MASTER 2025
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="badge-gold">
                STATUS: ONLINE & OFFLINE READY
              </span>
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

          {/* Central Split Layout: Left Menu Buttons + Right 3D Player Card */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 40,
            margin: 'auto 0'
          }}>
            {/* Left Console Menu Navigation */}
            <div style={{
              width: '100%',
              maxWidth: 480,
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                SELECT GAME MODE
              </div>

              {menuOptions.map((opt, idx) => {
                const isSelected = selectedMenuIndex === idx;
                const Icon = opt.icon;
                return (
                  <div
                    key={opt.id}
                    onMouseEnter={() => {
                      audio.playClick();
                      setSelectedMenuIndex(idx);
                    }}
                    onClick={() => handleSelectOption(opt.id)}
                    style={{
                      background: isSelected
                        ? 'linear-gradient(90deg, rgba(2, 132, 199, 0.5) 0%, rgba(15, 23, 42, 0.85) 100%)'
                        : 'rgba(15, 23, 42, 0.65)',
                      backdropFilter: 'blur(16px)',
                      border: isSelected ? '2px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 14,
                      padding: '16px 20px',
                      cursor: 'pointer',
                      transform: isSelected ? 'translateX(12px) scale(1.02)' : 'translateX(0)',
                      boxShadow: isSelected ? '0 10px 30px rgba(2, 132, 199, 0.4)' : 'none',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: isSelected ? opt.color : 'rgba(30, 41, 59, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF'
                      }}>
                        <Icon size={22} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="font-heading" style={{ fontSize: 18, fontWeight: 900, color: '#FFFFFF' }}>
                            {opt.title}
                          </span>
                          <span style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color: '#FCD34D',
                            background: 'rgba(245, 158, 11, 0.2)',
                            padding: '2px 6px',
                            borderRadius: 4
                          }}>
                            [{idx + 1}]
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: '#CBD5E1', marginTop: 2 }}>
                          {opt.subtitle}
                        </div>
                      </div>
                    </div>

                    <ChevronRight size={20} color={isSelected ? '#38BDF8' : '#64748B'} />
                  </div>
                );
              })}
            </div>

            {/* Right Side: FIFA / 2K Style Player Showcase Card */}
            <div className="glass-panel" style={{
              width: 380,
              padding: 24,
              border: '1px solid rgba(245, 158, 11, 0.4)',
              background: 'rgba(10, 16, 32, 0.85)',
              boxShadow: '0 0 35px rgba(245, 158, 11, 0.15)'
            }}>
              {/* Card Top: OVR Rating & Player Profile */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#FCD34D', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    MASTER CHASER #18
                  </div>
                  <div className="font-heading" style={{ fontSize: 24, fontWeight: 900, color: '#FFFFFF', marginTop: 2 }}>
                    VIRAT KOHLI
                  </div>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>
                    India • Right Hand Batsman
                  </div>
                </div>

                <div style={{
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  borderRadius: 10,
                  padding: '6px 14px',
                  textAlign: 'center',
                  boxShadow: '0 0 15px rgba(245, 158, 11, 0.5)'
                }}>
                  <div style={{ fontSize: 9, fontWeight: 900, color: '#0F172A', textTransform: 'uppercase' }}>OVR</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#0F172A', fontFamily: 'Rajdhani', lineHeight: 1 }}>98</div>
                </div>
              </div>

              {/* Era Switcher: Immediately alters live 3D player kit */}
              <div style={{ margin: '16px 0' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', marginBottom: 8 }}>
                  SWITCH 3D MODEL ERA:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                  {[
                    { id: 'teen', label: '1998' },
                    { id: 'young', label: '2008' },
                    { id: 'prime', label: '2016' },
                    { id: 'legend', label: '2024' }
                  ].map(era => (
                    <button
                      key={era.id}
                      onClick={() => handleEraChange(era.id)}
                      style={{
                        padding: '6px 4px',
                        fontSize: 11,
                        fontWeight: 800,
                        borderRadius: 6,
                        cursor: 'pointer',
                        background: selectedEra === era.id ? '#0284C7' : 'rgba(30, 41, 59, 0.6)',
                        border: selectedEra === era.id ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.08)',
                        color: selectedEra === era.id ? '#FFFFFF' : '#94A3B8'
                      }}
                    >
                      {era.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attributes Gauges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '14px 0' }}>
                {[
                  { name: 'Batting Technique', val: 99, color: '#F59E0B' },
                  { name: 'Shot Timing & Sweetspot', val: 98, color: '#10B981' },
                  { name: 'Six-Hitting Power', val: 94, color: '#EF4444' },
                  { name: 'Chamber Stamina & Running', val: 99, color: '#38BDF8' },
                  { name: 'Clutch / Pressure Mentality', val: 100, color: '#A855F7' }
                ].map((stat, sIdx) => (
                  <div key={sIdx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, marginBottom: 3 }}>
                      <span style={{ color: '#E2E8F0' }}>{stat.name}</span>
                      <span style={{ color: stat.color, fontFamily: 'Rajdhani', fontWeight: 900 }}>{stat.val}</span>
                    </div>
                    <div style={{ height: 5, borderRadius: 3, background: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
                      <div style={{ width: `${stat.val}%`, height: '100%', background: stat.color, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 10, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <span className="badge-gold" style={{ fontSize: 10 }}>50 ODI CENTURIES</span>
                <span className="badge-cyan" style={{ fontSize: 10 }}>CHASE MASTER</span>
                <span className="badge-gold" style={{ fontSize: 10 }}>T20 WC CHAMPION</span>
              </div>
            </div>
          </div>

          {/* Bottom Console Legend Prompt Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(9, 14, 28, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            borderRadius: 12,
            padding: '10px 24px'
          }}>
            <div style={{ display: 'flex', gap: 24, fontSize: 12, color: '#CBD5E1', fontFamily: 'Rajdhani', fontWeight: 700 }}>
              <span><b style={{ color: '#38BDF8' }}>[▲/▼] or [W/S]</b> NAVIGATE</span>
              <span><b style={{ color: '#FCD34D' }}>[ENTER]</b> SELECT</span>
              <span><b style={{ color: '#10B981' }}>[1-4]</b> QUICK MODE</span>
            </div>

            <div style={{ fontSize: 12, color: '#94A3B8' }}>
              🎮 3D WebGL Engine Active • Real-Time Physics & Procedural Audio
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
