import {ChangeDetectorRef, Component, OnInit} from '@angular/core';

import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import { ApiErrors } from '../../../app.api';
import { ProfessorService } from '../../professor.service';
import {NotificationService} from '../../../shared/messages/notification.service';
import { Endereco } from './endereco.model';
import {AlunoService} from '../../../aluno/aluno.service';

@Component({
    selector: 'app-endereco',
    templateUrl: './endereco.component.html',
    styleUrls: ['./endereco.component.css']
})
export class EnderecoComponent implements OnInit {

    formEndereco: FormGroup;
    loading: boolean = false;
    usuarioId: number;
    estados: [];
    cidades: [];
    private formSubmitAttempt: boolean = false;

    constructor(
        private alunoService: AlunoService,
        private professorService: ProfessorService,
        private notificationService: NotificationService,
        private cdr: ChangeDetectorRef,
    ) {

    }

    ngOnInit(): void {
        this.createFormMiniCurriculo(new Endereco());
        this.buscarEstado();
        this.cdr.detectChanges();
        // tslint:disable-next-line:radix
        this.usuarioId = parseInt(localStorage.getItem('usuario_id'));
        this.professorService.getProfessorByIdUsuario(this.usuarioId).subscribe((apiResponse) => {
            this.formEndereco.setValue({
                id: apiResponse.items.endereco.id,
                idUsuario: this.usuarioId,
                cep: apiResponse.items.endereco.cep,
                logradouro: apiResponse.items.endereco.logradouro,
                numero: apiResponse.items.endereco.numero,
                complemento: apiResponse.items.endereco.complemento,
                bairro: apiResponse.items.endereco.bairro,
                fk_cidade_id: apiResponse.items.endereco.fk_cidade_id,
                fk_estado_id: apiResponse.items.endereco.fk_estado_id,
                status: apiResponse.items.endereco.status,
            });
            if (apiResponse.items.endereco.fk_estado_id) {
                this.buscarCidades();
            }
        });
    }

    buscarEstado() {
        this.alunoService.getEstados().subscribe((apiResponse) => {
            this.estados = apiResponse.items;
        });
    }

    buscarCidades() {
        this.alunoService.getCidades(this.formEndereco.get('fk_estado_id').value).subscribe((apiResponse) => {
            this.cidades = apiResponse.items;
        });
    }

    createFormMiniCurriculo(enderecoForm: Endereco) {
        this.formEndereco = new FormGroup({
            id: new FormControl(enderecoForm.id),
            idUsuario: new FormControl(enderecoForm.idUsuario),
            cep: new FormControl(enderecoForm.cep),
            logradouro: new FormControl(enderecoForm.logradouro),
            numero: new FormControl(enderecoForm.numero),
            complemento: new FormControl(enderecoForm.complemento),
            bairro: new FormControl(enderecoForm.bairro),
            fk_cidade_id: new FormControl(enderecoForm.fk_cidade_id),
            fk_estado_id: new FormControl(enderecoForm.fk_estado_id),
            status: new FormControl(enderecoForm.status),
        });
    }

    onSubmitMiniCurriculo() {
        this.loading = true;
        this.formSubmitAttempt = true;

        if (this.formEndereco.invalid) {
            return this.loading = false;
        }

        this.professorService.saveEndereco(this.formEndereco.getRawValue()).subscribe((apiResponse) => {
            this.loading = false;
            if (apiResponse.success) {
                this.notificationService.success('Endereço atualizado com sucesso!');
            } else {
                this.notificationService.error('Houve um erro ao salvar os dados. Entre em contato com o suporte!');
            }
        });
    }

    buscarEnderecoCEP(event) {
        this.alunoService.getEnderecoCep(event.target.value).subscribe((apiResponse) => {
            if (apiResponse.success) {
                const endereco = apiResponse.items;
                this.alunoService.getCidades(endereco.ufId).subscribe((apiResponseCidade) => {
                    this.cidades = apiResponseCidade.items;
                    this.formEndereco.setValue({
                        id: this.formEndereco.get('id').value,
                        idUsuario: this.usuarioId,
                        cep: endereco.cep,
                        logradouro: endereco.logradouro,
                        numero: null,
                        complemento: endereco.complemento,
                        bairro: endereco.bairro,
                        fk_cidade_id: endereco.cidadeId,
                        fk_estado_id: endereco.ufId,
                        status: this.formEndereco.get('status').value
                    });
                });
            }
        });
    }

    isFieldValid(field: string) {
        return (!this.formEndereco.get(field).valid && this.formEndereco.get(field).touched) ||
            (this.formEndereco.get(field).untouched && this.formSubmitAttempt && !this.formEndereco.get(field).valid);
    }
}
