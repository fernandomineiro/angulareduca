export interface User {
    id: number;
    fk_perfil: number;
    email: string;
    fk_faculdade_id: number;
    aluno_kroton: string;
    foto: string;
    last_login: string;
    nome: string;
    remember_token: string;
    status: string;
}

export interface Membership {
    id: number;
    assinatura_id: string;
    assinatura_titulo: string;
    pid: string;
    status: string;
    tipo_assinatura: string;
    tipo_assinatura_id: string;
    tipo_liberacao: string;
    titulo: string;
    valor_bruto: string;
    valor_desconto: string;
}

export interface Curso {
    id: number;
    idioma: string;
    imagem: string;
    nome_curso: string;
    nome_professor: string;
    slug_curso: string;
    sobrenome_professor: string;
    tipo: number;
    valor: string;
    valor_de: string;
}

export interface LoginModel {
    userN: string;
    user: User;
    perfil: string;
    faculdade: string;
    loggedIn: string;
    krotonAccess: string;
    perfilNome: string;
    foto: string;
    nome: string;
    email: string;
    membership: Membership[];
    pass: string;
    usuario_id: string;
    token: string;
    meusCursos: {
        isLoaded: boolean,
        online: Curso[],
    };
}
