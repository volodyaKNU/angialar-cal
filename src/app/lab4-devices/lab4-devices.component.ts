import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Devices, Mobile, Phone } from '../domain/phone';

@Component({
  selector: 'app-lab4-devices',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lab4-devices.component.html',
  styleUrl: './lab4-devices.component.css',
})
export class Lab4DevicesComponent {
  radioState = signal<string>('phone');
  currentDevice = signal<Devices | null>(null);
  devicesCollection = signal<Devices[]>([]);

  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    // Спочатку створюємо форму
    this.form = this.fb.group({
      funcCount: [
        1,
        [
          Validators.required,
          Validators.min(1), // мінімальне значення 1
        ],
      ],
      model: ['', []],
    });

    // Потім підписуємося ефектом на radioState і модель
    effect(() => {
      const isMobile = this.radioState() === 'mobile';
      const modelControl = this.form.get('model');

      if (isMobile) {
        modelControl?.setValidators([
          Validators.required,
          Validators.minLength(2),
        ]);
      } else {
        modelControl?.clearValidators();
        modelControl?.setValue('');
      }

      modelControl?.updateValueAndValidity();
    });
  }

  get fc() {
    return this.form.controls;
  }

  pushItem() {
    if (!this.form.valid) return;

    this.devicesCollection.update((prev) => {
      const items = [...prev];
      if (this.radioState() === 'phone') {
        const p = new Phone(this.form.value.funcCount);
        items.push(p);
      }
      if (this.radioState() === 'mobile') {
        const m = new Mobile(this.form.value.funcCount, this.form.value.model);
        items.push(m);
      }
      return items;
    });
  }

  reset() {
    this.devicesCollection.set([]);
  }

  submit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.radioState() === 'phone') {
      const p = new Phone(this.form.value.funcCount);
      this.currentDevice.set(p);
    }
    if (this.radioState() === 'mobile') {
      const m = new Mobile(this.form.value.funcCount, this.form.value.model);
      this.currentDevice.set(m);
    }
  }
}
