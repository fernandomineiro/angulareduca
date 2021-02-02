import { Component, OnInit } from '@angular/core';
import { EventosService } from '../eventos.service';
import { HeaderService } from 'src/app/header/header.service';
import { MeusEventos } from './meus-eventos.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-meus-eventos',
  templateUrl: './meus-eventos.component.html',
  styleUrls: ['./meus-eventos.component.css']
})
export class MeusEventosComponent implements OnInit {
  IMG_URL = environment.img_url
  constructor(private meusEventosService: EventosService, private headerService: HeaderService) { }

  meusEventos: MeusEventos[];
  panelOpenState = [];

  color = 'primary';
  mode = 'determinate';

  percentWorkshop = [];
  percentLecture = [];


  ngOnInit() {
    try {
      const id = localStorage.getItem('usuario_id')
      this.meusEventosService.getMeusEventos(id).subscribe((meusEventos) => {
        this.meusEventos = meusEventos.items;
        /*this.meusEventos.forEach(element => {
          this.percentWorkshop.push((element.workshopBought * 100) / element.visitorsAmount);
          this.percentLecture.push((element.lectureBought * 100) / element.visitorsAmount);
          this.panelOpenState.push(false);
        });*/
        console.log(this.meusEventos);
      });

    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }
  }

  

}
