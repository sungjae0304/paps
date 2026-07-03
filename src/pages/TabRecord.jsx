import React, { useState, useContext } from 'react';
import { PapsContext } from '../context/PapsContext';
import { Activity, Calendar, Hash, Save, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TabRecord = () => {
  const { records, addRecord } = useContext(PapsContext);
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    addRecord(formData);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    
    // Reset values but keep student info
    setFormData({
      ...formData,
      round: (parseInt(formData.round) + 1).toString(),
      values: {
        cardio: '',
        flexibility: '',
        strength: '',
        power: '',
        cardioSub: ''
      }
    });
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

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="form-group mb-0">
              <label className="form-label">학년</label>
              <select name="grade" value={formData.grade} onChange={handleChange} className="form-control" required>
                <option value="5">5학년</option>
                <option value="6">6학년</option>
              </select>
            </div>
            <div className="form-group mb-0">
              <label className="form-label">반</label>
              <select name="classNum" value={formData.classNum} onChange={handleChange} className="form-control" required>
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1}반</option>
                ))}
              </select>
            </div>
            <div className="form-group mb-0">
              <label className="form-label">번호</label>
              <input type="number" name="studentNum" value={formData.studentNum} onChange={handleChange} className="form-control" min="1" max="35" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
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
          </div>

          <h3 className="mt-4 mb-2">PAPS 측정값 입력</h3>
          <div className="form-group">
            <label className="form-label">🫀 왕복오래달리기 (회)</label>
            <input type="number" name="cardio" value={formData.values.cardio} onChange={handleChange} className="form-control" placeholder="예: 40" required />
          </div>
          <div className="form-group">
            <label className="form-label">🤸 앉아윗몸앞으로굽히기 (cm)</label>
            <input type="number" step="0.1" name="flexibility" value={formData.values.flexibility} onChange={handleChange} className="form-control" placeholder="예: 12.5" required />
          </div>
          <div className="form-group">
            <label className="form-label">💪 윗몸말아올리기 (회)</label>
            <input type="number" name="strength" value={formData.values.strength} onChange={handleChange} className="form-control" placeholder="예: 30" required />
          </div>
          <div className="form-group">
            <label className="form-label">⚡ 50m 달리기 (초)</label>
            <input type="number" step="0.1" name="power" value={formData.values.power} onChange={handleChange} className="form-control" placeholder="예: 9.5" required />
          </div>
          <div className="form-group">
            <label className="form-label">🫀 1분 줄넘기 (회)</label>
            <input type="number" name="cardioSub" value={formData.values.cardioSub} onChange={handleChange} className="form-control" placeholder="예: 100" required />
          </div>

          <button type="submit" className="btn btn-primary mt-4">
            <Save size={18} /> 기록 저장하기
          </button>
        </form>
      </div>

      {showToast && (
        <div className="card level-2-bg text-center animate-slide-up" style={{ padding: '1rem', marginBottom: '1rem' }}>
          🎉 기록 완료! 탐험가야, 데이터가 쌓이고 있어!
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
