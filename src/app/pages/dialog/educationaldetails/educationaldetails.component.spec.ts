import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationaldetailsComponent } from './educationaldetails.component';

describe('EducationaldetailsComponent', () => {
  let component: EducationaldetailsComponent;
  let fixture: ComponentFixture<EducationaldetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EducationaldetailsComponent]
    });
    fixture = TestBed.createComponent(EducationaldetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
