export interface Curso {
    id: number;
    nome_curso: string;
    idioma: string;
    slug_curso: string;
    imagem: string;
    valor: string;
    valor_de: string;
    nome_professor: string;
    sobrenome_professor: string;
    tipo: number;
    data_inicio: string;
    ordem: number;
    curso_concluido: boolean;
}

export interface Categoria {
    id: number;
    titulo: string;
    slug_categoria: string;
    autocomplete: string;
    cursos: Curso[];
}

export interface Estrutura {
    id: number;
    titulo: string;
    tipo_liberacao: number;
    categorias: Categoria[];
}

