// 이 파일은 Firebase Firestore 연동을 위한 모의(Mock) 서비스입니다.
// 실제 Firebase 적용 시 firebase/app, firebase/firestore 등을 임포트하여
// 아래 함수들의 내부 로직을 교체하면 됩니다.

export const firebaseConfig = {
  // apiKey: "YOUR_API_KEY",
  // authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  // projectId: "YOUR_PROJECT_ID",
  // storageBucket: "YOUR_PROJECT_ID.appspot.com",
  // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  // appId: "YOUR_APP_ID"
};

/**
 * [Firebase 연동 가이드]
 * 실제 연동 시 주석 해제하여 사용
 * import { initializeApp } from "firebase/app";
 * import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
 * const app = initializeApp(firebaseConfig);
 * export const db = getFirestore(app);
 */

// 모의(Mock) DB 조작 함수
export const saveRecordToFirebase = async (recordData) => {
  console.log("[Firebase Mock] 데이터 저장 시도:", recordData);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("[Firebase Mock] 데이터 저장 완료 (paps_records)");
      resolve({ success: true, id: Date.now() });
    }, 500); // 0.5초 네트워크 지연 시뮬레이션
  });
};

export const fetchRecordsFromFirebase = async () => {
  console.log("[Firebase Mock] 데이터 불러오기 시도");
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("[Firebase Mock] 데이터 불러오기 완료");
      resolve([]); // 초기 빈 배열 반환
    }, 500);
  });
};
