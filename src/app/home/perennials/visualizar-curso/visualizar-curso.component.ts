import { Component, OnInit } from '@angular/core';
import { ProfessorService } from 'src/app/professor/professor.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-visualizar-curso',
  templateUrl: './visualizar-curso.component.html',
  styleUrls: ['./visualizar-curso.component.scss']
})
export class VisualizarCursoComponent implements OnInit {

  constructor(private professorService: ProfessorService, private router: Router,  private sanitizer: DomSanitizer) {
    if(JSON.parse(localStorage.getItem('user'))){
      if(JSON.parse(localStorage.getItem('user')).fk_perfil == 14)
        this.router.navigate(['/'])
    }
   }
  obj
  profInfo
  src
  IMG_URL = environment.s3_url
  ngOnInit() {
    this.obj = JSON.parse(localStorage.getItem('visualizarPerennials'))
    if(this.obj){
      this.src = 'https://player.vimeo.com/video/' + this.obj.teaser;
      this.src = this.sanitizer.bypassSecurityTrustResourceUrl(this.src)
      console.log("oi", this.obj)
      this.professorService.getById(this.obj.fk_professor).subscribe((response)=>{
        console.log(this.obj, response)
        this.profInfo = response.data[0];
      })
    }else{
      this.router.navigate(['/'])
    }
    
  }

}
