import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { trigger, state, style, transition, animate } from '@angular/animations'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'

import { Evento } from '../eventos/eventos.model'
import { EventosService } from '../eventos/eventos.service'

import { Categoria } from '../categorias/categorias.model'
import { CategoriasService } from '../categorias/categorias.service'

import { Observable, from } from 'rxjs'
import { switchMap, tap, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators'
import { HeaderService } from 'src/app/header/header.service';

import { environment } from "../../environments/environment";
import {ConfiguracoesStore} from '../stores/configuracoes.store';

@Component({
  styles: [`
    #mobile_navbar { background-color: rgba(255, 255, 255, .7) !important; }
    .dropdown{
      margin:auto;
    }
  `],
  selector: 'mt-eventos',
  templateUrl: './eventos.component.html'
})
export class EventosComponent implements OnInit {
  IMG_URL = environment.img_url;
  proximosEventos: any;
  categorias: Categoria[];
  cities: any[];
  currentCategory = '-1';
  currentCity = '-1';
  currentOrder1 = 'asc';
  currentOrder2 = 'vendidos';
  currentPrice = '0';
  currentSearchWord = '';

  constructor(private eventosService: EventosService, private configuracoesStore: ConfiguracoesStore,
              private categoriasService: CategoriasService, private headerService: HeaderService) { }

  ngOnInit() {

    this.headerService.selectedItem.next('eventos');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_primario ? state.configuracao.tiposCursosAtivos.header_primario : '#FFFFFF';
      this.headerService.changeNavColor.next(confNavColor);
    });

    try {

      this.headerService.getBanner(environment.faculdade_id,'eventos').subscribe((ApiResponse) => {   
        this.headerService.changeBanner.next(ApiResponse.items);
      });
      this.eventosService.getProximosEventos().subscribe((ApiResponse) => {
        this.proximosEventos = ApiResponse.items;
      });

      this.categoriasService.getCategorias(environment.faculdade_id).subscribe((ApiResponse) => {
        this.categorias = ApiResponse.items;
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
  filterByCategory(categoryId) {
      this.currentCategory = categoryId;
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
      this.eventosService.searchEventos(this.currentCategory, this.currentCity,
          this.currentSearchWord, this.currentOrder1, this.currentOrder2).subscribe((proximosEventos) => {
          this.proximosEventos = proximosEventos.items;
      });
  }
}
