import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubAdminComponent } from './sub-admin.component';

describe('SubAdminComponent', () => {
  let component: SubAdminComponent;
  let fixture: ComponentFixture<SubAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SubAdminComponent]
    });
    fixture = TestBed.createComponent(SubAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
