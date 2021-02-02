import { Component, OnInit } from '@angular/core';
import { TrilhasService } from 'src/app/trilha-conhecimento/trilha-conhecimento.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TrilhaSobre, TrilhaDetalhe, Curso } from 'src/app/trilha-conhecimento/sobre-trilha-conhecimento/sobre-trilha-conhecimento.model';
import { HeaderService } from 'src/app/header/header.service';
import { ShoppingCartService } from '../../shopping-cart/shopping-cart.service';
import { environment } from 'src/environments/environment';
import {ApiResponse} from '../../app.api';
import { CursosService } from 'src/app/curso/cursos.service';

import {ConfiguracoesStore} from '../../stores/configuracoes.store';
import {Configuracao} from '../../configuracao.model';

@Component({
  selector: 'app-sobre-trilha-conhecimento',
  templateUrl: './sobre-trilha-conhecimento.component.html',
  styleUrls: ['./sobre-trilha-conhecimento.component.css']
})
export class SobreTrilhaConhecimentoComponent implements OnInit {

  IMG_URL = environment.s3_url;
  trilha: TrilhaDetalhe[];
  cursos: Curso[];
  categorias: any;
  favorites: any;
  cursosAluno: any;
  cursosPresenciaisAluno

  trilha_id: string;
  slug_trilha: string;

  configuracoes: Configuracao;

  constructor(
      private trilhasService: TrilhasService,
      private route: ActivatedRoute,
      private shoppingCartService: ShoppingCartService,
      private router: Router,
      private headerService: HeaderService,
      private configuracoesStore: ConfiguracoesStore,
      private cursosService: CursosService
  ) {
      this.configuracoesStore.state$.subscribe(state => {
          this.configuracoes = state.configuracao;
          const confNavColor =
              state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
          this.headerService.changeNavColor.next(confNavColor);
      });
  }

  ngOnInit() {

    this.headerService.selectedItem.next('trilha');
    try {
      
      this.trilhasService.getTrilhaIDBySlug(this.route.snapshot.params.id).subscribe(ApiResponse => {
        this.trilha_id = ApiResponse.data['id'];
        this.slug_trilha = ApiResponse.data['slug_trilha'];
        
        this.trilhasService.getTrilhaSobre(this.trilha_id).subscribe((dados) => {
          this.trilha = dados.trilha;
          this.cursos = dados.cursos;
          this.categorias = dados.categorias;
        });

      });

      if (localStorage.getItem('usuario_id')) {
        this.cursosService.getFavorites(localStorage.getItem('usuario_id')).subscribe(favorites => {
          this.favorites = favorites;
          this.cursosService.getCursosOnlinePorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAluno) => {
            this.cursosAluno = cursosAluno.items;
          });
          this.cursosService.getCursosPresenciaisPorAluno(localStorage.getItem('usuario_id')).subscribe((cursosPresenciaisAluno) => {
            this.cursosPresenciaisAluno = cursosPresenciaisAluno.items;
          });
        });

       
      }

      // this.cursosService.getCursosRecentes(1).subscribe((apiResponse) => {
      //     this.cursos = apiResponse.items;
      // });

    } catch (error) {
      console.log('==== error ====', error);
    }
  }

  get totalPresencial() {
    let valor = 0;
    this.cursos.forEach(curso => {
        if (curso.tipo == 2) {
          valor++;
        }
    })
    return '' + valor;
  }
  get totalOnline() {
    let valor = 0;
    this.cursos.forEach(curso => {
      if (curso.tipo == 1) {
          valor++;
      }
    })
    return '' + valor;
  }
  get totalRemoto() {
    let valor = 0;
    this.cursos.forEach(curso => {
      if (curso.tipo == 4) {
          valor++;
      }
    })
    return '' + valor;
  }

  get professores() {
    const professores = Array.from(new Set(this.cursos.map(curso => curso.nome_professor)))
        .map(nomeprofessor => {
            return this.cursos.find(curso => curso.nome_professor === nomeprofessor);
        });
    return professores;
  }

  inserirNoCarrinho(item) { 
      const categoria = 'Trilha';
      this.shoppingCartService.addItem(item.titulo, item.id, item.valor_venda, undefined, categoria,item.gratis)
      this.router.navigate(['/carrinho']);
  }
}
