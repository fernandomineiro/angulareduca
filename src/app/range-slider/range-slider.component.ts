import { Component, Input, OnInit} from '@angular/core';

import { ChangeContext, Options} from 'ng5-slider';
import { CursosService } from '../curso/cursos.service';
import { PesquisaStore} from '../stores/pesquisa.store';
import { Router} from '@angular/router';

@Component({
    selector: 'app-range-slider',
    templateUrl: './range-slider.component.html',
})
export class RangeSliderComponent implements OnInit {

    value: number = 0;
    options: Options = {
        floor: 0,
        ceil: 200,
        step: 1
    };

    @Input()
    tipoCurso: number;

    constructor(
        private cursosService: CursosService,
        private store: PesquisaStore,
        private router: Router,
    ) { }

    ngOnInit() {
        this.cursosService.getMaxValueCourse().subscribe( apiResponse => {
            if (apiResponse.success) {
                const newOptions: Options = Object.assign({}, this.options);
                newOptions.ceil = apiResponse.items[0].max_valor_de;
                this.options = newOptions;
                this.value = apiResponse.items[0].max_valor_de;
            }
        });
    }

    findCursos(changeContext: ChangeContext) {

        const dataSearch = {
            price : changeContext.value,
            fk_cursos_tipo : this.tipoCurso,
        };

        this.cursosService.getCursos(dataSearch).subscribe(async apiResponse => {
            await this.store.updateCursos(apiResponse.items);
            this.router.navigate(['/pesquisar']);
        });
    }
}
