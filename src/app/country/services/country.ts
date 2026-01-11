import { Region } from './../interfaces/country.inteface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RESTCountry } from '../interfaces/rest-countries.interfaces';
import { map, Observable, catchError, throwError, delay, of, tap } from 'rxjs';
import { Country } from '../interfaces/country.inteface';
import { CountryMapper } from '../mappers/country.mapper';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient); //inyección del servicio HttpClient
  private queryCacheCapital = new Map<string, Country[]>(); // Cache para las consultas por capital
  private queryCacheCountry = new Map<string, Country[]>(); // Cache para las consultas por país
  private queryCacheRegion = new Map<Region, Country[]>(); // Cache para las consultas por región

  //Metodo para buscar países por capital
  searchByCapital(query: string): Observable<Country[]> {
    query = query.toLocaleLowerCase();

    //verificar si la consulta ya está en la caché
    if (this.queryCacheCapital.has(query)) {
      return of(this.queryCacheCapital.get(query) ?? []); //si esta en la cache, devolver el resultado almacenado
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`).pipe(
      map((resp) => CountryMapper.mapRestCountriesArrayToCountriesArray(resp)),
      tap((countries) => this.queryCacheCapital.set(query, countries)), //almacenar el resultado en la caché
      delay(1000), // un delay para simular tiempo de respuesta
      catchError((error) => {
        return throwError(() => new Error(`No se pudo obtener pais con la capital ${query}`));
      })
    );
  }

  //Metodo para buscar países por país
  searchByCountry(query: string): Observable<Country[]> {
    query = query.toLocaleLowerCase();

    //verificar si la consulta ya está en la caché
    if (this.queryCacheCountry.has(query)) {
      return of(this.queryCacheCountry.get(query) ?? []); //si esta en la cache, devolver el resultado almacenado
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`).pipe(
      map((resp) => CountryMapper.mapRestCountriesArrayToCountriesArray(resp)),
      tap((countries) => this.queryCacheCountry.set(query, countries)), //almacenar el resultado en la caché
      delay(1000),
      catchError((error) => {
        return throwError(() => new Error(`No se pudo obtener pais con ese nombre ${query}`));
      })
    );
  }

  //Metodo para buscar países por codigo de pais
  searchCountryByAlphaCode(code: string): Observable<Country[]> {
    return this.http.get<RESTCountry[]>(`${API_URL}/alpha/${code}`).pipe(
      map((resp) => CountryMapper.mapRestCountriesArrayToCountriesArray(resp)),
      map((countries) => (countries.at(0) ? [countries.at(0)!] : [])),
      delay(1000),
      catchError((error) => {
        return throwError(() => new Error(`No se pudo obtener pais con ese codigo ${code}`));
      })
    );
  }

  //Metodo para buscar países por región
  searchByRegion(region: Region): Observable<Country[]> {
    //verificar si la consulta ya está en la caché
    if (this.queryCacheRegion.has(region)) {
      return of(this.queryCacheRegion.get(region) ?? []); //si esta en la cache, devolver el resultado almacenado
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/region/${region}`).pipe(
      map((resp) => CountryMapper.mapRestCountriesArrayToCountriesArray(resp)),
      tap((countries) => this.queryCacheRegion.set(region, countries)), //almacenar el resultado en la caché
      delay(1000),
      catchError((error) => {
        return throwError(() => new Error(`No se pudo obtener paises de la region ${region}`));
      })
    );
  }
}
