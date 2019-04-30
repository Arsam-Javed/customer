import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";

@Injectable()
export class CatagoryProvider {
    baseurl :string = "";


    constructor(public http: HttpClient) {
  }
    deductMoneythroughEasyPay(body: any):Observable<any>{
        return this.http.post(this.baseurl+'easypaypayment/', JSON.stringify(body),{
            headers: new HttpHeaders().set('token', localStorage.getItem('user_token')).set('Content-Type', 'application/json')})

    }
    getSpecialPickupPercentage():Observable<any>{
        return this.http.get(this.baseurl+'getspecialpickuppercentage/',{
            headers: new HttpHeaders().set('token', localStorage.getItem('user_token'))})
    }
    logout():Observable<any>{
        return this.http.get(this.baseurl+'logout/',{
            headers: new HttpHeaders().set('token', localStorage.getItem('user_token'))})

    }
}
