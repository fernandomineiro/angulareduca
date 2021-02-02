export class Endereco {
    id: number;
    idUsuario: number;
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    // tslint:disable-next-line:variable-name
    fk_cidade_id: string;
    // tslint:disable-next-line:variable-name
    fk_estado_id: string;
    status: string;
}
