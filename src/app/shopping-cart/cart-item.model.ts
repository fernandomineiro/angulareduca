import {Curso} from '../curso/curso.model'

export class CartItem {
  constructor(public cursoItem: Curso,
              public quantity: number = 1){}

  value(): number {
    return this.cursoItem.valor
  }
}