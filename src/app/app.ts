import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder, ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  // templateUrl: './app.html',
  template: `<header>
      <h1>EDeHS</h1>
      <h2>Welcome, scatterbrain!</h2>
      <h4>Let's do some goddamn shopping.</h4>
    </header>
    <main>
      <section id="eingabe">
        <h3>Neuen Artikel hinzufügen</h3>
        <form [formGroup]="artikelForm" (ngSubmit)="addItem()">
          <label for="artikel">Artikelbezeichnung:</label>
          <input
            formControlName="artikel"
            type="text"
            id="artikel"
            placeholder="Brot, Eier, Milch..."
          />
          <label for="menge">Menge: </label>
          <input formControlName="menge" type="number" id="menge" placeholder="42" />
          <button [disabled]="!artikelForm.valid" type="submit">Hinzufügen!</button>
        </form>
      </section>
      <section id="einkaufsliste">
        <h3>Einkaufsliste</h3>
        <ul>
          @for (item of Liste; track $index) {
            <li>{{ item }}</li>
          }
        </ul>
      </section>
    </main>`,
  styleUrl: './app.css',
})
export class App {
  Liste = [''];
  protected readonly title = signal('edhs');

  public fb = inject(FormBuilder);

  artikelForm = this.fb.nonNullable.group({
    artikel: ['', Validators.required],
    menge: [],
  });

  addItem() {
    const test = this.artikelForm.getRawValue();
    this.Liste.push(neuerArtikel.name);
    console.log(this.Liste.length);
  }
}
