import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Active la validation + transforme les query params en types (number, etc.)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // supprime les champs inconnus
      forbidNonWhitelisted: false, // mets true si tu veux refuser (400) les champs inconnus
      transform: true, // transforme "take=20" => 20 (number)
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Application')
    .setDescription('API Ethnodata')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(3000);
}

// ✅ évite le warning ESLint no-floating-promises
bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
