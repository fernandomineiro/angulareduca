export interface Trilha {
    id: number;
    gratis: number;
    total_curso: number;
    descricao: string;
    slug_trilha: string;
    titulo: string;
    total_minutos: string;
    valor: string;
    valor_venda: string;
}

export enum CursoTypes {
    ONLINE = 1,
    PRESENCIAL = 2,
    HIBRIDO = 4
}
