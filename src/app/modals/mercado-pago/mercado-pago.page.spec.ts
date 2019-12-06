import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MercadoPagoPage } from './mercado-pago.page';

describe('MercadoPagoPage', () => {
  let component: MercadoPagoPage;
  let fixture: ComponentFixture<MercadoPagoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MercadoPagoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MercadoPagoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
