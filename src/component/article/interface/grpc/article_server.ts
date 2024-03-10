import { Empty } from '@bufbuild/protobuf';
import { ConnectRouter } from '@connectrpc/connect';

import { ArticleUsecase } from '@/component/article/usecase/article_usecase';
import { ArticleService } from '@/grpc/example/article/v1/article_connect';
import { ListArticleResponse } from '@/grpc/example/article/v1/article_pb';

class ArticleServer {
  constructor(private articleUsecase: ArticleUsecase) {}

  listArticle = async (req: Empty): Promise<ListArticleResponse> => {
    const articles = await this.articleUsecase.listArticle();

    return new ListArticleResponse({
      articles,
    });
  };
}

export const RegisterArticle = (
  router: ConnectRouter,
  articleUsecase: ArticleUsecase
) => {
  const server = new ArticleServer(articleUsecase);

  router.service(ArticleService, server);
};
