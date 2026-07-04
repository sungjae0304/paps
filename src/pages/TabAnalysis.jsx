import React, { useContext, useState, useEffect } from 'react';
import { PapsContext } from '../context/PapsContext';
import { Compass, Award, AlertCircle, Dumbbell } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const levelNames = {
  1: '🌟 슈퍼 탐험가',
  2: '⭐ 탐험가',
  3: '🔵 탐험 중',
  4: '🟡 탐험 시작',
  5: '⚪ 탐험 준비 중'
};

const getAiMessage = (type, grade) => {
  const messages = {
    1: "와! 이 분야는 진짜 슈퍼 탐험가야! 계속 유지해봐 💪",
    2: "훌륭해! 조금만 더 하면 슈퍼 탐험가가 될 수 있어 ✨",
    3: "보통이라고? 천만에! 조금만 더 하면 탐험가 레벨 달성이야 🔥",
    4: "지금부터가 진짜 탐험의 시작이야! 할 수 있어 🏃",
    5: "지금이 시작점이야. 탐험은 첫 발부터 시작되는 거야! 🌱"
  };
  return messages[grade] || messages[5];
};

const getRecommendations = (type) => {
  const recs = {
    cardio: [
      { name: "줄넘기 100개", level: "🟢 쉽게" },
      { name: "계단 오르내리기", level: "🟡 보통" },
      { name: "리듬 줄넘기", level: "🔴 도전!" }
    ],
    flexibility: [
      { name: "나비 스트레칭", level: "🟢 쉽게" },
      { name: "앉아 발끝 뻗기", level: "🟡 보통" },
      { name: "옆으로 굽히기", level: "🟢 쉽게" }
    ],
    strength: [
      { name: "플랭크 20초", level: "🟡 보통" },
      { name: "스쿼트 15개", level: "🟢 쉽게" },
      { name: "팔굽혀펴기", level: "🔴 도전!" }
    ],
    power: [
      { name: "제자리 높이 뛰기", level: "🟢 쉽게" },
      { name: "왕복 달리기", level: "🟡 보통" },
      { name: "줄넘기 2단 뛰기", level: "🔴 도전!" }
    ],
    cardioSub: [
      { name: "가볍게 뛰기 3분", level: "🟢 쉽게" },
      { name: "버피 테스트 10개", level: "🔴 도전!" },
      { name: "제자리 뛰기", level: "🟡 보통" }
    ]
  };
  return recs[type] || [];
};

const typeLabels = {
  cardio: '🫀 왕복오래달리기',
  flexibility: '🤸 유연성',
  strength: '💪 근력·근지구력',
  power: '⚡ 순발력'
};

