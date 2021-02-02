import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import { AlunoService } from 'src/app/aluno/aluno.service';

@Component({
    selector: 'app-mt-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
    IMG_URL = environment.img_url + '/files/curso/imagem/';

    constructor(private alunoService: AlunoService){}

    @Input()
    curso: any;

    @Input()
    showButtonPlay = true;

    @Input()
    isFavourite = false;

    @Input()
    showProgressBar = false;

    @Input()
    percentageDone = 0;
    
    progressInfo;
    ngOnInit(): void {        
        this.alunoService.getProgressoConclusao(Number(localStorage.getItem('usuario_id')),this.curso.id).subscribe(ApiResponse => {
            this.progressInfo = ApiResponse;
            this.progressInfo.percentual_conclusao =  this.progressInfo.percentual_conclusao > 1 ? 1 :  this.progressInfo.percentual_conclusao;         
        });
        

        const oImage = new Image();
        oImage.src = this.IMG_URL + this.curso.imagem;
        oImage.onload = () => {
            this.curso.imagem = oImage.src;
        };

        oImage.onerror = () => {
            this.curso.imagem = '../../../../assets/img/az.png';
        };
    }
}
