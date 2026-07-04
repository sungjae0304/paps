import React, { useState, useContext, useEffect } from 'react';
import { PapsContext } from '../context/PapsContext';
import { Activity, Calendar, Hash, Save, BarChart2, HelpCircle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const explanations = {
  cardio: "🫀 왕복오래달리기: 폐와 심장이 얼마나 오래 버티는지 보여줘!",
  flexibility: "🤸 앉아윗몸앞으로굽히기: 내 척추와 다리 근육이 얼마나 유연한지 보여줘!",
  strength: "💪 윗몸말아올리기: 배와 몸통 근육이 얼마나 튼튼하고 오래 견디는지 보여줘!",
  power: "⚡ 50m 달리기: 얼마나 순식간에 빠르게 달릴 수 있는지 보여줘!",
  cardioSub: "🫀 1분 줄넘기: 심폐지구력을 기르는 데 도움을 주는 보조 줄넘기 운동!"
};

const TabRecord = ({ onShowPrivacy, onShowTerms }) => {
  const { records, addRecord, setActiveStudent, classCode } = useContext(PapsContext);
  const [showToast, setShowToast] = useState(false);
  const [activeHelp, setActiveHelp] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [codeError, setCodeError] = useState('');

  const [formData, setFormData] = useState({
    schoolName: '서울고척초등학교',
    grade: '5',
    classNum: '1',
    studentNum: '1',
    date: new Date().toISOString().split('T')[0],
    round: '1',
    values: {
      cardio: '',
      flexibility: '',
      strength: '',
      power: '',
      cardioSub: ''
    }
  });

  useEffect(() => {
    setActiveStudent({
      schoolName: formData.schoolName,
      grade: formData.grade,
      classNum: formData.classNum,
      studentNum: formData.studentNum
    });
  }, [formData.schoolName, formData.grade, formData.classNum, formData.studentNum, setActiveStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.values) {
      setFormData({
        ...formData,
        values: {
          ...formData.values,
          [name]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (inputCode.trim() !== classCode) {
      setCodeError('승인 코드가 올바르지 않습니다. 선생님께 확인해 보세요!');
      return;
    }
    setCodeError('');
    setShowConfirmModal(true);
  };

  const handleSave = async () => {
    setShowConfirmModal(false);
    await addRecord(formData);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    
    // Reset values but keep student info
    setFormData({
      ...formData,
      round: Math.min(parseInt(formData.round) + 1, 3).toString(),
      values: {
        cardio: '',
        flexibility: '',
        strength: '',
        power: '',
        cardioSub: ''
      }
    });
    setInputCode('');
  };

  // 최근 기록과 즉시 비교하기
  const getDiffMsg = (type, currentValue) => {
    if (records.length === 0) return null;
    const prev = records[records.length - 1];
    const prevVal = parseFloat(prev.values[type]);
    const currVal = parseFloat(currentValue);
    if (isNaN(prevVal) || scarcityCheck(currentValue)) return null;

    const diff = currVal - prevVal;
    if (type === 'power') { // 달리기 등 초 단위 (낮을수록 좋음)
      if (diff < 0) return `지난번보다 ${Math.abs(diff).toFixed(1)}초 더 빨라졌어! 🏃⚡`;
      if (diff > 0) return `지난번보다 ${diff.toFixed(1)}초 느려졌지만 실망하지 마! 💪`;
    } else {
      if (diff > 0) return `지난번보다 +${diff} 늘었어! 완전 멋져 🎉`;
      if (diff < 0) return `지난번보다 ${diff} 줄었지만 꾸준히 하면 늘 거야! 💪`;
    }
    return "지난번과 똑같이 훌륭한 기록이야! 👍";
  };

  const scarcityCheck = (val) => {
    return val === undefined || val === null || val === '';
  };

  // 차트 데이터 가공
  const chartData = records.map(r => ({
    name: `${r.round}차`,
    심폐지구력: r.values.cardio,
    유연성: r.values.flexibility,
    근력: r.values.strength
  }));

  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="level-3-text" />
        <h2>내 체력 기록</h2>
      </div>

      {/* 내 몸을 숫자로 만나는 시간 인트로 배너 */}
      <div className="card bg-gradient-to-r from-blue-600 to-indigo-700 border-none p-5 mb-4" style={{ background: 'linear-gradient(to right, #2563eb, #4338ca)' }}>
        <h3 style={{ color: 'white', fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.25rem' }}>🔍 내 몸을 숫자로 만나는 시간</h3>
        <p style={{ color: '#bfdbfe', fontSize: '0.75rem' }}>오늘 측정한 나의 진짜 체력 결과를 직접 입력해봐. 숫자가 나의 성장을 말해줄 거야!</p>
      </div>

      <div className="card">
        <form onSubmit={handleOpenConfirm}>
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', letterSpacing: '0.05em', marginBottom: '1rem', textTransform: 'uppercase' }}>🏫 학생 소속 정보</h4>
            
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ color: '#1e293b', fontWeight: 700 }}>학교명</label>
              <input type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} className="form-control" placeholder="학교명을 입력하세요" required />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="form-group mb-0">
                <label className="form-label" style={{ color: '#1e293b', fontWeight: 700 }}>학년</label>
                <select name="grade" value={formData.grade} onChange={handleChange} className="form-control" required>
                  <option value="5">5학년</option>
                  <option value="6">6학년</option>
                </select>
              </div>
              <div className="form-group mb-0">
                <label className="form-label" style={{ color: '#1e293b', fontWeight: 700 }}>반</label>
                <select name="classNum" value={formData.classNum} onChange={handleChange} className="form-control" required>
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={i + 1}>{i + 1}반</option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-0">
                <label className="form-label" style={{ color: '#1e293b', fontWeight: 700 }}>번호</label>
                <input type="number" name="studentNum" value={formData.studentNum} onChange={handleChange} className="form-control" min="1" max="35" required />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="form-group mb-0">
              <label className="form-label flex items-center gap-1"><Calendar size={14}/> 날짜</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-control" required />
            </div>
            <div className="form-group mb-0">
              <label className="form-label flex items-center gap-1"><Hash size={14}/> 회차</label>
              <select name="round" value={formData.round} onChange={handleChange} className="form-control" required>
                <option value="1">1차</option>
                <option value="2">2차</option>
                <option value="3">3차</option>
              </select>
            </div>
            <div className="form-group mb-0">
              <label className="form-label flex items-center gap-1">🔐 승인 코드</label>
              <input 
                type="text" 
                value={inputCode} 
                onChange={(e) => setInputCode(e.target.value)} 
                className="form-control" 
                placeholder="2026" 
                required 
              />
            </div>
          </div>
          {codeError && (
            <p className="text-red-500 text-xs font-bold mb-4 animate-slide-up" style={{ marginTop: '-0.5rem' }}>
              ⚠️ {codeError}
            </p>
          )}

          <h3 className="mt-4 mb-2">PAPS 측정값 입력</h3>
          
          {[
            { key: 'cardio', label: '🫀 왕복오래달리기 (회)', placeholder: '예: 40' },
            { key: 'flexibility', label: '🤸 앉아윗몸앞으로굽히기 (cm)', placeholder: '예: 12.5', step: '0.1' },
            { key: 'strength', label: '💪 윗몸말아올리기 (회)', placeholder: '예: 30' },
            { key: 'power', label: '⚡ 50m 달리기 (초)', placeholder: '예: 9.5', step: '0.1' },
            { key: 'cardioSub', label: '🫀 1분 줄넘기 (회)', placeholder: '예: 100' }
          ].map(field => (
            <div key={field.key} className="form-group mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="form-label mb-0">{field.label}</label>
                <button 
                  type="button" 
                  onClick={() => setActiveHelp(activeHelp === field.key ? null : field.key)}
                  className="text-gray-400 hover:text-blue-500 bg-transparent border-none p-0 cursor-pointer flex items-center gap-0.5 text-xs"
                >
                  <HelpCircle size={14} /> 이게 뭐야?
                </button>
              </div>
              
              {activeHelp === field.key && (
                <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-900 mb-2 animate-slide-up">
                  {explanations[field.key]}
                </div>
              )}

              <input 
                type="number" 
                step={field.step || '1'} 
                name={field.key} 
                value={formData.values[field.key]} 
                onChange={handleChange} 
                className="form-control" 
                placeholder={field.placeholder} 
                required 
              />
              
              {/* 실시간 피드백 */}
              {formData.values[field.key] && (
                <p style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700, marginTop: '0.25rem' }}>
                  {getDiffMsg(field.key, formData.values[field.key])}
                </p>
              )}
            </div>
          ))}

          <button type="submit" className="btn btn-primary mt-4">
            <Save size={18} /> 기록 저장하기
          </button>
          
          <div className="flex justify-center gap-3 mt-4" style={{ fontSize: '11px' }}>
            <button type="button" onClick={onShowPrivacy} className="bg-transparent border-none text-slate-500 hover:text-slate-700 cursor-pointer underline font-bold" style={{ color: '#64748b' }}>개인정보처리방침</button>
            <span style={{ color: '#cbd5e1' }}>|</span>
            <button type="button" onClick={onShowTerms} className="bg-transparent border-none text-slate-500 hover:text-slate-700 cursor-pointer underline font-bold" style={{ color: '#64748b' }}>사용약관</button>
          </div>
        </form>
      </div>

      {showToast && (
        <div className="card level-2-bg text-center animate-slide-up" style={{ padding: '1rem', marginBottom: '1rem' }}>
          🎉 기록 완료! 탐험가야, 데이터가 쌓이고 있어!
        </div>
      )}

      {/* 요약 검토 모달 (저장 전 요약 확인) */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="card w-full max-w-sm animate-slide-up">
            <h3 className="mb-2 text-center text-slate-800">📋 내가 입력한 데이터 확인하기</h3>
            <p className="text-xs text-slate-500 text-center mb-4">이 데이터가 맞나요? 틀린 부분이 있다면 눌러서 고칠 수 있어!</p>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm space-y-2 mb-4">
              <p className="text-slate-700">🏫 <b>소속:</b> {formData.schoolName} {formData.grade}학년 {formData.classNum}반 {formData.studentNum}번</p>
              <p className="text-slate-700">📅 <b>회차:</b> {formData.round}차 측정</p>
              <hr className="my-2 border-slate-200"/>
              <p className="text-slate-700">🫀 왕복오래달리기: <b>{formData.values.cardio}회</b></p>
              <p className="text-slate-700">🤸 앉아윗몸앞으로굽히기: <b>{formData.values.flexibility}cm</b></p>
              <p className="text-slate-700">💪 윗몸말아올리기: <b>{formData.values.strength}회</b></p>
              <p className="text-slate-700">⚡ 50m 달리기: <b>{formData.values.power}초</b></p>
              <p className="text-slate-700">🫀 1분 줄넘기: <b>{formData.values.cardioSub}회</b></p>
            </div>



            <div className="flex gap-2">
              <button onClick={() => setShowConfirmModal(false)} className="btn btn-secondary flex-1">
                수정하기
              </button>
              <button onClick={handleSave} className="btn btn-primary flex-1">
                <CheckCircle size={16} /> 확인, 저장!
              </button>
            </div>
          </div>
        </div>
      )}

      {records.length > 0 && (
        <div className="card mt-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="level-3-text" />
            <h3 className="mb-0">누적 기록 타임라인</h3>
          </div>
          <p className="text-sm mb-4">최근 기록에 따른 나의 체력 변화를 확인해보세요.</p>
          
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="심폐지구력" fill="var(--level-3)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="유연성" fill="var(--level-2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="근력" fill="var(--level-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabRecord;
