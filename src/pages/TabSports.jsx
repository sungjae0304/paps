import React, { useContext, useState } from 'react';
import { PapsContext } from '../context/PapsContext';
import { Trophy, Users, Heart, ThumbsUp } from 'lucide-react';

const explorerTypes = {
  power: {
    icon: '🦁',
    name: '스피드형 탐험가',
    desc: '순발력이 가장 높은 학생',
    role: '공격수, 선두 주자, 속공 담당',
    bgClass: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    sports: [
      { name: '🥏 플라잉디스크', reason: '빠른 반응 속도로 원반을 잡아챌 수 있어!', role: '공격수' },
      { name: '⚽ 축구 (속공)', reason: '누구보다 빠르게 적진으로 달릴 수 있어!', role: '윙어' },
      { name: '🏃 발야구 (도루)', reason: '빠른 발로 베이스를 훔쳐보자!', role: '주자' }
    ]
  },
  cardio: {
    icon: '🐘',
    name: '지구력형 탐험가',
    desc: '심폐지구력이 가장 높은 학생',
    role: '중간 지원, 페이스 조절자, 수비 연결',
    bgClass: 'bg-green-50 border-green-200 text-green-900',
    sports: [
      { name: '🏐 피구 수비', reason: '오래 뛰어도 지치지 않아 끝까지 살아남아!', role: '수비 에이스' },
      { name: '🏸 배드민턴', reason: '끈질긴 랠리로 상대를 지치게 할 수 있어!', role: '올라운더' },
      { name: '🏃 달리기 릴레이', reason: '팀의 든든한 장거리 주자가 되어줘!', role: '앵커' }
    ]
  },
  flexibility: {
    icon: '🦊',
    name: '유연형 탐험가',
    desc: '유연성이 가장 높은 학생',
    role: '방향 전환 역할, 표현 영역 리더, 볼 컨트롤',
    bgClass: 'bg-purple-50 border-purple-200 text-purple-900',
    sports: [
      { name: '🎀 리듬 체조형 뉴스포츠', reason: '부드러운 움직임으로 멋진 동작을 만들어내!', role: '안무 리더' },
      { name: '💃 스포츠 댄스', reason: '리듬에 맞춰 몸을 자유자재로 움직일 수 있어!', role: '메인 댄서' },
      { name: '🤸 뜀틀', reason: '유연한 몸으로 멋지게 착지할 수 있어!', role: '체조 에이스' }
    ]
  },
  strength: {
    icon: '🐻',
    name: '파워형 탐험가',
    desc: '근력·근지구력이 가장 높은 학생',
    role: '수비수, 볼 경합, 버티기 역할',
    bgClass: 'bg-red-50 border-red-200 text-red-900',
    sports: [
      { name: '🤼 씨름형 뉴스포츠', reason: '강력한 힘으로 상대를 제압할 수 있어!', role: '천하장사' },
      { name: '🪢 줄다리기', reason: '팀의 든든한 기둥이 되어줄 수 있어!', role: '앵커맨' },
      { name: '🏈 태그 럭비', reason: '강한 힘으로 상대의 수비를 돌파해!', role: '돌격대장' }
    ]
  }
};

const TabSports = () => {
  const { getLatestRecord } = useContext(PapsContext);
  const record = getLatestRecord();
  const [showGroupPanel, setShowGroupPanel] = useState(false);

  if (!record) {
    return (
      <div className="animate-slide-up text-center mt-4">
        <p>기록이 없어요. 먼저 체력 기록을 입력해주세요!</p>
      </div>
    );
  }

  // 강점 찾기 (제일 낮은 등급 값 = 제일 좋은 성적)
  let bestType = 'cardio';
  let bestGrade = 5;
  Object.entries(record.grades).forEach(([type, grade]) => {
    // cardioSub는 제외하고 4가지 메인 요소로 결정
    if (type !== 'cardioSub' && grade < bestGrade) { 
      bestGrade = grade; 
      bestType = type; 
    }
  });

  const myType = explorerTypes[bestType];

  return (
    <div className="animate-slide-up pb-8">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="level-1-text" />
        <h2>스포츠 탐험</h2>
      </div>

      <div className={`card border ${myType.bgClass} text-center`}>
        <div className="text-4xl mb-2">{myType.icon}</div>
        <h3 className="mb-1">{myType.name}</h3>
        <p className="text-sm mb-4 font-bold">{myType.desc}</p>
        <div className="bg-white bg-opacity-60 rounded-xl p-3">
          <p className="text-xs text-gray-600 mb-1">🏅 모둠 활동 추천 역할</p>
          <p className="font-bold">{myType.role}</p>
        </div>
      </div>

      <h3 className="mt-6 mb-3 text-sm text-gray-500">이런 스포츠 어때요?</h3>
      <div className="flex flex-col gap-3">
        {myType.sports.map((sport, idx) => (
          <div key={idx} className="card p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg text-gray-800">{sport.name}</h4>
              <span className="badge bg-blue-100 text-blue-800">{sport.role}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded-lg">
              💡 {sport.reason}
            </p>
            <div className="flex gap-2">
              <button className="flex-1 btn btn-secondary py-2 text-xs">
                <ThumbsUp size={14} /> 좋아요
              </button>
              <button className="flex-1 btn btn-secondary py-2 text-xs">
                <Heart size={14} /> 해봤어요
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button 
          className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 w-full"
          onClick={() => setShowGroupPanel(!showGroupPanel)}
        >
          <Users size={18} /> 우리 모둠 데이터 합치기
        </button>

        {showGroupPanel && (
          <div className="card mt-4 bg-indigo-50 border border-indigo-100 animate-slide-up">
            <h4 className="text-indigo-900 mb-2">모둠 데이터 조합 분석</h4>
            <p className="text-sm text-indigo-700 mb-4">모둠원의 이름을 입력하고 데이터를 모아보세요.</p>
            
            <div className="space-y-2 mb-4">
              <input type="text" className="form-control" placeholder="모둠원 1 이름 (강점)" disabled />
              <input type="text" className="form-control" placeholder="모둠원 2 이름 (강점)" disabled />
            </div>

            <div className="bg-white p-3 rounded-xl text-center border border-indigo-200">
              <p className="text-sm text-gray-600">이 모둠의 최강 전략은...</p>
              <p className="font-bold text-lg text-indigo-700 mt-1">[속공 + 수비 조합]!</p>
            </div>
            <button className="btn btn-primary mt-4 py-2 w-full text-sm">작전판 생성하기 (인쇄)</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabSports;
