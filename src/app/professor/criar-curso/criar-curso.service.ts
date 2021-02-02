import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, ADDRESS_API } from 'src/app/app.api';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
      'Content-Type':  'application/json'
  })
};


@Injectable({
  providedIn: 'root'
})

export class CriarCursoService {

  constructor(private http: HttpClient) { }

  getCriarCurso(type:number): Observable<any> {    
    return this.http.get<any>("../assets/modelos json/criar-curso-online.json") ;   
  }

  getCriarCursoPresencial(type:number): Observable<any> {    
    return this.http.get<any>("../assets/modelos json/criar-curso-presencial.json") ;   
  }

  getCriarCursoRemoto(type:number): Observable<any> {    
    return this.http.get<any>("../assets/modelos json/criar-curso-remoto.json") ;   
  }

  getCriarEvento(type:number): Observable<any> {
    return this.http.get<any>("../assets/modelos json/criar-evento.json") ;   
  }

  getRascunhos(id,type:number): Observable<ApiResponse> {
   // return this.http.get<ApiResponse>(`${ADDRESS_API}/api/cursos-por-professor/${id}/${type}/rascunho`) ;   
   return this.http.get<any>("../assets/modelos json/criar-curso-enviados.json") ; 
  }

  getCursosProfessor(id, tipo, faculdade): Observable<any> {
   // return this.http.get<ApiResponse>(`${ADDRESS_API}/api/cursos-por-professor/${id}/${type}/rascunho`) ;
   return this.http.get<any>(`${ADDRESS_API}/api/cursos-por-professor/${id}/${tipo}/${faculdade}/meus-cursos`);
  }

  getCategorias(): Observable<ApiResponse> {
      return this.http.get<ApiResponse>(`${ADDRESS_API}/api/categorias`);
  }

  getCurso(id): Observable<ApiResponse> {
   // return this.http.get<ApiResponse>(`${ADDRESS_API}/api/cursos-por-professor/${id}/${type}/rascunho`) ;
   return this.http.get<any>(`${ADDRESS_API}/api/curso-ver/${id}`);
  }

  getEnviados(id,type:number): Observable<ApiResponse> {    
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/cursos-por-professor/${id}/${type}/enviado`) ;   
  }

  getProjetos(): Observable<any> {    
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/faculdade`) ;   
  }

  getCertificado(faculdade: number): Observable<any> {
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/certificado/${faculdade}/lista`) ;
  }

  getProfessores(): Observable<any> {    
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/professores-criar-curso`) ;
  }

  getCuradores(): Observable<any> {    
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/curadores`) ;    
  }

  getProdutoras(): Observable<any> {    
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/produtoras`) ; 
  }

  postData(data, editar): Observable<ApiResponse> {
    if (editar) {
      return this.http.post<ApiResponse>(`${ADDRESS_API}/api/curso/edit`, data);
    } else {
      return this.http.post<ApiResponse>(`${ADDRESS_API}/api/curso/create`, data);
    }
  }

  postCursoMentoria(data, editar, id?): Observable<ApiResponse> {
    if (editar) {
      return this.http.post<ApiResponse>(`${ADDRESS_API}/api/mentoria/${id}`, data);
    } else {
      return this.http.post<ApiResponse>(`${ADDRESS_API}/api/mentoria`, data);
    }
  }

  getCursosMentoria(): Observable<any> {    
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/mentoria?with=categorias;tags;professor`) ;    
  }

  getCursosFromCategoriaMentoria(idCategoria): Observable<any> {    
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/curso/mentoria/categorias?with=mentorias;mentorias.professor&search=${idCategoria}`) ;    
  }
  
  deleteCursoMentoria(cursoId): Observable<any> {    
    return this.http.delete<ApiResponse>(`${ADDRESS_API}/api/mentoria/${cursoId}`) ;    
  }

  uploadFiles(file): Observable<any> {
    console.log(file);
    return this.http.post<ApiResponse>(`${ADDRESS_API}/api/curso-files`, file);
  }

  postComentariosMentoria(id, data): Observable<ApiResponse> {
      return this.http.post<ApiResponse>(`${ADDRESS_API}/api/mentoria/${id}/comentarios`, data); 
  }
 getComentariosMentoria(id): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/mentoria/${id}/comentarios`); 
}

  getDuracaoTotal(modulos, agendas) {
    let duracaoTotal = 0;
    if (modulos && modulos.length > 0) {
      for (const e of modulos) {
          const tempo = e.value.split(':')
          if (tempo[0] && tempo[1] && tempo[2]) {
              const segundos = parseInt(tempo[2]) / 60
              duracaoTotal = duracaoTotal + parseInt(tempo[0]) * 60 + parseInt(tempo[1]) + (Math.floor(segundos * 1e2) / 1e2);
          }
      }
    }
    if (agendas && agendas.length > 0) {
      for (let i = 0; i < agendas.length; i++) {
          const agenda = agendas.controls[i].value
          if (agenda && agenda.duracao_aula) {
              const tempo = agenda.duracao_aula.split(':')
              duracaoTotal = duracaoTotal + parseInt(tempo[0]) * 60 + parseInt(tempo[1]);
          }
      }
    }
    if (duracaoTotal > 0) {
        const horas = Math.floor(duracaoTotal / 60);
        const horass = (horas > 9) ? horas + '' : '0' + horas;
        const minutos = duracaoTotal % 60;
        const segundos = (minutos - Math.floor(minutos)) * 60;
        const ssegundos = (segundos > 9) ? Math.round(segundos) : '0' + Math.round(segundos);
        const minutoss = (minutos > 9) ? Math.floor(minutos) + '' : '0' + Math.floor(minutos);
        return horass + ':' + minutoss;
    } else {
        return '00:00';
    }
  }

  calculaDuracao(duration: number) {
      const horas   = Math.floor(duration / 3600);
      const minutos = Math.floor((duration - (horas * 3600)) / 60);
      const segundos = Math.floor(duration - (horas * 3600) - (minutos * 60));
      const horass = (horas > 9) ? horas : '0' + horas;
      const minutoss = (minutos > 9) ? minutos : '0' + minutos;
      const ssegundos = (segundos > 9) ? segundos : '0' + segundos;
      const duracaoTotal = horass + ':' + minutoss + ':' + ssegundos;

      return duracaoTotal;
  }
}
