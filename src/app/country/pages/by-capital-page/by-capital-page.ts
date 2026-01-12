import { Component, computed, inject, linkedSignal, resource, signal } from '@angular/core';
import { SearchInput } from '../../components/search-input/search-input';
import { CountryList } from '../../components/country-list/country-list';
import { CountryService } from '../../services/country';
import { firstValueFrom, of, tap, catchError, throwError } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'by-capital-page',
  imports: [SearchInput, CountryList],
  templateUrl: './by-capital-page.html',
})
export class ByCapitalPage {
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

      this.isLoading.set(true);
      this.router.navigate(['country/by-capital'], {
        queryParams: { query: params.query },
      });

      return this.countryService.searchByCapital(params.query).pipe(
        tap(() => this.isLoading.set(false)),
        catchError((error) => {
          this.isLoading.set(false);
          return throwError(() => error);
        })
      );
    },
  });

  // Computed signals para manejar el estado de manera segura
  countries = computed(() => {
    return this.countryResource.error() ? [] : this.countryResource.value() ?? [];
  });

  errorMessage = computed(() => {
    const error = this.countryResource.error();
    if (error) return (error as any).cause?.message || error.message || 'Error desconocido';
  });

  isEmpty = computed(() => {
    return !this.countryResource.error() && this.countries().length === 0;
  });

  // Usando promesas de RxJs
  // countryResourse = resource({
  //   params: ()=>({ query: this.query() }),
  //   loader: async({ params })=>{
  //     if(!params.query) return []

  //     return await firstValueFrom(
  //       this.countryService.searchByCapital(params.query)
  //     )
  //   }
  // })

  // De manera tradicional
  // isLoading = signal(false);
  // isError = signal<string|null>(null);
  // countries = signal<Country[]>([]);

  // onSearch(query: string) {
  //   if( this.isLoading()) return;

  //   this.isLoading.set(true);
  //   this.isError.set(null);

  //   this.countryService.searchByCapital(query)
  //   .subscribe({
  //     next: (countries) => {
  //       this.isLoading.set(false);
  //       this.countries.set(countries);
  //     },
  //     error: (err) => {
  //       this.isLoading.set(false),
  //       this.countries.set([]),
  //       this.isError.set(err)
  //     },
  //   });
  // }
}
