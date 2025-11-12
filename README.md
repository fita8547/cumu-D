# COMU-D

학교 밖 청소년들이 지원 받는 시스템을 지향하는 웹 애플리케이션입니다.

## 프로젝트 구조

이 프로젝트는 React로 구성되어 있습니다.

```
COMU-D/
├── public/          # 정적 파일
│   ├── index.html
│   └── Logo.png
├── src/
│   ├── components/  # 재사용 가능한 컴포넌트
│   │   ├── Header.js
│   │   ├── Nav.js
│   │   └── Footer.js
│   ├── pages/       # 페이지 컴포넌트
│   │   ├── Main.js
│   │   ├── SocialIssue.js
│   │   ├── EnvironmentalProblem.js
│   │   └── WritingIdea.js
│   ├── App.js       # 메인 앱 컴포넌트
│   ├── App.css      # 앱 스타일
│   ├── index.js     # 진입점
│   └── index.css    # 전역 스타일
├── package.json
└── README.md
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인할 수 있습니다.

### 3. 프로덕션 빌드

```bash
npm run build
```

## 주요 기능

- **메인 페이지**: 다양한 카테고리로 이동할 수 있는 카드 레이아웃
- **네비게이션**: 사회이슈, 환경, 이야기, 과학, 이벤트 메뉴
- **라우팅**: React Router를 사용한 페이지 네비게이션

## 기술 스택

- React 18.2.0
- React Router DOM 6.20.0
- React Scripts 5.0.1

## 모바일 접근 및 배포

이 애플리케이션은 모바일에서도 완벽하게 작동하도록 반응형 디자인이 적용되어 있습니다.

### 무료 배포 옵션

#### 1. Netlify로 배포 (추천)

1. [Netlify](https://www.netlify.com/)에 가입
2. GitHub에 프로젝트 푸시
3. Netlify 대시보드에서 "New site from Git" 선택
4. 저장소 연결 후 다음 설정:
   - Build command: `npm run build`
   - Publish directory: `build`
5. 배포 완료 후 모바일에서 접근 가능

#### 2. Vercel로 배포

1. [Vercel](https://vercel.com/)에 가입
2. GitHub에 프로젝트 푸시
3. Vercel 대시보드에서 "Import Project" 선택
4. 저장소 연결 후 자동 배포
5. 배포 완료 후 모바일에서 접근 가능

#### 3. GitHub Pages로 배포

```bash
# gh-pages 패키지 설치
npm install --save-dev gh-pages

# package.json에 추가
"homepage": "https://[사용자명].github.io/COMU-D",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}

# 배포 실행
npm run deploy
```

### 구글 사이트 연동 방법

구글 사이트에 React 앱을 임베드하려면:

1. 위의 방법 중 하나로 먼저 배포 (Netlify/Vercel 추천)
2. 배포된 URL 획득 (예: `https://comu-d.netlify.app`)
3. [Google Sites](https://sites.google.com/)에서 새 사이트 생성
4. "삽입" > "URL 임베드" 선택
5. 배포된 URL 입력
6. 모바일에서도 접근 가능

### 로컬에서 모바일 테스트

1. 개발 서버 실행: `npm start`
2. 같은 네트워크의 모바일 기기에서 접근:
   - 컴퓨터의 로컬 IP 주소 확인 (예: `192.168.0.100`)
   - 모바일 브라우저에서 `http://192.168.0.100:3000` 접속

### 모바일 최적화 기능

- ✅ 반응형 디자인 (모든 화면 크기 지원)
- ✅ 터치 친화적 인터페이스
- ✅ 모바일 뷰포트 최적화
- ✅ 빠른 로딩 속도

## 연락처

- 이메일: junsumon090608@gmail.com
- 주소: (43010) 대구광역시 달성군 구지면 창리로11길 93
# cumu-D
