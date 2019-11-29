import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPerUserModalPage } from './payment-per-user-modal.page';

describe('PaymentPerUserModalPage', () => {
  let component: PaymentPerUserModalPage;
  let fixture: ComponentFixture<PaymentPerUserModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentPerUserModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPerUserModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
