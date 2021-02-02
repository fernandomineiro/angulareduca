export class Endereco {

  id: number;
  cep: string;
  logradouro: string;
  numero: number;
  complemento: string;
  // tslint:disable-next-line:variable-name
  fk_cidade_id: string;
  // tslint:disable-next-line:variable-name
  fk_estado_id: string;
  // tslint:disable-next-line:variable-name
  fk_usuario: number;
  bairro: string;

  constructor() {}
}
