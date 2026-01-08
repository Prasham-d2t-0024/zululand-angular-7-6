import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateFilesComponent } from './duplicate-files.component';

describe('DuplicateFilesComponent', () => {
  let component: DuplicateFilesComponent;
  let fixture: ComponentFixture<DuplicateFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuplicateFilesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuplicateFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
