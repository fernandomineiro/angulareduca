export interface TrilhaDetalhe {
    id: number,
    titulo: string,
    descricao: string,
    valor: string,
    valor_venda: string,
    nome_faculdade: string,
    id_faculdade: number,
    id_categoria: number,
    nome_categoria: string, 
    trilha_id: number, 
    slug_trilha: string
}
export interface Curso {
    id: number,
    fk_curso: number,
    nome_curso: string,
    curso_imagem: string,
    nome_faculdade: string,
    nome_professor: string,
    foto_professor: string,
    detalhe_professor: string,
    tipo: number,
    id_faculdade: number
}
export interface TrilhaSobre {
    trilha: TrilhaDetalhe[],
    cursos: Curso[],
    trilhaName: string,
    categoryName: string,
    categorias: any,
    trilha_id: number, 
    slug_trilha: string,
    socialMediaLinks:
        {
            facebook?:string
            twitter?:string
            linkedin?:string
            pinterest?:string
            googlePlus?:string
        }
    
    starRate:number
    language:string
    coursePresencialAmount:number
    courseOnlineAmount:number
    totalHours:number
    certification:string
    valueTotal:number
    parcelaAmount:number
    parcelaValue:number
    economy:number
    about:string
    coursesOnline:[
        {
            id:string
            imgSrc:string
            name:string
            teacher:string
        }
    ]
    coursesPresencial:[
        {
            id:string
            imgSrc:string
            cityState:string
            name:string
            teacher:string
            day:string
            price:number
        }
    ]
    teachers:[
        {
            id:string
            imgSrc:string
            name:string
        }
    ]
    rulesInformation:string
    comments:[
        {
            imgSrc:string
            starsRate:number
            name:string
            comment:string
        }
    ]
    
  }

