import React from 'react';

export const FieldingRadar = ({ fieldPreset = 'balanced', ballPos = null }) => {
  // Preset 2D coordinates for fielders on radar (-1 to 1 normalized)
  const fieldLayouts = {
    aggressive: [
      { name: 'Slip 1', x: -0.15, y: -0.32 },
      { name: 'Slip 2', x: -0.28, y: -0.30 },
      { name: 'Gully', x: -0.42, y: -0.24 },
      { name: 'Point', x: -0.55, y: 0.1 },
      { name: 'Cover', x: -0.48, y: 0.45 },
      { name: 'Mid-Off', x: -0.22, y: 0.65 },
      { name: 'Mid-On', x: 0.22, y: 0.65 },
      { name: 'Mid-Wicket', x: 0.52, y: 0.35 },
      { name: 'Wicket Keeper', x: 0.0, y: -0.28 }
    ],
    balanced: [
      { name: 'Slip 1', x: -0.18, y: -0.30 },
      { name: 'Point', x: -0.62, y: 0.15 },
      { name: 'Deep Cover', x: -0.75, y: 0.55 },
      { name: 'Mid-Off', x: -0.25, y: 0.62 },
      { name: 'Mid-On', x: 0.25, y: 0.62 },
      { name: 'Deep Midwicket', x: 0.72, y: 0.52 },
      { name: 'Square Leg', x: 0.55, y: -0.1 },
      { name: 'Third Man', x: -0.7, y: -0.65 },
      { name: 'Wicket Keeper', x: 0.0, y: -0.28 }
    ],
    defensive: [
      { name: 'Deep Point', x: -0.82, y: 0.1 },
      { name: 'Deep Cover', x: -0.78, y: 0.62 },
      { name: 'Long-Off', x: -0.3, y: 0.85 },
      { name: 'Long-On', x: 0.3, y: 0.85 },
      { name: 'Deep Midwicket', x: 0.8, y: 0.58 },
      { name: 'Deep Square Leg', x: 0.78, y: -0.25 },
      { name: 'Fine Leg', x: 0.45, y: -0.75 },
      { name: 'Third Man', x: -0.65, y: -0.7 },
      { name: 'Wicket Keeper', x: 0.0, y: -0.28 }
    ]
  };

  const fielders = fieldLayouts[fieldPreset] || fieldLayouts.balanced;

  return (
    <div style={{
      width: 150,
      height: 150,
      borderRadius: '50%',
      background: 'rgba(8, 14, 28, 0.88)',
      backdropFilter: 'blur(12px)',
      border: '2px solid rgba(56, 189, 248, 0.4)',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
    }}>
      {/* 75m Outer Boundary Ring */}
      <div style={{
        position: 'absolute',
        top: 6,
        left: 6,
        right: 6,
        bottom: 6,
        borderRadius: '50%',
        border: '1px dashed rgba(245, 158, 11, 0.5)'
      }} />

      {/* 30-Yard Circle Ring */}
      <div style={{
        position: 'absolute',
        top: 34,
        left: 34,
        right: 34,
        bottom: 34,
        borderRadius: '50%',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        background: 'rgba(56, 189, 248, 0.04)'
      }} />

      {/* Pitch Rectangle in Center */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '46%',
        width: 12,
        height: 30,
        background: '#C2A374',
        borderRadius: 2,
        transform: 'translate(-50%, -50%)'
      }} />

      {/* Striker Dot */}
      <div style={{
        position: 'absolute',
        top: '52%',
        left: '46%',
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: '#38BDF8',
        boxShadow: '0 0 8px #38BDF8',
        transform: 'translate(-50%, -50%)'
      }} />

      {/* Fielders Dots */}
      {fielders.map((f, idx) => {
        // Map normalized -1..1 to 0..150 px
        const left = 75 + f.x * 60;
        const top = 75 - f.y * 60;
        return (
          <div
            key={idx}
            title={f.name}
            style={{
              position: 'absolute',
              left: `${left}px`,
              top: `${top}px`,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#EF4444',
              border: '1px solid #FFFFFF',
              boxShadow: '0 0 6px #EF4444',
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.4s ease'
            }}
          />
        );
      })}

      {/* Radar Label */}
      <div style={{
        position: 'absolute',
        bottom: 4,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 9,
        fontWeight: 800,
        color: '#FCD34D',
        textTransform: 'uppercase',
        letterSpacing: '0.06em'
      }}>
        FIELD: {fieldPreset.toUpperCase()}
      </div>
    </div>
  );
};
