import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OauthService } from './auth/oauth.service';
import { ConversationSocketIOAdapter } from './chat/gateway/adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const oauthService = app.get(OauthService);
  const chatAdapter = new ConversationSocketIOAdapter(app, oauthService);
  app.useWebSocketAdapter(chatAdapter);

  await app.listen(3000);
}
bootstrap();
