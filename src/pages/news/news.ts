import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {AppMinimize} from "@ionic-native/app-minimize";
import {CatagoryPage} from "../catagory/catagory";
import {CatagoryProvider} from "../../providers/catagory/catagory";

/**
 * Generated class for the NewsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-news',
  templateUrl: 'news.html',
})
export class NewsPage {
    loaded: boolean = false;
    news: Array<any> = [];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public appMinimize: AppMinimize,
              public categoryService: CatagoryProvider) {
      this.categoryService.getNews()
          .subscribe(res=>{
              if(res.success)
              {
                  this.news = res.news;
                  this.loaded = true;
              }
          })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsPage');
      this.categoryService.getNews()
          .subscribe(res=>{
              if(res.success)
              {
                  this.news = res.news;
                  this.loaded = true;
              }
          })
  }
    ionViewWillEnter() {
        console.log('Entered');
        this.navCtrl.swipeBackEnabled = false;
        this.platform.registerBackButtonAction(() => {
            if (this.navCtrl.canGoBack()) { // CHECK IF THE USER IS IN THE ROOT PAGE.
                this.navCtrl.pop(); // IF IT'S NOT THE ROOT, POP A PAGE.
            } else {
                this.navCtrl.setRoot(CatagoryPage);
            }
        });
    }

    ionViewWillLeave() {
        this.navCtrl.swipeBackEnabled = true;
    }
}
