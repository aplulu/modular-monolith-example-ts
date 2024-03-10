import { Article } from '@/component/article/domain/model/article';
import { ArticleRepository } from '@/component/article/domain/repository/article_repository';

const articles: Article[] = [
  {
    id: '1',
    title: 'Article 1',
    content: 'Content 1',
    userId: '1',
  },
  {
    id: '2',
    title: 'Title 2',
    content: 'Content 2',
    userId: '2',
  },
];

class ArticleInMemory implements ArticleRepository {
  async listArticle(): Promise<Article[]> {
    return articles;
  }
}

export const NewArticleInMemory = (): ArticleRepository => {
  return new ArticleInMemory();
};
