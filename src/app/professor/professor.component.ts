import { Component, OnInit } from '@angular/core';
import { ProfessorService } from 'src/app/professor/professor.service';
import { Professor } from 'src/app/professor/professor.model';
import { HeaderService } from 'src/app/header/header.service';

import { environment } from '../../environments/environment';
import { CategoriasService } from 'src/app/categorias/categorias.service';
import {ConfiguracoesStore} from '../stores/configuracoes.store';

@Component({
  selector: 'app-professor',
  templateUrl: '../professor/professor.component.html',
  styleUrls: ['../professor/professor.component.css']
})
export class ProfessorComponent implements OnInit {

  constructor(private professorService: ProfessorService, private headerService: HeaderService,
              private categoriasService: CategoriasService,
              private configuracoesStore: ConfiguracoesStore,
  ) { }
  
  professores: any;
  IMG_URL = environment.s3_url;
  searchTerm: string;
  isGrid = true;
  categorias;
  categoryName: any;

  ngOnInit() {

    this.headerService.selectedItem.next('professores');
    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_primario ? state.configuracao.tiposCursosAtivos.header_primario : '#FFFFFF';
      this.headerService.changeNavColor.next(confNavColor);
    });

    try {
      this.headerService.getBanner(environment.faculdade_id, 'professores').subscribe((ApiResponse) => {
        this.headerService.changeBanner.next(ApiResponse.items);
      });

      this.maisVendidos();

    } catch (error) {
      console.log('==== error ====', error);
    }

    this.categoriasService.getCategorias(environment.faculdade_id).subscribe((ApiResponse) => {
      this.categorias = ApiResponse.items;
    });

  }

  maisVendidos() {
      this.professorService.get(environment.faculdade_id).subscribe((apiResponse) => {
          this.professores = this.sortAZ(apiResponse.items);
      });
  }

  recentes() {
      this.professorService.recentes().subscribe((apiResponse) => {
          this.professores = this.sortAZ(apiResponse.items);
      });
  }

  promocoes() {
      this.professorService.promocoes().subscribe((apiResponse) => {
          this.professores = this.sortAZ(apiResponse.items);
      });
  }

  onSubmit() {
    if (this.searchTerm) {
      this.professorService.searchProfessor(this.searchTerm).subscribe((apiResponse) => {
        this.professores = this.sortAZ(apiResponse.items);
      });
    } else {
        this.maisVendidos();
    }
  }

  sortAZ(professores) {
      return professores.sort((a, b) => {

          const nameA = a.nome_professor.toLowerCase();
          const nameB = b.nome_professor.toLowerCase();

          if (nameA < nameB) {
              return -1;
          }

          if (nameA > nameB) {
              return 1;
          }

          return 0;
      });
  }

  ordenarAZ(reverse) {
    const professores = this.sortAZ(this.professores);

    if (reverse) {
      professores.reverse();
    }

    this.professores = professores;
  }

  pesquisar(event) {
    if (event.charCode === 13) {
      this.onSubmit();
    }
  }

  // checkImage() {
  //     const oImage = new Image();
  //     oImage.src = this.IMG_URL + this.curso.imagem;
  //     oImage.onload = () => {
  //         // this.curso.imagem = oImage.src;
  //     };
  //
  //     oImage.onerror = () => {
  //         // this.curso.imagem = '../../../../assets/img/az.png';
  //     };
  // }

  exibirCategoriaSelecionada(categoria){
    /* Criação do item referente a tarefa ED2-1325 -> Por Gabriel Carvalho, dia 21/02/2020 */
    /* Ao selecionar uma categoria, deverá exibir no front-end, qual é a categoria que o usuário clicou */
    let isDivShow = $('#show-category-name').css('display');
    console.log('teste: ' + categoria); 
    if(isDivShow == 'none'){
      $('#show-category-name').show(500);
    }
    $('#category-name').empty();
    $('#category-name').html('Categoria: <strong>'+categoria+'</strong>');
  }

  professoresPorCategoria(idCategoria){
    this.professorService.getProfessoresByCategoriaId2(environment.faculdade_id, idCategoria).subscribe((response)=>{
      this.professores = response.items;
      console.log("professores categoria", this.professores);

      /*this.professores.forEach((value,i)=>{
        value.nome_professor = value.nome;
        value.sobrenome_professor = value.sobrenome;
        value.qtd_cursos_publicados = null;
      })*/
    })
  }
}
