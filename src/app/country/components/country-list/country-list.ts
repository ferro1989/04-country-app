import { Component, input, signal } from '@angular/core';
import { Country } from '../../interfaces/country.inteface';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { single } from 'rxjs';

@Component({
  selector: 'country-list',
  imports: [DecimalPipe,RouterLink],
  templateUrl: './country-list.html',
})
export class CountryList {

  countries= input.required<Country[]>();

  errorMessage= input<string|unknown|null>();
  isLoading = input<boolean>(false);
  isEmpty = input<boolean>(false);

}
