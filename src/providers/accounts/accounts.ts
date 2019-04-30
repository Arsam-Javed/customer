import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
/*
  Generated class for the AccountsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AccountsProvider {
    baseurl :string = "";
  constructor(public http: HttpClient) {
  }
    forgetpassword(body: any):Observable<any>{
          return this.http.post(this.baseurl+'forgetpassword/', JSON.stringify(body),{
            headers: new HttpHeaders().set('Content-Type', 'application/json')})
    }
    getAllData():Observable<any>{
          return this.http.get(this.baseurl+'getalldata/',{})
    }
    signup(json):Observable<any>{
          return this.http.post(this.baseurl+ 'signup/',JSON.stringify(json),{
              headers: new HttpHeaders().set('Content-Type', 'application/json')
          })
    }
    login(json):Observable<any>{
         return this.http.post(this.baseurl+'login/',JSON.stringify(json),{
            headers: new HttpHeaders().set('Content-Type', 'application/json')
         })
    }
}
