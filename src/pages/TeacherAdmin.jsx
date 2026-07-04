import React, { useState, useContext } from 'react';
import { PapsContext } from '../context/PapsContext';
import { Lock, Download, ShieldCheck, ChevronLeft, Send, Star, BarChart3, MessageSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockStudentInquiries = [
  { id: 1, studentId: '5-2-03', type: '생활습관형', question: '핸드폰 사용량을 줄이면 나의 50m 달리기 기록이 빨라질까?', date: '2026-07-01', pinned: false, comments: [] },
  { id: 2, studentId: '5-2-12', type: '데이터원인형', question: '왜 나는 유연성은 높은데 윗몸말아올리기는 4등급일까?', date: '2026-07-02', pinned: true, comments: ['멋진 발견이야! 두 운동에 사용되는 근육의 차이를 조사해봐!'] },
  { id: 3, studentId: '5-2-17', type: '비교탐구형', question: '계단으로 걸어 등교하는 것이 심폐지구력 향상에 더 도움될까?', date: '2026-07-03', pinned: false, comments: [] }
];

// F.I.T 신체활동역량 종합 성장 데이터 (체력 + 탐구 + 실천 복합 지수)
const mockFitGrowthData = [
  { name: '3월 (사전)', 체력지수: 60, 탐구지수: 30, 실천지수: 40 },
  { name: '5월 (중간)', 체력지수: 72, 탐구지수: 65, 실천지수: 68 },
  { name: '7월 (사후)', 체력지수: 85, 탐구지수: 90, 실천지수: 88 }
];

const TeacherAdmin = ({ onClose }) => {
  const { allRecords: records, classCode, setClassCode, selectedMethods, setSelectedMethods } = useContext(PapsContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [inquiries, setInquiries] = useState(mockStudentInquiries);
  const [commentInputs, setCommentInputs] = useState({});

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '0000') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleAddComment = (inquiryId) => {
    const text = commentInputs[inquiryId];
    if (!text || !text.trim()) return;

    setInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        return { ...inq, comments: [...inq.comments, text] };
      }
      return inq;
    }));

    setCommentInputs(prev => ({ ...prev, [inquiryId]: '' }));
    alert('학생 화면으로 피드백 코멘트가 전송되었습니다! 📝');
  };

  const handleTogglePin = (inquiryId) => {
    setInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        return { ...inq, pinned: !inq.pinned };
      }
      return inq;
    }));
  };



  const getMethodLabel = (domain, value) => {
    const labels = {
      shuttleRun: '왕복오래달리기',
      runWalk: '오래달리기-걷기',
      stepTest: '스텝검사',
      sitReach: '앉아윗몸굽히기',
      totalFlex: '종합유연성',
      curlUp: '윗몸말아올리기',
      grip: '악력',
      pushUp: '팔굽혀펴기',
      run50: '50m달리기',
      standingJump: '제자리멀리뛰기',
      jumpRope: '1분줄넘기'
    };
    return labels[value] || value || '';
  };

  const exportCSV = () => {
    const headers = ['학년', '반', '번호', '성별', '날짜', '회차', '심폐지구력 방식', '심폐지구력 기록', '유연성 방식', '유연성 기록', '근력 방식', '근력 기록', '순발력 방식', '순발력 기록', '줄넘기 기록'];
    const rows = records.map(r => [
      r.grade, r.classNum, r.studentNum, r.gender === 'male' ? '남' : '여', r.date, r.round,
      getMethodLabel('cardio', r.methods?.cardio), r.values.cardio,
      getMethodLabel('flexibility', r.methods?.flexibility), r.values.flexibility,
      getMethodLabel('strength', r.methods?.strength), r.values.strength,
      getMethodLabel('power', r.methods?.power), r.values.power,
      r.values.cardioSub
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "paps_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="card w-full max-w-sm animate-slide-up">
          <div className="flex justify-between items-center mb-4">
            <h3 className="flex items-center gap-2 text-slate-800"><Lock size={18} /> 교사 인증</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">관리자 비밀번호 (기본값: 0000)</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="form-control" 
                placeholder="비밀번호 4자리"
                maxLength={4}
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
            <button type="submit" className="btn btn-primary mt-2">확인</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-50 z-50 overflow-y-auto">
      <div className="header flex justify-between items-center px-4" style={{ position: 'sticky', top: 0 }}>
        <button onClick={onClose} className="text-white flex items-center gap-1 bg-transparent border-none cursor-pointer">
          <ChevronLeft size={20} /> 돌아가기
        </button>
        <div className="flex items-center gap-2 text-white font-bold">
          <ShieldCheck /> 교사용 탐구 지원 시스템
        </div>
        <div style={{ width: 80 }}></div>
      </div>

      <div className="p-4 max-w-2xl mx-auto animate-slide-up space-y-4 pb-12 text-slate-800">
        
        {/* 🔐 학생 기록 저장 승인 코드 설정 */}
        <div className="card">
          <h3 className="mb-2 text-slate-800 flex items-center gap-1.5">🔐 학생 기록 저장 승인 코드 설정</h3>
          <p className="text-xs text-slate-500 mb-4">학생들이 체력 데이터를 저장할 때 본인 확인/승인을 위해 입력해야 하는 보안 코드입니다.</p>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={classCode} 
              onChange={(e) => setClassCode(e.target.value)} 
              className="form-control" 
              placeholder="예: 2026"
              style={{ maxWidth: '200px' }}
            />
          </div>
        </div>

        {/* ⚙️ 우리 학교 측정 종목 설정 */}
        <div className="card">
          <h3 className="mb-2 text-slate-800 flex items-center gap-1.5">🏫 우리 학교 측정 종목 설정</h3>
          <p className="text-xs text-slate-500 mb-4">학교별 PAPS 평가 계획에 맞게 영역별 측정 종목을 지정하세요. 학생 화면에 반영됩니다.</p>
          
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">🫀 심폐지구력 영역</label>
              <select
                value={selectedMethods.cardio}
                onChange={(e) => setSelectedMethods({ ...selectedMethods, cardio: e.target.value })}
                className="form-control text-xs py-1"
              >
                <option value="shuttleRun">왕복오래달리기 (회)</option>
                <option value="runWalk">오래달리기-걷기 (초)</option>
                <option value="stepTest">스텝검사 (PEI)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">🤸 유연성 영역</label>
              <select
                value={selectedMethods.flexibility}
                onChange={(e) => setSelectedMethods({ ...selectedMethods, flexibility: e.target.value })}
                className="form-control text-xs py-1"
              >
                <option value="sitReach">앉아윗몸앞으로굽히기 (cm)</option>
                <option value="totalFlex">종합유연성 (점수)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">💪 근력·근지구력 영역</label>
              <select
                value={selectedMethods.strength}
                onChange={(e) => setSelectedMethods({ ...selectedMethods, strength: e.target.value })}
                className="form-control text-xs py-1"
              >
                <option value="curlUp">윗몸말아올리기 (회)</option>
                <option value="grip">악력 (kg)</option>
                <option value="pushUp">팔굽혀펴기 (회)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">⚡ 순발력 영역</label>
              <select
                value={selectedMethods.power}
                onChange={(e) => setSelectedMethods({ ...selectedMethods, power: e.target.value })}
                className="form-control text-xs py-1"
              >
                <option value="run50">50m 달리기 (초)</option>
                <option value="standingJump">제자리멀리뛰기 (cm)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-slate-700 block mb-1">🫀 보조평가 / 체지방 영역</label>
              <select
                value={selectedMethods.cardioSub}
                onChange={(e) => setSelectedMethods({ ...selectedMethods, cardioSub: e.target.value })}
                className="form-control text-xs py-1"
              >
                <option value="jumpRope">1분 줄넘기 (회)</option>
                <option value="bmi">체질량지수 (BMI)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 1. 신체활동역량 종합 성장 그래프 */}
        <div className="card">
          <h3 className="mb-2 text-slate-800 flex items-center gap-1.5"><BarChart3 size={18} className="text-indigo-600"/> 종합 F.I.T 신체활동역량 성장 분석</h3>
          <p className="text-xs text-slate-500 mb-4">단순 체력 등급뿐만 아니라, 스스로 문제를 묻고 실천하는 종합 지수를 추적합니다.</p>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={mockFitGrowthData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" fontSize={11} tick={{ fill: '#334155' }} />
                <YAxis fontSize={11} tick={{ fill: '#334155' }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="체력지수" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="탐구지수" stroke="#a855f7" strokeWidth={2} />
                <Line type="monotone" dataKey="실천지수" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. 학생 탐구 질문 현황판 & 교과 피드백 */}
        <div className="card">
          <h3 className="mb-2 text-slate-800 flex items-center gap-1.5"><MessageSquare size={18} className="text-purple-600"/> 학생 탐구 질문 및 성찰 관리</h3>
          <p className="text-xs text-slate-500 mb-4">학생들이 데이터를 보고 스스로 생성한 질문 목록입니다. 피드백을 제공해 보세요.</p>
          
          <div className="space-y-3">
            {inquiries.map((inq) => (
              <div key={inq.id} className="p-3.5 bg-slate-100 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500">학번: {inq.studentId} | {inq.type}</span>
                  <button 
                    onClick={() => handleTogglePin(inq.id)} 
                    className="bg-transparent border-none p-0 cursor-pointer text-slate-400 hover:text-amber-500"
                  >
                    <Star size={16} fill={inq.pinned ? "var(--level-1)" : "none"} className={inq.pinned ? "text-amber-500" : "text-slate-400"} />
                  </button>
                </div>
                
                <p className="text-xs font-black text-slate-800 mb-2">❓ "{inq.question}"</p>
                
                {inq.comments.length > 0 && (
                  <div className="bg-white p-2 rounded border border-slate-200 mb-3">
                    <p className="text-[10px] text-indigo-700 font-bold">📝 나의 피드백:</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{inq.comments.join(', ')}</p>
                  </div>
                )}

                <div className="flex gap-1.5 mt-2">
                  <input 
                    type="text" 
                    value={commentInputs[inq.id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [inq.id]: e.target.value })}
                    className="form-control text-[11px] flex-1 py-1" 
                    placeholder="조언이나 격려 코멘트를 작성해보세요..."
                  />
                  <button 
                    onClick={() => handleAddComment(inq.id)}
                    className="btn py-1 px-3 text-xs w-auto bg-purple-600 text-white flex items-center justify-center gap-1"
                  >
                    <Send size={10} /> 전송
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 학급 전체 데이터 목록 & 수업 피드백 미션 전송 */}
        <div className="card">
          <h3 className="mb-2 text-slate-800">학급 전체 PAPS 데이터 현황</h3>
          <p className="text-xs text-slate-500 mb-4">학생들의 체력 측정 현황입니다.</p>
          
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-xs text-left" style={{ minWidth: '700px' }}>
              <thead className="text-[10px] text-slate-700 uppercase bg-slate-100">
                <tr>
                  <th className="px-2 py-2">학번</th>
                  <th className="px-2 py-2">성별</th>
                  <th className="px-2 py-2">회차</th>
                  <th className="px-2 py-2">심폐지구력</th>
                  <th className="px-2 py-2">유연성</th>
                  <th className="px-2 py-2">근력</th>
                  <th className="px-2 py-2">순발력</th>
                  <th className="px-2 py-2">줄넘기</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr><td colSpan="8" className="text-center py-4 text-slate-500">데이터가 없습니다.</td></tr>
                ) : (
                  records.map(r => (
                    <tr key={r.id} className="bg-white border-b text-slate-700">
                      <td className="px-2 py-2 font-medium text-slate-900">{r.grade}-{r.classNum}-{r.studentNum}</td>
                      <td className="px-2 py-2">{r.gender === 'male' ? '남' : '여'}</td>
                      <td className="px-2 py-2">{r.round}차</td>
                      <td className="px-2 py-2">{r.values.cardio} ({getMethodLabel('cardio', r.methods?.cardio)})</td>
                      <td className="px-2 py-2">{r.values.flexibility} ({getMethodLabel('flexibility', r.methods?.flexibility)})</td>
                      <td className="px-2 py-2">{r.values.strength} ({getMethodLabel('strength', r.methods?.strength)})</td>
                      <td className="px-2 py-2">{r.values.power} ({getMethodLabel('power', r.methods?.power)})</td>
                      <td className="px-2 py-2">{r.values.cardioSub}회</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2">
            <button onClick={exportCSV} className="btn btn-secondary flex-1">
              <Download size={14} /> CSV 내보내기
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeacherAdmin;
