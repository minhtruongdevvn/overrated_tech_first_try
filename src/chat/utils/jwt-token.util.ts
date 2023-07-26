import { JwtService } from '@nestjs/jwt';
import { IncomingMessage } from 'http';
import { ChatSocket } from '../gateway/types';

const jwtService: JwtService = new JwtService();

export function getAccessTokenFromSocket(
  client: ChatSocket,
): number | undefined {
  const rawToken = client.handshake.headers.authorization;

  const token = getAccessToken(rawToken);
  if (!token) return;

  const claim = jwtService.decode(token);
  if (!claim) return; // add log

  const sub = claim['sub'];
  if (!sub) return; // add log

  return sub;
}

export function getAccessTokenFromRequest(request: IncomingMessage) {
  const rawToken = request.headers.authorization;
  return getAccessToken(rawToken);
}

function getAccessToken(rawToken: string | undefined) {
  if (!rawToken || typeof rawToken !== 'string') return;

  if (rawToken.substring(0, 6).toLowerCase() === 'bearer') {
    return rawToken.substring(7, rawToken.length);
  } else {
    return rawToken;
  }
}
