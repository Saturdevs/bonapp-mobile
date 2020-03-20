import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyMenuListPage } from './daily-menu-list.page';

describe('DailyMenuListPage', () => {
  let component: DailyMenuListPage;
  let fixture: ComponentFixture<DailyMenuListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyMenuListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyMenuListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
