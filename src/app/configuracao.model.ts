
class Logo {
    atualizacao: string;
    criacao: string;
    descricao: string;
    // tslint:disable-next-line:variable-name
    fk_atualizador_id: number;
    // tslint:disable-next-line:variable-name
    fk_criador_id: number;
    // tslint:disable-next-line:variable-name
    fk_faculdade_id: number;
    id: number;
    slug: string;
    status: number;
    // tslint:disable-next-line:variable-name
    url_logtipo: string;
}

class TipoCursos {
    // tslint:disable-next-line:variable-name
    ativar_cursos_hibridos: number;
    // tslint:disable-next-line:variable-name
    ativar_cursos_online: number;
    // tslint:disable-next-line:variable-name
    ativar_cursos_presenciais: number;
    // tslint:disable-next-line:variable-name
    ativar_eventos: number;
    // tslint:disable-next-line:variable-name
    ativar_trilha_conhecimento: number;
    // tslint:disable-next-line:variable-name
    ativar_membership: number;
    // tslint:disable-next-line:variable-name
    ativar_parceiros: number;
    // tslint:disable-next-line:variable-name
    ativar_biblioteca: number;
    // tslint:disable-next-line:variable-name
    ativar_vantagens_assinantes: number;
    // tslint:disable-next-line:variable-name
    ativar_descubra_trilhas: number;
    // tslint:disable-next-line:variable-name
    ativar_seja_professor: number;
    // tslint:disable-next-line:variable-name
    ativar_autenticidade_certificado: number;
    // tslint:disable-next-line:variable-name
    ativar_faz_curso_superior: number;
    // tslint:disable-next-line:variable-name
    ativar_faz_especializacao: number;
    // tslint:disable-next-line:variable-name
    ativar_banner_secundario: number;
    atualizacao: string;
    criacao: string;
    // tslint:disable-next-line:variable-name
    fk_atualizador_id: number;
    // tslint:disable-next-line:variable-name
    fk_criador_id: number;
    // tslint:disable-next-line:variable-name
    fk_faculdade_id: number;
    id: number;
    status: number;
    teaser: string;
    // tslint:disable-next-line:variable-name
    banner_secundario: string;
    // tslint:disable-next-line:variable-name
    banner_lateral: string;
    // tslint:disable-next-line:variable-name
    url_quem_somos: string;
    // tslint:disable-next-line:variable-name
    header_primario: string;
    // tslint:disable-next-line:variable-name
    header_secundario: string;

    descricao: string;
    favicon: string;
    // tslint:disable-next-line:variable-name
    css_categorias: string;
    // tslint:disable-next-line:variable-name
    cor_banner_login: string;
    // tslint:disable-next-line:variable-name
    banner_central: string;
    // tslint:disable-next-line:variable-name
    texto_banner_central: string;
    // tslint:disable-next-line:variable-name
    primeiro_texto_login: string;
    // tslint:disable-next-line:variable-name
    segundo_texto_login: string;
}

export class Configuracao {
    logo: Logo;
    parceiros: Array<any>;
    redesSociais: Array<any>;
    tiposCursosAtivos: TipoCursos;
    sac: any;
    itv: number;
    layoutHome: number;
    estilos: Array<any>;
    ga: Array<any>;
    facebook: Array<any>;
}


export interface LogoTipo {
    id: number;
    status: number;
    descricao: string;
    url_logtipo: string;
    slug: string;
    fk_faculdade_id: number;
}

export interface RedeSocial {
    id: number;
    status: number;
    titulo: string;
    rede_url: string;
    fk_faculdade_id: number;
}

export interface TipoCurso {
    id: number;
    fk_faculdade_id: number;
    status: number;
    fk_criador_id: number;
    fk_atualizador_id: number;
    ativar_cursos_online: boolean;
    ativar_cursos_presenciais: boolean;
    ativar_cursos_hibridos: boolean;
    ativar_cursos_mentoria: boolean;
    ativar_eventos: boolean;
    ativar_trilha_conhecimento: boolean;
    ativar_membership: boolean;
    ativar_parceiros: boolean;
    ativar_biblioteca: boolean;
    ativar_vantagens_assinantes: boolean;
    ativar_descubra_trilhas: boolean;
    ativar_seja_professor: boolean;
    ativar_autenticidade_certificado: boolean;
    ativar_faz_curso_superior: boolean;
    ativar_faz_especializacao: boolean;
    ativar_banner_secundario: boolean;
    tipo_layout: number;
    criacao: string;
    atualizacao: string;
    teaser: string;
    banner_secundario: string;
    banner_lateral: string;
    url_quem_somos: string;
    header_primario: string;
    header_secundario: string;
    descricao: string;
    favicon: string;
    css_categorias: string;
    cor_banner_login: string;
    banner_central: string;
    texto_banner_central: string;
    primeiro_texto_login: string;
    segundo_texto_login: string;
}

export interface Sac {
    id: number;
    fk_faculdade_id: number;
    status: number;
    descricao: string;
    telefone_1: string;
    telefone_2: string;
    skype: string;
    hangouts: string;
    whatsapp: string;
    telegram: string;
    email: string;
    url_sac: string;
    slug: string;
}

export interface Analytics {
    id: number;
    status: number;
    fk_faculdade: number;
    fk_atualizador_id: number;
    fk_criador_id: number;
    atualizacao: string;
    criacao: string;
    id_visualizacao: string;
    pixel: string;
    tipo_pixel: string;
}

export interface Estilo {
    descricao: string;
    value: string;
    nome: string;
}
