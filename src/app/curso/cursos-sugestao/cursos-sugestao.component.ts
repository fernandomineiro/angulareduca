import { Component, OnInit } from '@angular/core';
import { CursosService } from 'src/app/curso/cursos.service';
import { CategoriasService } from 'src/app/categorias/categorias.service';

import { CursosSugestao } from 'src/app/curso/cursos-sugestao/cursos-sugestao.model';
import { Categoria } from 'src/app/categorias/categorias.model';

import { FormControl } from '@angular/forms';
import { ApiErrors } from '../../app.api'
import { HeaderService } from 'src/app/header/header.service';
import { environment } from 'src/environments/environment';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';

@Component({
  selector: 'app-cursos-sugestao',
  templateUrl: './cursos-sugestao.component.html'
})
export class CursosSugestaoComponent implements OnInit {
  IMG_URL = environment.img_url
  constructor(private cursosService: CursosService, private categoriasService: CategoriasService,
              private configuracoesStore: ConfiguracoesStore, private headerService: HeaderService) { }

  sugestao = new CursosSugestao();
  categorias: Categoria[];  
  
  individual:string
  geral:string

  submitted = false;

  ngOnInit() {

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    this.headerService.selectedItem.next('cursos');
    try {

        this.categoriasService.get(environment.faculdade_id).subscribe((apiResponse) => {
            this.categorias = apiResponse.items;
        });              
    

    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }
  }
  
  onSubmit() {       
    
      this.cursosService.createSugestao(this.sugestao).subscribe((apiResponse) => {

          if(apiResponse.success) {
              this.submitted = true;
              
          } else {
                let errors = new ApiErrors();
                errors.handle(apiResponse); 
          }
          
      });    
  
  } 


  // TODO: Remove this when we're done
  get diagnostic() {       
    return JSON.stringify(this.sugestao); 
  }

}
