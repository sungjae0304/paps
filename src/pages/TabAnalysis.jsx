import React, { useContext, useState } from 'react';
import { PapsContext } from '../context/PapsContext';
import { Compass, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
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
      { name: "줄넘기 100개", level: "🟡 보통" },
      { name: "계단 오르내리기", level: "🟢 쉽게" },
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
  power: '⚡ 순발력',
  cardioSub: '🫀 1분 줄넘기'
};

const TabAnalysis = () => {
  const { getLatestRecord } = useContext(PapsContext);
  const record = getLatestRecord();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  if (!record) {
    return (
      <div className="animate-slide-up text-center mt-4">
        <p>기록이 없어요. 먼저 체력 기록을 입력해주세요!</p>
      </div>
    );
  }

  // Radar 차트용 데이터. 값이 클수록 그래프가 밖으로 나가도록 6 - grade로 변환.
  const chartData = [
    { subject: '심폐(오래달리기)', A: 6 - record.grades.cardio, fullMark: 5 },
    { subject: '유연성', A: 6 - record.grades.flexibility, fullMark: 5 },
    { subject: '근력', A: 6 - record.grades.strength, fullMark: 5 },
    { subject: '순발력', A: 6 - record.grades.power, fullMark: 5 },
    { subject: '심폐(줄넘기)', A: 6 - record.grades.cardioSub, fullMark: 5 },
  ];

  const types = ['cardio', 'flexibility', 'strength', 'power', 'cardioSub'];
  const currentType = types[currentCardIndex];
  const currentGrade = record.grades[currentType];

  const handlePrev = () => setCurrentCardIndex(prev => (prev === 0 ? types.length - 1 : prev - 1));
  const handleNext = () => setCurrentCardIndex(prev => (prev === types.length - 1 ? 0 : prev + 1));

  // 강점과 약점 찾기
  let bestType = 'cardio';
  let bestGrade = 5;
  let worstType = 'cardio';
  let worstGrade = 1;

  Object.entries(record.grades).forEach(([type, grade]) => {
    if (grade < bestGrade) { bestGrade = grade; bestType = type; }
    if (grade > worstGrade) { worstGrade = grade; worstType = type; }
  });

  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <Compass className="level-3-text" />
        <h2>데이터 분석</h2>
      </div>

      <div className="card text-center">
        <h3 className="mb-2">내 체력 레이더</h3>
        <p className="text-sm mb-4">가득 찰수록 슈퍼 탐험가에 가까워요!</p>
        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" fontSize={12} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} />
              <Radar name="내 능력치" dataKey="A" stroke="var(--secondary-color)" fill="var(--secondary-color)" fillOpacity={0.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card relative p-0 overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-100">
          <button onClick={handlePrev} className="p-1 rounded-full hover:bg-gray-200 transition"><ChevronLeft /></button>
          <div className="text-center">
            <div className="font-bold text-lg">{typeLabels[currentType]}</div>
            <div className={`text-sm font-semibold level-${currentGrade}-text`}>
              {levelNames[currentGrade]}
            </div>
          </div>
          <button onClick={handleNext} className="p-1 rounded-full hover:bg-gray-200 transition"><ChevronRight /></button>
        </div>
        
        <div className="p-4">
          <div className="flex gap-2 items-start mb-4 bg-blue-50 p-3 rounded-xl border border-blue-100">
            <Sparkles className="text-blue-500 mt-1 flex-shrink-0" size={18} />
            <p className="text-sm text-gray-700">{getAiMessage(currentType, currentGrade)}</p>
          </div>

          <h4 className="text-sm font-bold mb-2">추천 탐험 퀘스트 (운동)</h4>
          <div className="flex flex-col gap-2">
            {getRecommendations(currentType).map((rec, idx) => (
              <div key={idx} className="flex justify-between items-center bg-white border border-gray-200 p-2 rounded-lg shadow-sm">
                <span className="text-sm">{rec.name}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{rec.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 mt-4">
        <div className="card bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 mb-0">
          <h4 className="text-orange-800 text-sm mb-1">🔥 나의 최강 무기</h4>
          <p className="text-sm text-orange-900">너의 최강 무기는 <b>[{typeLabels[bestType]}]</b>야! 탐험에서 적극적으로 써먹어봐!</p>
        </div>
        <div className="card bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
          <h4 className="text-blue-800 text-sm mb-1">🎯 집중 공략 포인트</h4>
          <p className="text-sm text-blue-900">이번엔 <b>[{typeLabels[worstType]}]</b>을 집중 공략해보자! 성장할 수 있어!</p>
        </div>
      </div>
    </div>
  );
};

export default TabAnalysis;
