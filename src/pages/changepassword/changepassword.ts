import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {CatagoryProvider} from "../../providers/catagory/catagory";
import {CatagoryPage} from "../catagory/catagory";
import {AppMinimize} from "@ionic-native/app-minimize";

/**
 * Generated class for the ChangepasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {
  data: any = {
      current_password: '',
      new_password: '',
      re_new_password: ''
    };
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public catgaroyProvider: CatagoryProvider,
              public platform: Platform,
              public appMinimize: AppMinimize) {
  }
    change(){
    if(this.data.new_password != this.data.re_new_password){
        this.presentToast('Passwords do not match!');
    }
    else if(this.data.new_password == '' || this.data.re_new_password == '' || this.data.current_password == '') {
        this.presentToast('Please enter password!');
    }
    else {
        this.catgaroyProvider.updatepassword(this.data)
            .subscribe(res=>{
                if(res.success)
                {
                    this.presentToast('Password updated successfully');
                    this.navCtrl.setRoot(CatagoryPage);
                }
                else {
                    this.presentToast(res.message);
                }
            });
    }
    }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangepasswordPage');
  }
    presentToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom',
            cssClass: "toastClass"
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }
    ionViewWillEnter() {
        console.log('Entered');
        this.navCtrl.swipeBackEnabled = false;
        this.platform.registerBackButtonAction(() => {
            if (this.navCtrl.canGoBack()) { // CHECK IF THE USER IS IN THE ROOT PAGE.
                this.navCtrl.pop(); // IF IT'S NOT THE ROOT, POP A PAGE.
            } else {
                // platform.exitApp(); // IF IT'S THE ROOT, EXIT THE APP.
                this.appMinimize.minimize();
            }
        });
    }

    ionViewWillLeave() {
        this.navCtrl.swipeBackEnabled = true;
    }
}
