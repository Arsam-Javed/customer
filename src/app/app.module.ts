import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule, NavController} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AccountsProvider } from '../providers/accounts/accounts';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { CatagoryProvider } from '../providers/catagory/catagory';
import {CalendarModule} from "ion2-calendar";
import { Geolocation } from '@ionic-native/geolocation';
import {NativeGeocoder} from "@ionic-native/native-geocoder";
import {LoginmenuPage} from "../pages/loginmenu/loginmenu";
import {CatagoryPage} from "../pages/catagory/catagory";
import { AppMinimize } from '@ionic-native/app-minimize';
import { TokenProvider } from '../providers/token/token';
import { FCM } from '@ionic-native/fcm';
import {NewsPage} from "../pages/news/news";
import { StatusBar } from '@ionic-native/status-bar';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import {Network} from "@ionic-native/network";
import { BackgroundMode } from '@ionic-native/background-mode';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
const config: SocketIoConfig = { url: '', options: {transports: ['websocket']} };
@NgModule({
  declarations: [
    MyApp,
    HomePage,
      LoginmenuPage,
      CatagoryPage,
      NewsPage
  ],
  imports: [
      CalendarModule,
      HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, {
        scrollPadding: false,
        scrollAssist: true,
        autoFocusAssist: false
    }),
      SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
      LoginmenuPage,
      CatagoryPage,
      NewsPage
  ],
  providers: [
      ScreenOrientation,
      BackgroundMode,
      Network,
      Keyboard,
      FCM,
      AppMinimize,
      Geolocation,
      NativeGeocoder,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AccountsProvider,
    AccountsProvider,
      HttpClient,
    CatagoryProvider,
    TokenProvider
  ]
})
export class AppModule {}
