export interface User {
    id: string,
    nome: string,
    email: string,    
    perfil: string,
    perfilNome?: string,
    foto: string,
    token: string,
    fk_perfil?: string,
    faculdade: string
}