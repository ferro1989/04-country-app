import type { RESTCountry } from '../interfaces/rest-countries.interfaces';
import type { Country } from '../interfaces/country.inteface';
import { map } from 'rxjs';
import { Maps } from '../interfaces/rest-countries.interfaces';

export class CountryMapper {
  //static RestCountry => Country
  static mapRestCountryToCountry(restCountry: RESTCountry): Country {
    return {
      capital: restCountry.capital?.join(','),
      cca2: restCountry.cca2,
      flag: restCountry.flag,
      flagSvg: restCountry.flags.svg,
      name: restCountry.translations['spa']?.common || restCountry.name.common,
      population: restCountry.population,

      map: restCountry.maps.googleMaps,
      escudo: restCountry.coatOfArms.svg,
      region: restCountry.region,
      subRegion: restCountry.subregion,
      latlng: restCountry.latlng,
      borders: restCountry.borders,
    };
  }

  //static RestCountry[] => Country[]
  static mapRestCountriesArrayToCountriesArray(restCountries: RESTCountry[]): Country[] {
    return restCountries.map(this.mapRestCountryToCountry);
  }
}
