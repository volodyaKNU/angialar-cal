import { Component, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-two-d-array',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './two-d-array.component.html',
  styleUrl: './two-d-array.component.css',
})
export class TwoDArrayComponent {
  form: FormGroup;

  readonly size = 5;

  // Результати
  minValue = signal<number | null>(null);
  minRow = signal<number | null>(null); // 1..5
  minCol = signal<number | null>(null); // 1..5
  relationText = signal<string | null>(null);

  constructor(private fb: FormBuilder) {
    const rows: FormArray[] = [];

    for (let i = 0; i < this.size; i++) {
      const rowControls: FormControl[] = [];
      for (let j = 0; j < this.size; j++) {
        rowControls.push(
          this.fb.control('', [
            Validators.required,
            Validators.pattern(/^-?\d+$/), // тільки ціле число
          ])
        );
      }
      rows.push(this.fb.array(rowControls));
    }

    this.form = this.fb.group({
      matrix: this.fb.array(rows),
    });
  }

  get matrix(): FormArray {
    return this.form.get('matrix') as FormArray;
  }

  rowAt(i: number): FormArray {
    return this.matrix.at(i) as FormArray;
  }

  cellAt(i: number, j: number): FormControl {
    return this.rowAt(i).at(j) as FormControl;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let minVal = Number.POSITIVE_INFINITY;
    let minI = 0;
    let minJ = 0;

    // Знаходимо мінімум і його індекси
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const val = Number(this.cellAt(i, j).value);
        if (val < minVal) {
          minVal = val;
          minI = i;
          minJ = j;
        }
      }
    }

    this.minValue.set(minVal);
    this.minRow.set(minI + 1); // 1..5 для виводу
    this.minCol.set(minJ + 1);

    // 🔹 Логіка відносно правої (другорядної) діагоналі
    // для матриці 5×5 індекси діагоналі: i + j = 4
    const diagIndex = this.size - 1; // 4
    const sum = minI + minJ;

    let rel: string;
    if (sum === diagIndex) {
      rel = 'на правій діагоналі';
    } else if (sum < diagIndex) {
      rel = 'вище правої діагоналі';
    } else {
      rel = 'нижче правої діагоналі';
    }

    this.relationText.set(rel);
  }

  reset(): void {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.cellAt(i, j).setValue('');
      }
    }
    this.form.markAsPristine();
    this.form.markAsUntouched();

    this.minValue.set(null);
    this.minRow.set(null);
    this.minCol.set(null);
    this.relationText.set(null);
  }
}
