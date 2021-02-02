import {environment} from '../environments/environment';
import $ from 'jquery';

export const ADDRESS_API = environment.api

export interface ApiResponse {
    success: boolean;
    messages: Array<any>;
    items: Array<any>;
    data: Array<any>;
    fileNo: Array<any>;
    total: number;
}

export class ApiErrors {
    handle(errors) {
        $('.error').remove();
        $.each(errors.messages, (model, fields) => {
            $.each(fields, (field, message) => {
                $('#' + field).after(
                    $('<span style="color:red"></span>')
                        .addClass('error')
                        .html(message)
                );
            });
        });
    }
}
