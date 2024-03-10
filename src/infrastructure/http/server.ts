import { fastify } from 'fastify';
import { ConnectRouter, createPromiseClient } from '@connectrpc/connect';
import { fastifyConnectPlugin } from '@connectrpc/connect-fastify';

import * as config from '@/config/config';
import { NewArticleUsecase } from '@/component/article/usecase/article_usecase';
import { NewArticleInMemory } from '@/component/article/infrastructure/inmemory/article_inmemory';
import { RegisterArticle } from '@/component/article/interface/grpc/article_server';
import { NewUserInMemory } from '@/component/user/infrastructure/inmemory/user_inmemory';
import { NewUserUsecase } from '@/component/user/usecase/user_usecase';
import { RegisterUser } from '@/component/user/interface/grpc/internal_server';
import { InternalUserService } from '@/grpc/example/user/v1/internal_connect';
import { createServiceAdapter } from '@/grpc/service_adapter';

export const startServer = async () => {
  const routes = (router: ConnectRouter) => {
    const { adapterTransport, adapterRouter } = createServiceAdapter();
    const internalUserClient = createPromiseClient(
      InternalUserService,
      adapterTransport
    );

    // Register article module
    const articleUsecase = NewArticleUsecase(
      NewArticleInMemory(),
      internalUserClient
    );
    RegisterArticle(router, articleUsecase);

    // Register user module
    const userUsecase = NewUserUsecase(NewUserInMemory());
    RegisterUser(adapterRouter, userUsecase);
  };

  const server = fastify({
    http2: true, // HTTP/1でリクエストを送る場合はコメントアウトする
  });

  await server.register(fastifyConnectPlugin, {
    routes,
  });

  await server.listen({
    host: config.host,
    port: config.port,
  });
  console.log(`Server is running on port ${config.port}`);
};
