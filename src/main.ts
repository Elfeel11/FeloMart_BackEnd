import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SEVER_PORT } from "./config/config.service";
import { ResponseInterceptor } from "./common/interceptor/response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalInterceptors(new ResponseInterceptor());
  const PORT = SEVER_PORT;

  await app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
}
bootstrap();
