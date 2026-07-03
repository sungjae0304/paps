import React, { useState, useContext, useEffect } from 'react';
import { PapsContext } from '../context/PapsContext';
import { HelpCircle, Search, Lightbulb, PenTool, BookOpen, CheckSquare } from 'lucide-react';

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
  const questions = [];
  
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

  // 성찰 일지 관련 상태
  const [reflectionInput, setReflectionInput] = useState('');
  const [savedReflections, setSavedReflections] = useState([]);

  // 2주 뒤 실험 결과 상태
  const [experimentAnswers, setExperimentAnswers] = useState({});

  if (!record) {
    return (
      <div className="animate-slide-up text-center mt-4">
        <p>기록이 없어요. 먼저 체력 기록을 입력해주세요!</p>
      </div>
    );
  }

  // 1차 기록과 비교한 자동 성찰 질문 제시
  const getAutoInquiryQuestion = () => {
    let bestType = 'cardio';
    let bestGrade = 5;
    Object.entries(record.grades).forEach(([type, grade]) => {
      if (grade < bestGrade) { bestGrade = grade; bestType = type; }
    });

    const labels = { cardio: '심폐지구력(오래달리기)', flexibility: '유연성', strength: '근력', power: '순발력', cardioSub: '줄넘기' };
    return `Q. 왜 이번 측정에서 내 [${labels[bestType]}]이 가장 잘 나왔을까? 지난 2주간 내 생활에서 달라진 점이 있었는지 성찰해봐! 📝`;
  };

  const toggleHabit = (id) => {
    setSelectedHabits(prev => 
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedQuestions([]);
    
    setTimeout(() => {
      const qs = generateMockQuestions(selectedHabits, record.grades);
      setGeneratedQuestions(qs);
      setIsGenerating(false);
    }, 1200);
  };

  const saveQuestion = (q) => {
    if (!savedQuestions.some(sq => sq.q === q.q)) {
      setSavedQuestions([{ ...q, id: Date.now(), date: new Date().toLocaleDateString() }, ...savedQuestions]);
    }
  };

  const handleSaveReflection = (e) => {
    e.preventDefault();
    if (!reflectionInput.trim()) return;
    setSavedReflections([
      {
        id: Date.now(),
        question: getAutoInquiryQuestion(),
        answer: reflectionInput,
        date: new Date().toLocaleDateString()
      },
      ...savedReflections
    ]);
    setReflectionInput('');
  };

  const handleSaveExperiment = (id, answerText) => {
    setExperimentAnswers(prev => ({
      ...prev,
      [id]: { answer: answerText, completed: true }
    }));
  };

  return (
    <div className="animate-slide-up pb-12 text-slate-800">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="level-4-text" />
        <h2>탐구 질문 생성</h2>
      </div>

      {/* 1. 오늘의 발견 (데이터 기반 자동 성찰 질문 제시) */}
      <div className="card border border-blue-200 bg-blue-50/50">
        <h3 className="text-blue-900 text-sm font-bold flex items-center gap-1.5"><BookOpen size={16} /> 오늘의 성찰 발견</h3>
        <p className="text-xs text-blue-950 font-bold mt-1 bg-white p-2.5 rounded-lg border border-blue-100">{getAutoInquiryQuestion()}</p>
        
        <form onSubmit={handleSaveReflection} className="mt-3">
          <textarea
            value={reflectionInput}
            onChange={(e) => setReflectionInput(e.target.value)}
            className="form-control text-xs w-full p-2.5 rounded-xl border-slate-200"
            rows="3"
            placeholder="여기에 생각이나 발견한 원인을 3~5줄 적어보세요..."
            required
          />
          <button type="submit" className="btn btn-primary bg-blue-600 mt-2 py-1 text-xs w-full">
            생각 기록하기
          </button>
        </form>
      </div>

      {/* 2. 생활습관 기반 AI 탐구 질문 만들기 */}
      <div className="card">
        <h3 className="text-sm text-slate-700 font-bold mb-3">✅ 나의 일상 정보 선택</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {habitsList.map(habit => (
            <label key={habit.id} className={`flex items-center gap-1.5 p-2 rounded-xl border cursor-pointer transition ${selectedHabits.includes(habit.id) ? 'bg-indigo-50 border-indigo-300' : 'bg-slate-50 border-slate-200'}`}>
              <input 
                type="checkbox" 
                checked={selectedHabits.includes(habit.id)}
                onChange={() => toggleHabit(habit.id)}
                className="w-4 h-4 text-indigo-600"
              />
              <span className="text-xs">{habit.label}</span>
            </label>
          ))}
        </div>

        <button 
          onClick={handleGenerate} 
          disabled={isGenerating}
          className="btn btn-primary w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-xs py-2"
        >
          {isGenerating ? 'AI가 질문을 추출하는 중...' : '내 탐구 질문 만들기 🔍'}
        </button>
      </div>

      {generatedQuestions.length > 0 && (
        <div className="mt-6 animate-slide-up">
          <h3 className="mb-3 flex items-center gap-2 text-purple-800 text-sm font-bold">
            <Lightbulb size={18} /> AI 추천 탐구 질문
          </h3>
          <div className="flex flex-col gap-3">
            {generatedQuestions.map((q, idx) => (
              <div key={idx} className="card bg-gradient-to-r from-purple-50 to-white border border-purple-100 p-4 relative">
                <span className="text-[10px] font-bold text-purple-600 mb-1 block">[{q.type}]</span>
                <p className="font-bold text-slate-800 text-sm mb-2">{q.q}</p>
                <p className="text-[11px] text-slate-500 bg-white p-2 rounded border border-gray-100 mb-3">
                  💡 힌트: {q.hint}
                </p>
                <button 
                  onClick={() => saveQuestion(q)}
                  className="btn btn-secondary py-1 text-xs border-purple-300 text-purple-700 hover:bg-purple-50 w-full"
                >
                  <PenTool size={12} /> 이 질문 선택!
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. 나의 탐구 질문 모음 & 2주 뒤 결과 기록 */}
      {savedQuestions.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-slate-800 text-sm font-bold">나의 탐구 질문 모음</h3>
          <div className="flex flex-col gap-3">
            {savedQuestions.map((sq) => {
              const hasAnswer = experimentAnswers[sq.id]?.completed;
              return (
                <div key={sq.id} className="card bg-white border border-slate-200 p-4 rounded-xl">
                  <span className="text-[10px] text-indigo-600 font-bold block mb-1">[{sq.type}]</span>
                  <p className="font-bold text-slate-800 text-sm">{sq.q}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{sq.date}에 저장됨</p>
                  
                  {hasAnswer ? (
                    <div className="mt-3 bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-xs font-bold text-green-900 flex items-center gap-1"><CheckSquare size={14}/> 2주 뒤 나의 대답:</p>
                      <p className="text-xs text-slate-600 mt-1">{experimentAnswers[sq.id].answer}</p>
                      <span className="text-[10px] text-green-700 font-bold block mt-1">탐구 완료! 🎉 넌 진짜 데이터 탐험가야!</span>
                    </div>
                  ) : (
                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <p className="text-xs font-bold text-slate-600 mb-1">2주 뒤 실험 결과 기록하기:</p>
                      <div className="flex gap-1.5">
                        <input 
                          type="text" 
                          id={`input-${sq.id}`}
                          className="form-control text-xs flex-1 py-1" 
                          placeholder="실험을 실천해보고 어땠는지 적어봐!"
                        />
                        <button 
                          onClick={() => {
                            const val = document.getElementById(`input-${sq.id}`).value;
                            if (val.trim()) handleSaveExperiment(sq.id, val);
                          }}
                          className="btn btn-primary py-1 px-3 text-xs w-auto bg-green-600 hover:bg-green-700"
                        >
                          기록
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. 성찰 타임라인 포트폴리오 */}
      {savedReflections.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-slate-800 text-sm font-bold">나의 성찰 타임라인</h3>
          <div className="flex flex-col gap-2">
            {savedReflections.map((ref) => (
              <div key={ref.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-150 text-left">
                <p className="text-[11px] text-indigo-700 font-bold mb-1 leading-relaxed">{ref.question}</p>
                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed font-semibold">✍️ {ref.answer}</p>
                <p className="text-[10px] text-slate-400 mt-2">{ref.date}에 성찰함</p>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default TabInquiry;
