import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from "@nestjs/swagger";

const start = async () => {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const config = new DocumentBuilder().setTitle("Поиск группы апи").setVersion("1.0.0").build();
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup("/api", app, document);

  await app.listen(PORT, () => {
    console.log(`Сервер запустился на порту = ${PORT}`);
  });
};
start();
