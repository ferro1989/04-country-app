import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CountryService } from '../../services/country';
import { NotFound } from '../../../shared/components/footer/not-found/not-found';
import { CountryInformation } from "./country-information/country-information";

@Component({
  selector: 'country-page',
  imports: [NotFound, CountryInformation],
  templateUrl: './country-page.html',
})
export class CountryPage {
  countryCode = inject(ActivatedRoute).snapshot.params['code'];
  countryService = inject(CountryService);

  countryResource = rxResource({
    params: () => ({ code: this.countryCode }),
    stream: ({ params }) => {
      return this.countryService.searchCountryByAlphaCode(params.code);
    },
  });
}
