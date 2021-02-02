import { Directive } from '@angular/core';
import { Input } from '@angular/core';
import { HostListener } from '@angular/core';
import { 
  NG_VALUE_ACCESSOR, ControlValueAccessor 
} from '@angular/forms';

@Directive({
  selector: '[appNumberMask]',
  providers: [{
    provide: NG_VALUE_ACCESSOR, 
    useExisting: NumberMaskDirective, 
    multi: true 
  }]
})
export class NumberMaskDirective {

  onTouched: any;
  onChange: any;
 
  @Input('appNumberMask') kzMask: string;
  @Input('isCnpj') isCnpj:boolean
 
  writeValue(value: any): void {
  }
 
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
 
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
 
  @HostListener('keyup', ['$event']) 
  onKeyup($event: any) {
    var valor = $event.target.value.replace(/\D/g, '');
    var pad = this.kzMask.replace(/\D/g, '').replace(/9/g, '_');
    var valorMask = valor + pad.substring(0, pad.length - valor.length);
 
    // retorna caso pressionado backspace
    if ($event.keyCode === 8) {
      this.onChange(valor);
      return;
    }
 
   if (valor.length <= pad.length || this.isCnpj) {
      this.onChange(valor);
    }
 
    var valorMaskPos = 0;
    valor = '';
    for (var i = 0; i < this.kzMask.length; i++) {
      if (isNaN(parseInt(this.kzMask.charAt(i)))) {
        valor += this.kzMask.charAt(i);
      } else {
        valor += valorMask[valorMaskPos++];
      }
    }
    
    if (valor.indexOf('_') > -1) {
      valor = valor.substr(0, valor.indexOf('_'));
    }
 
    $event.target.value = valor;
  }

  @HostListener('mouseenter', ['$event']) 
  onmouseenter($event: any) {
    if($event.target.value == '')return;
    var valor = $event.target.value.replace(/\D/g, '');
    var pad = this.kzMask.replace(/\D/g, '').replace(/9/g, '_');
    var valorMask = valor + pad.substring(0, pad.length - valor.length);
 
    // retorna caso pressionado backspace
    if ($event.keyCode === 8) {
      this.onChange(valor);
      return;
    }
 
   if (valor.length <= pad.length || this.isCnpj) {
      this.onChange(valor);
    }
 
    var valorMaskPos = 0;
    valor = '';
    for (var i = 0; i < this.kzMask.length; i++) {
      if (isNaN(parseInt(this.kzMask.charAt(i)))) {
        valor += this.kzMask.charAt(i);
      } else {
        valor += valorMask[valorMaskPos++];
      }
    }
    
    if (valor.indexOf('_') > -1) {
      valor = valor.substr(0, valor.indexOf('_'));
    }
 
    $event.target.value = valor;
  }
 
  @HostListener('blur', ['$event']) 
  onBlur($event: any) {
    if ($event.target.value.length === this.kzMask.length) {
       return;
    }
    this.onChange('');
    $event.target.value = '';
  }

}
