import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    // optionsSuccessStatus: 204,
  });

  app.useGlobalFilters();

  const config = new DocumentBuilder()
    .setTitle('NF')
    .setDescription('The NF API ')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3012, () => {
    console.log('[Server listening] http://localhost:3012');
  });
}
bootstrap();
