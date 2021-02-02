import { Component, OnInit } from '@angular/core';
import { MeAviseModalService } from './me-avise-modal.service';
import {EmailValidator, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../environments/environment';

@Component({
    selector: 'app-me-avise-modal',
    templateUrl: './me-avise-modal.component.html',
    styleUrls: ['./me-avise-modal.component.css']
})
export class MeAviseModalComponent implements OnInit {

    constructor(
                private modalWarning: MeAviseModalService,
                private formBuilder: FormBuilder
    ) {
    }

    formWarnMe: FormGroup;
    error: any;
    mensagem: any;
    validator: any;
    submitted: any;

    ngOnInit() {
        this.createForm();
        this.error = null;
        this.mensagem = null;
        this.validator = null;
    }

    createForm() {
        this.formWarnMe = this.formBuilder.group({
            nome: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email, EmailValidator]],
        });
    }

    onSubmit() {
        const data = {
            nome_aluno: this.formWarnMe.get('nome').value,
            email_aluno: this.formWarnMe.get('email').value,
            fk_curso: localStorage.getItem('idCursoMeAvise'),
            fk_faculdade: environment.faculdade_id.toString(),
        };
        this.modalWarning.salvarDadosDeAviso(data).subscribe(response => {
            if (response.success) {
                this.mensagem = response.message;
            } else {
                this.error = response.error;
                if (response.validator) {
                    this.validator = response.validator;
                }
            }
        });
    }
}
