import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PesquisaState {
    cursos: Array<object> = [];
}
