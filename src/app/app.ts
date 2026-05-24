import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder, ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { updateState, withStorageSync } from '@angular-architects/ngrx-toolkit'
import { signalStore, withMethods, withState } from "@ngrx/signals";

// muss vor der Component stehen
// Aufbau der Artikel-Objekte mit allen Attributen
type Article = {
  id: number;
  name: string;
  amount: number | null;
  needed: boolean;
};

const Beispiel1: Article = {
  id: 1,
  name: "Katzen",
  amount: 2,
  needed: true,
}

const Beispiel2: Article = {
  id: 2,
  name: "Enten",
  amount: 5,
  needed: true,
}

// Aufbau der Listen-Zustände, kann zB um Filter erweitert werden
type listState = {
  articles: Article[];
};

// Zustand, den die Liste beim ersten Laden haben soll
const initialState: listState = {
  articles: [Beispiel1, Beispiel2],
}

// reaktiver Snapshot mit allem, was eine Shopping Liste können muss
const shoppingListStore = signalStore(
// signalStore macht aus allen Properties der const initialState eigene Signals
// wenn eine Property sich ändert, wird auch nur diese Property angefasst
  withState(initialState),
  withMethods(
    
  )
// speichert den Zustand der Liste automatisch, wenn er sich ändert
// abrufbar ist er dann über den Key: groceries
  withStorageSync('groceries'),
  );


@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  styleUrl: './app.css',
  template: `<header>
      <h1>EDeHS</h1>
      <h2>Welcome, scatterbrain!</h2>
      <p>Let's do some goddamn shopping.</p>
    </header>
    <main>
      <section id="eingabe">
        <h3>Neuen Artikel hinzufügen</h3>
        <form [formGroup]="newArticleForm" (ngSubmit)="addItem()">
          <label for="name">Artikelbezeichnung:</label>
          <input
            formControlName="name"
            type="text"
            id="articleName"
            placeholder="Brot, Eier, Milch..."
          />
          <label for="amount">Menge: </label>
          <input 
            formControlName="amount"
            type="number"
            id="articleAmount"
            placeholder="42" 
          />
          <button
            [disabled]="!newArticleForm.valid"
            type="submit">Hinzufügen!
          </button>
        </form>
      </section>
      <section id="einkaufsliste">
        <h3>Einkaufsliste</h3>
        <ul>
          @for (item of shoppingList(); track $index) {
            @if (item.amount){
              <li>{{ item.name + ', ' + item.amount}}</li>
            }@else {
              <li>{{ item.name }}</li>
            }
          }
        </ul>
        <ol>
          @for (article of this.toBuy.articles(); track article.id) {
            @if (article.amount){
              <li>{{ article.name + ', ' + article.amount }}</li>
            } @else {
              <li>{{ article.name }}</li>
            }
          }
        </ol>
      </section>
    </main>`,
})



export class App {
  // shoppingListLoad : ListState =
  // {
  //   // articles: [localStorage.getItem(this.shoppingListStore)],
  // }

  shoppingList = signal<Partial<Article>[]>([]);
  historyList = signal<Partial<Article>[]>([]);

  // loadList() {
  //   this.shoppingList.update((shoppingListLoad.articles)
  // }

  // toBuy = inject(shoppingListStore);
// initialState: listState = {
//   articles: [{
//   id: 2,
//   name: "Enten",
//   amount: 5,
//   needed: true,
// }, {
//   id: 2,
//   name: "Enten",
//   amount: 5,
//   needed: true,
// }],
// }
//   // reaktiver Snapshot mit allem, was eine Shopping Liste können muss
// shoppingListStore = signalStore(
// // signalStore macht aus allen Properties der const initialState eigene Signals
// // wenn eine Property sich ändert, wird auch nur diese Property angefasst
//   withState(this.initialState),
// // speichert den Zustand der Liste automatisch, wenn er sich ändert
// // abrufbar ist er dann über den Key: groceries
//   withStorageSync('groceries'),
//   );

  toBuy = new shoppingListStore;
  
  #fb = inject(FormBuilder);

  newArticleForm = this.#fb.nonNullable.group({
    name: this.#fb.nonNullable.control <string>('', Validators.required),
    amount: this.#fb.control<number | null>(null),
    needed: true,
  });

  addItem() {
    const newArticle = this.newArticleForm.value;
    this.shoppingList.update((articles) => [...articles, newArticle]);
    this.newArticleForm.reset();
    console.log(this.shoppingList());

    this.toBuy.articles.update((items) => [...items, newArticle]);
  }
}
