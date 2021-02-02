import { Component, OnInit } from '@angular/core';

import {Categoria} from '../categorias/categorias.model'
import {CategoriasService} from '../categorias/categorias.service'
import { environment } from 'src/environments/environment';
import { Input } from '@angular/core';
import {Configuracao} from '../configuracao.model';
import {ConfiguracoesStore} from '../stores/configuracoes.store';

@Component({
  selector: 'mt-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {
  IMG_URL = environment.img_url;
  categorias: Categoria[] = [];
  configuracoes: Configuracao;
  options = {
    autoHide: false
  }

  constructor(private configuracoesStore: ConfiguracoesStore, private categoriasService: CategoriasService) { }

  @Input() hasSearchBox;

  @Input() totalTipos : number;

  ngOnInit() {
    this.categoriasService.getCategorias(environment.faculdade_id).subscribe((ApiResponse) => {
      this.categorias = ApiResponse.items;
    });

    this.configuracoesStore.state$.subscribe(state => {
        this.configuracoes = state.configuracao;
    });

    console.log('hasSearchBox', this.hasSearchBox);
  }
}
