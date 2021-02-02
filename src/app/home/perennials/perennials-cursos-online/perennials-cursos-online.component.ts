import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/header/header.service';
import { CursosService } from 'src/app/curso/cursos.service';
import { LoginService } from 'src/app/security/login/login.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CriarCursoService } from 'src/app/professor/criar-curso/criar-curso.service';
import { ViewChild } from '@angular/core';


@Component({
  selector: 'app-perennials-cursos-online',
  templateUrl: './perennials-cursos-online.component.html',
  styleUrls: ['./perennials-cursos-online.component.scss']
})
export class PerennialsCursosOnlineComponent implements OnInit {

  @ViewChild('novoComentario') novoComentario

  isMobile: boolean = false;
  offsetLeftContainer
  widthContainer
  favorites
  cursosAluno
  cursos
  curso_id
  curso
  IMG_URL = environment.s3_url
  src
  isAluno = true
  evaluation = 0
  comentarios
  submitted = false;
  permission = false;
  constructor(private headerService: HeaderService, private cursosService: CursosService, private loginService: LoginService, private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router, private criarCursoService: CriarCursoService) {
    if (!localStorage.getItem('user')) {
      router.navigate(['/'])
      return;
    } else {
      this.isAluno = JSON.parse(localStorage.getItem('user')).fk_perfil == 14
    }

    this.isMobile = (window.innerWidth < 992) ? true : false;
    var interval = setInterval(() => {
      if ($('#web_navbar .container').offset() != undefined) {
        this.offsetLeftContainer = $('#web_navbar .container').offset().left;
        this.widthContainer = $('#web_navbar .container').width();
        clearInterval(interval)
      }
    })
  }

  ngOnInit() {
    this.headerService.selectedItem.next('perennialsCursoOnline');
    console.log("evaluation", this.evaluation)
    this.cursosService.getCourseMentoriaBySlug(this.route.snapshot.params['id']).subscribe((ApiResponse) => {
      this.curso = ApiResponse;
      this.getProfessorPermission();
      this.src = 'https://player.vimeo.com/video/' + this.curso.url_video;
      this.src = this.sanitizer.bypassSecurityTrustResourceUrl(this.src)
      console.log("response2", ApiResponse)
       
      this.cursosService.getFavorites(localStorage.getItem('usuario_id')).subscribe(favorites => {
        this.favorites = favorites;

      })
     this.getComentarios();
     this.getMoreCourses();
    })
    


  }

  getComentarios(){
    this.criarCursoService.getComentariosMentoria(this.curso.id).subscribe(response => {
      this.comentarios = response;

    })
  }


  onResized($event): void {
    this.isMobile = (window.innerWidth < 992) ? true : false;
    if ($('#web_navbar .container').offset() != undefined)
      this.offsetLeftContainer = $('#web_navbar .container').offset().left;
    this.widthContainer = $('#web_navbar .container').width();
  }

  returnSlideConfig(element, cardWidth) {
    return {
      centerMode: false,
      slidesToShow: Math.floor(($(element).width() / cardWidth)),
      slidesToScroll: Math.floor(($(element).width() / cardWidth)),
      autoplay: true,
      infinite: false,

    };
  }

  getMoreCourses() {
    //this.cursos
    this.criarCursoService.getCursosFromCategoriaMentoria(this.curso.categorias[0].id).subscribe((ApiResponse1) => {
      console.log("apiresponse", ApiResponse1)     
        this.cursos = ApiResponse1;
    });
  }

  sendComment(){
    this.submitted = true;
    let comment = this.novoComentario.nativeElement.value;
    if(comment && comment != ''){
      let objToSend = {
        avaliacao: this.evaluation,
        comentario: comment,
       // fk_professor: this.curso.fk_professor,
        fk_criador_id: JSON.parse(localStorage.getItem('user')).id
      }
      this.criarCursoService.postComentariosMentoria(this.curso.id,objToSend).subscribe(response =>{
        this.evaluation = 0;
        this.novoComentario.nativeElement.value = '';
        this.submitted = false;
        this.getComentarios();
      })
    }
  }

  getProfessorPermission(){
    if(JSON.parse(localStorage.getItem('user')).fk_perfil == 1){
      let userId = JSON.parse(localStorage.getItem('user')).id;
      if(userId == this.curso.professor.usuario.id || userId == this.curso.fk_criador_id){
        this.curso.permission = true;
      }
    }
  }
  


}
