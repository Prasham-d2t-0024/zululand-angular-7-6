import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeItemAnalyticsComponent } from './home-item-analytics.component';

describe('HomeItemAnalyticsComponent', () => {
  let component: HomeItemAnalyticsComponent;
  let fixture: ComponentFixture<HomeItemAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeItemAnalyticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeItemAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
