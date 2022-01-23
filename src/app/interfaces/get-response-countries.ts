import { Country } from "../common/country";

export interface GetResponseCountries {
    _embedded: {
        countries: Country[];
      },
      
}