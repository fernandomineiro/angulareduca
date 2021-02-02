export class Curso {
  id: number;
  nome_curso: string;
  sobre_curso: string;
  objetivo_descricao: string;
  publico_alvo: string;
  teaser: string;
  valor: number;
  valor_de: string;
  //nome_faculdade: string;
  nome_professor: string;
  sobre_professor: string;
  id_professor: number;
  tipo?: number;
  data?: string;
  cidade?: string;
  estado?: string;
  idioma?: string;
  formato?: string;
  duracao?: string;
  certificado?: string;
  imagem: string;
  categorias?: any;
  total_modulos?: string;
  total_minutos?: string;
  indisponivel_venda?: boolean;

  constructor(

    ) {  }  
}

export interface ICursosCategorias {
  id: number;
  titulo: string;
}
