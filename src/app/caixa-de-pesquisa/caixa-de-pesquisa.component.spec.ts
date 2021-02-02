import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaixaDePesquisaComponent } from './caixa-de-pesquisa.component';

describe('CaixaDePesquisaComponent', () => {
  let component: CaixaDePesquisaComponent;
  let fixture: ComponentFixture<CaixaDePesquisaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaixaDePesquisaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaixaDePesquisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
