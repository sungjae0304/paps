import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Compass, Activity, Trophy, HelpCircle, Lock, Settings } from 'lucide-react';
import { PapsProvider, PapsContext } from './context/PapsContext';
import TabRecord from './pages/TabRecord';
import TabAnalysis from './pages/TabAnalysis';
import TabSports from './pages/TabSports';
import TabInquiry from './pages/TabInquiry';
import TeacherAdmin from './pages/TeacherAdmin';
import SettingsModal from './pages/SettingsModal';
import SplashScreen from './components/SplashScreen';
import Onboarding from './components/Onboarding';
import StudentLogin from './components/StudentLogin';
import { PrivacyPolicy, TermsOfUse } from './pages/Policies';

function MainApp() {
  const { activeStudent, setActiveStudent } = useContext(PapsContext);
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

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까? 소속 정보가 초기화됩니다.")) {
      setActiveStudent(null);
    }
  };

  return (
    <Router>
      <div className="app-container" style={{ paddingBottom: '36px' }}>
        {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
        {!showSplash && showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
        
        <header className="header justify-between">
          <button onClick={() => setShowSettings(true)} className="text-white hover:text-gray-200 bg-transparent border-none cursor-pointer">
            <Settings size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Compass className="animate-pulse" />
            <h1>D.A.T.A 탐험대</h1>
          </div>
          <button onClick={() => setShowAdmin(true)} className="text-white hover:text-gray-200 bg-transparent border-none cursor-pointer">
            <Lock size={20} />
          </button>
        </header>

        <main className="content flex flex-col">
          {!showSplash && !showOnboarding && !activeStudent ? (
            <StudentLogin />
          ) : (
            <>
              {/* 상단 프로필 요약 헤더 */}
              {activeStudent && (
                <div className="flex justify-between items-center bg-slate-800/80 backdrop-blur text-white text-xs px-3.5 py-2 rounded-xl mb-4 border border-slate-700/50 shadow-inner">
                  <span className="font-bold">
                    🏫 {activeStudent.schoolName} | {activeStudent.grade} {activeStudent.classNum}반 {activeStudent.studentNum}번 ({activeStudent.gender === 'male' ? '남학생' : '여학생'})
                  </span>
                  <button 
                    onClick={handleLogout} 
                    className="text-[10px] bg-slate-700 hover:bg-red-600 px-2 py-0.5 rounded text-white border-none cursor-pointer transition font-bold"
                  >
                    로그아웃
                  </button>
                </div>
              )}
              <Routes>
                <Route path="/" element={<TabRecord onShowPrivacy={() => setShowPrivacy(true)} onShowTerms={() => setShowTerms(true)} />} />
                <Route path="/analysis" element={<TabAnalysis />} />
                <Route path="/sports" element={<TabSports />} />
                <Route path="/inquiry" element={<TabInquiry />} />
              </Routes>
            </>
          )}
        </main>

        {activeStudent && (
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
        )}
        
        <footer className="fixed bottom-0 left-0 w-full bg-[#1E293B] text-white flex justify-between items-center px-4 z-[200]" style={{ height: '36px', fontSize: '12px' }}>
          <div className="flex gap-2 items-center">
            <span>🏫 {activeStudent?.schoolName || 'OO초등학교'}</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <button onClick={() => setShowPrivacy(true)} className="text-white hover:underline bg-transparent border-none p-0 cursor-pointer" style={{ fontSize: '11px', outline: 'none' }}>개인정보처리방침</button>
            <span style={{ opacity: 0.3 }}>|</span>
            <button onClick={() => setShowTerms(true)} className="text-white hover:underline bg-transparent border-none p-0 cursor-pointer" style={{ fontSize: '11px', outline: 'none' }}>사용약관</button>
          </div>
          <span>제작자 OOO</span>
        </footer>

        {showAdmin && <TeacherAdmin onClose={() => setShowAdmin(false)} />}
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
        {showTerms && <TermsOfUse onClose={() => setShowTerms(false)} />}
      </div>
    </Router>
  );
}

function App() {
  return (
    <PapsProvider>
      <MainApp />
    </PapsProvider>
  );
}

export default App;
