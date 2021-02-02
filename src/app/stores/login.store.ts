import { Store } from './store';
import { Injectable } from '@angular/core';
import { LoginState } from './states/login.state';

@Injectable({
    providedIn: 'root'
})
export class LoginStore extends Store<LoginState> {

    constructor() {
        super(new LoginState());
    }

    updateCurrentEndpoint(currentValue: object): void {
        this.setState({
            ...this.state,
            current: currentValue
        });
    }

    updateCurrentUser(currentUser: object): void {
        this.setState({
            ...this.state,
            user: currentUser
        });
    }
}
