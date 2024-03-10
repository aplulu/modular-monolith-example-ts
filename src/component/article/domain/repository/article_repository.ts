import { Article } from '@/component/article/domain/model/article';

export type ArticleRepository = {
  listArticle: () => Promise<Article[]>;
};
