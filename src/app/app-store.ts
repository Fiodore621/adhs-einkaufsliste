// Signal, das bei der Eingabe in die Input-Felder bearbeitet wird
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Article, ArticleForm } from './types';
import { withStorageSync } from '@angular-architects/ngrx-toolkit';

type ShoppingListState = {
  articles: Article[];
};

// Zustand, den die Liste beim ersten Laden haben soll
const initialState: ShoppingListState = {
  articles: [],
};

// reaktiver Snapshot mit allem, was eine Shoppingliste können muss
export const ShoppingListStore = signalStore(
  { providedIn: 'root' },
  // signalStore macht aus allen Properties der const initialState eigene read only-Signals
  // wenn eine Property sich ändert, wird auch nur diese Property angefasst
  withState(initialState),
  withMethods((store) => ({
    addArticle({ name, amount, isDone }: ArticleForm) {
      const article: Article = {
        id: new Date().getTime().toString(),
        name,
        amount,
        isDone,
      };
      patchState(store, (state) => ({
        articles: [...state.articles, article],
      }));
    },
    updateArticle(id: string, { isDone }: ArticleForm) {
      patchState(store, (state) => ({
        articles: state.articles.map((article) =>
          article.id === id ? { ...article, isDone } : article,
        ),
      }));
    },
    removeArticle(id: string) {
      patchState(store, (state) => ({
        articles: state.articles.filter((article) => article.id !== id),
      }));
    },
  })),
  // speichert den Zustand der Liste automatisch im Browser, wenn er sich ändert
  // abrufbar ist er dann über den Key: articles
  withStorageSync('articles'),
);
