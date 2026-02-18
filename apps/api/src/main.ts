import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // (Optionnel mais utile)
  app.enableCors();

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Ethnodata API')
    .setDescription('Documentation interactive de l’API Ethnodata')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // URL Swagger => /docs
  SwaggerModule.setup('docs', app, document);

  // Render fournit le port dans process.env.PORT
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 API en ligne sur : http://localhost:${port}`);
  console.log(`📚 Swagger sur : http://localhost:${port}/docs`);
}

bootstrap();
