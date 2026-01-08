import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTrendingCollecctionComponent } from './home-trending-collecction.component';

describe('HomeTrendingCollecctionComponent', () => {
  let component: HomeTrendingCollecctionComponent;
  let fixture: ComponentFixture<HomeTrendingCollecctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeTrendingCollecctionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeTrendingCollecctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
