import { Store } from './store';

import { PesquisaState } from './states/pesquisa.state';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PesquisaStore extends Store<PesquisaState> {

    constructor() {
        super(new PesquisaState());
    }

    updateCursos(cursos: Array<object>): void {
        this.setState({
            ...this.state,
            cursos: cursos
        });
    }
}
