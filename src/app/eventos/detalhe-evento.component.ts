import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Evento } from '../eventos/eventos.model';
import { EventosService } from '../eventos/eventos.service';

import { Categoria } from '../categorias/categorias.model';
import { CategoriasService } from '../categorias/categorias.service';

import { Observable, from } from 'rxjs';
import { switchMap, tap, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { HeaderService } from 'src/app/header/header.service';
import { environment } from 'src/environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {MapsAPILoader} from '@agm/core';
import {ShoppingCartService} from '../shopping-cart/shopping-cart.service';
import {ConfiguracoesStore} from '../stores/configuracoes.store';

declare var google: any;

@Component({
  styles: [`
 #palestra_name{
   line-height:20px;
 }

`],
  selector: 'mt-detalhe-evento',
  templateUrl: './detalhe-evento.component.html'
})
export class DetalheEventoComponent implements OnInit {

  IMG_URL = environment.img_url;
  evento: any;
  modulos: any;
  categorias: Categoria[];
  lat: number;
  lng: number;
  geocoder: any;

  showCartAdded = false;
  zoom = 15;

  constructor(
      private eventosService: EventosService,
      private categoriasService: CategoriasService,
      private shoppingCartService: ShoppingCartService,
      private route: ActivatedRoute,
      public mapsApiLoader: MapsAPILoader,
      private router: Router,
      private headerService: HeaderService,
      private configuracoesStore: ConfiguracoesStore,
  ) { }

  ngOnInit() {

    this.headerService.selectedItem.next('eventos');
    const that = this;
    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    try {
      this.eventosService.eventoById(this.route.snapshot.params['id']).subscribe((ApiResponse) => {
        this.evento = ApiResponse.items[0];
        this.modulos = this.evento.agendas;

        this.mapsApiLoader.load().then(() => {
          this.geocoder = new google.maps.Geocoder();
          this.geocoder.geocode({
            address: this.evento.endereco
          }, (results, status) => {
            if (status === 'OK') {
              if (results[0].geometry.location) {
                that.lat = results[0].geometry.location.lat();
                that.lng = results[0].geometry.location.lng();
              }
            }
          });
        });
      });
    } catch (error) {
      console.log('==== error ====', error);
    }
  }

  get somaValoresAgenda() {
    let cont = 0;
    this.modulos.forEach(e => {
      cont = cont + Math.floor(e.agenda_valor);
    })
    return cont;
  }

  get palestrantes() {
    return this.modulos.map(e => {
      return {
        curriculo: e.curriculo,
        nome_palestrante: e.nome_palestrante
      };
    });
  }

  montaCartItem(agenda) {
    return {
      id: agenda.id,
      titulo: agenda.descricao,
      fk_evento: this.evento.id,
      imagem: this.evento.imagem,
      valor: agenda.agenda_valor,
      gratis: (this.somaValoresAgenda > 0) ? false : true
    };
  }

  addToCart(item, multiplas) {
    item = this.montaCartItem(item);
    this.shoppingCartService.addItem(item.titulo, item.id, item.valor, item.imagem , 'Dia de Evento', item.gratis, item.fk_evento);
    // if (!multiplas) this.router.navigate(['/carrinho']);
  }

  addAllToCart(items) {
    items.forEach(e => {
      this.addToCart(e, true);
    });
    this.router.navigate(['/carrinho']);
  }

  get moduloInicialFinal() {
    let primeiroModulo = this.modulos[0];
    if (this.modulos.length > 1) {
      let ultimoModulo = this.modulos[this.modulos.length - 1];
      return [primeiroModulo, ultimoModulo];
    } else {
      return [primeiroModulo];
    }
  }
}
