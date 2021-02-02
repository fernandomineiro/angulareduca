import { Component, OnInit } from '@angular/core';
import { ListaPresencaService } from 'src/app/lista-presenca/lista-presenca.service';
import { Input } from '@angular/core';
import { ListaPresenca } from 'src/app/lista-presenca/lista-presenca.model';
import { ListaPresencaStudents } from 'src/app/lista-presenca/lista-presenca-students.model';
import * as underscore from 'underscore';
import { HeaderService } from 'src/app/header/header.service';
import { environment } from 'src/environments/environment';
import {ConfiguracoesStore} from '../stores/configuracoes.store';

@Component({
  selector: 'app-lista-presenca',
  templateUrl: './lista-presenca.component.html',
  styleUrls: ['./lista-presenca.component.css']
})
export class ListaPresencaComponent implements OnInit {
  IMG_URL = environment.img_url

  constructor(private listaPresencaService: ListaPresencaService,
              private configuracoesStore: ConfiguracoesStore,
              private headerService: HeaderService) { }

  @Input()
  hideToggle: true;
  panelOpenState = [];
  currentDayId = [];
  listasPresenca: ListaPresenca[];
  listaPresencaStudents: ListaPresencaStudents[];
  currentListStudents = [];
  currentAgenda;

  ngOnInit() {
    this.headerService.changeNavColor.next('#DBDADA');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    this.headerService.selectedItem.next('user');

    try {
      this.listaPresencaService.getListasPresenca().subscribe(
    (listasPresenca) => {
            this.listasPresenca = listasPresenca.items;
          },
    error => console.log('Error: ', error),
() => {
            console.log('completed');
          }
      );
    } catch (error) {
      console.log('==== error ====', error);
    }
  }

  getListStudents(course, agendaId) {
    const self = this;
    this.listaPresencaService.getListaStudents(course.courseId, agendaId).subscribe( (students) => {
          if (students) {
            const ids = agendaId.split('/');
            course.currentAgendaId = ids[1];
            course.currentListStudents = students;
          }
        },
        error => {
          console.log('completed', error);
        });
  }

  sendPresence(course) {

    const objectToSend = {
      courseId: course.courseId,
      dayId: course.currentAgendaId,
      students: course.currentListStudents
    };
    
    this.listaPresencaService.sendListaPresenca(objectToSend).subscribe( (apiResponse) => {
      this.getListStudents(course, course.selectedAgenda);
    });
  }

}
