export class Professor {
    
    id: number;
    // tslint:disable-next-line:variable-name
    razao_social: string;
    sobrenome: string;
    cpf: string;
    // tslint:disable-next-line:variable-name
    data_nascimento: string;
    cep: string;
    logradouro: string;
    numero: number;
    complemento: string;
    cidade: number;
    estado: number;
    profissao: string;
    // tslint:disable-next-line:variable-name
    mini_curriculum: string;
    endereco: string;
    foto: string;
    // tslint:disable-next-line:variable-name
    nome_professor: string;
    bairro: string;
    // tslint:disable-next-line:variable-name
    telefone_1: string;
    email: string;
    senha: string;

    constructor(

      ) {  }    

  }
  
export class ProfessorFormacao {
    
    id: number;
    fk_professor_formacao_tipo_id: number;
    instituicao: string;
    curso: string;
    ano_inicio: number;
    ano_conclusao: number;

    constructor(

      ) {  }    

  }  


export interface IProfessorFormacaoTipo {
    
    id: number;
    tipo: string;
    curso: string;

  }  
