import React, { useState } from 'react';
import { KOHLI_ERAS, CAREER_RECORD_HIGHLIGHTS } from '../data/timelineData';
import { audio } from '../utils/audio';
import {
  Sparkles,
  Trophy,
  Activity,
  Award,
  Calendar,
  CheckCircle,
  Quote,
  ChevronRight,
  UserCheck,
  Zap
} from 'lucide-react';

export const TimelineViewer = ({ onBackToMenu, onSelectEraPlay }) => {
  const [selectedEraIndex, setSelectedEraIndex] = useState(0);

  const era = KOHLI_ERAS[selectedEraIndex];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle at 50% 20%, #0F1D38 0%, #050811 100%)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Top Navigation */}
      <div style={{
        height: 64,
        background: 'rgba(7, 11, 25, 0.9)',
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
              CAREER TIMELINE ARCHIVE
            </div>
            <div className="font-heading" style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>
              The Evolution of King Kohli: 1998 to Present
            </div>
          </div>
        </div>

        <span className="badge-gold">
          AUTOBIOGRAPHY GALLERY
        </span>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Era Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12
        }}>
          {KOHLI_ERAS.map((e, idx) => {
            const isSelected = idx === selectedEraIndex;
            return (
              <div
                key={e.id}
                onClick={() => {
                  audio.playClick();
                  setSelectedEraIndex(idx);
                }}
                style={{
                  padding: '16px 14px',
                  borderRadius: 14,
                  cursor: 'pointer',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.35) 0%, rgba(245, 158, 11, 0.2) 100%)'
                    : 'rgba(15, 23, 42, 0.6)',
                  border: isSelected
                    ? '2px solid #38BDF8'
                    : '1px solid rgba(148, 163, 184, 0.15)',
                  boxShadow: isSelected ? '0 0 20px rgba(56, 189, 248, 0.2)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 800, color: isSelected ? '#FCD34D' : '#94A3B8' }}>
                  {e.period}
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
                  {e.label.split(':')[0]}
                </div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
                  Age {e.age}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Era Feature Showcase */}
        <div className="glass-panel" style={{ padding: 32, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div>
              <span className="badge-cyan">{era.period} • {era.age}</span>
              <h1 className="font-heading" style={{ fontSize: 32, fontWeight: 900, color: '#FFFFFF', marginTop: 8 }}>
                {era.label}
              </h1>
              <p style={{ fontSize: 16, color: '#FCD34D', fontWeight: 600, marginTop: 4 }}>
                "{era.tagline}"
              </p>
            </div>

            {/* Quick Era Stats Badge */}
            <div style={{
              display: 'flex',
              gap: 16,
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '12px 20px',
              borderRadius: 12,
              border: '1px solid rgba(56, 189, 248, 0.25)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>RUNS</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF', fontFamily: 'Rajdhani' }}>{era.stats.runs}</div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>AVERAGE</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#10B981', fontFamily: 'Rajdhani' }}>{era.stats.average}</div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>100s</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#F59E0B', fontFamily: 'Rajdhani' }}>{era.stats.hundreds}</div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>FITNESS</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#38BDF8', fontFamily: 'Rajdhani' }}>{era.stats.fitScore}</div>
              </div>
            </div>
          </div>

          {/* Visual Appearance & Equipment Matrix */}
          <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase' }}>HAIR & STYLING</div>
              <div style={{ fontSize: 13, color: '#F1F5F9', marginTop: 4 }}>{era.look.hair}</div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase' }}>PHYSIQUE & NUTRITION</div>
              <div style={{ fontSize: 13, color: '#F1F5F9', marginTop: 4 }}>{era.look.physique}</div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase' }}>OFFICIAL KIT</div>
              <div style={{ fontSize: 13, color: '#F1F5F9', marginTop: 4 }}>{era.look.jersey}</div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase' }}>WILLOW BAT & GEAR</div>
              <div style={{ fontSize: 13, color: '#F1F5F9', marginTop: 4 }}>{era.look.bat}</div>
            </div>
          </div>

          {/* Era Milestones Timeline */}
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', marginBottom: 12 }}>
              DEFINING HISTORIC MOMENTS OF THIS ERA
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {era.milestones.map((m, mIdx) => (
                <div key={mIdx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  background: 'rgba(15, 23, 42, 0.5)',
                  padding: '10px 16px',
                  borderRadius: 10,
                  borderLeft: '3px solid #38BDF8'
                }}>
                  <span className="badge-gold" style={{ fontSize: 11 }}>{m.year}</span>
                  <span style={{ fontSize: 14, color: '#E2E8F0' }}>{m.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Era Quote */}
          <div style={{
            marginTop: 24,
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 12,
            padding: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 14
          }}>
            <Quote size={28} color="#F59E0B" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 14, fontStyle: 'italic', color: '#FCD34D', lineHeight: 1.6 }}>
              "{era.bioQuote}"
            </div>
          </div>
        </div>

        {/* Global Career Records Gallery */}
        <div className="glass-panel" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <Trophy size={22} color="#F59E0B" />
            <h3 className="font-heading" style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF' }}>
              All-Time Career Milestone Records
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {CAREER_RECORD_HIGHLIGHTS.map((rec, rIdx) => (
              <div key={rIdx} style={{
                background: 'rgba(15, 23, 42, 0.7)',
                borderRadius: 12,
                padding: 16,
                border: '1px solid rgba(56, 189, 248, 0.15)'
              }}>
                <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                  {rec.label}
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', fontFamily: 'Rajdhani', margin: '4px 0' }}>
                  {rec.value}
                </div>
                <div style={{ fontSize: 12, color: '#38BDF8' }}>
                  {rec.subtitle}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
