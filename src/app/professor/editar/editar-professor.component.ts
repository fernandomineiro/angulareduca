import { Component, OnInit } from '@angular/core';

import {FormControl, FormGroup} from '@angular/forms';
import { ApiErrors } from '../../app.api';

import { ProfessorService } from '../professor.service';
import {NotificationService} from '../../shared/messages/notification.service';
import { DadosBasicos } from './dados-basicos.model';
import $ from "jquery";
import {AlunoService} from '../../aluno/aluno.service';
import {LoginService} from '../../security/login/login.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-editar-professor',
    templateUrl: './editar-professor.component.html',
    styleUrls: ['./editar-professor.component.css']
})
export class EditarProfessorComponent implements OnInit {

    formDadosBasicos: FormGroup;
    loading: boolean = false;
    usuarioId: number;
    IMG_URL = environment.s3_url;
    private formSubmitAttempt: boolean = false;
    selectedFile: File;

    constructor(
        private professorService: ProfessorService,
        private notificationService: NotificationService,
        private alunoService: AlunoService,
        private loginService: LoginService,
    ) {

    }

    ngOnInit(): void {
        this.createFormMiniCurriculo(new DadosBasicos());
        // tslint:disable-next-line:radix
        this.usuarioId = parseInt(localStorage.getItem('usuario_id'));
        this.professorService.getProfessorByIdUsuario(this.usuarioId).subscribe((apiResponse) => {
            this.formDadosBasicos.setValue({
                id: this.usuarioId,
                nome: apiResponse.items.nome,
                sobrenome: apiResponse.items.sobrenome,
                nome_fantasia: apiResponse.items.nome_fantasia,
                razao_social: apiResponse.items.razao_social,
                cpf: apiResponse.items.cpf ? this.mask(apiResponse.items.cpf) : null,
                cnpj: apiResponse.items.cnpj ? this.mask(apiResponse.items.cnpj) : null,
                data_nascimento: apiResponse.items.data_nascimento,
                profissao: apiResponse.items.profissao,
                telefone_1: apiResponse.items.telefone_1,
                telefone_2: apiResponse.items.telefone_2,
                telefone_3: apiResponse.items.telefone_3,
                facebook_link: apiResponse.items.facebook_link,
                insta_link: apiResponse.items.insta_link,
                twitter_link: apiResponse.items.twitter_link,
                linkedin_link: apiResponse.items.linkedin_link,
                youteber_link: apiResponse.items.youteber_link,
                representante_legal: apiResponse.items.representante_legal,
                responsavel: apiResponse.items.responsavel,
                titular: apiResponse.items.titular,
            });
        });
    }

    createFormMiniCurriculo(dadosBasicosForm: DadosBasicos) {
        this.formDadosBasicos = new FormGroup({
            id: new FormControl(dadosBasicosForm.id),
            nome: new FormControl(dadosBasicosForm.nome),
            sobrenome: new FormControl(dadosBasicosForm.sobrenome),
            nome_fantasia: new FormControl(dadosBasicosForm.nome_fantasia),
            razao_social: new FormControl(dadosBasicosForm.razao_social),
            cpf: new FormControl(dadosBasicosForm.cpf),
            cnpj: new FormControl(dadosBasicosForm.cnpj),
            data_nascimento: new FormControl(dadosBasicosForm.data_nascimento),
            profissao: new FormControl(dadosBasicosForm.profissao),
            telefone_1: new FormControl(dadosBasicosForm.telefone_1),
            telefone_2: new FormControl(dadosBasicosForm.telefone_2),
            telefone_3: new FormControl(dadosBasicosForm.telefone_3),
            facebook_link: new FormControl(dadosBasicosForm.facebook_link),
            insta_link: new FormControl(dadosBasicosForm.insta_link),
            twitter_link: new FormControl(dadosBasicosForm.twitter_link),
            linkedin_link: new FormControl(dadosBasicosForm.linkedin_link),
            youteber_link: new FormControl(dadosBasicosForm.youteber_link),
            representante_legal: new FormControl(dadosBasicosForm.representante_legal),
            responsavel: new FormControl(dadosBasicosForm.responsavel),
            titular: new FormControl(dadosBasicosForm.titular),
        });
    }

    onSubmitDadosBasicos() {
        this.loading = true;
        this.formSubmitAttempt = true;

        if (this.formDadosBasicos.invalid) {
            console.log(this.formDadosBasicos);
            this.loading = false;
            return false;
        }
        let formDadosBasicosCopy = JSON.parse(JSON.stringify(this.formDadosBasicos.getRawValue()))
        if(this.perfil == 2 || this.perfil == 9 || this.perfil == 13 || this.perfil == 11 || this.perfil == 22 || this.perfil == 10){
            delete formDadosBasicosCopy.nome_fantasia;
            delete formDadosBasicosCopy.razao_social;
            delete formDadosBasicosCopy.cnpj;
            delete formDadosBasicosCopy.data_nascimento;
            delete formDadosBasicosCopy.profissao;            
            delete formDadosBasicosCopy.facebook_link;
            delete formDadosBasicosCopy.insta_link;
            delete formDadosBasicosCopy.linkedin_link;
            delete formDadosBasicosCopy.youteber_link;
            delete formDadosBasicosCopy.representante_legal;
            delete formDadosBasicosCopy.responsavel;
            delete formDadosBasicosCopy.titular;
        }
        this.professorService.saveProfessor(this.formDadosBasicos.getRawValue()).subscribe((apiResponse) => {
            this.loading = false;
            if (apiResponse.success) {
                this.notificationService.success('Dados pessoais salvos com sucesso!');
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

    isValidBirthdate(c: FormControl) {
        const birthdate = new Date(c.value);
        return Number(birthdate.getFullYear()) >= 1900 && birthdate < new Date() ? null : {
            validateBirthdate: {
                valid: false,
                message: 'Informe uma data de nascimento válida'
            }
        };
    }

    isFieldValid(field: string) {
        return (!this.formDadosBasicos.get(field).valid && this.formDadosBasicos.get(field).touched) ||
            (this.formDadosBasicos.get(field).untouched && this.formSubmitAttempt && !this.formDadosBasicos.get(field).valid);
    }

    get foto() {
        return localStorage.getItem('foto') || null;
    }

    get perfil() {
        return this.loginService.getPerfil();
    }

    onFileSelected(event) {
        this.selectedFile = event.target.files[0];
        $('#user_avatar').attr('src', URL.createObjectURL(event.target.files[0]));
    }

    triggerInputFile() {
        $('#profilePicture').trigger('click');
    }

    onUpload() {
        if (!this.selectedFile) {
            this.notificationService.error('Você precisa selecionar uma foto!');
            return;
        }

        this.alunoService.fotoUpload(this.selectedFile, this.usuarioId).subscribe((apiResponse) => {
            this.loading = true;

            if (apiResponse.success == false) {
                this.notificationService.error('Houve erro ao enviar foto!');
                return false;
            }

            localStorage.setItem('foto', apiResponse.fileNo.toString());
            this.notificationService.success('A foto foi enviada com sucesso');
        });
    }
}
