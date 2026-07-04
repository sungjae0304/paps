import React, { createContext, useState, useEffect } from 'react';
import { saveRecordToFirebase, fetchRecordsFromFirebase } from '../services/firebase';

export const PapsContext = createContext();

// 5학년 남학생 기준 예시 등급표 (1등급 ~ 5등급)
// 실제 앱에서는 성별/학년별 기준표를 모두 가지고 있어야 함.
// 여기서는 입력값을 바탕으로 단순화된 모의 등급 계산기를 사용합니다.
const calculateGrade = (type, value) => {
  const v = parseFloat(value);
  if (isNaN(v)) return 5;

  switch (type) {
    case 'cardio': // 왕복오래달리기 (회)
      if (v >= 60) return 1;
      if (v >= 45) return 2;
      if (v >= 30) return 3;
      if (v >= 15) return 4;
      return 5;
    case 'flexibility': // 앉아윗몸앞으로굽히기 (cm)
      if (v >= 15) return 1;
      if (v >= 10) return 2;
      if (v >= 5) return 3;
      if (v >= 0) return 4;
      return 5;
    case 'strength': // 윗몸말아올리기 (회)
      if (v >= 40) return 1;
      if (v >= 30) return 2;
      if (v >= 20) return 3;
      if (v >= 10) return 4;
      return 5;
    case 'power': // 50m 달리기 (초, 낮을수록 좋음)
      if (v <= 8.5) return 1;
      if (v <= 9.5) return 2;
      if (v <= 10.5) return 3;
      if (v <= 11.5) return 4;
      return 5;
    case 'cardioSub': // 1분 줄넘기 (회)
      if (v >= 120) return 1;
      if (v >= 100) return 2;
      if (v >= 80) return 3;
      if (v >= 60) return 4;
      return 5;
    default:
      return 5;
  }
};

export const PapsProvider = ({ children }) => {
  const [activeStudent, setActiveStudent] = useState({
    schoolName: '서울고척초등학교',
    grade: '5',
    classNum: '1',
    studentNum: '1'
  });

  const [classCode, setClassCode] = useState('2026'); // 기본 코드

  // 모의 데이터 초기값 (사용자 요청에 따라 조금 채워둡니다)
  const [records, setRecords] = useState([
    {
      id: 1,
      grade: '5',
      classNum: '1',
      studentNum: '10',
      date: '2026-03-15',
      round: '1',
      values: {
        cardio: 35,
        flexibility: 8,
        strength: 25,
        power: 10.0,
        cardioSub: 90
      },
      grades: {
        cardio: 3,
        flexibility: 3,
        strength: 3,
        power: 3,
        cardioSub: 3
      }
    }
  ]);

  useEffect(() => {
    const loadData = async () => {
      const fbRecords = await fetchRecordsFromFirebase();
      if (fbRecords.length > 0) {
        const updated = fbRecords.map(r => {
          const grades = {
            cardio: calculateGrade('cardio', r.values.cardio),
            flexibility: calculateGrade('flexibility', r.values.flexibility),
            strength: calculateGrade('strength', r.values.strength),
            power: calculateGrade('power', r.values.power),
            cardioSub: calculateGrade('cardioSub', r.values.cardioSub),
          };
          return { ...r, grades };
        });
        setRecords(updated);
      }
    };
    loadData();
  }, []);

  const addRecord = async (newRecord) => {
    const grades = {
      cardio: calculateGrade('cardio', newRecord.values.cardio),
      flexibility: calculateGrade('flexibility', newRecord.values.flexibility),
      strength: calculateGrade('strength', newRecord.values.strength),
      power: calculateGrade('power', newRecord.values.power),
      cardioSub: calculateGrade('cardioSub', newRecord.values.cardioSub),
    };

    const finalRecord = { ...newRecord, grades, id: Date.now() };

    // Firebase 연동 (Mock)
    await saveRecordToFirebase(finalRecord);

    setRecords([...records, finalRecord]);
  };

  const getStudentRecords = () => {
    return records.filter(r => 
      r.grade === activeStudent.grade && 
      r.classNum === activeStudent.classNum && 
      r.studentNum === activeStudent.studentNum
    );
  };

  const getLatestRecord = () => {
    const studentRecords = getStudentRecords();
    if (studentRecords.length === 0) return null;
    return studentRecords[studentRecords.length - 1];
  };

  return (
    <PapsContext.Provider value={{ 
      records: getStudentRecords(), 
      allRecords: records, 
      activeStudent, 
      setActiveStudent, 
      classCode,
      setClassCode,
      addRecord, 
      getLatestRecord, 
      calculateGrade 
    }}>
      {children}
    </PapsContext.Provider>
  );
};
