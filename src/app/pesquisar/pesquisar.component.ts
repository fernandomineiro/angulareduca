import { environment } from 'src/environments/environment';

import { Component, OnInit } from '@angular/core';
import { CursosService } from '../curso/cursos.service';
import { Categoria } from '../categorias/categorias.model';
import { CategoriasService } from '../categorias/categorias.service';
import { PesquisaStore } from '../stores/pesquisa.store';
import {PageEvent} from '@angular/material';
import { ConfiguracoesStore } from 'src/app/stores/configuracoes.store';

@Component({
  selector: 'app-pesquisar',
  templateUrl: './pesquisar.component.html',
  styleUrls: ['./pesquisar.component.css']
})
export class PesquisarComponent implements OnInit {
  IMG_URL: string = environment.img_url;

  cursos: Array<object> = [];
  categorias: Array<Categoria> = [];
  favorites: any;
  cursosAluno: any;
  cursosAlunoPresencial: any;
  cursosAlunoRemoto: any;
  length;
  pageSize = 25;
  pageSizeOptions: number[] = [1,10,25,50];
  pageEvent: PageEvent;  
  activePageDataChunk = []
  configuracoes: any;

  constructor(
      private categoriasService: CategoriasService,
      private cursosService: CursosService,
      private pesquisaStore: PesquisaStore,
      private configuracoesStore: ConfiguracoesStore,
  ) {
    if(window.innerWidth <= 500)
      this.pageSize = 1   
    this.configuracoesStore.state$.subscribe(state => {
      this.configuracoes = state.configuracao;
    });
   }

  ngOnInit(): void {

    this.pesquisaStore.state$.subscribe(state => {
      this.cursos = state.cursos;
      this.activePageDataChunk = this.cursos.slice(0,this.pageSize);
      this.length = this.cursos.length;
    });

    /*if (!this.pesquisaStore.state.cursos.length) {
        this.cursosService.getCursos({}).subscribe(apiResponse => {
            this.pesquisaStore.updateCursos(apiResponse.items);
        });
    }*/

    this.cursosService.getFavorites(localStorage.getItem('usuario_id')).subscribe(favorites => {
      this.favorites = favorites;
      this.cursosService.getCursosOnlinePorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAluno) => {
        this.cursosAluno = cursosAluno.items;
        console.log("cursosAluno", this.cursosAluno)
      });
  
      this.cursosService.getCursosPresenciaisPorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAlunoPresencial) => {
        this.cursosAlunoPresencial = cursosAlunoPresencial.items;
        console.log("cursosAlunoPresencial", this.cursosAlunoPresencial)
      });
  
      this.cursosService.getCursosRemotosPorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAlunoRemoto) => {
        this.cursosAlunoRemoto = cursosAlunoRemoto.items;
        console.log("cursosAlunoRemoto", this.cursosAlunoRemoto)
      });
  
      this.categoriasService.getCategorias(environment.faculdade_id).subscribe(apiResponse => {
        this.categorias = apiResponse.items;
      });
    });

   
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
}
