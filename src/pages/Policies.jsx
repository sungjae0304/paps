import React from 'react';
import { ChevronLeft } from 'lucide-react';

export const PrivacyPolicy = ({ onClose }) => (
  <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: 'white' }}>
    <div style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', padding: '1rem', background: '#1e293b', color: 'white' }}>
      <button onClick={onClose} style={{ marginRight: '1rem', color: 'white', background: 'transparent', border: 'none', cursor: 'pointer' }}><ChevronLeft /></button>
      <h2 style={{ fontSize: '1.125rem', color: 'white', marginBottom: 0, fontWeight: 700, textShadow: 'none' }}>개인정보처리방침</h2>
    </div>
    <div style={{ padding: '1.5rem', color: '#1e293b' }}>
      <section style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: '#3730a3', textShadow: 'none' }}>[1. 수집 항목]</h3>
        <p style={{ fontSize: '0.875rem', color: '#334155' }}>본 앱은 다음 정보를 수집합니다.</p>
        <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#334155', marginTop: '0.5rem', listStyleType: 'disc' }}>
          <li>학년, 반, 번호 (이름 수집 안 함)</li>
          <li>PAPS 체력 측정 수치 (심폐지구력·유연성·근력·근지구력·순발력)</li>
          <li>측정 날짜 및 회차</li>
          <li>선택한 생활 습관 항목 (익명)</li>
        </ul>
      </section>
      
      <section style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: '#3730a3', textShadow: 'none' }}>[2. 이용 목적]</h3>
        <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#334155', listStyleType: 'disc' }}>
          <li>학생 개인의 체력 변화 누적 기록 및 분석</li>
          <li>맞춤형 운동 추천 및 탐구 질문 생성</li>
          <li>교사의 학급 전체 체력 향상 연구 데이터 활용</li>
        </ul>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: '#3730a3', textShadow: 'none' }}>[3. 보관 기간]</h3>
        <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#334155', listStyleType: 'disc' }}>
          <li>해당 학년도(3월~다음해 2월) 종료 후 자동 삭제</li>
          <li>교사가 직접 삭제 요청 시 즉시 삭제</li>
        </ul>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: '#3730a3', textShadow: 'none' }}>[4. 문의처]</h3>
        <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#334155', listStyleType: 'disc' }}>
          <li>담당 교사에게 직접 문의</li>
          <li>본 앱은 학교 내 교육 목적으로만 사용되며 외부에 정보를 제공하지 않습니다.</li>
        </ul>
      </section>

      <button onClick={onClose} className="btn btn-primary w-full" style={{ marginTop: '2rem', background: '#1e293b', border: 'none' }}>
        확인했습니다
      </button>
    </div>
  </div>
);

export const TermsOfUse = ({ onClose }) => (
  <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: 'white' }}>
    <div style={{ position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', padding: '1rem', background: '#1e293b', color: 'white' }}>
      <button onClick={onClose} style={{ marginRight: '1rem', color: 'white', background: 'transparent', border: 'none', cursor: 'pointer' }}><ChevronLeft /></button>
      <h2 style={{ fontSize: '1.125rem', color: 'white', marginBottom: 0, fontWeight: 700, textShadow: 'none' }}>서비스 이용약관</h2>
    </div>
    <div style={{ padding: '1.5rem', color: '#1e293b' }}>
      <section style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: '#3730a3', textShadow: 'none' }}>[1. 서비스 이용 조건]</h3>
        <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#334155', listStyleType: 'disc' }}>
          <li>본 서비스는 ○○초등학교 재학생 및 담당 교사만 이용 가능합니다.</li>
          <li>학생은 본인의 체력 데이터만 입력하여야 합니다.</li>
          <li>교사 코드를 타인과 공유하지 않습니다.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: '#3730a3', textShadow: 'none' }}>[2. 책임 범위]</h3>
        <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#334155', listStyleType: 'disc' }}>
          <li>본 앱은 교육 보조 도구이며, PAPS 공식 측정을 대체하지 않습니다.</li>
          <li>AI 추천 운동은 참고용이며, 부상 예방을 위해 준비운동을 먼저 합니다.</li>
          <li>앱 사용 중 발생하는 부상에 대한 책임은 앱 제작자에게 없습니다.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: '#3730a3', textShadow: 'none' }}>[3. 금지 행위]</h3>
        <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#334155', listStyleType: 'disc' }}>
          <li>타인의 학번으로 데이터를 입력하거나 조작하는 행위</li>
          <li>앱의 소스코드를 무단으로 복제·배포하는 행위</li>
          <li>교사 관리 코드를 허가 없이 획득하려는 행위</li>
        </ul>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem', color: '#3730a3', textShadow: 'none' }}>[4. 변경 안내]</h3>
        <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#334155', listStyleType: 'disc' }}>
          <li>약관 변경 시 앱 공지사항을 통해 7일 전 안내합니다.</li>
          <li>변경 후 계속 사용 시 변경된 약관에 동의한 것으로 간주합니다.</li>
        </ul>
      </section>

      <button onClick={onClose} className="btn btn-primary w-full" style={{ marginTop: '2rem', background: '#1e293b', border: 'none' }}>
        동의하고 시작하기
      </button>
    </div>
  </div>
);
