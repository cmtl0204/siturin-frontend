import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NiveselaComponent } from './nivesela.component';

describe('NiveselaComponent', () => {
  let component: NiveselaComponent;
  let fixture: ComponentFixture<NiveselaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NiveselaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NiveselaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
