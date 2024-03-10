import { Article } from '@/component/article/domain/model/article';
import { ArticleRepository } from '@/component/article/domain/repository/article_repository';
import { PromiseClient } from '@connectrpc/connect';
import { GetUserRequest } from '@/grpc/example/user/v1/internal_pb';
import { InternalUserService } from '@/grpc/example/user/v1/internal_connect';

export type ArticleUsecase = {
  listArticle(): Promise<Article[]>;
};

class ArticleUsecaseImpl implements ArticleUsecase {
  constructor(
    private articleRepository: ArticleRepository,
    private internalUserClient: PromiseClient<typeof InternalUserService>
  ) {}

  async listArticle(): Promise<Article[]> {
    const articles = await this.articleRepository.listArticle();

    // UserServiceからユーザ情報を取得してArticleにセットする
    for (const i in articles) {
      const article = articles[i];
      const res = await this.internalUserClient.getUser(
        new GetUserRequest({
          userId: article.userId,
        })
      );

      if (!!res.user) {
        articles[i].user = {
          id: res.user.id,
          name: res.user.name,
        };
      }
    }

    return articles;
  }
}

export const NewArticleUsecase = (
  articleRepository: ArticleRepository,
  internalUserClient: PromiseClient<typeof InternalUserService>
): ArticleUsecase => {
  return new ArticleUsecaseImpl(articleRepository, internalUserClient);
};
