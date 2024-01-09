import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessDirComponent } from './business-dir.component';

describe('BusinessDirComponent', () => {
  let component: BusinessDirComponent;
  let fixture: ComponentFixture<BusinessDirComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessDirComponent]
    });
    fixture = TestBed.createComponent(BusinessDirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
