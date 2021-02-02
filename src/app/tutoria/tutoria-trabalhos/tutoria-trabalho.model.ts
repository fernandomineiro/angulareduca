export interface TutoriaTrabalho {
    id:string
    name:string
    envios:[
        {
            id:string
            student:string
            studentId:string
            grade:number
            downloadPath:string
        }
    ]
  }