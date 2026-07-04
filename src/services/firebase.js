import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCpdeRr4PBPdehECN4xh2sZz6jiKifkocs",
  authDomain: "paps-data-app.firebaseapp.com",
  projectId: "paps-data-app",
  storageBucket: "paps-data-app.firebasestorage.app",
  messagingSenderId: "1034651900444",
  appId: "1:1034651900444:web:e849ecef47877a6a2ef303",
  measurementId: "G-YTY51DWKJ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// 데이터 저장 함수 (Firestore 연동)
export const saveRecordToFirebase = async (recordData) => {
  try {
    const docRef = await addDoc(collection(db, "paps_records"), {
      student_id: `${recordData.grade}-${recordData.classNum}-${recordData.studentNum}`,
      grade: parseInt(recordData.grade),
      class: parseInt(recordData.classNum),
      number: parseInt(recordData.studentNum),
      round: parseInt(recordData.round),
      date: recordData.date,
      gender: recordData.gender || "male",
      cardio: parseFloat(recordData.values.cardio) || 0,
      flexibility: parseFloat(recordData.values.flexibility) || 0,
      strength: parseFloat(recordData.values.strength) || 0,
      speed: parseFloat(recordData.values.power) || 0,
      jump_rope: parseFloat(recordData.values.cardioSub) || 0,
      cardio_method: recordData.methods?.cardio || "shuttleRun",
      flexibility_method: recordData.methods?.flexibility || "sitReach",
      strength_method: recordData.methods?.strength || "curlUp",
      power_method: recordData.methods?.power || "run50",
      cardio_sub_method: recordData.methods?.cardioSub || "jumpRope",
      created_at: serverTimestamp()
    });
    console.log("Firestore 저장 성공, ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Firestore 저장 실패:", error);
    return { success: false, error };
  }
};

// 데이터 불러오기 함수
export const fetchRecordsFromFirebase = async () => {
  try {
    const q = query(collection(db, "paps_records"), orderBy("created_at", "asc"));
    const querySnapshot = await getDocs(q);
    const records = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        grade: String(data.grade),
        classNum: String(data.class),
        studentNum: String(data.number),
        date: data.date,
        round: String(data.round),
        gender: data.gender || "male",
        methods: {
          cardio: data.cardio_method || "shuttleRun",
          flexibility: data.flexibility_method || "sitReach",
          strength: data.strength_method || "curlUp",
          power: data.power_method || "run50",
          cardioSub: data.cardio_sub_method || "jumpRope"
        },
        values: {
          cardio: data.cardio,
          flexibility: data.flexibility,
          strength: data.strength,
          power: data.speed,
          cardioSub: data.jump_rope
        },
        grades: {
          // 로컬에서 계산할 것이므로 여기서는 placeholder 처리 가능 또는 로컬 계산
        }
      });
    });
    return records;
  } catch (error) {
    console.error("Firestore 불러오기 실패:", error);
    return [];
  }
};
