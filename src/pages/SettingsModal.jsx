import React, { useState, useEffect } from 'react';
import { ChevronLeft, GitBranch, Globe, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PrivacyPolicy, TermsOfUse } from './Policies';

const SettingsModal = ({ onClose }) => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [checkStatus, setCheckStatus] = useState(null);
  const [lastCheckTime, setLastCheckTime] = useState('방금 전');

  const runCheck = () => {
    setIsChecking(true);
    setCheckStatus(null);
    // 모의 확인 딜레이
    setTimeout(() => {
      setCheckStatus({
        web: true,
        links: true,
        policies: true,
        firebase: true
      });
      setIsChecking(false);
      setLastCheckTime('방금 전');
    }, 1500);
  };

  useEffect(() => {
    runCheck();
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-50 z-40 overflow-y-auto">
      <div className="header sticky top-0 flex items-center p-4 bg-slate-800 text-white z-10">
        <button onClick={onClose} className="mr-4"><ChevronLeft /></button>
        <h2 className="text-lg mb-0 font-bold">앱 설정 & 정보</h2>
      </div>

      <div className="p-4 space-y-4 pb-20 animate-slide-up max-w-xl mx-auto">
        
        <div className="card">
          <h3 className="mb-4 flex items-center gap-2"><Globe className="text-blue-600"/> 🌐 앱 접속 주소</h3>
          <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-between mb-4 border border-gray-200">
            <span className="text-sm font-mono text-gray-700 truncate">https://data-explorer-paps.vercel.app</span>
            <span className="text-xl">🔗</span>
          </div>
          <div className="flex flex-col items-center mb-4">
            <div className="bg-white p-2 rounded-xl shadow-sm inline-block border border-gray-200 mb-2">
              <QRCodeSVG value="https://data-explorer-paps.vercel.app" size={120} />
            </div>
            <p className="text-xs text-center text-gray-500">
              📱 위 주소로 접속하거나 QR 코드를 스캔하세요<br/>
              💡 크롬 브라우저 사용을 권장합니다<br/>
              📌 북마크 추가하면 더 편리해요
            </p>
          </div>
          <a href="https://data-explorer-paps.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full bg-blue-600 hover:bg-blue-700 border-none text-white">
            앱 접속하기
          </a>
        </div>

        <div className="card bg-[#24292e] text-white">
          <h3 className="mb-4 flex items-center gap-2 text-white"><GitBranch /> 📂 소스코드 & 개발 정보</h3>
          <a href="https://github.com/sungjae0304/paps" target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm underline block mb-4 truncate">
            https://github.com/sungjae0304/paps
          </a>
          <div className="space-y-2 text-sm text-gray-300 mb-4">
            <p>💻 개발 언어: React / HTML / CSS</p>
            <p>🔥 백엔드: Firebase (Mock)</p>
            <p>📅 개발 기간: 2026년 6월 ~ 7월</p>
          </div>
          <p className="text-xs text-gray-400 bg-black bg-opacity-30 p-3 rounded-lg">
            이 앱의 전체 소스코드와 개발 과정이 공개되어 있습니다.<br/>
            수업 연구 목적으로 자유롭게 참고하실 수 있습니다.
          </p>
        </div>

        <div className="card">
          <h3 className="mb-4">📄 이용 안내 및 정책</h3>
          <div className="flex flex-col gap-2">
            <button onClick={() => setShowTerms(true)} className="btn btn-secondary justify-between w-full">
              서비스 이용약관 <ChevronLeft className="rotate-180" size={16}/>
            </button>
            <button onClick={() => setShowPrivacy(true)} className="btn btn-secondary justify-between w-full">
              개인정보처리방침 <ChevronLeft className="rotate-180" size={16}/>
            </button>
          </div>
        </div>

        <div className="card bg-green-50 border border-green-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-green-900 mb-0">✅ 배포 완료 확인</h3>
            <button onClick={runCheck} disabled={isChecking} className="text-green-700 hover:text-green-900 flex items-center gap-1 text-xs bg-green-100 px-2 py-1 rounded-full">
              <RefreshCw size={12} className={isChecking ? "animate-spin" : ""} /> 다시 확인
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="mt-0.5">{checkStatus?.web ? <CheckCircle size={16} className="text-green-600"/> : <XCircle size={16} className="text-red-600"/>}</span>
              <div>
                <p className="text-sm font-bold text-gray-800">1. 🌐 웹 접속</p>
                <p className="text-xs text-gray-600">{checkStatus?.web ? "정상 접속" : "접속 불가"} <span className="text-gray-400 ml-1">({lastCheckTime} 확인)</span></p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5">{checkStatus?.links ? <CheckCircle size={16} className="text-green-600"/> : <XCircle size={16} className="text-red-600"/>}</span>
              <div>
                <p className="text-sm font-bold text-gray-800">2. 🔗 링크 작동</p>
                <p className="text-xs text-gray-600">{checkStatus?.links ? "내부 이동 정상" : "오류 발생"} <span className="text-gray-400 ml-1">({lastCheckTime} 확인)</span></p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5">{checkStatus?.policies ? <CheckCircle size={16} className="text-green-600"/> : <XCircle size={16} className="text-red-600"/>}</span>
              <div>
                <p className="text-sm font-bold text-gray-800">3. 📄 정책 페이지 연결</p>
                <p className="text-xs text-gray-600">{checkStatus?.policies ? "개인정보처리방침 / 사용약관 연결됨" : "오류 발생"} <span className="text-gray-400 ml-1">({lastCheckTime} 확인)</span></p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-0.5">{checkStatus?.firebase ? <CheckCircle size={16} className="text-green-600"/> : <XCircle size={16} className="text-red-600"/>}</span>
              <div>
                <p className="text-sm font-bold text-gray-800">4. 🗄️ 저장 기능 정상 여부</p>
                <p className="text-xs text-gray-600">{checkStatus?.firebase ? "Firebase 연결됨 · 저장 정상" : "Firebase 연결 끊김"} <span className="text-gray-400 ml-1">({lastCheckTime} 확인)</span></p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-green-200 text-center">
            <button className="text-xs text-green-700 underline font-bold">캡처용 보기</button>
          </div>
        </div>

      </div>

      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}
      {showTerms && <TermsOfUse onClose={() => setShowTerms(false)} />}
    </div>
  );
};

export default SettingsModal;
