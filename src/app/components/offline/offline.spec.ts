import { TestBed } from '@angular/core/testing';
import { OfflineComponent } from './offline';

describe('OfflineComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfflineComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(OfflineComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
