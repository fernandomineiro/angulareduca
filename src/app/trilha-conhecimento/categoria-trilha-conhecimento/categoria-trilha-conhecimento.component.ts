import { Component, OnInit } from '@angular/core';
import { TrilhasService } from 'src/app/trilha-conhecimento/trilha-conhecimento.service';
import { TrilhaCategoria } from 'src/app/trilha-conhecimento/categoria-trilha-conhecimento/categoria-trilha-conhecimento.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { ActivatedRouteSnapshot } from '@angular/router';
import { HeaderService } from 'src/app/header/header.service';
import { environment } from 'src/environments/environment';
import { ShoppingCartService } from 'src/app/shopping-cart/shopping-cart.service';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';
import PNotify from 'pnotify/dist/es/PNotify';
import { CursosService } from 'src/app/curso/cursos.service';
import $ from "jquery";
import { Router } from '@angular/router';
import { ConfiguracoesStore } from '../../stores/configuracoes.store';
import { ChangeContext, Options } from 'ng5-slider';

@Component({
  selector: 'app-categoria-trilha-conhecimento',
  templateUrl: './categoria-trilha-conhecimento.component.html',
  styleUrls: ['./categoria-trilha-conhecimento.component.css']
})
export class CategoriaTrilhaConhecimentoComponent implements OnInit {

  IMG_URL = environment.s3_url;
  categorias: any;
  trilhaName: string;
  categoria_id: string;
  slug_categoria: string;
  currentCategory = '-1';
  currentCity = '-1';
  currentOrder1 = '';
  currentOrder2 = '';
  currentPrice = '0';
  currentSearchWord = '';
  currentPageNumber = 1;
  trilhas: any;
  cities: any[];
  categoria: any;
  favorites: any;
  currentViewType = 'grid'
  value: number = 0;
  options: Options = {
    floor: 0,
    ceil: 1000,
    step: 1
  };
  isMobile = false;

  constructor(
    private trilhasService: TrilhasService,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private shoppingCartService: ShoppingCartService,
    private cursosService: CursosService,
    private router: Router,
    private configuracoesStore: ConfiguracoesStore,
  ) {
    PNotifyButtons; // Initiate the module. Important!
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  ngOnInit() {
    this.isMobile = (window.innerWidth < 992) ? true : false;
    this.headerService.selectedItem.next('trilha');
    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
        state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });


    this.trilhasService.getCategoryIDBySlug(this.route.snapshot.params.id).subscribe(apiResponse => {

      this.categoria_id = apiResponse.data['id'];
      this.slug_categoria = apiResponse.data['slug_categoria'];

      this.trilhasService.getCategoria(this.categoria_id).subscribe((categoria) => {
        this.categoria = categoria.data;
      });

      this.trilhasService.getTrilhasCategoria(this.categoria_id).subscribe((categorias) => {
        this.trilhas = categorias.items;
        const newOptions: Options = Object.assign({}, this.options);
        newOptions.floor = this.minValue;
        newOptions.ceil = this.maxValue;
        this.options = newOptions;
        this.value = this.maxValue;
        console.log("categorias", this.categorias)

      });

    });

    this.trilhasService.getFavorites(localStorage.getItem('usuario_id')).subscribe(favorites => {
      this.favorites = favorites;
    });

    this.trilhasService.getCategoriasComTrilhasCadastradas(environment.faculdade_id).subscribe((apiResponse) => {
      this.categorias = apiResponse.items;
    });





  }

  filterByCategory(categoryId) {
    this.currentCategory = categoryId.target.selectedOptions[0].value;
    this.filter();
  }

  filter() {
    this.trilhasService.getFilteredTrilha(this.currentCategory, this.currentCity, this.currentOrder1, this.currentPrice,
      this.currentPageNumber, this.currentSearchWord, this.categoria.id).subscribe((categorias) => {
        this.trilhas = categorias.items;
      });
  }

  filterByCity(cityId) {
    this.currentCity = cityId.target.selectedOptions[0].value;
    this.filter();
  }

  filterOrder(event, type) {
    this.currentOrder1 = event.target.value;
    this.filter();
  }

  filterByPrice(el) {
    console.log("el", el)
    this.currentPrice = el.value;
    this.filter();
  }

  search(el) {
    this.currentSearchWord = el.value;
    this.filter();
  }

  changePageNumber(el, type) {
    if (type == 'prev') {
      this.currentPageNumber--;
    } else if (type == 'next') {
      this.currentPageNumber++;
    }
    else this.currentPageNumber = el.target.value;
    this.filter();
  }

  changeViewType(type) {
    console.log('entrei');
    this.currentViewType = type;
  }


  onResized($event): void {
    this.isMobile = (window.innerWidth < 992) ? true : false;
  }

  get minValue() {
    if (this.trilhas) {
      return this.trilhas.reduce((prev, current) => {
        return (prev.valor_venda < current.valor_venda) ? prev.valor_venda : current.valor_venda;
      });
    }
    return 0;
  }
  get maxValue() {
    if (this.trilhas) {
      return Math.max.apply(Math, this.trilhas.map(o => o.valor_venda));
    }
    return 0;
  }
}
