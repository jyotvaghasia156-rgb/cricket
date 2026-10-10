import React, { useState } from 'react';
import { MainMenu } from './components/MainMenu';
import { StoryMode } from './components/StoryMode';
import { OfflineMatchMode } from './components/OfflineMatchMode';
import { TimelineViewer } from './components/TimelineViewer';
import { PracticeNetsMode } from './components/PracticeNetsMode';
import { TournamentMode } from './components/TournamentMode';

export default function App() {
  const [activeScreen, setActiveScreen] = useState('menu'); // 'menu', 'story', 'offline', 'timeline', 'practice'

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {activeScreen === 'menu' && (
        <MainMenu onSelectMode={(mode) => setActiveScreen(mode)} />
      )}

      {activeScreen === 'story' && (
        <StoryMode onBackToMenu={() => setActiveScreen('menu')} />
      )}

      {activeScreen === 'offline' && (
        <OfflineMatchMode onBackToMenu={() => setActiveScreen('menu')} />
      )}

      {activeScreen === 'timeline' && (
        <TimelineViewer onBackToMenu={() => setActiveScreen('menu')} />
      )}

      {activeScreen === 'practice' && (
        <PracticeNetsMode onBackToMenu={() => setActiveScreen('menu')} />
      )}

      {activeScreen === 'tournament' && (
        <TournamentMode onBack={() => setActiveScreen('menu')} />
      )}
    </div>
  );
}
