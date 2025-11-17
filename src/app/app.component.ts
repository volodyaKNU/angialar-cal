import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Devices, Mobile, Phone } from './domain/phone';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  radioState = signal<string>('phone');
  currentDevice = signal<Devices | null>(null);
  devicesCollection = signal<Devices[]>([]);

  title = 'lab';
  form!: FormGroup;

  constructor(private fb: FormBuilder) {
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
        modelControl?.setValue(''); // можна очистити поле
      }

      modelControl?.updateValueAndValidity();
    });

    this.form = this.fb.group({
      funcCount: [1, [Validators.required, Validators.minLength(1)]],
      model: ['', []],
    });
  }

  get fc() {
    return this.form.controls;
  }

  pushItem() {
    if (!this.form.valid) return;
    console.log('fdjv');
    this.devicesCollection.update((prev) => {
      const items = [...prev];
      if (this.radioState() === 'phone') {
        const p = new Phone(this.form.value.funcCount);
        items.push(p);
      }
      if (this.radioState() === 'mobile') {
        console.log(this.form.value.model);
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
    if (this.form.valid) {
      if (this.radioState() === 'phone') {
        const p = new Phone(this.form.value.funcCount);
        this.currentDevice.set(p);
      }
      if (this.radioState() === 'mobile') {
        console.log('saidj');
        const m = new Mobile(this.form.value.funcCount, this.form.value.model);
        this.currentDevice.set(m);
      }
      console.log(this.form.value);
    }
  }
}
