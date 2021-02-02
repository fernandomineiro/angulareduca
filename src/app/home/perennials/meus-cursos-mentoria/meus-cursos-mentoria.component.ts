import { Component, OnInit } from '@angular/core';
import { CriarCursoService } from 'src/app/professor/criar-curso/criar-curso.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meus-cursos-mentoria',
  templateUrl: './meus-cursos-mentoria.component.html',
  styleUrls: ['./meus-cursos-mentoria.component.scss']
})
export class MeusCursosMentoriaComponent implements OnInit {

  constructor(private criarCursoService: CriarCursoService, private router: Router ) { 
    this.isMobile = (window.innerWidth < 992) ? true : false;
    if(JSON.parse(localStorage.getItem('user'))){
      if(JSON.parse(localStorage.getItem('user')).fk_perfil == 14)
        this.router.navigate(['/'])
    }
  }
  cursos;
  favorites
  cursosAluno
  isMobile: boolean = false;
  ngOnInit() {
    this.criarCursoService.getCursosMentoria().subscribe(response => {
      console.log("response", response)
      this.cursos = response;
    })
  }

  
  onResized($event): void {
    this.isMobile = (window.innerWidth < 992) ? true : false;    
  }

  
  filterStatusPublicado(curso: any) {
    return curso.status == 'PUBLICADO'    
  }

  

}
