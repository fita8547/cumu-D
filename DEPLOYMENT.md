# COMU-D 배포 가이드

이 문서는 COMU-D 애플리케이션을 모바일에서 접근 가능하도록 배포하는 방법을 안내합니다.

## 🚀 빠른 배포 (5분 안에 완료)

### 방법 1: Netlify (가장 쉬움, 추천)

1. **GitHub에 코드 업로드**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin [당신의 GitHub 저장소 URL]
   git push -u origin main
   ```

2. **Netlify 배포**
   - [netlify.com](https://www.netlify.com) 접속
   - "Sign up" 클릭 (GitHub 계정으로 가입 가능)
   - "Add new site" > "Import an existing project" 선택
   - GitHub 저장소 선택
   - Build settings 자동 감지됨 (변경 불필요)
   - "Deploy site" 클릭
   - 완료! 🎉

3. **모바일에서 접속**
   - 배포된 URL (예: `https://comu-d-123.netlify.app`)을 모바일 브라우저에서 열기
   - 홈 화면에 추가 가능

### 방법 2: Vercel

1. **GitHub에 코드 업로드** (위와 동일)

2. **Vercel 배포**
   - [vercel.com](https://vercel.com) 접속
   - "Sign up" 클릭 (GitHub 계정으로 가입 가능)
   - "Add New Project" 클릭
   - GitHub 저장소 선택
   - "Deploy" 클릭
   - 완료! 🎉

### 방법 3: GitHub Pages

```bash
# 1. gh-pages 설치
npm install --save-dev gh-pages

# 2. package.json에 추가 (이미 추가되어 있음)
# "homepage": "https://[사용자명].github.io/COMU-D"

# 3. 배포
npm run deploy
```

## 📱 구글 사이트 연동

1. **먼저 위 방법 중 하나로 배포** (Netlify 추천)

2. **배포된 URL 확인**
   - Netlify/Vercel 대시보드에서 URL 복사
   - 예: `https://comu-d.netlify.app`

3. **구글 사이트 설정**
   - [sites.google.com](https://sites.google.com) 접속
   - 새 사이트 생성
   - "삽입" 메뉴 클릭
   - "URL 임베드" 선택
   - 배포된 URL 입력
   - 크기 조정 (전체 너비 권장)
   - 저장

4. **모바일 접근**
   - 구글 사이트 URL을 모바일에서 열기
   - 또는 구글 사이트 앱에서 접근

## 🧪 로컬에서 모바일 테스트

같은 Wi-Fi 네트워크에서 테스트:

1. **개발 서버 실행**
   ```bash
   npm start
   ```

2. **컴퓨터 IP 주소 확인**
   - Windows: `ipconfig` (IPv4 주소 확인)
   - Mac/Linux: `ifconfig` 또는 `ip addr`
   - 예: `192.168.0.100`

3. **모바일에서 접속**
   - 모바일 브라우저에서 `http://192.168.0.100:3000` 입력
   - 같은 Wi-Fi에 연결되어 있어야 함

## 📋 배포 체크리스트

배포 전 확인사항:

- [ ] `npm run build` 성공적으로 실행됨
- [ ] 모든 기능이 정상 작동함
- [ ] 모바일에서 반응형 디자인 확인
- [ ] 이미지 및 리소스가 정상 로드됨
- [ ] 라우팅이 정상 작동함

## 🔧 문제 해결

### 빌드 오류
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 라우팅 오류 (404)
- Netlify: `netlify.toml` 파일 확인 (이미 포함됨)
- Vercel: `vercel.json` 파일 확인 (이미 포함됨)

### 모바일에서 접속 안 됨
- HTTPS 사용 확인 (HTTP는 일부 기능 제한)
- 브라우저 캐시 삭제
- 다른 브라우저로 시도

## 📞 도움말

문제가 발생하면:
- 이메일: junsumon090608@gmail.com
- GitHub Issues에 문의

