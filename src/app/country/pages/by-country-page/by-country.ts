import { Component, inject, linkedSignal, resource, signal } from '@angular/core';
import { SearchInput } from '../../components/search-input/search-input';
import { CountryList } from '../../components/country-list/country-list';
import { catchError, firstValueFrom, of, tap, throwError } from 'rxjs';
import { CountryService } from '../../services/country';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'by-country-page',
  imports: [SearchInput, CountryList],
  templateUrl: './by-country.html',
})
export class ByCountryPage {
  countryService = inject(CountryService);
  isLoading = signal(false);

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  queryParam = inject(ActivatedRoute).snapshot.queryParamMap.get('query') ?? '';

  query = linkedSignal(() => this.queryParam);

  //Usando Observables de RxJs
  countryResource = rxResource({
    params: () => ({ query: this.query() }),
    stream: ({ params }) => {
      if (!params.query) return of([]);

      // Actualizar la URL con el query param 'query'
      this.isLoading.set(true);
      this.router.navigate(['country/by-country'], {
        queryParams: { query: params.query },
      });

      return this.countryService.searchByCountry(params.query).pipe(
        tap(() => this.isLoading.set(false)),
        catchError((error) => {
          this.isLoading.set(false);
          return throwError(() => error);
        })
      );
    },
  });

  //Usando Promesas de RxJs
  // countryResourse = resource({
  //   params: ()=>({ query: this.query() }),
  //   loader: async({ params })=>{
  //     if(!params.query) return []

  //     return await firstValueFrom(
  //       this.countryService.searchByCountry(params.query)
  //     )
  //   }
  // })
}
