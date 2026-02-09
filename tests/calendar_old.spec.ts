import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// 1. 이전에 저장한 토큰 파일을 읽어옵니다.
const tokenPath = path.join(__dirname, '../.auth/token.json');
const authData = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
const ACCESS_TOKEN = authData.token;

// 모든 API 요청에 사용할 공통 헤더 설정
const authHeaders = {
'Authorization': `Bearer ${ACCESS_TOKEN}`,
'Content-Type': 'application/json',
};


let eventId: string;

test.describe.configure({ mode: 'serial' });

test.describe('구글 캘린더 API 자동화 시나리오', () => {

  test('Step 1: 새로운 일정 생성 (POST)', async ({ request }) => {
    const response = await request.post('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      headers: authHeaders,
      data: {
        summary: 'Playwright 자동화 테스트 일정',
        description: '이 일정은 Playwright를 통해 생성되었습니다.',
        start: { dateTime: '2026-02-15T10:00:00Z' },
        end: { dateTime: '2026-02-15T11:00:00Z' }
      }
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    eventId = body.id; // 생성된 ID를 변수에 저장
    console.log(`Created Event ID: ${eventId}`);
  });

  test('Step 2: 일정 내용 수정 (PATCH)', async ({ request }) => {
    const response = await request.patch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
      headers: authHeaders,
      data: {
        summary: '제목이 Playwright에 의해 수정됨!'
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.summary).toBe('제목이 Playwright에 의해 수정됨!');
  });

  test('Step 3: 수정된 내용 최종 검증 (GET)', async ({ request }) => {
    const response = await request.get(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
      headers: authHeaders
    });

    const body = await response.json();
    expect(body.summary).toBe('제목이 Playwright에 의해 수정됨!');
    console.log('✅ 최종 검증 완료: 제목이 정상적으로 수정되었습니다.');
  });
});

// 모든 테스트가 끝난 뒤(성공하든 실패하든) 실행됩니다.
  test.afterAll(async ({ request }) => {
    if (eventId) {
      console.log(`🧹 테스트 데이터를 정리합니다. ID: ${eventId}`);
      const response = await request.delete(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
        headers: authHeaders
      });
      
      if (response.ok()) {
        console.log('✅ 테스트 일정이 성공적으로 삭제되었습니다.');
      }
    }
  });