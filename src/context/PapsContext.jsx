import React, { createContext, useState, useEffect } from 'react';
import { saveRecordToFirebase, fetchRecordsFromFirebase } from '../services/firebase';

export const PapsContext = createContext();

// 학년별, 성별별, 측정 방식별 교육부 공식 등급 계산기 (1등급 ~ 5등급 및 BMI 판정)
const calculateGrade = (type, value, method = '', gender = 'male', grade = '5') => {
  const v = parseFloat(value);
  if (isNaN(v)) return '-';

  const isMale = gender === 'male';
  
  // normalize grade string ('4', '5', '6', 'm1', 'm2', 'm3', 'h1', 'h2', 'h3') or ('초4', '중1', etc.)
  let gKey = grade.toString().replace(/초|중|고/g, '');
  if (gKey === '4') gKey = '초4';
  else if (gKey === '5') gKey = '초5';
  else if (gKey === '6') gKey = '초6';
  else if (gKey === '7' || gKey === '중1' || gKey === 'm1') gKey = '중1';
  else if (gKey === '8' || gKey === '중2' || gKey === 'm2') gKey = '중2';
  else if (gKey === '9' || gKey === '중3' || gKey === 'm3') gKey = '중3';
  else if (gKey === '10' || gKey === '고1' || gKey === 'h1') gKey = '고1';
  else if (gKey === '11' || gKey === '고2' || gKey === 'h2') gKey = '고2';
  else if (gKey === '12' || gKey === '고3' || gKey === 'h3') gKey = '고3';
  else {
    // default/fallback mapping
    if (gKey.includes('중') || ['7','8','9','m1','m2','m3'].includes(gKey)) gKey = '중1';
    else if (gKey.includes('고') || ['10','11','12','h1','h2','h3'].includes(gKey)) gKey = '고1';
    else gKey = '초5';
  }

  // 1. 심폐지구력 (cardio)
  if (type === 'cardio') {
    const activeMethod = method || 'shuttleRun';
    if (activeMethod === 'shuttleRun') { // 왕복오래달리기 (회, 높을수록 좋음)
      const thresholds = {
        male: {
          '초4': [96, 69, 45, 26],
          '초5': [100, 73, 50, 29],
          '초6': [104, 78, 54, 32],
          '중1': [64, 50, 36, 20],
          '중2': [66, 52, 38, 22],
          '중3': [68, 54, 40, 24],
          '고1': [70, 56, 42, 26],
          '고2': [72, 58, 44, 28],
          '고3': [74, 60, 46, 30]
        },
        female: {
          '초4': [77, 57, 40, 21],
          '초5': [85, 63, 45, 23],
          '초6': [93, 69, 50, 25],
          '중1': [35, 25, 19, 14],
          '중2': [40, 29, 21, 15],
          '중3': [45, 33, 23, 16],
          '고1': [50, 37, 25, 17],
          '고2': [55, 41, 27, 18],
          '고3': [55, 41, 27, 18]
        }
      };
      const arr = thresholds[isMale ? 'male' : 'female'][gKey] || thresholds[isMale ? 'male' : 'female']['초5'];
      if (v >= arr[0]) return 1;
      if (v >= arr[1]) return 2;
      if (v >= arr[2]) return 3;
      if (v >= arr[3]) return 4;
      return 5;
    } else if (activeMethod === 'runWalk') { // 오래달리기-걷기 (초, 낮을수록 좋음)
      const thresholds = {
        male: {
          '초4': [281, 324, 409, 479], // 초4는 초5 기준 준용
          '초5': [281, 324, 409, 479],
          '초6': [250, 314, 379, 449],
          '중1': [425, 502, 599, 699],
          '중2': [416, 487, 583, 679],
          '중3': [407, 472, 567, 659],
          '고1': [398, 457, 551, 639],
          '고2': [389, 442, 535, 619],
          '고3': [380, 427, 519, 599]
        },
        female: {
          '초4': [299, 359, 441, 501], // 초4는 초5 기준 준용
          '초5': [299, 359, 441, 501],
          '초6': [299, 353, 429, 479],
          '중1': [379, 442, 517, 608],
          '중2': [379, 442, 517, 608],
          '중3': [379, 442, 517, 608],
          '고1': [379, 442, 517, 608],
          '고2': [379, 442, 517, 608],
          '고3': [379, 442, 517, 608]
        }
      };
      const arr = thresholds[isMale ? 'male' : 'female'][gKey] || thresholds[isMale ? 'male' : 'female']['초5'];
      if (v <= arr[0]) return 1;
      if (v <= arr[1]) return 2;
      if (v <= arr[2]) return 3;
      if (v <= arr[3]) return 4;
      return 5;
    } else if (activeMethod === 'stepTest') { // 스텝검사 (PEI 점수, 높을수록 좋음)
      if (v >= 76.0) return 1;
      if (v >= 62.0) return 2;
      if (v >= 52.0) return 3;
      if (v >= 47.0) return 4;
      return 5;
    }
  }

  // 2. 유연성 (flexibility)
  if (type === 'flexibility') {
    const activeMethod = method || 'sitReach';
    if (activeMethod === 'sitReach') { // 앉아윗몸앞으로굽히기 (cm, 높을수록 좋음)
      const thresholds = {
        male: {
          '초4': [8.0, 5.0, 1.0, -4.0], // 초4는 초5 기준 준용
          '초5': [8.0, 5.0, 1.0, -4.0],
          '초6': [8.0, 5.0, 1.0, -4.0],
          '중1': [10.0, 6.0, 2.0, -4.0],
          '중2': [10.0, 7.0, 2.0, -4.0],
          '중3': [10.0, 7.0, 2.6, -3.0],
          '고1': [13.0, 9.0, 4.0, -2.0],
          '고2': [16.0, 11.0, 5.0, 0.1],
          '고3': [16.0, 11.0, 6.0, 0.1]
        },
        female: {
          '초4': [10.0, 7.0, 5.0, 1.0], // 초4는 초5 기준 준용
          '초5': [10.0, 7.0, 5.0, 1.0],
          '초6': [14.0, 10.0, 5.0, 2.0],
          '중1': [15.0, 11.0, 8.0, 2.0],
          '중2': [15.0, 11.0, 8.0, 2.0],
          '중3': [16.0, 11.0, 8.0, 2.0],
          '고1': [16.0, 11.0, 8.0, 2.0],
          '고2': [17.0, 12.0, 9.0, 5.0],
          '고3': [17.0, 12.0, 9.0, 5.0]
        }
      };
      const arr = thresholds[isMale ? 'male' : 'female'][gKey] || thresholds[isMale ? 'male' : 'female']['초5'];
      if (v >= arr[0]) return 1;
      if (v >= arr[1]) return 2;
      if (v >= arr[2]) return 3;
      if (v >= arr[3]) return 4;
      return 5;
    } else if (activeMethod === 'totalFlex') { // 종합유연성 (점수, 높을수록 좋음)
      if (v >= 8) return 1;
      if (v >= 7) return 2;
      if (v >= 6) return 3;
      if (v >= 5) return 4;
      return 5;
    }
  }

  // 3. 근력·근지구력 (strength)
  if (type === 'strength') {
    const activeMethod = method || 'curlUp';
    if (activeMethod === 'curlUp') { // 윗몸말아올리기 (회, 높을수록 좋음)
      const thresholds = {
        male: {
          '초4': [80, 40, 22, 7],
          '초5': [80, 40, 22, 7],
          '초6': [80, 40, 22, 7],
          '중1': [90, 55, 33, 14],
          '중2': [90, 55, 33, 14],
          '중3': [90, 55, 33, 14],
          '고1': [90, 60, 35, 15],
          '고2': [90, 60, 35, 17],
          '고3': [90, 60, 35, 17]
        },
        female: {
          '초4': [60, 29, 18, 6],
          '초5': [60, 36, 23, 7],
          '초6': [60, 43, 23, 7],
          '중1': [58, 43, 22, 7],
          '중2': [58, 39, 19, 7],
          '중3': [52, 34, 17, 6],
          '고1': [40, 30, 13, 4],
          '고2': [40, 30, 13, 4],
          '고3': [40, 30, 13, 4]
        }
      };
      const arr = thresholds[isMale ? 'male' : 'female'][gKey] || thresholds[isMale ? 'male' : 'female']['초5'];
      if (v >= arr[0]) return 1;
      if (v >= arr[1]) return 2;
      if (v >= arr[2]) return 3;
      if (v >= arr[3]) return 4;
      return 5;
    } else if (activeMethod === 'grip') { // 악력 (kg, 높을수록 좋음)
      const thresholds = {
        male: {
          '초4': [31.0, 18.5, 15.0, 11.5],
          '초5': [31.0, 23.0, 17.0, 12.5],
          '초6': [35.0, 26.5, 19.0, 15.0],
          '중1': [42.0, 30.0, 22.5, 16.5],
          '중2': [44.5, 37.0, 28.5, 22.0],
          '중3': [48.5, 40.5, 33.0, 25.0],
          '고1': [61.0, 42.5, 35.5, 29.0],
          '고2': [61.0, 46.0, 39.0, 31.0],
          '고3': [63.5, 46.0, 39.0, 31.0]
        },
        female: {
          '초4': [29.0, 18.0, 13.5, 10.5],
          '초5': [29.0, 19.0, 15.5, 12.0],
          '초6': [33.0, 22.0, 19.0, 14.0],
          '중1': [36.0, 23.0, 19.0, 14.0],
          '중2': [36.0, 25.5, 19.5, 14.0],
          '중3': [36.0, 27.5, 19.5, 16.0],
          '고1': [36.0, 29.0, 23.0, 16.5],
          '고2': [37.5, 29.5, 25.0, 18.0],
          '고3': [37.5, 29.5, 25.0, 18.0]
        }
      };
      const arr = thresholds[isMale ? 'male' : 'female'][gKey] || thresholds[isMale ? 'male' : 'female']['초5'];
      if (v >= arr[0]) return 1;
      if (v >= arr[1]) return 2;
      if (v >= arr[2]) return 3;
      if (v >= arr[3]) return 4;
      return 5;
    } else if (activeMethod === 'pushUp') { // 팔굽혀펴기 (회, 높을수록 좋음, 남:일반/여:무릎)
      const thresholds = {
        male: {
          '초4': [34, 25, 12, 4], // 초등은 중1 기준 준용
          '초5': [34, 25, 12, 4],
          '초6': [34, 25, 12, 4],
          '중1': [34, 25, 12, 4],
          '중2': [34, 25, 12, 4],
          '중3': [34, 25, 12, 4],
          '고1': [46, 30, 16, 7],
          '고2': [50, 42, 25, 11],
          '고3': [56, 46, 30, 17]
        },
        female: {
          '초4': [45, 24, 14, 6], // 초등은 중1 기준 준용
          '초5': [45, 24, 14, 6],
          '초6': [45, 24, 14, 6],
          '중1': [45, 24, 14, 6],
          '중2': [40, 24, 14, 6],
          '중3': [40, 24, 14, 6],
          '고1': [46, 24, 14, 6],
          '고2': [40, 30, 18, 9],
          '고3': [40, 30, 18, 9]
        }
      };
      const arr = thresholds[isMale ? 'male' : 'female'][gKey] || thresholds[isMale ? 'male' : 'female']['중1'];
      if (v >= arr[0]) return 1;
      if (v >= arr[1]) return 2;
      if (v >= arr[2]) return 3;
      if (v >= arr[3]) return 4;
      return 5;
    }
  }

  // 4. 순발력 (power)
  if (type === 'power') {
    const activeMethod = method || 'run50';
    if (activeMethod === 'run50') { // 50m 달리기 (초, 낮을수록 좋음)
      const thresholds = {
        male: {
          '초4': [8.80, 9.70, 10.50, 13.20],
          '초5': [8.50, 9.40, 10.20, 13.20],
          '초6': [8.10, 9.10, 10.00, 12.50],
          '중1': [7.50, 8.40, 9.30, 11.50],
          '중2': [7.30, 8.20, 9.00, 11.50],
          '중3': [7.00, 7.80, 8.50, 11.00],
          '고1': [7.00, 7.60, 8.10, 10.00],
          '고2': [6.70, 7.50, 7.90, 9.50],
          '고3': [6.70, 7.50, 7.90, 8.70]
        },
        female: {
          '초4': [9.40, 10.40, 11.00, 13.30],
          '초5': [8.90, 9.90, 10.70, 13.30],
          '초6': [8.90, 9.80, 10.70, 12.90],
          '중1': [8.80, 9.80, 10.50, 12.20],
          '중2': [8.80, 9.80, 10.50, 12.20],
          '중3': [8.80, 9.80, 10.50, 12.20],
          '고1': [8.80, 9.80, 10.50, 12.20],
          '고2': [8.80, 9.80, 10.50, 12.20],
          '고3': [8.80, 9.80, 10.50, 12.20]
        }
      };
      const arr = thresholds[isMale ? 'male' : 'female'][gKey] || thresholds[isMale ? 'male' : 'female']['초5'];
      if (v <= arr[0]) return 1;
      if (v <= arr[1]) return 2;
      if (v <= arr[2]) return 3;
      if (v <= arr[3]) return 4;
      return 5;
    } else if (activeMethod === 'standingJump') { // 제자리멀리뛰기 (cm, 높을수록 좋음)
      const thresholds = {
        male: {
          '초4': [170.1, 149.1, 130.1, 100.1],
          '초5': [180.1, 159.1, 141.1, 111.1],
          '초6': [200.1, 167.1, 148.1, 122.1],
          '중1': [211.1, 177.1, 159.1, 131.1],
          '중2': [218.1, 187.1, 169.1, 136.1],
          '중3': [238.1, 201.1, 180.1, 145.1],
          '고1': [255.1, 216.1, 195.1, 160.1],
          '고2': [258.1, 228.1, 212.1, 177.1],
          '고3': [264.1, 243.1, 221.1, 185.1]
        },
        female: {
          '초4': [161.1, 135.1, 119.1, 97.1],
          '초5': [170.1, 139.1, 123.1, 100.1],
          '초6': [175.1, 144.1, 127.1, 100.1],
          '중1': [175.1, 144.1, 127.1, 100.1],
          '중2': [183.1, 145.1, 127.1, 100.1],
          '중3': [183.1, 145.1, 127.1, 100.1],
          '고1': [186.1, 159.1, 139.1, 100.1],
          '고2': [186.1, 159.1, 139.1, 100.1],
          '고3': [186.1, 159.1, 139.1, 100.1]
        }
      };
      const arr = thresholds[isMale ? 'male' : 'female'][gKey] || thresholds[isMale ? 'male' : 'female']['초5'];
      if (v >= arr[0]) return 1;
      if (v >= arr[1]) return 2;
      if (v >= arr[2]) return 3;
      if (v >= arr[3]) return 4;
      return 5;
    }
  }

  return 5;
};

