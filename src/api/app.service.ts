import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { config } from 'src/config/envConfig';


export class Aplication {
  static async main(): Promise<void> {
    // ========================= DATABASE =========================

    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
      cors:true
    });

    // ========================= VALIDATSIYA =========================

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    );

    // ========================= COOKIE =========================
    app.use(cookieParser());

    const api = config.API_VERSION
    // ========================= GLOBAL URL =========================
    app.setGlobalPrefix(api);

    // ========================= SWAGGER =========================
    const configSwagger = new DocumentBuilder()
      .setTitle('Theatr')
      .setVersion('1.0.0')
      .addBearerAuth({
        type: 'http',
        scheme: 'Bearer',
        in: 'Header',
      })
      .build();

    const documentSwagger = SwaggerModule.createDocument(app, configSwagger);
    SwaggerModule.setup(api, app, documentSwagger);

    const logging = new Logger('Swagger-cinemauz');

    // ========================= PORT =========================
    const PORT = config.API_PORT;

    await app.listen(PORT, () => {
      setTimeout(() => {
        logging.log(`Swagger UI: http://${config.APP_URL}:${PORT}/${api}`);
      });
    });
  }
}
