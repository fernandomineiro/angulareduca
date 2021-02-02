import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizNaoAprovadoComponent } from './quiz-nao-aprovado.component';

describe('QuizNaoAprovadoComponent', () => {
  let component: QuizNaoAprovadoComponent;
  let fixture: ComponentFixture<QuizNaoAprovadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizNaoAprovadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizNaoAprovadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
