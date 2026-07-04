import React, { useState, useContext } from 'react';
import { PapsContext } from '../context/PapsContext';
import { Compass, GraduationCap, User, KeyRound } from 'lucide-react';

const StudentLogin = () => {
  const { setActiveStudent, classCode } = useContext(PapsContext);
  const [formData, setFormData] = useState({
    schoolName: '서울고척초등학교',
    grade: '초5',
    classNum: '1',
    studentNum: '1',
    gender: 'male'
  });
  const [inputCode, setInputCode] = useState('');
  const [codeError, setCodeError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputCode.trim() !== classCode) {
      setCodeError('승인 코드가 올바르지 않습니다. 선생님께 확인해 보세요!');
      return;
    }
    setCodeError('');
    setActiveStudent({
      schoolName: formData.schoolName,
      grade: formData.grade,
      classNum: formData.classNum,
      studentNum: formData.studentNum,
      gender: formData.gender
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 animate-slide-up">
      <div className="card w-full max-w-md shadow-2xl border border-slate-100 bg-white p-6 rounded-3xl">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-blue-50 rounded-2xl text-blue-600 mb-3">
            <Compass className="animate-spin-slow" size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-1" style={{ color: '#1e293b', textShadow: 'none' }}>체력 탐험대 로그인</h2>
          <p className="text-xs text-slate-500" style={{ color: '#64748b' }}>나의 소속 정보를 입력하고 탐험을 시작해요!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group text-left">
            <label className="form-label font-bold text-slate-700 text-xs flex items-center gap-1.5 mb-1" style={{ color: '#475569' }}>
              <GraduationCap size={16} className="text-blue-500" /> 학교명
            </label>
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              className="form-control text-sm"
              placeholder="학교명을 입력하세요"
              required
            />
          </div>

          <div className="form-group text-left">
            <label className="form-label font-bold text-slate-700 text-xs flex items-center gap-1.5 mb-1" style={{ color: '#475569' }}>
              <User size={16} className="text-blue-500" /> 성별
            </label>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 text-sm font-bold">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                  className="w-4 h-4 accent-blue-600"
                />
                남학생
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 text-sm font-bold">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                  className="w-4 h-4 accent-pink-600"
                />
                여학생
              </label>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="form-group text-left">
              <label className="form-label font-bold text-slate-700 text-xs block mb-1" style={{ color: '#475569' }}>학년</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="form-control text-sm"
                required
              >
                <option value="초4">초 4학년</option>
                <option value="초5">초 5학년</option>
                <option value="초6">초 6학년</option>
                <option value="중1">중 1학년</option>
                <option value="중2">중 2학년</option>
                <option value="중3">중 3학년</option>
                <option value="고1">고 1학년</option>
                <option value="고2">고 2학년</option>
                <option value="고3">고 3학년</option>
              </select>
            </div>

            <div className="form-group text-left">
              <label className="form-label font-bold text-slate-700 text-xs block mb-1" style={{ color: '#475569' }}>반</label>
              <select
                name="classNum"
                value={formData.classNum}
                onChange={handleChange}
                className="form-control text-sm"
                required
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1}반</option>
                ))}
              </select>
            </div>

            <div className="form-group text-left">
              <label className="form-label font-bold text-slate-700 text-xs block mb-1" style={{ color: '#475569' }}>번호</label>
              <input
                type="number"
                name="studentNum"
                value={formData.studentNum}
                onChange={handleChange}
                className="form-control text-sm"
                min="1"
                max="35"
                required
              />
            </div>
          </div>

          <div className="form-group text-left">
            <label className="form-label font-bold text-slate-700 text-xs flex items-center gap-1.5 mb-1" style={{ color: '#475569' }}>
              <KeyRound size={16} className="text-blue-500" /> 🔐 승인 코드
            </label>
            <input
              type="password"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="form-control text-sm"
              placeholder="선생님이 알려주신 승인 코드 입력"
              required
            />
            {codeError && (
              <p className="text-red-500 text-xs font-bold mt-1.5 animate-slide-up">
                ⚠️ {codeError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-6 w-full py-3.5 text-base rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
          >
            체력 탐험 공간 입장하기 🚀
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
