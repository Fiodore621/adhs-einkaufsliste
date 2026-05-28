// Artikel-Objekte mit allen Attributen
export type Article = {
  id: string;
  name: string;
  amount: string; //warum kriege ich den Error, wenn ich hier | null eingebe?
  isDone: boolean;
};

export type ArticleForm = Omit<Article, 'id'>;
