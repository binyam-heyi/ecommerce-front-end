import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';
import { GetResponseCountries } from '../interfaces/get-response-countries';
import { GetResponseStates } from '../interfaces/get-response-states';


@Injectable({
  providedIn: 'root'
})
export class CheckoutfromService {
  private cuntriesUrl= 'http://localhost:8080/api/countries'
  private statesUrl='http://localhost:8080/api/states'

  constructor(private httpClient: HttpClient) { }
  getCreditCardMonth(startMonth: number): Observable<number[]>{
    let months:number[]=[];
    for(let month=startMonth; month<=12; month++){
       months.push(month); 
    }
    return of(months);
    
  }
  getCreditCardYear(): Observable<number[]>{
    let years:number[]=[];
   const startYear: number= new Date().getFullYear();
   const endYear: number= startYear+10;
    for(let year=startYear; year<endYear; year++){
       years.push(year); 
    }
    return of(years);
    
  }
  getCountries(): Observable<Country[]> {

    return this.httpClient.get<GetResponseCountries>(this.cuntriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }
  getStates(theCountryCode: string): Observable<State[]> {

    // search url
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }
   
  

}
