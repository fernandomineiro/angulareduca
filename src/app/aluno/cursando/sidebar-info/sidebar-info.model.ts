export interface SidebarInfo {
    nome_curso:string
    nome_faculdade:string
    categoria:Array<ICursosCategorias>
    idioma:string
    modulos:number
    duracao:number
    certificado:string
    percent:number
    respostas_corretas:number
    respostas_incorretas:number
    tempo_finalizar:number
  }

  export interface ICursosCategorias {
    id: number;
    titulo: string;
  }