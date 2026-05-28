import { Component, inject, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { ShoppingListStore } from './app-store';
import { ArticleForm } from './types';

@Component({
  selector: 'app-root',
  imports: [FormField], // FormRoot könnte die Submission-Lösung sein
  template: `
    <header>
      <h1>EDeHS</h1>
      <h2>Welcome, scatterbrain!</h2>
      <p>Let's do some goddamn shopping.</p>
    </header>
    <main>
      <section id="eingabe">
        <h3>Neuen Artikel hinzufügen</h3>
        <form>
          <label>
            Neuer Artikel:
            <input type="text" [formField]="articleForm.name" />
          </label>
          <label>
            Menge:
            <input type="text" [formField]="articleForm.amount" />
          </label>
          <button type="submit" (click)="store.addArticle(formValues())">Artikel hinzufügen</button>
        </form>
      </section>
      <section id="einkaufsliste">
        <h3>Einkaufsliste</h3>
        <ul>
          @for (article of store.articles(); track article.id) {
            @if (article.isDone === false) {
              <li>
                {{ article.name + ', ' + article.amount }}
                <span
                  ><button (click)="store.updateArticle(article.id, formValues())">&#10003;</button>
                  <button (click)="store.removeArticle(article.id)">❌</button></span
                >
              </li>
            }
          }
        </ul>
        <h3>Vorschläge</h3>
        <ul>
          @for (article of store.articles(); track article.id) {
            @if (article.isDone === true) {
              <li>
                {{ article.name + ', ' + article.amount }}
                <span
                  ><button (click)="store.updateArticle(article.id, formValues())">&#10003;</button>
                  <button (click)="store.removeArticle(article.id)">❌</button></span
                >
              </li>
            }
          }
        </ul>
      </section>
    </main>
  `,
})
export class App {
  // Instanz des SignalStores, auf den zugegriffen werden soll
  store = inject(ShoppingListStore);

  formValues = signal<ArticleForm>({ name: '', amount: '', isDone: false });

  // Form-Objekt, schemaPath gibt Validation-Regeln an
  articleForm = form(this.formValues, (schemaPath) => {
    required(schemaPath.name, {
      message: 'Na, also wenigstens ein Stichwort solltest du schon schreiben.',
    });
  });
}
