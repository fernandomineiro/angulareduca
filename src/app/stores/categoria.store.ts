import { Store } from './store';

import { Injectable } from '@angular/core';
import { CategoriaState } from './states/categoria.state';
import { Categoria } from '../categorias/categorias.model';

@Injectable({
    providedIn: 'root'
})
export class CategoriaStore extends Store<CategoriaState> {

    constructor() {
        super(new CategoriaState());
    }

    updateCategorias(categorias: Array<Categoria>): void {
        this.setState({
            ...this.state,
            categorias
        });
    }
}
