import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder, ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { updateState, withStorageSync } from '@angular-architects/ngrx-toolkit'
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';

// VERWENDETE TYPEN

// Artikel-Objekte mit allen Attributen
type Article = {
  id: number;
  name: string;
  amount: string | null;
  isNeeded: boolean;
};

// Listen-Zustände, kann zB um Filter erweitert werden
type listState = {
  articles: Article[];
};


// VERWENDETE VARIABLEN

// Default zum Prüfen
const Beispiel1: Article = {
  id: 1,
  name: "Katzenfutter",
  amount: '2 Säcke',
  isNeeded: true,
}

const Beispiel2: Article = {
  id: 2,
  name: "Entenfutter",
  amount: '5 Portionen',
  isNeeded: true,
}

const groceries = signal<Article[]>([]);

// Zustand, den die Liste beim ersten Laden haben soll
const initialState: listState = {
  articles: [Beispiel1, Beispiel2],
}

// reaktiver Snapshot mit allem, was eine Shopping Liste können muss
const shoppingListStore = signalStore(
// signalStore macht aus allen Properties der const initialState eigene read only-Signals
// wenn eine Property sich ändert, wird auch nur diese Property angefasst
  withState(initialState),
  withMethods(
    // factory function, die einen bearbeitbaren Zustand herstellt (?)
    (store) => ({
      addArticle
    })
  ),
// speichert den Zustand der Liste automatisch, wenn er sich ändert
// abrufbar ist er dann über den Key: groceries
  // withStorageSync('groceries'),
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
        <form>

        </form>
      </section>
      <section id="einkaufsliste">
        <h3>Einkaufsliste</h3>

      </section>
    </main>`,
})



export class App implements OnInit{


  // shoppingList = signal<Partial<Article>[]>([]);

  ngOnInit(): void {
    
  }


  store = new shoppingListStore;
  
  #fb = inject(FormBuilder);

  newArticleForm = this.#fb.nonNullable.group({
    id: dateTimestampProvider.now(),
    name: this.#fb.nonNullable.control <string>('', Validators.required),
    amount: this.#fb.control<string | null>(null),
    needed: true,
  });

  addItem() {
    const newArticle : Partial<Article> = {
      id: this.newArticleForm.value.id,
      name: this.newArticleForm.value.name,
      amount: this.newArticleForm.value.amount,
      isNeeded: true,
    };
    // this.shoppingList.update((articles) => [...articles, newArticle]);
    // this.newArticleForm.reset();
    // console.log(this.shoppingList());

    this.store.updateList(newArticle);
    console.log(this.store.articles());
  }
}
