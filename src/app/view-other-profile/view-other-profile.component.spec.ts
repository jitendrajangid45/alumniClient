import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOtherProfileComponent } from './view-other-profile.component';

describe('ViewOtherProfileComponent', () => {
  let component: ViewOtherProfileComponent;
  let fixture: ComponentFixture<ViewOtherProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewOtherProfileComponent]
    });
    fixture = TestBed.createComponent(ViewOtherProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
