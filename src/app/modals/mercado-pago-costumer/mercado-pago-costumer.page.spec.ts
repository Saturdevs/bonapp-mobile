import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MercadoPagoCostumerPage } from './mercado-pago-costumer.page';

describe('MercadoPagoCostumerPage', () => {
  let component: MercadoPagoCostumerPage;
  let fixture: ComponentFixture<MercadoPagoCostumerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MercadoPagoCostumerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MercadoPagoCostumerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
