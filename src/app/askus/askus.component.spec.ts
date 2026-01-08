import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskusComponent } from './askus.component';

describe('AskusComponent', () => {
  let component: AskusComponent;
  let fixture: ComponentFixture<AskusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
