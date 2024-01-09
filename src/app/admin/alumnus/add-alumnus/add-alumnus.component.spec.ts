import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAlumnusComponent } from './add-alumnus.component';

describe('AddAlumnusComponent', () => {
  let component: AddAlumnusComponent;
  let fixture: ComponentFixture<AddAlumnusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddAlumnusComponent]
    });
    fixture = TestBed.createComponent(AddAlumnusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
