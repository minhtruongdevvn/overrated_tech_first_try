import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { IncomingMessage } from 'http';
import { ServerOptions } from 'socket.io';
import { OauthService } from 'src/auth/oauth.service';
import { getAccessTokenFromRequest } from '../utils';

export class ConversationSocketIOAdapter extends IoAdapter {
  constructor(
    app: INestApplicationContext,
    private readonly oauthService: OauthService,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const chatboxOption: Partial<ServerOptions> = {
      ...(options ?? {}),
      allowRequest: (req, fn) =>
        this.validateRequest(req, this.oauthService, fn),
    };

    return super.createIOServer(port, chatboxOption);
  }

  private async validateRequest(
    request: IncomingMessage,
    oauthService: OauthService,
    allowFunction: (err: string | null | undefined, success: boolean) => void,
  ) {
    const token = getAccessTokenFromRequest(request);
    if (!token) return allowFunction('Unauthorized', false);

    const oauth = await oauthService.getByToken(token);
    if (!oauth) return allowFunction('Unauthorized', false);

    return allowFunction(undefined, true);
  }
}
