import { Component, OnInit } from '@angular/core';
import { ProfessorService } from 'src/app/professor/professor.service';
import { Professor } from 'src/app/professor/professor.model';
import { Categoria } from 'src/app/categorias/categorias.model';
import { CategoriasService } from 'src/app/categorias/categorias.service';

import { ActivatedRoute } from '@angular/router';
import { HeaderService } from 'src/app/header/header.service';
import { environment } from 'src/environments/environment';
import {ConfiguracoesStore} from '../stores/configuracoes.store';


@Component({
  selector: 'app-professor',
  templateUrl: '../professor/professor-categoria.component.html',
  styleUrls: ['../professor/professor-categoria.component.css']
})
export class ProfessorCategoriaComponent implements OnInit {

  constructor(private professorService: ProfessorService, private categoriaService: CategoriasService,
              private route: ActivatedRoute, private headerService: HeaderService,
              private configuracoesStore: ConfiguracoesStore,
  ) { }
  
  professores:Professor[];
  categorias:Categoria[];
  IMG_URL = environment.img_url
  
  ngOnInit() {
    this.headerService.selectedItem.next('professores');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    try {

        this.categoriaService.get(environment.faculdade_id).subscribe((apiResponse) => {
          this.categorias = apiResponse.items;
        });

        let categoria_id = this.route.snapshot.params['id'];

        if(undefined !== categoria_id) {

          this.professorService.getProfessoresByCategoriaId(categoria_id).subscribe((apiResponse) => {
            this.professores = apiResponse.items;
          });

        }

    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }
  }

}
