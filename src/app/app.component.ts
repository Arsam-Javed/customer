import {Component, Inject, ViewChild} from '@angular/core';
import {AlertController, Nav, NavController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import {LoginmenuPage} from "../pages/loginmenu/loginmenu";
import {CatagoryPage} from "../pages/catagory/catagory";
import {FCM} from "@ionic-native/fcm";
import {CatagoryProvider} from "../providers/catagory/catagory";
import {NewsPage} from "../pages/news/news";
import {AccountsProvider} from "../providers/accounts/accounts";
import {TokenProvider} from "../providers/token/token";
import {Socket} from 'ng-socket-io';
import {Network} from "@ionic-native/network";
import { BackgroundMode } from '@ionic-native/background-mode';
import {AppMinimize} from "@ionic-native/app-minimize";
import {ScreenOrientation} from "@ionic-native/screen-orientation";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any;
  notificationCatched: boolean = false;
  constructor(public platform: Platform,
              public statusBar: StatusBar,
              splashScreen: SplashScreen,
              fcm: FCM,
              public tokenProvider: TokenProvider,
              public categoryService: CatagoryProvider,
              public accountService: AccountsProvider,
              public alertCtrl: AlertController,
              public network: Network,
              public appMinimize: AppMinimize,
              public screenOrientation: ScreenOrientation
  ) {
      platform.ready().then(() => {
          this.statusBar.backgroundColorByHexString('#37abe1');
          this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
          this.platform.registerBackButtonAction(() => {
              this.appMinimize.minimize();
          });
          try {
              fcm.onNotification().subscribe(data => {
                  if (data.wasTapped) {
                      if (data.type_of_notification == 'news') {
                          this.notificationCatched = true;
                          this.rootPage = NewsPage;
                      }
                  }
                  else {
                      if (data.type_of_notification == 'news') {
                          this.notificationCatched = true;
                          this.presentAlertNews(data.notification_title, data.notification_body);
                      }
                      else {
                          this.notificationCatched = true;
                          this.presentAlertNotNews(data.notification_title, data.notification_body);
                      }
                  }
              });
          }
          catch (err) {
              alert(err);
          }
          this.accountService.testInternet()
              .subscribe(res => {
                  if (res.success) {
                      if (localStorage.getItem('user_token') && localStorage.getItem('introShown') == 'yes' && !this.notificationCatched) {
                          this.accountService.getAllData()
                              .subscribe(res => {
                                  if (res.success) {
                                      localStorage.setItem('catandprod', JSON.stringify(res.data));
                                      this.rootPage = CatagoryPage;
                                      if (this.tokenProvider.role() != '_g') {
                                          try {
                                              fcm.getToken().then(token => {
                                                  if (this.isIOS()) {
                                                      let body = {
                                                          devicetype: 'ios',
                                                          token: token
                                                      };
                                                      this.categoryService.storeFCM(body)
                                                          .subscribe(res => {
                                                              console.log(res);
                                                          })
                                                  }
                                                  else if (this.isAndroid()) {
                                                      let body = {
                                                          devicetype: 'android',
                                                          token: token
                                                      };
                                                      this.categoryService.storeFCM(body)
                                                          .subscribe(res => {
                                                              console.log(res);
                                                          })
                                                  }
                                              });
                                          }
                                          catch (err) {
                                              alert(err);
                                          }
                                      }
                                  }
                              });
                      }
                      else if (localStorage.getItem('introShown') == 'yes') {
                          this.accountService.getAllData()
                              .subscribe(res => {
                                  if (res.success) {
                                      localStorage.removeItem('catandprod');
                                      localStorage.setItem('catandprod', JSON.stringify(res.data));
                                      this.rootPage = LoginmenuPage;
                                  }
                              });
                      }
                      else {
                          this.accountService.getAllData()
                              .subscribe(res => {
                                  console.log(res);
                                  if (res.success) {
                                      localStorage.removeItem('catandprod');
                                      localStorage.setItem('catandprod', JSON.stringify(res.data));
                                      this.rootPage = HomePage;
                                  }
                              });
                      }
                      splashScreen.hide();
                  }
                  else {
                      this.presentAlertNotNews('No Internet', 'Please connect to the internet to continue');
                      splashScreen.show();
                      let connect = this.network.onConnect().subscribe(() => {
                          if (localStorage.getItem('user_token') && localStorage.getItem('introShown') == 'yes' && !this.notificationCatched) {
                              this.rootPage = LoginmenuPage;
                          }
                      });
                  }
              });
      statusBar.styleDefault();
    });
  }
  isIOS(){
      if(this.platform.is('ios')) {
          return true;
      }
      else {
        return false;
      }
  }
    isAndroid(){
        if(this.platform.is('android')) {
            return true;
        }
        else {
            return false;
        }
    }
    presentAlertNews(title, message) {
        let alertToShow = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'View',
                    handler: data => {
                        this.nav.setRoot(NewsPage);
                    }
                },
                {
                    text: 'Cancel',
                    handler: data => {
                    }
                }
            ]
        });
        alertToShow.present();
    }
    presentAlertNotNews(title, message) {
        let alertToShow = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'ok',
                    handler: data => {
                    }
                }
            ]
        });
        alertToShow.present();
    }
}

