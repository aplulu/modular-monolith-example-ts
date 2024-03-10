export type Article = {
  id: string;
  title: string;
  content: string;
  userId: string;
  user?: ArticleUser;
};

export type ArticleUser = {
  id: string;
  name: string;
};
