import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  constructor(private readonly firebaseService: FirebaseService) {
    super();
  }

  async validate(req: any): Promise<any> {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    const decodedToken = await this.firebaseService.verifyToken(token);

    // Zwraca dane użytkownika, które można użyć w dalszych częściach aplikacji
    return { uid: decodedToken.uid, email: decodedToken.email };
  }
}
