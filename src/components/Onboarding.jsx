import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const slides = [
  {
    title: "시작하는 방법",
    content: (
      <div className="space-y-4 text-left">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="font-bold flex items-center gap-2 mb-2 text-slate-800 text-lg">
            <span className="text-2xl">🏫</span> 학생: 로그인 없이 바로 시작!
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            학교명과 학년·반·번호를 입력하면 나만의 탐험 공간이 열려요.
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="font-bold flex items-center gap-2 mb-2 text-slate-800 text-lg">
            <span className="text-2xl">🔑</span> 선생님: 우측 상단 열쇠 아이콘 클릭
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            비밀번호 4자리를 입력하면 교사용 관리 화면이 열려요.
          </p>
        </div>
      </div>
    )
  },
  {
    title: "이런 걸 할 수 있어요",
    content: (
      <div className="space-y-4 text-left bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-start gap-4">
          <span className="text-3xl bg-blue-50 p-2 rounded-xl">🏃</span>
          <div>
            <span className="font-bold text-slate-800 text-base block">체력 기록</span>
            <p className="text-xs text-slate-500 mt-0.5">PAPS 측정값 입력하고 변화 확인</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-3xl bg-orange-50 p-2 rounded-xl">📊</span>
          <div>
            <span className="font-bold text-slate-800 text-base block">데이터 분석</span>
            <p className="text-xs text-slate-500 mt-0.5">내 체력 레벨과 맞춤 운동 추천 받기</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-3xl bg-indigo-50 p-2 rounded-xl">⚽</span>
          <div>
            <span className="font-bold text-slate-800 text-base block">스포츠 탐험</span>
            <p className="text-xs text-slate-500 mt-0.5">내 강점에 맞는 스포츠 역할 찾기</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-3xl bg-purple-50 p-2 rounded-xl">🔍</span>
          <div>
            <span className="font-bold text-slate-800 text-base block">탐구 질문</span>
            <p className="text-xs text-slate-500 mt-0.5">내 삶과 연결된 탐구 질문 만들기</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "ePAPS랑 뭐가 달라요? 🤔",
    content: (
      <div className="space-y-3 text-left">
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <p className="text-sm font-bold text-slate-800 mb-1">📋 기존 ePAPS는...</p>
          <p className="text-xs text-slate-600">선생님이 일괄 입력하고, 등급 숫자를 받아보고 끝납니다.</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <p className="text-sm font-bold text-blue-900 mb-1">🚀 D.A.T.A 탐험대는...</p>
          <p className="text-xs text-blue-700">내가 직접 데이터를 관찰하고, 탐구 질문을 만들어 체육 수업(운동·스포츠·표현)에서 주도적으로 활용해요!</p>
        </div>
        <p className="text-[11px] text-slate-500 bg-gray-100 p-2 rounded text-center">
          "본 앱은 ePAPS 행정 등록을 대체하지 않아요. PAPS 결과를 여기서 탐험해요! 🗺️"
        </p>
      </div>
    )
  },
  {
    title: "이것만 기억해요",
    content: (
      <div className="space-y-3 text-left bg-orange-50 p-5 rounded-2xl border border-orange-100 text-orange-950">
        <p className="text-sm flex items-start gap-2 font-medium">
          <span className="shrink-0 text-orange-600">⚠️</span> 내 번호로만 입력하기 (다른 친구 번호 사용 금지)
        </p>
        <p className="text-sm flex items-start gap-2 font-medium">
          <span className="shrink-0 text-orange-600">⚠️</span> 운동 전 꼭 준비운동 하기
        </p>
        <p className="text-sm flex items-start gap-2 font-medium">
          <span className="shrink-0 text-orange-600">⚠️</span> AI 추천은 참고용이에요. 선생님께 먼저 여쭤보세요.
        </p>
        <p className="text-sm flex items-start gap-2 font-medium">
          <span className="shrink-0 text-orange-600">⚠️</span> 체력 등급은 비교 대상이 아니라 나의 성장 기록이에요 💪
        </p>
      </div>
    )
  },
  {
    title: "탐험을 시작할 준비가 됐나요?",
    content: (
      <div className="text-center mt-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <span className="text-6xl mb-4 block animate-bounce">🌟</span>
        <p className="font-bold text-slate-800 text-lg mb-2">지금 바로 첫 번째 체력 데이터를 입력해봐요!</p>
        <p className="text-sm text-slate-500">나의 몸을 탐험하는 여정이 시작됩니다.</p>
      </div>
    )
  }
];

const Onboarding = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col max-w-xl mx-auto w-full">
      <div className="flex justify-end p-4">
        <button onClick={onComplete} className="text-sm text-slate-500 font-bold hover:text-slate-800 transition">
          건너뛰기
        </button>
      </div>
      
      <div className="flex-1 flex flex-col px-6 justify-center animate-slide-up">
        <h2 className="text-2xl font-black text-center text-slate-800 mb-8">{slides[currentSlide].title}</h2>
        <div className="w-full">
          {slides[currentSlide].content}
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-6 bg-orange-500' : 'w-2 bg-gray-300'}`}
            />
          ))}
        </div>
        <button 
          onClick={nextSlide} 
          className="btn w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 text-lg rounded-xl flex justify-center items-center gap-2 shadow-lg shadow-orange-500/20"
        >
          {currentSlide === slides.length - 1 ? '탐험 시작하기! 🚀' : '다음'} <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
