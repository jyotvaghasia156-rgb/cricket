import React, { useState } from 'react';
import { Trophy, ChevronLeft, Play, Shield, Globe } from 'lucide-react';
import { audio } from '../utils/audio';

export const TournamentMode = ({ onBack }) => {
  const [selectedTournament, setSelectedTournament] = useState(0);
  
  const tournaments = [
    {
      id: 'world-cup',
      title: 'ICC Cricket World Cup 2023',
      desc: 'Lead Team India to glory in the biggest stage. Play through the group stages and knockouts.',
      icon: Globe,
      color: '#38BDF8',
      teams: 10
    },
    {
      id: 't20',
      title: 'T20 Premier League',
      desc: 'Fast-paced franchise cricket action. Draft your team, manage your squad, and win the trophy.',
      icon: Trophy,
      color: '#F59E0B',
      teams: 8
    },
    {
      id: 'test',
      title: 'World Test Championship',
      desc: 'The ultimate test of endurance and skill. Play intense 5-day matches across the globe.',
      icon: Shield,
      color: '#EF4444',
      teams: 9
    }
  ];

  const handleStartTournament = () => {
    audio.playClick();
    // For now, this is a placeholder for tournament start
    alert(`Starting ${tournaments[selectedTournament].title}!`);
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#040814',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      padding: '36px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decor */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: `radial-gradient(circle, ${tournaments[selectedTournament].color}22 0%, transparent 70%)`,
        borderRadius: '50%',
        filter: 'blur(60px)',
        zIndex: 0
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, zIndex: 1, marginBottom: 40 }}>
        <button 
          onClick={() => { audio.playClick(); onBack(); }}
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#FFFFFF'
          }}
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#94A3B8', letterSpacing: '0.1em' }}>SELECT EVENT</div>
          <h1 className="font-heading" style={{ fontSize: 42, fontWeight: 900, textTransform: 'uppercase' }}>
            TOURNAMENT MODE
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', gap: 40, flex: 1, zIndex: 1 }}>
        {/* Tournament List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 400 }}>
          {tournaments.map((t, idx) => {
            const isSelected = selectedTournament === idx;
            const Icon = t.icon;
            return (
              <div
                key={t.id}
                onClick={() => { audio.playClick(); setSelectedTournament(idx); }}
                style={{
                  background: isSelected ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.6)',
                  border: isSelected ? `2px solid ${t.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                  padding: 20,
                  borderRadius: 16,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  transform: isSelected ? 'translateX(10px)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  background: t.color,
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 20px ${t.color}66`
                }}>
                  <Icon size={24} color="#000" />
                </div>
                <div>
                  <h3 className="font-heading" style={{ fontSize: 20, fontWeight: 800 }}>{t.title}</h3>
                  <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>{t.teams} Teams Participating</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Tournament Details */}
        <div className="glass-panel" style={{ flex: 1, padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: `1px solid ${tournaments[selectedTournament].color}44` }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              {React.createElement(tournaments[selectedTournament].icon, { size: 48, color: tournaments[selectedTournament].color })}
              <h2 className="font-heading" style={{ fontSize: 48, fontWeight: 900, color: tournaments[selectedTournament].color }}>
                {tournaments[selectedTournament].title}
              </h2>
            </div>
            <p style={{ fontSize: 18, color: '#E2E8F0', lineHeight: 1.6, maxWidth: 600 }}>
              {tournaments[selectedTournament].desc}
            </p>
            
            <div style={{ marginTop: 40, display: 'flex', gap: 20 }}>
               <div style={{ background: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 12, flex: 1 }}>
                 <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 700 }}>DIFFICULTY</div>
                 <div style={{ fontSize: 20, fontWeight: 800 }}>WORLD CLASS</div>
               </div>
               <div style={{ background: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 12, flex: 1 }}>
                 <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 700 }}>PRIZE MONEY</div>
                 <div style={{ fontSize: 20, fontWeight: 800 }}>$10,000,000</div>
               </div>
            </div>
          </div>

          <button
            onClick={handleStartTournament}
            className="pulse-glow"
            style={{
              background: `linear-gradient(135deg, ${tournaments[selectedTournament].color} 0%, #1E293B 100%)`,
              border: 'none',
              padding: '20px 40px',
              borderRadius: 16,
              fontSize: 24,
              fontWeight: 900,
              color: '#FFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              fontFamily: 'Outfit',
              boxShadow: `0 10px 30px ${tournaments[selectedTournament].color}44`
            }}
          >
            <Play size={28} />
            ENTER TOURNAMENT
          </button>
        </div>
      </div>
    </div>
  );
};
