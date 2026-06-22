import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private initialized = false;

  onModuleInit() {
    const keyPath = path.join(process.cwd(), 'firebase-service-account.json');
    if (!fs.existsSync(keyPath)) {
      this.logger.warn('firebase-service-account.json 없음 — FCM 비활성화');
      return;
    }
    if (getApps().length === 0) {
      initializeApp({ credential: cert(keyPath) });
    }
    this.initialized = true;
  }

  /** 토큰 목록에 FCM 알림 전송. 실패 토큰은 무시한다. */
  async sendMulticast(tokens: string[], title: string, body: string): Promise<void> {
    if (!this.initialized) return;
    const validTokens = tokens.filter(Boolean);
    if (validTokens.length === 0) return;

    try {
      await getMessaging().sendEachForMulticast({
        tokens: validTokens,
        notification: { title, body },
        android: { priority: 'high' },
      });
    } catch (err) {
      this.logger.error('FCM 전송 실패', (err as Error).message);
    }
  }
}
