import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmCarritoComponent } from './abm-carrito.component';

describe('AbmCarritoComponent', () => {
  let component: AbmCarritoComponent;
  let fixture: ComponentFixture<AbmCarritoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbmCarritoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbmCarritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
