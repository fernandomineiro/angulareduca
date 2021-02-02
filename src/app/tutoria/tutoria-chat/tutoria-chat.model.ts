export interface TutoriaChat {    
    name:string
    courseName:string
    profilePicture:string
    messages:[
        {
            type:string
            sentDate:string
            sentTime:string
            content:string
        }
    ]
  }