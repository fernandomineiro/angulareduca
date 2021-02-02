import { Component, OnInit } from '@angular/core';
import { CursosService } from 'src/app/curso/cursos.service';
import { HeaderService } from 'src/app/header/header.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CategoriasService } from 'src/app/categorias/categorias.service';
import { ConfiguracoesStore } from 'src/app/stores/configuracoes.store';
import { PageEvent } from '@angular/material';
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-todos-cursos',
  templateUrl: './todos-cursos.component.html',
  styleUrls: ['./todos-cursos.component.scss']
})
export class TodosCursosComponent implements OnInit {

  constructor(private cursosService: CursosService,private headerService: HeaderService,private router: Router,private route: ActivatedRoute,private categoriasService: CategoriasService,private configuracoesStore: ConfiguracoesStore,) { }

  cursos;
  dataSearch = {

  }
  cursosOnlineAluno: any;
  cursosRemotosAluno: any;
  cursosPresenciaisAluno: any;
  priceValue = 0
  tipo
  currentViewType = 'grid';
  favorites  
  tipoString
  configuracoes
  length;
  pageSize = 24;
  pageSizeOptions: number[] = [12,24,48];
  pageEvent: PageEvent;  
  activePageDataChunk = []
  classif
  categorias
  isMobile = false;

  ngOnInit() {
    this.isMobile = (window.innerWidth < 992) ? true : false;
    this.tipo = this.route.snapshot.params['tipo'];
    this.classif = this.route.snapshot.params['classif'];

    this.headerService.selectedItem.next('');

    this.configuracoesStore.state$.subscribe(state => {
      this.configuracoes = state.configuracao;
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_primario ? state.configuracao.tiposCursosAtivos.header_primario : '#FFFFFF';
      this.headerService.changeNavColor.next(confNavColor);

      if(this.configuracoes.tiposCursosAtivos.ativar_cursos_hibridos == 0 && this.tipo == '4')
        this.router.navigate(['/']);
      else if(this.configuracoes.tiposCursosAtivos.ativar_cursos_online == 0 && this.tipo == '1')
        this.router.navigate(['/']);
      else if(this.configuracoes.tiposCursosAtivos.ativar_cursos_presencial == 0 && this.tipo == '2')
        this.router.navigate(['/']);
    });

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.categoriasService.getCategorias(environment.faculdade_id).subscribe((ApiResponse4) => {
      this.categorias = ApiResponse4.items;
    });
    if (this.tipo == '1') this.getOnline();
    else if(this.tipo == '4') this.getRemotos();
    else this.getPresenciais();
   

   
  }

  findCursos(type, value) {
    switch (type) {
      case 'sort':  this.dataSearch = {
          sort : value,
          fk_cursos_tipo:this.tipo
      };
      this.tipoString = value == 'asc' ? 'de A - Z' : 'de Z - A'
      break;
      case 'price':
          this.priceValue = $(value.target).val();
          this.dataSearch = {
              price : this.priceValue,
              fk_cursos_tipo:this.tipo
          };
          this.tipoString = `até R$ ${this.priceValue}`
      break;
    }    
    this.cursosService.getCursos(this.dataSearch).subscribe(apiResponse => {        
        this.cursos = apiResponse.items;          
        this.setPages(); 
    })
   
  }

  getOnline() {
    this.tipoString = 'on-line'
    this.cursosService.getCursosOnlinePorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAluno) => {
      this.cursosOnlineAluno = cursosAluno.items;
      this.getTodosEFav(this.tipo);      
    });
}

getRemotos() {
  this.tipoString = 'remotos'
    this.cursosService.getCursosRemotosPorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAluno) => {
      this.cursosRemotosAluno = cursosAluno.items;  
      this.getTodosEFav(this.tipo); 
    }); 
}

getPresenciais() {
  this.tipoString = 'presenciais'
    this.cursosService.getCursosPresenciaisPorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAluno) => {
      this.cursosPresenciaisAluno = cursosAluno.items;     
      this.getTodosEFav(this.tipo);
    });
}

changeViewType(type) {
  this.currentViewType = type;
}

setPageSizeOptions(setPageSizeOptionsInput: string) {
  this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
}

onPageChanged(e) {
  let firstCut = e.pageIndex * e.pageSize;
  let secondCut = firstCut + e.pageSize;
  this.activePageDataChunk = this.cursos.slice(firstCut, secondCut);
  console.log(this.activePageDataChunk);
}

changePrice(value) {
  this.priceValue = $(value.target).val();
}

getTodosEFav(tipo){
  this.cursosService.getFavorites(localStorage.getItem('usuario_id')).subscribe(favorites => {
    this.favorites = favorites;
    if(this.classif != undefined){
      if(this.classif == 1)
        this.cursosService.getCursosRecentes(tipo).subscribe((ApiResponse1) => {
          this.cursos = ApiResponse1.items;  
          this.tipoString = 'adicionados recentemente'
          this.setPages();        
        });
        if(this.classif == 2)
          this.cursosService.getCursosEmPromocao(tipo).subscribe((ApiResponse1) => {
            this.cursos = ApiResponse1.items;
            this.tipoString = 'em promoção'
            this.setPages();           
          });
        if(this.classif == 3)
          this.cursosService.getCursosMaisVendidos(tipo).subscribe((ApiResponse1) => {
            this.cursos = ApiResponse1.items; 
            this.tipoString = 'mais vendidos'
            this.setPages();          
          });
    }
    else    
      this.cursosService.getTodosCursosPorTipo(tipo).subscribe((cursos) => {
        this.cursos = cursos.items; 
        this.setPages();       
      });
  });
}

setPages(){
  this.activePageDataChunk = this.cursos.slice(0,this.pageSize);
  this.length = this.cursos.length;
}

onResized($event): void {
  this.isMobile = (window.innerWidth < 992) ? true : false;
}

}
