import { Routes } from '@angular/router';
import { CountryLayout } from './layouts/CountryLayout/CountryLayout';
import { ByCapitalPage } from './pages/by-capital-page/by-capital-page';
import { ByCountryPage } from './pages/by-country-page/by-country';
import { ByRegionPage } from './pages/by-region-page/by-region';
import { CountryPage } from './pages/country-page/country-page';

export const countryRoutes: Routes = [
  {
    path: '',
    component: CountryLayout,
    children: [
      //ByCapitalPage
      {
        path: 'by-capital',
        component: ByCapitalPage,
      },
      //ByCountryPage
      {
        path: 'by-country',
        component: ByCountryPage,
      },
      //ByRegionPage
      {
        path: 'by-region',
        component: ByRegionPage,
      },
      //Ruta dinamica
      {
        path: 'by/:code',
        component: CountryPage
      },
      {
        path: '**',
        redirectTo: 'by-capital',
      },
    ],
  },
];

export default countryRoutes;
