import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VivasComponent } from './vivas.component';

describe('VivasComponent', () => {
  let component: VivasComponent;
  let fixture: ComponentFixture<VivasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VivasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
