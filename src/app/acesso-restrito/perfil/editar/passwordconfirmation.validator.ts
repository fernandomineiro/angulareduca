import { AbstractControl } from '@angular/forms';

export function PasswordMatchValidator(control: AbstractControl) {
    const password: string = control.get('senha').value;
    const passwordConfirmated: string = control.get('senha_confirmar').value;

    if (password !== passwordConfirmated) {
        control.get('senha_confirmar').setErrors({ NoPassswordMatch: true });
    }

    return null;
}
