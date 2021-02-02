import { Component, OnInit, Input } from '@angular/core';
import $ from 'jquery';
import * as underscore from 'underscore';
import { Agenda } from './agenda.model';
import { AgendaService } from './agenda.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {

    constructor(private agendaService: AgendaService) { }

    compromissos: Agenda[];

    months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    today;

    currentMonth;
    currentYear;

    selectYear;
    selectMonth;

    ngOnInit() {

        this.today = new Date();

        this.currentMonth = this.today.getMonth();
        this.currentYear = this.today.getFullYear();

        this.selectYear = new Date().getFullYear();

        try {
            this.showCalendar(this.currentMonth, this.currentYear);
        } catch (error) {
          console.log('==== error ====', error);
        }
    }

    configureTooltip(compromissos) {

        if (compromissos.length) {
            compromissos.forEach((element) => {
                if ((this.selectMonth + 1) === element.month) {
                    const elementId = '#day_' + element.day;

                    $(elementId).addClass('compromisso');
                    $(elementId).on('mouseenter', () => {
                        $('#tooltip_calendar #title').text(element.title);
                        $('#tooltip_calendar #date').text(element.date);
                        $('#tooltip_calendar #local').text(element.local);

                        $('#tooltip_calendar').css('top', $(elementId).offset().top - $('#tooltip_calendar').height() / 2 + 30);
                        $('#tooltip_calendar').css('left', ($(elementId) as any)[0].cellIndex * 100);
                        $('#tooltip_calendar').show();
                    });

                    $(elementId).on('mouseleave', () => {
                        $('#tooltip_calendar').hide();
                    });
                }
            });
        }
    }

    showCalendar(month, year) {
        // filing data about month and in the page via DOM.
        this.selectYear = year;
        this.selectMonth = month;

        // var compromissos = JSON.parse($("#calendar-body"+index).attr('compromissos'));
        const firstDay = (new Date(year, month)).getDay();
        const daysInMonth = 32 - new Date(year, month, 32).getDate();

        const tbl = document.getElementById('calendar-body'); // body of the calendar

        // clearing all previous cells
        tbl.innerHTML = '';

        // creating all cells
        let date = 1;
        for (let i = 0; i < 6; i++) {

            // creates a table row
            const row = document.createElement('tr');
            // creating individual cells, filing them up with data.
            for (let j = 0; j < 7; j++) {
                let cell;
                let cellText;
                let span;

                if (date > daysInMonth) {
                    break;
                }

                cell = document.createElement('td');
                span = document.createElement('div');

                if (i === 0 && j < firstDay) {
                    cellText = document.createTextNode('');
                    cell.style.border = 'none';
                } else {

                    cellText = document.createTextNode(date.toString());

                    if (date === this.today.getDate() &&
                        year === this.currentYear &&
                        month === this.currentMonth
                    ) {
                        cell.classList.add('today');
                    }
                    cell.id = 'day_' + date;
                    date++;
                }

                cell.appendChild(span);
                span.appendChild(cellText);

                row.appendChild(cell);
            }

            tbl.appendChild(row); // appending each row into calendar body.
        }

        this.fetchCompromissos();
    }

    changeDate(month) {
        this.today.setMonth(this.today.getMonth() + month);
        this.showCalendar(this.today.getMonth(), this.today.getFullYear());
    }

    fetchCompromissos() {
        this.agendaService.getAgenda(this.selectMonth + 1).subscribe((agenda) => {
            this.compromissos = agenda;
            this.configureTooltip(this.compromissos);
        });
    }

    get monthYear() {
        return this.months[this.selectMonth] + ' ' + this.selectYear;
    }

}
