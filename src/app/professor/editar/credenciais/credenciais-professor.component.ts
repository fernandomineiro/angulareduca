import { Component, OnInit } from '@angular/core';

import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import { ApiErrors } from '../../../app.api';
import { ProfessorService } from '../../professor.service';
import { Credenciais } from '../../../aluno/credenciais.model';
import {NotificationService} from '../../../shared/messages/notification.service';
import {AlunoService} from '../../../aluno/aluno.service';
import {LoginService} from '../../../security/login/login.service';

@Component({
    selector: 'app-credenciais-professor',
    templateUrl: './credenciais-professor.component.html',
    styleUrls: ['./credenciais-professor.component.css']
})
export class CredenciaisProfessorComponent implements OnInit {

    formCredentials: FormGroup;
    usuarioId: number;
    visualizarSenha: boolean = false;
    loading: boolean = false;
    private formSubmitAttempt: boolean = false;

    constructor(
        private alunoService: AlunoService,
        private loginService: LoginService,
        private professorService: ProfessorService,
        private notificationService: NotificationService,
    ) { }

    ngOnInit(): void {
        this.createFormCredentials(new Credenciais());
        // tslint:disable-next-line:radix
        this.usuarioId = parseInt(localStorage.getItem('usuario_id'));
        this.formCredentials.setValue({
            id: this.usuarioId,
            email: localStorage.getItem('email'),
            senha: null,
            senha_confirmar: null,
        });
    }

    createFormCredentials(credentialsForm: Credenciais) {
        this.formCredentials = new FormGroup({
            id: new FormControl(credentialsForm.id),
            email: new FormControl(credentialsForm.email, [Validators.required, Validators.email]),
            senha: new FormControl(credentialsForm.senha),
            senha_confirmar: new FormControl(
                credentialsForm.senha_confirmar, [
                (control: AbstractControl) => {
                    if (control.parent) {
                        if (control.parent.value.senha !== control.value) {
                            return { NoPassswordMatch: true };
                        }
                    }
                    return null;
                }
            ]),
        });
    }

    onSubmitCredentials() {
        this.loading = true;
        this.formSubmitAttempt = true;

        if (this.formCredentials.invalid) {
            return this.loading = false;
        }

        this.alunoService.updateCredentials(this.formCredentials.getRawValue(), this.usuarioId).subscribe((apiResponse) => {
            this.loading = false;
            this.formSubmitAttempt = false;
            if (apiResponse.success) {
                this.notificationService.success('Credenciais atualizadas com sucesso!');
                this.atualizarLocalStorage(apiResponse.data);
                this.formCredentials.reset();
                this.formCredentials.setValue({
                    id: this.usuarioId,
                    email: localStorage.getItem('email'),
                    senha: null,
                    senha_confirmar: null,
                });
            } else {
                this.notificationService.error('Houve um erro ao salvar os dados. Entre em contato com o suporte!');
            }
        });
    }

    atualizarLocalStorage(data) {
        if (data) {
            this.loginService.user = data[0];
            this.loginService.saveUserLocalStorage();
        }
    }

    isFieldValid(field: string) {
        return (!this.formCredentials.get(field).valid && this.formCredentials.get(field).touched) ||
            (this.formCredentials.get(field).untouched && this.formSubmitAttempt && !this.formCredentials.get(field).valid);
    }
}
