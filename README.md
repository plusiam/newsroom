# Newsroom 🗞️

협업 온라인 신문 플랫폼 - 커뮤니티, 학교, 조직을 위한 온라인 신문 제작 도구

## 📖 소개

Newsroom은 모든 그룹이 자신만의 온라인 신문을 쉽게 만들고 발행할 수 있는 웹 플랫폼입니다. 학급, 동아리, 지역 커뮤니티, 회사 팀 등 어디서나 사용할 수 있습니다.

## ✨ 주요 기능

### 📝 4단계 역할 시스템
- **관리자**: 모든 권한 + 수석 편집자 임명 + 조직 설정
- **수석 편집자**: 기사 검토, 신문 발행, 기자를 편집자로 임명
- **편집자**: 기사 검토, 신문 발행
- **기자**: 기사 작성

### 📰 핵심 기능
- ✅ 구글 계정 로그인 (프로토타입: 이메일 로그인)
- ✅ 기사 작성 및 이미지 업로드
- ✅ 기사 검토 및 승인 시스템
- ✅ 신문 레이아웃 편집
- ✅ 온라인 신문 발행 및 공유
- ✅ 조직별 커스터마이징 (이름, 카테고리)

### ⚙️ 조직 설정
- 신문 이름 및 슬로건 변경
- 기사 카테고리 자유 추가/삭제
- 멤버 역할 관리

## 🚀 시작하기

### 설치

```bash
# 저장소 클론
git clone https://github.com/plusiam/newsroom.git
cd newsroom

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 📱 사용 예시

### 학급 신문
- 조직 이름: "5학년 3반 소식지"
- 카테고리: 학교소식, 학급행사, 친구이야기, 독후감

### 동아리 소식지
- 조직 이름: "독서 동아리 매거진"
- 카테고리: 책리뷰, 추천도서, 독서모임, 작가인터뷰

### 회사 팀 블로그
- 조직 이름: "DevTeam Tech Blog"
- 카테고리: 기술블로그, 프로젝트후기, 팀문화, 채용

### 지역 커뮤니티
- 조직 이름: "○○아파트 소식지"
- 카테고리: 공지사항, 주민인터뷰, 행사안내, 건의사항

## 🛠️ 기술 스택

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: LocalStorage (프로토타입)
- **Future**: Firebase (인증, 데이터베이스, 스토리지)

## 📋 로드맵

### v1.0 (현재 - 프로토타입)
- [x] 기본 UI/UX
- [x] 역할 기반 권한 시스템
- [x] 기사 작성 및 관리
- [x] 신문 편집 및 발행
- [x] LocalStorage 데이터 저장

### v2.0 (계획)
- [ ] Firebase 통합
  - [ ] Google 로그인
  - [ ] Firestore 데이터베이스
  - [ ] Firebase Storage (이미지)
- [ ] 실시간 협업 기능
- [ ] 댓글 시스템
- [ ] 알림 기능

### v3.0 (계획)
- [ ] 다양한 신문 템플릿
- [ ] PDF 내보내기
- [ ] 통계 대시보드
- [ ] 태그 시스템
- [ ] 검색 기능

## 🤝 기여하기

프로젝트에 기여하고 싶으시다면:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License

## 👨‍💻 개발자

**여한기 (Yeo Hanki)**
- 대구감천초등학교 수석교사
- GitHub: [@plusiam](https://github.com/plusiam)

## 🙏 감사의 말

이 프로젝트는 학급 신문을 만들고 싶어하는 학생들과 교사들을 위해 시작되었습니다. 
모든 커뮤니티가 자신들의 이야기를 나눌 수 있는 플랫폼이 되기를 바랍니다.

---

**Made with ❤️ for communities everywhere**
