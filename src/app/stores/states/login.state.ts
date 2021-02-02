import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoginState {
    current: {} = {
        value: null,
        title: null,
        endpoint: null,
        hasCadastro: true
    };
    user: {};
}
