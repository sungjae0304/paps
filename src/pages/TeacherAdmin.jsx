import React, { useState, useContext } from 'react';
import { PapsContext } from '../context/PapsContext';
import { Lock, FileText, Download, ShieldCheck, ChevronLeft } from 'lucide-react';

const TeacherAdmin = ({ onClose }) => {
  const { records } = useContext(PapsContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '0000') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('비밀번호가 일치하지 않습니다.');
    }
  };

  const exportCSV = () => {
    const headers = ['학년', '반', '번호', '날짜', '회차', '왕복오래달리기', '유연성', '근력', '순발력', '줄넘기'];
    const rows = records.map(r => [
      r.grade, r.classNum, r.studentNum, r.date, r.round,
      r.values.cardio, r.values.flexibility, r.values.strength, r.values.power, r.values.cardioSub
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
            <h3 className="flex items-center gap-2"><Lock size={18} /> 교사 인증</h3>
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
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto">
      <div className="header flex justify-between items-center px-4" style={{ position: 'sticky', top: 0 }}>
        <button onClick={onClose} className="text-white flex items-center gap-1">
          <ChevronLeft size={20} /> 돌아가기
        </button>
        <div className="flex items-center gap-2 text-white font-bold">
          <ShieldCheck /> 관리자 모드
        </div>
        <div style={{ width: 80 }}></div>
      </div>

      <div className="p-4 max-w-2xl mx-auto animate-slide-up">
        <div className="card">
          <h3 className="mb-4">학급 전체 PAPS 데이터 현황</h3>
          
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-3 py-2">식별 (학년-반-번호)</th>
                  <th className="px-3 py-2">회차</th>
                  <th className="px-3 py-2">오래달리기</th>
                  <th className="px-3 py-2">유연성</th>
                  <th className="px-3 py-2">근력</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-4 text-gray-500">데이터가 없습니다.</td></tr>
                ) : (
                  records.map(r => (
                    <tr key={r.id} className="bg-white border-b">
                      <td className="px-3 py-2 font-medium">{r.grade}-{r.classNum}-{r.studentNum}</td>
                      <td className="px-3 py-2">{r.round}차</td>
                      <td className="px-3 py-2">{r.values.cardio} ({r.grades.cardio}등급)</td>
                      <td className="px-3 py-2">{r.values.flexibility} ({r.grades.flexibility}등급)</td>
                      <td className="px-3 py-2">{r.values.strength} ({r.grades.strength}등급)</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2">
            <button onClick={exportCSV} className="btn btn-secondary flex-1">
              <Download size={16} /> CSV 내보내기
            </button>
            <button className="btn btn-primary flex-1 bg-green-600 border-green-600 hover:bg-green-700 hover:border-green-700">
              <FileText size={16} /> 보고서 생성 (PDF)
            </button>
          </div>
        </div>
        
        <div className="card mt-4">
          <h3 className="mb-2">연구 데이터 요약</h3>
          <p className="text-sm text-gray-600 mb-4">입력된 데이터를 바탕으로 반 전체의 사전·사후 비교 통계를 확인합니다.</p>
          <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
            데이터가 충분히 누적되면 여기에 통계 그래프가 표시됩니다.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAdmin;
