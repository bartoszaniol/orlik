import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseService {
  constructor() {
    if (admin.apps.length != 0) return
    admin.initializeApp({
      credential: admin.credential.cert('src/firebase-admin.json'),
    });
  }

  async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
    try {
      return await admin.auth().verifyIdToken(token);
    } catch (error) {
      throw new Error('Invalid token, get gud');
    }
  }
}