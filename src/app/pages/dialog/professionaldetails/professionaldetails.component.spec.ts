import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionaldetailsComponent } from './professionaldetails.component';

describe('ProfessionaldetailsComponent', () => {
  let component: ProfessionaldetailsComponent;
  let fixture: ComponentFixture<ProfessionaldetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfessionaldetailsComponent]
    });
    fixture = TestBed.createComponent(ProfessionaldetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
