import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTredingCommunitiesComponent } from './home-treding-communities.component';

describe('HomeTredingCommunitiesComponent', () => {
  let component: HomeTredingCommunitiesComponent;
  let fixture: ComponentFixture<HomeTredingCommunitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeTredingCommunitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeTredingCommunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
