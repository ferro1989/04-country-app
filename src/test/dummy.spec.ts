import { CountryList } from '../app/country/components/country-list/country-list';
import { TestBed } from '@angular/core/testing';



describe('CountryList (dummy test)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryList],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(CountryList);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });

  it('should always pass (dummy assertion)', () => {
    expect(true).toBe(true);
  });
});
