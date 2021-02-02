import { Injectable } from '@angular/core';
import { Categoria } from '../../categorias/categorias.model';

@Injectable({
    providedIn: 'root'
})
export class CategoriaState {
    categorias: Array<Categoria> = [];
}
