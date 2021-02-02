import { Curso } from './curso/curso.model';

  export class quizResultado {
    fk_quiz: number;
    fk_usuario: number;
    qtd_acertos: number;
    qtd_erros: number;
    json_acertos: object;
    json_erros: object;
    nome_curso: string;
    //nome_faculdade: string;
    idioma?: string;
    categorias?: any;
    total_modulos?: string;
    total_minutos?: string;

    constructor(
  
        ) {  } 
  }