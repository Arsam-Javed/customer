import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {JwtHelper} from "angular2-jwt";

/*
  Generated class for the TokenProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TokenProvider {
    jwtHelper: JwtHelper = new JwtHelper();
  constructor(public http: HttpClient) {
  }


    username() {
      console.log(this.jwtHelper.decodeToken(localStorage.getItem('user_token')).u);
        return this.jwtHelper.decodeToken(localStorage.getItem('user_token')).u;
    }
    role() {
      console.log(this.jwtHelper.decodeToken(localStorage.getItem('user_token')).r);
        return this.jwtHelper.decodeToken(localStorage.getItem('user_token')).r;
    }
    phonenumber() {
        console.log(this.jwtHelper.decodeToken(localStorage.getItem('user_token')).ph);
        return this.jwtHelper.decodeToken(localStorage.getItem('user_token')).ph;
    }
    id() {
        console.log(this.jwtHelper.decodeToken(localStorage.getItem('user_token')).d);
        return this.jwtHelper.decodeToken(localStorage.getItem('user_token')).d;
    }
}
