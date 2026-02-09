import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const tokenPath = path.join(__dirname, '../.auth/token.json');
const authData = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
const authHeaders = { 'Authorization': `Bearer ${authData.token}`, 'Content-Type': 'application/json' };

// 1. 테스트할 데이터 배열 정의
const testCases = [
  { summary: '정기 주간 회의', desc: '일반적인 제목 테스트' },
  { summary: 'Special! @#$%^&*', desc: '특수문자 포함 테스트' },
  { summary: 'A'.repeat(50), desc: '매우 긴 제목 테스트' }
];

test.describe('구글 캘린더 DDT 시나리오', () => {
  // 각 케이스별로 독립적인 테스트가 생성됩니다.
  for (const data of testCases) {
    test(`일정 생성 및 삭제 테스트: ${data.desc}`, async ({ request }) => {
      let eventId: string;

      // [생성]
      const createRes = await request.post('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: authHeaders,
        data: {
          summary: data.summary,
          start: { dateTime: '2026-03-01T10:00:00Z' },
          end: { dateTime: '2026-03-01T11:00:00Z' }
        }
      });
      const body = await createRes.json();
      eventId = body.id;
      expect(createRes.ok()).toBeTruthy();

      // [삭제 - Cleanup]
      const deleteRes = await request.delete(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
        headers: authHeaders
      });
      expect(deleteRes.ok()).toBeTruthy();
      console.log(`✅ 성공: ${data.desc}`);
    });
  }
});