import { Component, OnInit } from '@angular/core';

import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import { ApiErrors } from '../../../app.api';
import { ProfessorService } from '../../professor.service';
import { MiniCurriculo } from '../credenciais/mini-curriculo.model';
import {Credenciais} from '../../../aluno/credenciais.model';
import {NotificationService} from '../../../shared/messages/notification.service';

@Component({
    selector: 'app-mini-curriculo',
    templateUrl: './mini-curriculo.component.html',
    styleUrls: ['./mini-curriculo.component.css']
})
export class MiniCurriculoComponent implements OnInit {

    formMiniCurriculo: FormGroup;
    loading: boolean = false;
    usuarioId: number;
    private formSubmitAttempt: boolean = false;

    constructor(
        private professorService: ProfessorService,
        private notificationService: NotificationService,
    ) {

    }

    ngOnInit(): void {
        this.createFormMiniCurriculo(new MiniCurriculo());
        // tslint:disable-next-line:radix
        this.usuarioId = parseInt(localStorage.getItem('usuario_id'));
        this.professorService.getProfessorByIdUsuario(this.usuarioId).subscribe((apiResponse) => {
            this.formMiniCurriculo.setValue({
                id: this.usuarioId,
                mini_curriculum: apiResponse.items.mini_curriculum
            });
        });
    }

    createFormMiniCurriculo(miniCurriculoForm: MiniCurriculo) {
        this.formMiniCurriculo = new FormGroup({
            id: new FormControl(miniCurriculoForm.id),
            mini_curriculum: new FormControl(miniCurriculoForm.mini_curriculum),
        });
    }

    onSubmitMiniCurriculo() {
        this.loading = true;
        this.formSubmitAttempt = true;

        if (this.formMiniCurriculo.invalid) {
            return this.loading = false;
        }

        this.professorService.saveMiniCurriculo(this.formMiniCurriculo.getRawValue()).subscribe((apiResponse) => {
            this.loading = false;
            if (apiResponse.success) {
                this.notificationService.success('Mini-currículo atualizado com sucesso!');
            } else {
                this.notificationService.error('Houve um erro ao salvar os dados. Entre em contato com o suporte!');
            }
        });
    }

    isFieldValid(field: string) {
        return (!this.formMiniCurriculo.get(field).valid && this.formMiniCurriculo.get(field).touched) ||
            (this.formMiniCurriculo.get(field).untouched && this.formSubmitAttempt && !this.formMiniCurriculo.get(field).valid);
    }
}
