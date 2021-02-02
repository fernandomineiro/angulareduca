import { Component, OnInit } from '@angular/core';

import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import { ApiErrors } from '../../../app.api';
import { ProfessorService } from '../../professor.service';
import { NotificationService } from '../../../shared/messages/notification.service';
import { DadosBancarios } from './dados-bancarios.model';

@Component({
    selector: 'app-dados-bancarios',
    templateUrl: './dados-bancarios.component.html',
    styleUrls: ['./dados-bancarios.component.css']
})
export class DadosBancariosComponent implements OnInit {

    formDadosBancarios: FormGroup;
    loading: boolean = false;
    usuarioId: number;
    bancos: Array<any>;
    private formSubmitAttempt = false;

    constructor(
        private professorService: ProfessorService,
        private notificationService: NotificationService,
    ) {

    }

    ngOnInit(): void {
        this.createFormDadosBancarios(new DadosBancarios());
        // tslint:disable-next-line:radix
        this.usuarioId = parseInt(localStorage.getItem('usuario_id'));
        this.professorService.getProfessorByIdUsuario(this.usuarioId).subscribe((apiResponse) => {
            this.formDadosBancarios.setValue({
                id: apiResponse.items.conta.id,
                titular: apiResponse.items.conta.titular,
                documento: this.mask(apiResponse.items.conta.documento),
                fk_banco_id: apiResponse.items.conta.fk_banco_id,
                agencia: apiResponse.items.conta.agencia,
                conta_corrente: apiResponse.items.conta.conta_corrente,
                operacao: apiResponse.items.conta.operacao,
                digita_conta: apiResponse.items.conta.digita_conta,
                digita_agencia: apiResponse.items.conta.digita_agencia,
                tipo_conta: apiResponse.items.conta.tipo_conta,
            });
        });
        this.professorService.getBancos().subscribe((apiResponse) => {
            this.bancos = apiResponse.items;
        });
    }

    createFormDadosBancarios(dadosBancarios: DadosBancarios) {
        this.formDadosBancarios = new FormGroup({
            id: new FormControl(dadosBancarios.id),
            titular: new FormControl(dadosBancarios.titular),
            fk_banco_id: new FormControl(dadosBancarios.fk_banco_id),
            agencia: new FormControl(dadosBancarios.agencia),
            conta_corrente: new FormControl(dadosBancarios.conta_corrente),
            operacao: new FormControl(dadosBancarios.operacao),
            documento: new FormControl(dadosBancarios.documento),
            digita_conta: new FormControl(dadosBancarios.digita_conta),
            digita_agencia: new FormControl(dadosBancarios.digita_agencia),
            tipo_conta: new FormControl(dadosBancarios.tipo_conta),
        });
    }

    onSubmitDadosBancarios() {
        this.loading = true;
        this.formSubmitAttempt = true;

        if (this.formDadosBancarios.invalid) {
            return this.loading = false;
        }

        this.professorService.saveDadosBancarios(this.formDadosBancarios.getRawValue()).subscribe((apiResponse) => {
            this.loading = false;
            if (apiResponse.success) {
                this.notificationService.success('Dados bancários atualizado com sucesso!');
            } else {
                this.notificationService.error('Houve um erro ao salvar os dados. Entre em contato com o suporte!');
            }
        });
    }

    cpfMask(event) {
        event.target.value = this.mask(event.target.value);
    }

    mask(value) {
        value = value.replace(/\D/g, '');
        if (value.length > 11) {
            return value.replace(/\D/g, '')
                .replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, '$1.$2.$3/$4-$5');
        }

        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    }

    isFieldValid(field: string) {
        return (!this.formDadosBancarios.get(field).valid && this.formDadosBancarios.get(field).touched) ||
            (this.formDadosBancarios.get(field).untouched && this.formSubmitAttempt && !this.formDadosBancarios.get(field).valid);
    }
}
