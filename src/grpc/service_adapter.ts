import {
  ConnectRouter,
  ContextValues,
  createConnectRouter,
  Transport,
  UnaryResponse,
} from '@connectrpc/connect';
import {
  AnyMessage,
  JsonValue,
  Message,
  MethodInfo,
  PartialMessage,
  ServiceType,
} from '@bufbuild/protobuf';
import { UniversalServerRequest } from '@connectrpc/connect/protocol';

export const createServiceAdapter = (): {
  adapterTransport: Transport;
  adapterRouter: ConnectRouter;
} => {
  const router = createConnectRouter();

  return {
    adapterRouter: router,
    adapterTransport: {
      unary: async <
        I extends Message<I> = AnyMessage,
        O extends Message<O> = AnyMessage,
      >(
        service: ServiceType,
        method: MethodInfo<I, O>,
        signal: AbortSignal | undefined,
        timeoutMs: number | undefined,
        header: HeadersInit | undefined,
        message: PartialMessage<I>,
        contextValues?: ContextValues
      ): Promise<UnaryResponse<I, O>> => {
        for (const handler of router.handlers) {
          if (handler.service.typeName === service.typeName && handler.method.name === method.name) {

            if (!signal) {
              const abortController = new AbortController();
              signal = abortController.signal;
            }

            const headers = new Headers();
            headers.set('Content-Type', 'application/json');

            const req: UniversalServerRequest = {
              httpVersion: '2',
              url: 'http://localhost/' + handler.requestPath,
              method: 'POST',
              header: headers,
              body: message as JsonValue,
              signal,
              contextValues,
            };

            const res = await handler(req);
            if (res.status !== 200) {
              throw new Error('status is not 200');
            }

            const it = res.body?.[Symbol.asyncIterator]();
            if (!it) {
              throw new Error('body is not iterable');
            }

            const chunks = [];
            let chunk = await it.next();
            for (; chunk.done !== true; chunk = await it.next()) {
              chunks.push(chunk.value);
            }

            const body = JSON.parse(Buffer.concat(chunks).toString());

            return <UnaryResponse<I, O>>{
              message: body,
              stream: false,
            };
          }
        }

        throw new Error('handler not found');
      },
      stream: async (
        service,
        method,
        signal,
        timeoutMs,
        header,
        input,
        contextValues
      ) => {
        throw new Error('stream is not supported');
      },
    },
  };
};
