import { Component, OnInit } from '@angular/core';
import { TutoriaService } from 'src/app/tutoria/tutoria.service';
import { TutoriaTrabalho } from 'src/app/tutoria/tutoria-trabalhos/tutoria-trabalho.model';
import {MatExpansionModule} from '@angular/material/expansion';
import { NgModule } from '@angular/core';
import { Input , Output} from '@angular/core';
import { EventEmitter } from '@angular/core';
import { HeaderService } from 'src/app/header/header.service';
import * as underscore from 'underscore';
import { environment } from 'src/environments/environment';
import {NotificationService} from '../../shared/messages/notification.service';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-tutoria-trabalhos',
  templateUrl: './tutoria-trabalhos.component.html',
  styleUrls: ['./tutoria-trabalhos.component.scss']
})
export class TutoriaTrabalhosComponent implements OnInit {
  form: FormGroup;
  panelOpenState = [];
  tutoriasTrabalhos: TutoriaTrabalho[];
  cursos: any[] = [];
  IMG_URL = environment.s3_url;

  @Input() hideToggle: true;

  constructor(
      private tutoriaService: TutoriaService,
      private headerService: HeaderService,
      private notificationService: NotificationService,
      private configuracoesStore: ConfiguracoesStore,
      private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.construirFormulario();

    this.headerService.selectedItem.next('user');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    this.carregarTrabalhos();
  }

  checkIfValid(envio: any): void {
    if (envio.grade > 10) {
      envio.grade = 10;  
    } else if (envio.grade < 0) {
      envio.grade = 0;  
    }
  }

  sendGrades(trabalho: TutoriaTrabalho) {
    const trabalhoToSend = {
      trabalhoId: trabalho.id,
      grades: []
    };

    trabalho.envios.forEach(element => {
      trabalhoToSend.grades.push({
        studentId: element.studentId,
        id: element.id,
        grade: element.grade
      });
    });

    this.tutoriaService.postTrabalho(trabalhoToSend).subscribe((apiResponse) => {
        if (apiResponse.success == true) {
          this.notificationService.success('Nota(s) enviada(s) com sucesso!');
        } else {
          this.notificationService.error('Não foi possível salvar a(s) nota(s), por favor tente novamente mais tarde!');
        }
    });
  }

  filtrar(): void {
    this.tutoriasTrabalhos = [];

    this.carregarTrabalhos();
  }

  private construirFormulario(): void {
    this.form = this.formBuilder.group({
      curso_id: [''],
      data_envio: [],
      status: ['']
    });
  }

  private carregarTrabalhos(): void {
    try {
      this.tutoriaService.get(this.form.value).subscribe((apiResponse) => {
        this.tutoriasTrabalhos = apiResponse.items;
        this.carregarCursos();

        this.tutoriasTrabalhos.forEach(element => {
          this.panelOpenState.push(false);
        });
      });

    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }
  }

  private carregarCursos(): void {
    this.tutoriasTrabalhos.forEach(trabalho => {
      if (!this.cursos.find(curso => curso.id === trabalho[`curso_id`])) {
        this.cursos.push({ curso_id: trabalho[`curso_id`], curso_titulo: trabalho[`curso_titulo`] });
      }
    });
  }
}
