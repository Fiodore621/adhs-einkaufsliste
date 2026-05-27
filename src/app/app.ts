import { Component, inject, OnInit, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { updateState, withStorageSync } from '@angular-architects/ngrx-toolkit'
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';

// VERWENDETE TYPEN

// Artikel-Objekte mit allen Attributen
type Article = {
  id: number;
  name: string;
  amount: string;  //warum kriege ich den Error, wenn ich hier | null eingebe?
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
      addArticle() {

      }
    })
  ),
// speichert den Zustand der Liste automatisch, wenn er sich ändert
// abrufbar ist er dann über den Key: groceries
  // withStorageSync('groceries'),
  );


@Component({
  selector: 'app-root',
  imports: [FormField, FormRoot],
  styleUrl: './app.css',
  template: `<header>
      <h1>EDeHS</h1>
      <h2>Welcome, scatterbrain!</h2>
      <p>Let's do some goddamn shopping.</p>
    </header>
    <main>
      <section id="eingabe">
        <h3>Neuen Artikel hinzufügen</h3>
        <form [formRoot]="newArticleForm">
          <label>
            Neuer Artikel: 
            <input type="text" [formField]="newArticleForm.name" />
          </label>
          <label>
            Menge: 
            <input type="text" [formField]="newArticleForm.amount" />
          </label>
          <button type="submit">Artikel hinzufügen</button>
        </form>
      </section>
      <section id="einkaufsliste">
        <h3>Einkaufsliste</h3>

      </section>
    </main>`,
})



export class App{


  // shoppingList = signal<Partial<Article>[]>([]);

  // Signal, das bei der Eingabe in die Input-Felder bearbeitet wird
  newArticle = signal<Article>({
    id: 0,
    name: '',
    amount: '',
    isNeeded: true
  });

  // Instanz des SignalStores, auf den zugegriffen werden soll
  store = new shoppingListStore;
  
 

  newArticleForm = form(this.newArticle, (schemaPath) => {
    required(schemaPath.name, {message: 'Na, also wenigstens ein Stichwort solltest du schon schreiben.'})
  });

  addItem() {

  }
}