export const PapsProvider = ({ children }) => {
  const [activeStudent, setActiveStudent] = useState({
    schoolName: '서울고척초등학교',
    grade: '초5',
    classNum: '1',
    studentNum: '1',
    gender: 'male'
  });

  const [classCode, setClassCode] = useState('2026'); // 기본 코드

  // 학교별 선택 종목 상태 (로컬 스토리지 연동)
  const [selectedMethods, setSelectedMethods] = useState(() => {
    const saved = localStorage.getItem('paps_selected_methods');
    return saved ? JSON.parse(saved) : {
      cardio: 'shuttleRun',
      flexibility: 'sitReach',
      strength: 'curlUp',
      power: 'run50'
    };
  });

  useEffect(() => {
    localStorage.setItem('paps_selected_methods', JSON.stringify(selectedMethods));
  }, [selectedMethods]);


  // 모의 데이터 초기값 (사용자 요청에 따라 조금 채워둡니다)
  const [records, setRecords] = useState([
    {
      id: 1,
      grade: '5',
      classNum: '1',
      studentNum: '10',
      date: '2026-03-15',
      round: '1',
      gender: 'male',
      methods: {
        cardio: 'shuttleRun',
        flexibility: 'sitReach',
        strength: 'curlUp',
        power: 'run50'
      },
      values: {
        cardio: 35,
        flexibility: 8,
        strength: 25,
        power: 10.0
      },
      grades: {
        cardio: 3,
        flexibility: 3,
        strength: 3,
        power: 3
      }
    }
  ]);

  useEffect(() => {
    const loadData = async () => {
      const fbRecords = await fetchRecordsFromFirebase();
      if (fbRecords.length > 0) {
        const updated = fbRecords.map(r => {
          const grades = {
            cardio: calculateGrade('cardio', r.values.cardio, r.methods?.cardio, r.gender, r.grade),
            flexibility: calculateGrade('flexibility', r.values.flexibility, r.methods?.flexibility, r.gender, r.grade),
            strength: calculateGrade('strength', r.values.strength, r.methods?.strength, r.gender, r.grade),
            power: calculateGrade('power', r.values.power, r.methods?.power, r.gender, r.grade)
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
      cardio: calculateGrade('cardio', newRecord.values.cardio, newRecord.methods?.cardio, newRecord.gender, newRecord.grade),
      flexibility: calculateGrade('flexibility', newRecord.values.flexibility, newRecord.methods?.flexibility, newRecord.gender, newRecord.grade),
      strength: calculateGrade('strength', newRecord.values.strength, newRecord.methods?.strength, newRecord.gender, newRecord.grade),
      power: calculateGrade('power', newRecord.values.power, newRecord.methods?.power, newRecord.gender, newRecord.grade)
    };

    const finalRecord = { ...newRecord, grades, id: Date.now() };

    // Firebase 연동 (Mock)
    await saveRecordToFirebase(finalRecord);

    setRecords([...records, finalRecord]);
  };

  const normalizeGrade = (g) => {
    if (!g) return '';
    let val = g.toString().replace(/초|중|고/g, '');
    if (['4','5','6'].includes(val)) return '초' + val;
    if (['7','8','9','m1','m2','m3'].includes(val) || val.includes('중')) return '중' + val.replace(/중|m/g, '');
    return '고' + val.replace(/고|h/g, '');
  };

  const getStudentRecords = () => {
    return records.filter(r => 
      normalizeGrade(r.grade) === normalizeGrade(activeStudent.grade) && 
      String(r.classNum) === String(activeStudent.classNum) && 
      String(r.studentNum) === String(activeStudent.studentNum)
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
      selectedMethods,
      setSelectedMethods,
      addRecord, 
      getLatestRecord, 
      calculateGrade 
    }}>
      {children}
    </PapsContext.Provider>
  );
};
