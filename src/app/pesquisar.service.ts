import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PesquisarService {
  private items = new BehaviorSubject([]);
  cursos = this.items.asObservable();

  constructor() { }

  changeCursos(cursos) {
    this.items.next(cursos);
  }
}
