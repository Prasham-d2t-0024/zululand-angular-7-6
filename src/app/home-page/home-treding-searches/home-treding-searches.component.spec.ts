import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTredingSearchesComponent } from './home-treding-searches.component';

describe('HomeTredingSearchesComponent', () => {
  let component: HomeTredingSearchesComponent;
  let fixture: ComponentFixture<HomeTredingSearchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeTredingSearchesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeTredingSearchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
