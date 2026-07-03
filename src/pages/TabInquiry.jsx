import React, { useState, useContext } from 'react';
import { PapsContext } from '../context/PapsContext';
import { HelpCircle, Search, Lightbulb, PenTool } from 'lucide-react';

const habitsList = [
  { id: 'sleepLate', label: '🛏️ 잠을 늦게 자는 편이야' },
  { id: 'phone', label: '📱 하루 2시간 이상 핸드폰을 봐' },
  { id: 'fastfood', label: '🍔 패스트푸드를 자주 먹어' },
  { id: 'walk', label: '🚶 걸어서 등교해' },
  { id: 'elevator', label: '🛗 엘리베이터를 주로 써' },
  { id: 'game', label: '🎮 게임을 즐겨해' },
  { id: 'sport', label: '⚽ 방과후에 운동을 해' },
  { id: 'study', label: '📚 앉아서 공부하는 시간이 길어' },
];

const generateMockQuestions = (habits, grades) => {
  // 모의 질문 생성기
  const questions = [];
  
  // 1. 생활 습관 기반 (유형 B)
  if (habits.includes('elevator')) {
    questions.push({
      q: "엘리베이터 대신 계단을 쓰면 2주 뒤 내 심폐지구력이 달라질까?",
      hint: "왕복오래달리기 기록을 지금 재고, 2주 뒤 다시 재서 비교해봐!",
      type: "생활 습관 실험"
    });
  } else if (habits.includes('phone')) {
    questions.push({
      q: "자기 전 핸드폰을 안 보면 내 순발력이 좋아질까?",
      hint: "50m 달리기 기록을 지금 재고, 일주일 뒤 다시 재서 비교해봐!",
      type: "생활 습관 실험"
    });
  } else {
    questions.push({
      q: "하루 30분 줄넘기를 2주 동안 하면 내 체력이 어떻게 변할까?",
      hint: "PAPS 기록을 지금 재고, 2주 뒤 다시 재서 비교해봐!",
      type: "생활 습관 실험"
    });
  }

  // 2. 데이터 원인 탐구 (유형 A)
  const weakType = Object.keys(grades).reduce((a, b) => grades[a] > grades[b] ? a : b);
  const weakLabel = weakType === 'cardio' ? '오래달리기는' : weakType === 'flexibility' ? '유연성은' : '윗몸일으키기는';
  const strongType = Object.keys(grades).reduce((a, b) => grades[a] < grades[b] ? a : b);
  const strongLabel = strongType === 'power' ? '달리기는' : strongType === 'strength' ? '근력은' : '줄넘기는';

  if (weakType !== strongType) {
    questions.push({
      q: `왜 나는 ${strongLabel} 잘하는데 ${weakLabel} 힘들까?`,
      hint: "두 운동에 쓰이는 근육이 어떻게 다른지 알아봐!",
      type: "데이터 원인 탐구"
    });
  } else {
    questions.push({
      q: "왜 나는 아침보다 저녁에 운동할 때 더 힘들까?",
      hint: "시간대에 따른 컨디션 변화를 일기로 적어봐!",
      type: "데이터 원인 탐구"
    });
  }

  // 3. 비교 탐구 (유형 C)
  questions.push({
    q: "방과후 운동을 하는 날과 안 하는 날의 수면의 질은 어떻게 다를까?",
    hint: "매일 아침 일어날 때의 기분을 점수로 매겨봐!",
    type: "비교 탐구"
  });

  return questions;
};

const TabInquiry = () => {
  const { getLatestRecord } = useContext(PapsContext);
  const record = getLatestRecord();
  
  const [selectedHabits, setSelectedHabits] = useState([]);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!record) {
    return (
      <div className="animate-slide-up text-center mt-4">
        <p>기록이 없어요. 먼저 체력 기록을 입력해주세요!</p>
      </div>
    );
  }

  const toggleHabit = (id) => {
    setSelectedHabits(prev => 
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedQuestions([]);
    
    // 모의 로딩 (나침반 회전 애니메이션용 타임아웃)
    setTimeout(() => {
      const qs = generateMockQuestions(selectedHabits, record.grades);
      setGeneratedQuestions(qs);
      setIsGenerating(false);
    }, 1500);
  };

  const saveQuestion = (q) => {
    if (!savedQuestions.some(sq => sq.q === q.q)) {
      setSavedQuestions([{ ...q, date: new Date().toLocaleDateString() }, ...savedQuestions]);
    }
  };

  return (
    <div className="animate-slide-up pb-8">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="level-4-text" />
        <h2>탐구 질문 생성</h2>
      </div>

      <div className="card">
        <h3 className="text-sm text-gray-600 mb-3">✅ 나의 일상 정보 선택 (해당하는 것 모두)</h3>
        <div className="grid grid-cols-1 gap-2">
          {habitsList.map(habit => (
            <label key={habit.id} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition ${selectedHabits.includes(habit.id) ? 'bg-indigo-50 border-indigo-400' : 'bg-gray-50 border-gray-200'}`}>
              <input 
                type="checkbox" 
                checked={selectedHabits.includes(habit.id)}
                onChange={() => toggleHabit(habit.id)}
                className="w-5 h-5 text-indigo-600"
              />
              <span className="text-sm">{habit.label}</span>
            </label>
          ))}
        </div>

        <button 
          onClick={handleGenerate} 
          disabled={isGenerating}
          className="btn btn-primary mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
        >
          {isGenerating ? <Compass className="animate-spin" /> : <Search size={18} />}
          {isGenerating ? 'AI가 질문을 찾는 중...' : '내 탐구 질문 만들기 🔍'}
        </button>
      </div>

      {generatedQuestions.length > 0 && (
        <div className="mt-6 animate-slide-up">
          <h3 className="mb-3 flex items-center gap-2 text-purple-800">
            <Lightbulb size={20} /> AI 추천 탐구 질문
          </h3>
          <div className="flex flex-col gap-3">
            {generatedQuestions.map((q, idx) => (
              <div key={idx} className="card bg-gradient-to-r from-purple-50 to-white border border-purple-100 p-4 relative">
                <span className="text-xs font-bold text-purple-600 mb-1 block">[{q.type}]</span>
                <p className="font-bold text-gray-800 mb-2">{q.q}</p>
                <p className="text-xs text-gray-500 bg-white p-2 rounded border border-gray-100 mb-3">
                  💡 힌트: {q.hint}
                </p>
                <button 
                  onClick={() => saveQuestion(q)}
                  className="btn btn-secondary py-1 text-sm border-purple-300 text-purple-700 hover:bg-purple-50 w-full"
                >
                  <PenTool size={14} /> 이 질문 선택!
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {savedQuestions.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-gray-700">나의 탐구 질문 모음</h3>
          <div className="flex flex-col gap-2">
            {savedQuestions.map((sq, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <p className="font-bold text-sm text-gray-800">{sq.q}</p>
                <p className="text-xs text-gray-400 mt-1">{sq.date} 저장됨</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TabInquiry;
