export class Proposta {
    id: number;
    titulo: string;
    fk_categoria_id: number;    
    descricao: string;
    objetivo: string;
    publico_alvo: string;      
//    url_video: string;
//    duracao_total: string;
//    sugestao_preco: string; 
            
    constructor(

      ) {  }    

  }
 
  
export interface IPropostaCategorias {
    
  id: number;
  titulo: string;

}

    
export class PropostaModulos {
    id: number;
    fk_professor_formacao_tipo_id: number;
    titulo: string;

    constructor(

      ) {  }    

  }
 
  
