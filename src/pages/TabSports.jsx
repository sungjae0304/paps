import React, { useContext, useState } from 'react';
import { PapsContext } from '../context/PapsContext';
import { Trophy, Users, Music } from 'lucide-react';

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

const danceSuggestions = {
  flexibility: ["🤸 스트레칭 동작", "🤸 유연하게 회전하는 동작", "🤸 몸을 낮추는 부드러운 웨이브"],
  power: ["⚡ 빠른 점프", "⚡ 급격한 방향 전환", "⚡ 리듬에 맞춘 빠른 스텝"],
  strength: ["💪 강한 착지 동작", "💪 힘이 들어간 정지 동작(프리즈)", "💪 튼튼하게 버티는 시그니처 포즈"],
  cardio: ["🏃 지치지 않는 스텝 댄스", "🏃 대형을 넓게 이동하는 동작", "🏃 연속 점핑 잭 동작"]
};

const TabSports = () => {
  const { getLatestRecord } = useContext(PapsContext);
  const record = getLatestRecord();
  
  const [showGroupPanel, setShowGroupPanel] = useState(false);
  const [showDancePanel, setShowDancePanel] = useState(false);

  // 모둠원 입력용 상태
  const [groupMembers, setGroupMembers] = useState([
    { name: '나', strength: '유연성' },
    { name: '', strength: '순발력' },
    { name: '', strength: '심폐지구력' },
    { name: '', strength: '근력' }
  ]);
  const [showStrategyResult, setShowStrategyResult] = useState(false);

  // 안무 설계 상태
  const [savedDanceMoves, setSavedDanceMoves] = useState([]);

  if (!record) {
    return (
      <div className="animate-slide-up text-center mt-4">
        <p>기록이 없어요. 먼저 체력 기록을 입력해주세요!</p>
      </div>
    );
  }

  // 내 강점 찾기 (1순위)
  let bestType = 'cardio';
  let bestGrade = 5;
  Object.entries(record.grades).forEach(([type, grade]) => {
    if (grade < bestGrade) { 
      bestGrade = grade; 
      bestType = type; 
    }
  });

  const myType = explorerTypes[bestType] || explorerTypes['cardio'];
  const myDanceSuggestions = danceSuggestions[bestType] || danceSuggestions['cardio'];

  // bgClass를 inline style 객체로 변환
  const typeStyleMap = {
    power:       { background: '#fefce8', border: '1px solid #fde68a', color: '#713f12' },
    cardio:      { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#14532d' },
    flexibility: { background: '#faf5ff', border: '1px solid #e9d5ff', color: '#4c1d95' },
    strength:    { background: '#fff1f2', border: '1px solid #fecdd3', color: '#881337' },
  };
  const typeCardStyle = typeStyleMap[bestType] || typeStyleMap['cardio'];

  const handleGroupMemberChange = (idx, field, val) => {
    const updated = [...groupMembers];
    updated[idx][field] = val;
    setGroupMembers(updated);
  };

  const handleCreateStrategy = () => {
    setShowStrategyResult(true);
  };

  const toggleSaveDanceMove = (move) => {
    setSavedDanceMoves(prev =>
      prev.includes(move) ? prev.filter(m => m !== move) : [...prev, move]
    );
  };

  return (
    <div className="animate-slide-up pb-12 text-slate-800">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="level-1-text" />
        <h2>스포츠 탐험</h2>
      </div>

      {/* 내 체력 유형 진단 */}
      <div className="card border text-center" style={typeCardStyle}>
        <div className="text-4xl mb-2">{myType.icon}</div>
        <h3 className="mb-1" style={{ color: typeCardStyle.color }}>{myType.name}</h3>
        <p className="text-xs mb-4 font-bold" style={{ color: typeCardStyle.color }}>{myType.desc}</p>
        <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '12px', padding: '0.75rem' }}>
          <p className="text-xs text-slate-500 mb-1">🏅 모둠 활동 추천 역할</p>
          <p className="font-bold text-slate-800">{myType.role}</p>
        </div>
      </div>

      {/* 강점 기반 안무 동작 제안 (표현 영역 연결) */}
      <div className="mt-6">
        <button 
          className="btn btn-primary bg-purple-600 hover:bg-purple-700 w-full flex items-center justify-center gap-2"
          onClick={() => setShowDancePanel(!showDancePanel)}
        >
          <Music size={18} /> 내 강점으로 안무 짜기 💃
        </button>

        {showDancePanel && (
          <div className="card mt-4 bg-purple-50/50 border border-purple-200 animate-slide-up">
            <h3 className="text-purple-900 text-sm font-bold mb-1">💃 표현 영역 강점 안무 제안</h3>
            <p className="text-xs text-purple-700 mb-4">너의 최고의 강점인 **[{myType.desc.split(' ')[0]}]**이 잘 살아나는 시그니처 안무 동작이야!</p>
            
            <div className="space-y-2 mb-4">
              {myDanceSuggestions.map((move, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-purple-100 shadow-sm">
                  <span className="text-sm font-bold text-slate-700">{move}</span>
                  <button 
                    onClick={() => toggleSaveDanceMove(move)}
                    className={`btn py-1 px-3 text-xs w-auto ${savedDanceMoves.includes(move) ? 'bg-purple-600 text-white' : 'btn-secondary border-purple-300 text-purple-600'}`}
                  >
                    {savedDanceMoves.includes(move) ? '선택됨 ✅' : '안무 담기'}
                  </button>
                </div>
              ))}
            </div>

            {savedDanceMoves.length > 0 && (
              <div className="bg-white p-4 rounded-xl border border-purple-200 mt-2">
                <p className="text-xs font-bold text-purple-950 mb-2">📋 나의 표현 안무 기획보드</p>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  {savedDanceMoves.map((m, i) => <li key={i}>{m}</li>)}
                </ul>

              </div>
            )}
          </div>
        )}
      </div>

      {/* 모둠 전략 역할 배정 (스포츠 영역 연결) */}
      <div className="mt-4">
        <button 
          className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 w-full flex items-center justify-center gap-2"
          onClick={() => setShowGroupPanel(!showGroupPanel)}
        >
          <Users size={18} /> 우리 모둠 데이터 합치기 ⚽
        </button>

        {showGroupPanel && (
          <div className="card mt-4 bg-indigo-50/50 border border-indigo-200 animate-slide-up">
            <h3 className="text-indigo-900 text-sm font-bold mb-1">⚽ 모둠 전략 작전 설계소</h3>
            <p className="text-xs text-indigo-700 mb-4">모둠원들의 이름을 입력하고 각자의 강점 체력을 매칭해 보세요.</p>
            
            <div className="space-y-3 mb-4">
              {groupMembers.map((member, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    value={member.name}
                    onChange={(e) => handleGroupMemberChange(idx, 'name', e.target.value)}
                    className="form-control text-xs py-1" 
                    placeholder={idx === 0 ? '나' : `모둠원 ${idx + 1}`}
                  />
                  <select 
                    value={member.strength}
                    onChange={(e) => handleGroupMemberChange(idx, 'strength', e.target.value)}
                    className="form-control text-xs py-1"
                  >
                    <option value="순발력">순발력 (스피드)</option>
                    <option value="심폐지구력">심폐지구력 (지구력)</option>
                    <option value="유연성">유연성 (유연)</option>
                    <option value="근력">근력 (파워)</option>
                  </select>
                </div>
              ))}
            </div>

            <button onClick={handleCreateStrategy} className="btn btn-primary bg-indigo-600 py-2 text-xs">
              모둠 작전판 생성하기 📋
            </button>

            {showStrategyResult && (
              <div className="bg-white p-4 rounded-xl border border-indigo-200 mt-4 animate-slide-up">
                <p className="text-xs font-black text-indigo-950 mb-2">📋 모둠 배치 결과 작전판</p>
                <div className="space-y-1.5 text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-lg">
                  {groupMembers.map((m, i) => {
                    const name = m.name || `모둠원 ${i + 1}`;
                    let role = '중간 연결';
                    if (m.strength === '순발력') role = '⚡ 공격수 (속공 공격 담당)';
                    if (m.strength === '심폐지구력') role = '🫀 미드필더 (수비 조절 및 패스 연결)';
                    if (m.strength === '유연성') role = '🤸 경기 메이커 (수비 진형 전환)';
                    if (m.strength === '근력') role = '💪 최종 수비수 (강력한 가드 및 몸싸움)';
                    return (
                      <p key={i}>• <b>{name}</b> ({m.strength}) → {role}</p>
                    );
                  })}
                </div>
                <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-100 text-center mb-3">
                  <p className="text-xs text-indigo-900 font-bold">📢 모둠 작전 전략 진단</p>
                  <p className="text-[11px] text-indigo-700 font-semibold mt-0.5">"이 모둠은 빠른 공격과 튼튼한 패스 연결이 최적화된 [속공 공격형] 포메이션입니다!"</p>
                </div>

              </div>
            )}
          </div>
        )}
      </div>

      {/* 기존 스포츠 활동 추천 */}
      <h3 className="mt-6 mb-3 text-xs text-slate-500">이런 스포츠 활동도 추천해요!</h3>
      <div className="flex flex-col gap-3">
        {myType.sports.map((sport, idx) => (
          <div key={idx} className="card p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-base text-slate-800 font-black mb-0">{sport.name}</h4>
              <span className="badge bg-blue-100 text-blue-800 text-[10px]">{sport.role}</span>
            </div>
            <p className="text-xs text-slate-600 mb-1 bg-slate-50 p-2.5 rounded-lg font-medium leading-relaxed">
              💡 왜 나한테 맞냐면? {sport.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabSports;
