import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder, ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { withStorageSync } from '@angular-architects/ngrx-toolkit'
import { signalStore, withState } from "@ngrx/signals";

//muss vor der Component stehen
type Article = {
  name: string;
  amount: number | null;
  needed: boolean;
}

// type ListState = {
//   articles: Article[] | null;
// }
// let shoppingListLoad  = localStorage.getItem('groceries')

// if(typeof localStorage.getItem('groceries') === null) {
//   let shoppingListLoad: ListState = {
//     articles: [],
//   }
// }

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


  // shoppingListStore = signalStore(
  //   withState({ articles: this.shoppingList() }),
  //   withStorageSync('groceries'),
  // )
  
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
  }
}
