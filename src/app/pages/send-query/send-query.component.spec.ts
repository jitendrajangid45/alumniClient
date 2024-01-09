import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendQueryComponent } from './send-query.component';

describe('SendQueryComponent', () => {
  let component: SendQueryComponent;
  let fixture: ComponentFixture<SendQueryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SendQueryComponent]
    });
    fixture = TestBed.createComponent(SendQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
