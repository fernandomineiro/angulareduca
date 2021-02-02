import { Component, OnInit } from '@angular/core';
import { CursosService } from '../../../curso/cursos.service';
import * as underscore from 'underscore';
import {environment} from '../../../../environments/environment';
import { TrilhasService } from 'src/app/trilha-conhecimento/trilha-conhecimento.service';

@Component({
    selector: 'app-mt-meus-cursos',
    templateUrl: './favoritos.component.html',
    styleUrls: ['./favoritos.component.css']
})
export class FavoritosComponent implements OnInit {
    IMG_URL = environment.img_url;
    favorites = [];
    favorites2;
    cursosAlunoPresencial;
    cursosAlunoRemotos;
    cursosAluno
    trilhas:any
    trilhaFavorites:any


    slide1Config = {
        slidesToShow: 4,
        slidesToScroll: 4,
        autoplay:true,
        autoPlaySpeed:8000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 750,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    }

    slide2Config = {
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 2,
        autoplay:true,
        responsive: [
          {
            breakpoint: 940,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,         
              dots: false
            }
          }
        ]
      }

  

    constructor(
        private cursosService: CursosService,
        private trilhasService: TrilhasService
    ) {}

    ngOnInit() {
        this.cursosService.getFavorites(Number(localStorage.getItem('usuario_id')))
            .subscribe((ApiResponse) => {
                this.favorites2 = ApiResponse;               
                underscore.each(ApiResponse.items, element => {
                    element.route = this.buildRoute(element);
                    this.favorites.push(element);
                });
                var prov;
                this.cursosService.getCursosOnlinePorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAluno) => {
                    prov = cursosAluno.items;
                    this.cursosService.getCursosPresenciaisPorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAlunoPresencial) => {
                      this.cursosAlunoPresencial = cursosAlunoPresencial.items;
                      this.cursosService.getCursosRemotosPorAluno(localStorage.getItem('usuario_id')).subscribe((cursosAlunoRemoto) => {
                        this.cursosAlunoRemotos = cursosAlunoRemoto.items;
                        this.cursosAluno = prov.concat(this.cursosAlunoPresencial, this.cursosAlunoRemotos)
                        console.log("cursossss", this.cursosAluno)
                      });
                      
                    });
                    
          
                  });
            });

            this.trilhasService.getFavorites(localStorage.getItem('usuario_id')).subscribe(favorites => {
                this.trilhaFavorites = favorites;   
                this.trilhaFavorites = {items:Object.values(this.trilhaFavorites.items) }
                console.log("this.trilhaFavorites ",this.trilhaFavorites )        
              });
    }

    buildRoute(favorite) {
        let type: string;
        switch (favorite.tipo) {
            case 1:
                type = '/curso-online';
                break;
            case 2:
                type = '/curso-presencial';
                break;
            case 3:
                type = '/evento';
                break;
            default:
                type = '/curso-remoto';
        }

        return type + '/' + favorite.id + '/' + 'detalhe';
    }
}
