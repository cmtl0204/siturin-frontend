import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SotomayorComponent } from './sotomayor.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('SotomayorComponent', () => {
  let component: SotomayorComponent;
  let fixture: ComponentFixture<SotomayorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SotomayorComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SotomayorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
