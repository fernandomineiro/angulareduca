import { Component, OnInit } from '@angular/core';
import * as _ from 'underscore';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/header/header.service';
import { CursosService } from 'src/app/curso/cursos.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-lista-card-cursos',
  templateUrl: './lista-card-cursos.component.html',
  styleUrls: ['./lista-card-cursos.component.scss']
})
export class ListaCardCursosComponent implements OnInit {

  constructor(private router: Router, private headerService: HeaderService, private cursosService: CursosService) { }

  cursos;
 favorites;
  isMobile;
  
  @ViewChild('searchWord') searchWord
  
  ngOnInit() {
    this.isMobile = (window.innerWidth < 992) ? true : false;
    if(localStorage.getItem('user')==null){
      this.router.navigate(['/']);
    }
    this.headerService.selectedItem.next('perennialsCursoOnline');
    this.cursosService.getFavorites(localStorage.getItem('usuario_id')).subscribe(favorites => {
      this.favorites = favorites;
      this.cursosService.getAllCoursesGroupedByCategoriaOpen().subscribe((ApiResponse1) => {           
        this.cursos = ApiResponse1;
      });
    })
  }

  filterStatus(curso: any) {
    return curso.status == 'PUBLICADO'
    
  }

  categoriaHasPublicados(categoria){
    return _.where(categoria.mentorias, {status: 'PUBLICADO'}).length
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

  onResized($event): void {
    this.isMobile = (window.innerWidth < 992) ? true : false;
  }
  
  onSubmit(){
    let word = this.searchWord.nativeElement.value;
    console.log("word", word);
    this.cursosService.searchCoursesGroupedByCategoriaOpen(word).subscribe(response => {
      console.log("response", response);
      this.cursos = response;
    })
  }

  findCursos(type){
    this.cursosService.sortCoursesMentoria(type).subscribe(response => {
      this.cursos = response;
    })
  }

}