const TabAnalysis = () => {
  const { records, getLatestRecord } = useContext(PapsContext);
  const record = getLatestRecord();

  // 나만의 운동 설계소 관련 상태
  const [designStep, setDesignStep] = useState(1);
  const [targetType, setTargetType] = useState('cardio');
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [routineDays, setRoutineDays] = useState({
    월: false, 화: false, 수: false, 목: false, 금: false
  });
  const [savedRoutine, setSavedRoutine] = useState(null);

  if (!record) {
    return (
      <div className="animate-slide-up text-center mt-4">
        <p>기록이 없어요. 먼저 체력 기록을 입력해주세요!</p>
      </div>
    );
  }

  // Radar 차트용 데이터 (등급 표시 숫자를 숨기기 위해 계산만 진행)
  const radarData = [
    { subject: '오래달리기', A: 6 - record.grades.cardio },
    { subject: '유연성', A: 6 - record.grades.flexibility },
    { subject: '근력', A: 6 - record.grades.strength },
    { subject: '순발력', A: 6 - record.grades.power },
  ];

  // 강점과 약점 찾기
  let bestType = 'cardio';
  let bestGrade = 5;
  let worstType = 'cardio';
  let worstGrade = 1;

  Object.entries(record.grades).forEach(([type, grade]) => {
    if (grade < bestGrade) { bestGrade = grade; bestType = type; }
    if (grade > worstGrade) { worstGrade = grade; worstType = type; }
  });


  // 운동 설계소 처리
  const toggleWorkout = (name) => {
    setSelectedWorkouts(prev =>
      prev.includes(name) ? prev.filter(w => w !== name) : [...prev, name]
    );
  };

  const handleDayToggle = (day) => {
    setRoutineDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const saveMyRoutine = () => {
    setSavedRoutine({
      target: targetType,
      workouts: selectedWorkouts,
      days: Object.keys(routineDays).filter(d => routineDays[d]),
      checked: { 월: false, 화: false, 수: false, 목: false, 금: false }
    });
    setDesignStep(4);
  };

  const handleCheckRoutineDay = (day) => {
    if (!savedRoutine) return;
    setSavedRoutine(prev => {
      const nextChecked = { ...prev.checked, [day]: !prev.checked[day] };
      return { ...prev, checked: nextChecked };
    });
  };

  // 실천 달성률 계산
  const getProgressRate = () => {
    if (!savedRoutine || savedRoutine.days.length === 0) return 0;
    const checkedCount = Object.keys(savedRoutine.checked).filter(d => savedRoutine.checked[d] && savedRoutine.days.includes(d)).length;
    return Math.round((checkedCount / savedRoutine.days.length) * 100);
  };

  return (
    <div className="animate-slide-up pb-12">
      <div className="flex items-center gap-2 mb-4">
        <Compass className="level-3-text" />
        <h2>데이터 분석</h2>
      </div>

      {/* 체지방 비만 제거 심리 안전 문구 */}
      <div style={{ background: '#1e293b', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <AlertCircle size={16} style={{ color: '#fb923c', flexShrink: 0 }} />
        <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>우리는 몸의 체지방 수치가 아닌 진짜 신체 능력에 집중해요 💪 (비만 항목 없음)</span>
      </div>

      <div className="card text-center">
        <h3 className="mb-2 text-slate-800">내 체력 레이더</h3>
        <p className="text-xs text-slate-500 mb-4">가득 찰수록 슈퍼 탐험가에 가까워요!</p>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" fontSize={11} tick={{ fill: '#334155' }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} />
              <Radar name="내 능력치" dataKey="A" stroke="var(--secondary-color)" fill="var(--secondary-color)" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 강점 언어 분석 카드 */}
      <div className="card mb-4" style={{ borderLeft: '4px solid #d97706', background: '#fffbeb' }}>
        <div className="flex items-center gap-2 mb-2">
          <Award size={24} style={{ color: '#d97706' }} />
          <h3 style={{ color: '#78350f', marginBottom: 0, fontWeight: 900 }}>⭐ 너의 슈퍼 파워: {typeLabels[bestType].split(' ')[1]}</h3>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#451a03', fontWeight: 500 }}>
          이 분야에서 너는 훌륭한 강점을 지니고 있어! 체육 시간에 이 능력을 마음껏 뽐내봐 💃
        </p>
      </div>

      {/* 도전 포인트 (부드러운 언어) */}
      <div className="card mb-4" style={{ borderLeft: '4px solid #2563eb', background: '#eff6ff' }}>
        <h3 style={{ color: '#1e3a8a', marginBottom: '0.5rem', fontWeight: 900 }}>🎯 성장 중인 도전 포인트: {typeLabels[worstType].split(' ')[1]}</h3>
        <p style={{ fontSize: '0.875rem', color: '#1e3a8a', fontWeight: 500 }}>
          이번에는 <b>[{typeLabels[worstType].split(' ')[1]}]</b> 탐험지에 도전해볼까? 조금만 노력을 기울이면 반드시 성장할 수 있을 거야!
        </p>
      </div>





      {/* 나만의 운동 설계소 (처방이 아닌 자기 설계 피처) */}
      <div className="card border-2 border-indigo-200 bg-gradient-to-br from-white to-slate-50">
        <div className="flex items-center gap-2 mb-3">
          <Dumbbell className="text-indigo-600" />
          <h3 className="mb-0 text-slate-800 font-black">🏗️ 나만의 운동 설계소</h3>
        </div>

        {designStep === 1 && (
          <div className="space-y-4 animate-slide-up">
            <p className="text-xs text-slate-600 font-semibold">Step 1: 어떤 체력 탐험지를 키우고 싶니? 직접 목적지를 골라봐!</p>
            <div className="flex flex-col gap-2">
              {Object.keys(typeLabels).map(key => (
                <button 
                  key={key}
                  onClick={() => { setTargetType(key); setDesignStep(2); }}
                  className={`btn py-2 text-sm justify-between ${targetType === key ? 'btn-primary' : 'btn-secondary'}`}
                >
                  <span>{typeLabels[key]}</span>
                  <span>{record.grades[key] >= 4 ? '🔥 집중공략추천' : '✨ 성장하기'}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {designStep === 2 && (
          <div className="space-y-4 animate-slide-up">
            <p className="text-xs text-slate-600 font-semibold">Step 2: 아래 운동 중 마음에 드는 운동을 1개 이상 골라봐!</p>
            <div className="flex flex-col gap-2">
              {getRecommendations(targetType).map((rec, idx) => {
                const isSelected = selectedWorkouts.includes(rec.name);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleWorkout(rec.name)}
                    className={`btn py-2 text-sm justify-between transition-transform duration-200 ${
                      isSelected 
                        ? 'bg-indigo-600 text-white scale-[1.02]' 
                        : 'bg-white border-2 border-slate-300 text-slate-700'
                    }`}
                    style={{ color: isSelected ? '#ffffff' : '#334155' }}
                  >
                    <span className="flex items-center gap-1.5">
                      {isSelected && <span style={{ color: '#ffffff', fontWeight: 'bold' }}>✓</span>}
                      {rec.name}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{rec.level}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setDesignStep(1)} className="btn btn-secondary py-2 text-sm">이전</button>
              <button 
                onClick={() => setDesignStep(3)} 
                disabled={selectedWorkouts.length === 0} 
                className="btn btn-primary py-2 text-sm disabled:opacity-50"
              >
                다음 단계로
              </button>
            </div>
          </div>
        )}

        {designStep === 3 && (
          <div className="space-y-4 animate-slide-up">
            <p className="text-xs text-slate-600 font-semibold">Step 3: 매주 언제 실천할 수 있니? 계획적인 요일을 선택해봐!</p>
            <div className="flex justify-around gap-1">
              {Object.keys(routineDays).map(day => {
                const isSelected = routineDays[day];
                return (
                  <button
                    key={day}
                    onClick={() => handleDayToggle(day)}
                    className={`rounded-full font-bold text-sm transition-all ${
                      isSelected 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                    style={{ width: '44px', height: '44px', color: isSelected ? '#ffffff' : '#64748b' }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setDesignStep(2)} className="btn btn-secondary py-2 text-sm">이전</button>
              <button 
                onClick={saveMyRoutine} 
                disabled={Object.values(routineDays).filter(Boolean).length === 0}
                className="btn btn-primary py-2 text-sm disabled:opacity-50"
              >
                운동 루틴 완성! ✨
              </button>
            </div>
          </div>
        )}

        {designStep === 4 && savedRoutine && (
          <div className="space-y-4 animate-slide-up text-left text-slate-800">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
              <p className="text-xs font-bold text-indigo-900 mb-1">🏁 나만의 이번 주 운동 루틴</p>
              <p className="text-sm font-semibold">🎯 목표 체력: {typeLabels[savedRoutine.target]}</p>
              <p className="text-sm">🏋️ 운동: {savedRoutine.workouts.join(', ')}</p>
              <p className="text-sm">📅 실천일: {savedRoutine.days.join(', ')}요일</p>
            </div>

            <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-lg border border-slate-200">
              <span className="text-xs font-bold">이번 주 루틴 달성률</span>
              <span className="font-black text-indigo-700 text-sm">{getProgressRate()}%</span>
            </div>

            <div className="flex gap-1 justify-between">
              {savedRoutine.days.map(day => {
                const isChecked = savedRoutine.checked[day];
                return (
                  <button
                    key={day}
                    onClick={() => handleCheckRoutineDay(day)}
                    className={`flex-1 py-2 rounded-lg font-bold text-xs transition-colors ${
                      isChecked 
                        ? 'bg-green-600 text-white' 
                        : 'bg-white text-slate-600 border-2 border-slate-300'
                    }`}
                    style={{ color: isChecked ? '#ffffff' : '#475569' }}
                  >
                    {day} {isChecked ? '✓' : '점검'}
                  </button>
                );
              })}
            </div>

            <button 
              onClick={() => { setSavedRoutine(null); setDesignStep(1); setSelectedWorkouts([]); setRoutineDays({ 월: false, 화: false, 수: false, 목: false, 금: false }); }}
              className="btn btn-secondary py-1 text-xs border-indigo-300 text-indigo-600 mt-2"
            >
              🔄 다시 설계하기
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default TabAnalysis;
