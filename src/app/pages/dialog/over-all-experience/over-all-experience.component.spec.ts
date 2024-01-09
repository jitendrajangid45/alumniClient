import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverAllExperienceComponent } from './over-all-experience.component';

describe('OverAllExperienceComponent', () => {
  let component: OverAllExperienceComponent;
  let fixture: ComponentFixture<OverAllExperienceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OverAllExperienceComponent]
    });
    fixture = TestBed.createComponent(OverAllExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
