import {Component, OnDestroy, OnInit} from '@angular/core';
import { View } from '@syncfusion/ej2-angular-schedule';
import { loadCldr, L10n } from '@syncfusion/ej2-base';
import { EventSettingsModel } from '@syncfusion/ej2-angular-schedule';

import * as  numberingSystems from 'node_modules/cldr-data/supplemental/numberingSystems.json';
import * as  gregorian from 'node_modules/cldr-data/main/pt/ca-gregorian.json';
import * as  numbers from 'node_modules/cldr-data/main/pt/numbers.json';
import * as  timeZoneNames from 'node_modules/cldr-data/main/pt/timeZoneNames.json';
import {Store} from '@ngrx/store';
import {CalendarState} from './store/calendar.reducer';
import {CalendarLoad} from './store/calendar.actions';
import {SubSink} from 'subsink';
import {calendar} from './store/calendar.selector';
import {LoginService} from '../security/login/login.service';
import {ConfiguracoesStore} from "../stores/configuracoes.store";
import {DomSanitizer} from "@angular/platform-browser";
import {environment} from "../../environments/environment";

loadCldr(numberingSystems['default'], gregorian['default'], numbers['default'], timeZoneNames['default']);
L10n.load({
    'pt': {
        'schedule': {
            'day': 'dia',
            'week': 'semana',
            'workWeek': 'Semana de trabalho',
            'month': 'Mês',
            'agenda': 'Agenda',
            'weekAgenda': 'Agenda de da semana',
            'workWeekAgenda': 'Agenda da Semana de Trabalho',
            'monthAgenda': 'Agenda do mês',
            'today': 'Hoje',
            'noEvents': 'Sem eventos',
            'allDay': 'Todo o dia',
            'start': 'Início',
            'end': 'Fim',
            'more': 'Mais',
            'close': 'Fechar',
            'cancel': 'Cancelar',
            'noTitle': '(Sem título)',
            'delete': 'Apagar',
            'deleteEvent': 'Excluir evento',
            'selectedItems': 'Ítens selecionados',
            'deleteSeries': 'Apagar série',
            'edit': 'Editar',
            'editSeries': 'Editar série',
            'editEvent': 'Editar evento',
            'createEvent': 'Criar',
            'subject': 'Assunto',
            'addTitle': 'Adicionar título',
            'moreDetails': 'Mais detalles',
            'save': 'Salvar',
            'editContent': 'Deseja editar apenas este evento ou toda a série?',
            'deleteRecurrenceContent': 'Deseja eliminar só este evento ou toda a série?',
            'deleteContent': 'Tem certeza que deseja apagar este evento?',
            'newEvent': 'Novo evento',
            'title': 'Título',
            'location': 'Localização',
            'description': 'Descrição',
            'timezone': 'Time Zone',
            'startTimezone': 'Hora inicial',
            'endTimezone': 'Hora final',
            'repeat': 'Repetir',
            'saveButton': 'Salvar',
            'cancelButton': 'Cancelar',
            'deleteButton': 'Apagar',
            'recurrence': 'Recorrência',
            'editRecurrence': 'Editar recorrência',
            'repeats': 'Repete',
            'alert': 'Alerta',
            'startEndError': 'A data de finalização selecionada ocorre antes da da de início.',
            'invalidDateError': 'O valor da data é invalida.',
            'ok': 'Confirmar',
            'occurrence': 'Výskyt',
            'series': 'Série',
            'previous': 'Anterior',
            'next': 'Próximo',
            'timelineDay': 'Alocação de Hoje',
            'timelineWeek': 'Alocação Semanal',
            'timelineWorkWeek': 'Alocação do trabalho semanal',
            'timelineMonth': 'Alocação mensal'
        },
        'recurrenceeditor': {
            'none': 'Nenhum',
            'daily': 'Diário',
            'weekly': 'Semanal',
            'monthly': 'Mensal',
            'month': 'Mês',
            'yearly': 'Anual',
            'never': 'Nunca',
            'until': 'Até',
            'count': 'Contar',
            'first': 'Primeiro',
            'second': 'Segundo',
            'third': 'Tercero',
            'fourth': 'Quarto',
            'last': 'Último',
            'repeat': 'Repetir',
            'repeatEvery': 'Repita cada',
            'on': 'Repita en',
            'end': 'Fim',
            'onDay': 'Dia',
            'days': 'Dias)',
            'weeks': 'Semanas)',
            'months': 'Meses)',
            'years': 'Anos)',
            'every': 'cada',
            'summaryTimes': 'vecês)',
            'summaryOn': 'em',
            'summaryUntil': 'até',
            'summaryRepeat': 'Repita',
            'summaryDay': 'dias)',
            'summaryWeek': 'semanas)',
            'summaryMonth': 'meses)',
            'summaryYear': 'anos)',
            'monthWeek': 'Měsíční týden',
            'monthPosition': 'Pozice měsíce',
            'monthExpander': 'Expander měsíce',
            'yearExpander': 'Rok Expander',
            'repeatInterval': 'Interval opakování'
        },
        'calendar': {
            today: 'Hoje'
        }
    }
});

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {

    public setView: View = 'Month';
    public eventSetting: EventSettingsModel;

    IMG_URL = environment.img_url;
    subs = new SubSink();
    configuracoes;
    src = 'https://player.vimeo.com/video/';
    codigoVimeo = '374889836';

    constructor(
        private store: Store<CalendarState>,
        private loginService: LoginService,
        private configuracoesStore: ConfiguracoesStore,
        public sanitizer: DomSanitizer,
    ) { }

    ngOnInit() {
        this.store.dispatch(new CalendarLoad({ id: this.loginService.user.id }));
        this.subs.sink = this.store.select(calendar).subscribe(response => {

            if (response) {
                const items = [];
                response.forEach((value, i) => {
                    items.push({
                        id: value.id,
                        Subject: value.subject,
                        StartTime: new Date(value.startTime),
                        EndTime: new Date(value.endTime)
                    });
                });

                this.eventSetting = {
                    dataSource: items
                };
            }
        });

        this.subs.sink = this.configuracoesStore.state$.subscribe(state => {
            this.configuracoes = state.configuracao;
            this.codigoVimeo = state.configuracao.tiposCursosAtivos.teaser ? state.configuracao.tiposCursosAtivos.teaser : this.codigoVimeo;
            this.src = this.src + this.codigoVimeo;
        });
    }

    isLoggedIn() {
        return this.loginService.isLoggedIn();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
