import { TestBed } from '@angular/core/testing';
import { FavoritesComponent } from './favorites';

describe('FavoritesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritesComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FavoritesComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
