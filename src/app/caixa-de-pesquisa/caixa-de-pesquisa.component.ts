import {Component, Injectable, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiResponse } from '../app.api';

import { PesquisarService } from './../pesquisar.service';
import { CursosService } from './../curso/cursos.service';

import { PesquisaStore } from '../stores/pesquisa.store';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-caixa-de-pesquisa',
  templateUrl: './caixa-de-pesquisa.component.html',
  styleUrls: ['./caixa-de-pesquisa.component.css']
})
export class CaixaDePesquisaComponent implements OnInit {
  IMG_URL = environment.img_url;

  formBuscar: FormGroup;

  success: boolean = false;
  error: string;

  apiResponse: ApiResponse;

  constructor(
      private cursosService: CursosService,
      private router: Router,
      private store: PesquisaStore
  ) {

  }

  ngOnInit() {
    this.formBuscar = new FormGroup({
      search: new FormControl()
    });

  }

  onSubmit() {
    const data = { search: this.formBuscar.get('search').value };

    if (data.search !== null) {
      this.cursosService.getCursos(data).subscribe(apiResponse => {
        this.store.updateCursos(apiResponse.items);
        this.router.navigate(['/pesquisar']);
      });
    }
  }

  pesquisar(event) {

  }
}

