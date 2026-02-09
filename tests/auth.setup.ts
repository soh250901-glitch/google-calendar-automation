import { test as setup } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// 1. 토큰을 임시 저장할 파일 경로 설정 (프로젝트 루트에 저장됨)
const tokenPath = path.join(__dirname, '../.auth/token.json');

setup('Google Calendar API 인증 토큰 준비', async ({ request }) => {
  console.log('🔄 구글 Access Token 갱신을 시작합니다...');

  // 2. Google OAuth2 엔드포인트에 토큰 갱신 요청을 보냅니다.
  const response = await request.post('https://oauth2.googleapis.com/token', {
    form: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      refresh_token: process.env.REFRESH_TOKEN,
      grant_type: 'refresh_token',
    },
  });

  const data = await response.json();

  if (data.access_token) {
    console.log('✅ Access Token 발급 성공!');
    
    // 3. 나중에 다른 테스트에서 꺼내 쓸 수 있도록 파일로 저장합니다.
    if (!fs.existsSync(path.dirname(tokenPath))) {
      fs.mkdirSync(path.dirname(tokenPath), { recursive: true });
    }
    fs.writeFileSync(tokenPath, JSON.stringify({ token: data.access_token }));
    console.log(`💾 토큰이 저장되었습니다: ${tokenPath}`);
  } else {
    console.error('❌ 토큰 발급 실패:', data);
    throw new Error('Google 인증에 실패했습니다. REFRESH_TOKEN을 확인하세요.');
  }
});