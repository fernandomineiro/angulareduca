import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { trigger, state, style, transition, animate } from '@angular/animations'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'

import { Evento } from '../eventos/eventos.model'
import { EventosService } from '../eventos/eventos.service'

import { Categoria } from '../categorias/categorias.model'
import { CategoriasService } from '../categorias/categorias.service'

import { Observable, from } from 'rxjs';
import { switchMap, tap, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { HeaderService } from 'src/app/header/header.service';
import { environment } from 'src/environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfiguracoesStore} from '../stores/configuracoes.store';

@Component({
  styles: [`
    #mobile_navbar { background-color: rgba(255, 255, 255, .7) !important; }
  `],
  selector: 'mt-categoria-eventos',
  templateUrl: './categoria-eventos.component.html'
})
export class CategoriaEventosComponent implements OnInit {
  IMG_URL = environment.img_url;
  eventos: Evento[];
  categoria: any;
  currentCity = '-1';
  currentOrder1 = 'asc';
  currentOrder2 = 'vendidos';
  currentPrice = '0';
  currentSearchWord = '';
  cities: any;

  constructor(private eventosService: EventosService, private categoriasService: CategoriasService,
              private route: ActivatedRoute, private headerService: HeaderService, private configuracoesStore: ConfiguracoesStore) { }

  ngOnInit() {

    this.headerService.selectedItem.next('eventos');
    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    var banner = 'categoria/'+this.route.snapshot.params['id']
    this.headerService.getBanner(environment.faculdade_id,banner).subscribe((ApiResponse) => {
      console.log("eita")   
      this.headerService.changeBanner.next(ApiResponse.items);
    });
    try {
      this.eventosService.searchEventos(this.route.snapshot.params['id'], this.currentCity, this.currentSearchWord, this.currentOrder1, this.currentOrder2).subscribe((ApiResponse) => {
        this.eventos = ApiResponse.items;
      });

      this.categoriasService.getCategoria(this.route.snapshot.params['id']).subscribe((ApiResponse) => {
        this.categoria = ApiResponse.items;
      });
    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }
  }
  filterOrder(event, type) {
      if (type == 1) {
          this.currentOrder1 = event.target.value;
      } else {
          this.currentOrder2 = event.target.value;
      }
      this.filter();
  }
  filterByCity(cityId) {
      this.currentCity = cityId.target.selectedOptions[0].value;
      this.filter();
  }
  search(el) {
      this.currentSearchWord = el.target.value;
      this.filter();
  }
  filter() {
      this.eventosService.searchEventos(this.route.snapshot.params['id'], this.currentCity,
          this.currentSearchWord, this.currentOrder1, this.currentOrder2).subscribe((proximosEventos) => {
          this.eventos = proximosEventos.items;
      });
  }
}
