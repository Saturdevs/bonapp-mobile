import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLoginPage } from './app-login.page';

describe('AppLoginPage', () => {
  let component: AppLoginPage;
  let fixture: ComponentFixture<AppLoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppLoginPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
