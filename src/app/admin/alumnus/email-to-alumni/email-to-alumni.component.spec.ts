import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailToAlumniComponent } from './email-to-alumni.component';

describe('EmailToAlumniComponent', () => {
  let component: EmailToAlumniComponent;
  let fixture: ComponentFixture<EmailToAlumniComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmailToAlumniComponent]
    });
    fixture = TestBed.createComponent(EmailToAlumniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
