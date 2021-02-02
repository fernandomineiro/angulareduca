export interface Trilha {
    id: number;
    titulo: string;
    icone: string;
    id_faculdade: number;
    nome_faculdade: number;
    trilha_id: string;
    slug_trilha: string;
}
export interface TrilhaConfiguracao {
    id: number;
    pagina_trilha_conhecimento: string;
    fk_criador_id: number;
    fk_atualizador_id: number;
    criacao: string;
    atualizacao: string;
    status: number;
    fk_faculdade_id: number;
}
