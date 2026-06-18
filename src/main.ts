import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ativa validação automática dos DTOs em todas as rotas
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Livros')
    .setDescription('API RESTful para gerenciamento de livros')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Aplicação rodando em: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`Swagger disponível em: http://localhost:${process.env.PORT ?? 3000}/api`);
}
bootstrap();
