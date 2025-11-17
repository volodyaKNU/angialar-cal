export class Phone {
  readonly kind: PhoneKind = 'phone';

  constructor(public k: number) {
    if (!Number.isFinite(k) || k <= 0) {
      throw new Error('k має бути додатним числом');
    }
  }

  // 🔹 Тепер cost — гетер, а не метод
  get cost(): number {
    return 40 * Math.log(this.k);
  }

  // 🔹 type теж гетер
  get type(): string {
    return 'Телефон';
  }

  // 🔹 У звичайного телефона моделі немає — повертаємо "—"
  get model(): string {
    return '—';
  }
}

export class Mobile extends Phone {
  override readonly kind: PhoneKind = 'mobile';
  private _model: string;

  constructor(k: number, model = '') {
    super(k);
    this._model = model?.trim() ?? '';
  }

  // 🔹 Мобільний = 3 * cost базового телефона
  override get cost(): number {
    return 3 * super.cost;
  }

  override get type(): string {
    return 'Мобільний';
  }

  // 🔹 Якщо модель порожня — теж повертаємо "—"
  override get model(): string {
    console.log(this._model);
    return this._model || '—';
  }
}

export type PhoneKind = 'phone' | 'mobile';

export type Devices = Phone | Mobile;
