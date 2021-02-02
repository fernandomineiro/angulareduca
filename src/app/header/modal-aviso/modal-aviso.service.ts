import { Injectable } from '@angular/core';
// @ts-ignore
import $ from 'jquery';
// @ts-ignore
declare var $: $;

@Injectable({
  providedIn: 'root'
})
export class ModalAvisoService {

  

  constructor() { 

    $.noConflict();
  }

  openWarning(body) {
  
    $('#bodyTextModalWarning').text(body) ;
    $('#warningModal').modal('show');
    
  }

  

 
}
