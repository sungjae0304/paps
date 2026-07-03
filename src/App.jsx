import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Compass, Activity, Trophy, HelpCircle, Lock, Settings } from 'lucide-react';
import { PapsProvider } from './context/PapsContext';
import TabRecord from './pages/TabRecord';
import TabAnalysis from './pages/TabAnalysis';
import TabSports from './pages/TabSports';
import TabInquiry from './pages/TabInquiry';
import TeacherAdmin from './pages/TeacherAdmin';
import SettingsModal from './pages/SettingsModal';
import SplashScreen from './components/SplashScreen';
import Onboarding from './components/Onboarding';
import { PrivacyPolicy, TermsOfUse } from './pages/Policies';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };
  return (
    <PapsProvider>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      {!showSplash && showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      <Router>
        <div className="app-container" style={{ paddingBottom: '36px' }}>
          <header className="header justify-between">
            <button onClick={() => setShowSettings(true)} className="text-white hover:text-gray-200">
              <Settings size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Compass className="animate-pulse" />
              <h1>D.A.T.A 탐험대</h1>
            </div>
            <button onClick={() => setShowAdmin(true)} className="text-white hover:text-gray-200">
              <Lock size={20} />
            </button>
          </header>

          <main className="content">
            <Routes>
              <Route path="/" element={<TabRecord onShowPrivacy={() => setShowPrivacy(true)} onShowTerms={() => setShowTerms(true)} />} />
              <Route path="/analysis" element={<TabAnalysis />} />
              <Route path="/sports" element={<TabSports />} />
              <Route path="/inquiry" element={<TabInquiry />} />
            </Routes>
          </main>

          <nav className="bottom-nav" style={{ bottom: '36px' }}>
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Activity />
              <span>내 기록</span>
            </NavLink>
            <NavLink 
              to="/analysis" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Compass />
              <span>데이터 분석</span>
            </NavLink>
            <NavLink 
              to="/sports" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Trophy />
              <span>스포츠 탐험</span>
            </NavLink>
            <NavLink 
              to="/inquiry" 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <HelpCircle />
              <span>탐구 질문</span>
            </NavLink>
          </nav>
          
          <footer className="fixed bottom-0 left-0 w-full bg-[#1E293B] text-white flex justify-between items-center px-4 z-[200]" style={{ height: '36px', fontSize: '12px' }}>
            <div className="flex gap-2 items-center">
              <span>🏫 서울고척초등학교</span>
              <span style={{ opacity: 0.3 }}>|</span>
              <button onClick={() => setShowPrivacy(true)} className="text-white hover:underline bg-transparent border-none p-0 cursor-pointer" style={{ fontSize: '11px', outline: 'none' }}>개인정보처리방침</button>
              <span style={{ opacity: 0.3 }}>|</span>
              <button onClick={() => setShowTerms(true)} className="text-white hover:underline bg-transparent border-none p-0 cursor-pointer" style={{ fontSize: '11px', outline: 'none' }}>사용약관</button>
            </div>
            <span>제작자 이성재</span>
          </footer>

          {showAdmin && <TeacherAdmin onClose={() => setShowAdmin(false)} />}
          {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
          {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
          {showTerms && <TermsOfUse onClose={() => setShowTerms(false)} />}
        </div>
      </Router>
    </PapsProvider>
  );
}

export default App;
