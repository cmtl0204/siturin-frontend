import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentForm } from './parent-form';

describe('ParentForm', () => {
  let component: ParentForm;
  let fixture: ComponentFixture<ParentForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
