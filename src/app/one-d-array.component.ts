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
  selector: 'app-one-d-array',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './one-d-array.component.html',
  styleUrl: './one-d-array.component.css',
})
export class OneDArrayComponent {
  form: FormGroup;
  resultCount = signal<number | null>(null);

  readonly size = 10; // декада листопада

  constructor(private fb: FormBuilder) {
    const controls: FormControl[] = [];

    for (let i = 0; i < this.size; i++) {
      controls.push(
        this.fb.control('', [
          Validators.required, // просто обов'язкове поле
        ])
      );
    }

    this.form = this.fb.group({
      temps: this.fb.array(controls),
    });
  }

  get temps(): FormArray {
    return this.form.get('temps') as FormArray;
  }

  getTempControl(i: number): FormControl {
    return this.temps.at(i) as FormControl;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.temps.value as (string | number)[];
    const numbers = values.map((v) => Number(v));
    const belowMinus10 = numbers.filter((t) => t < -10).length;

    this.resultCount.set(belowMinus10);
  }

  reset(): void {
    this.temps.controls.forEach((c) => c.setValue(''));
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.resultCount.set(null);
  }
}
