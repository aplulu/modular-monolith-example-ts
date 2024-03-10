FROM node:21.6.2-alpine

WORKDIR /workspace

RUN npm install @bufbuild/buf @bufbuild/protoc-gen-es @bufbuild/protobuf @connectrpc/protoc-gen-connect-es @connectrpc/connect

ENTRYPOINT ["/usr/local/bin/npx", "buf"]
