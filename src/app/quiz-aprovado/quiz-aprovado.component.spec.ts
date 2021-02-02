import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizAprovadoComponent } from './quiz-aprovado.component';

describe('QuizAprovadoComponent', () => {
  let component: QuizAprovadoComponent;
  let fixture: ComponentFixture<QuizAprovadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizAprovadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizAprovadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
