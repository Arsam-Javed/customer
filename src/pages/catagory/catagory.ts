import {
    AlertController, IonicPage, MenuController, NavController, NavParams, Platform,
    ToastController
} from 'ionic-angular';
import {Component, ElementRef, ViewChild} from '@angular/core';
import { Slides } from 'ionic-angular';
import {CatagoryProvider} from "../../providers/catagory/catagory";
import {DomSanitizer} from "@angular/platform-browser";
import {LoginmenuPage} from "../loginmenu/loginmenu";
import {AppMinimize} from "@ionic-native/app-minimize";
import {TokenProvider} from "../../providers/token/token";
import {NewsPage} from "../news/news";
import { Socket } from 'ng-socket-io';
/**
 * Generated class for the CatagoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
    selector: 'page-catagory',
    templateUrl: 'catagory.html',
})
export class CatagoryPage {
    @ViewChild('categoriesdiv') public categoriesdiv ;
    public total: number = 0.0;
    public settingOpened: boolean = false;
    public selectingProduct:boolean = false;
    public selectedProduct:any = {};
    loading: boolean = true;
    products:Array<Object>=[];
    activeCategoryObject:any={};
    activeCategory:string="";
    activeCategoryIndex:number=0;
    innerWidth:string="";
    username: string = 'Username';
    menuOpened: boolean = false;
    slider: Array<any> = [];
    addition: number = 0;
    promoApplied: boolean = false;
    discount: number = 0;
    screenwidth: number = 0;
    role: string = "";
    constructor(private sanitization:DomSanitizer,
                public navCtrl: NavController,
                public navParams: NavParams,
                public categoryProvide: CatagoryProvider,
                private toastCtrl: ToastController,
                public  platform: Platform,
                public appMinimize: AppMinimize,
                public tokenProvider: TokenProvider,
                public menuCtrl: MenuController,
                public alertCtrl: AlertController,
                public socket: Socket){
        if(localStorage.getItem("showwelcome") == "showwelcome")
        {
            localStorage.removeItem('showwelcome');
            this.welcomeAlert("Welcome to Laundream!", "You're just a few steps away from placing an order with us. Select a product and checkout, it's that simple!")
        }

        this.screenwidth = screen.width;
        this.role = this.tokenProvider.role();
        this.username = this.tokenProvider.username();
        try {
            this.slider = JSON.parse(localStorage.getItem('catandprod'));
        }
        catch (err){
            alert('err');
        }
        this.activeCategory=this.slider[0].category['_id'];
        this.activeCategoryObject = this.slider[0].category;
        this.innerWidth=(this.slider.length*80)+'px';
        let cart_items = localStorage.getItem('cart_items');
        if(cart_items){
            let cart_items_json = JSON.parse(cart_items);
            for(let cartItemIndex=0; cart_items_json[cartItemIndex];cartItemIndex++)
            {
                this.total += cart_items_json[cartItemIndex].subtotal;
                for(let productsIndex = 0; this.slider[0].products[productsIndex]; productsIndex++)
                {
                    console.log(cart_items_json[cartItemIndex]['itemid'] == this.slider[0].products[productsIndex]['_id']);
                    if(cart_items_json[cartItemIndex]['itemid'] == this.slider[0].products[productsIndex]['_id'])
                    {
                        this.slider[0].products[productsIndex]['quantity'] = cart_items_json[cartItemIndex]['quantity'];
                    }
                }
            }
        }
        else {
            let cart_items_json = [];
            localStorage.setItem('cart_items', JSON.stringify(cart_items_json));
        }
        let promo_code = localStorage.getItem('promoCode');
        if(promo_code) {
            this.promoApplied = true;
            let dis = parseInt(localStorage.getItem('promoDis'));
            this.discount = this.total * (dis / 100);
        }
    }
    @ViewChild(Slides) slides: Slides;
    slideChanged() {
        let currentIndex = this.slides.getActiveIndex();
        if(currentIndex>=0 && currentIndex<this.slider.length) {
            if(currentIndex<=2)
            {
                this.categoriesdiv.nativeElement.scrollLeft = 0;
            }
            console.log(this.categoriesdiv);
            if (currentIndex > 2) {
                this.categoriesdiv.nativeElement.scrollLeft = 80 * (currentIndex - 2);
            }
            this.activeCategory = this.slider[currentIndex].category['_id'];
            this.activeCategoryObject = this.slider[currentIndex].category;
            this.activeCategoryIndex = currentIndex;
        }
    }
    welcomeAlert(title, message) {
        let alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'Ok',
                    handler: data => {
                    }
                }
            ]
        });
        alert.present();
    }
    myNews(){
        this.navCtrl.push(NewsPage);
    }
    myOrders(){
        this.navCtrl.push('CurrentorderPage');
    }
    changePassword(){
        this.navCtrl.push('ChangepasswordPage');
    }
    menuClosed(){
        this.settingOpened = false;
        this.menuOpened = false;
    }
    menuOpen(){
        this.menuOpened = true;
    }
    logout(){
        this.categoryProvide.logout()
            .subscribe(res => {
            });
        this.socket.removeAllListeners();
        this.socket.disconnect();
        this.navCtrl.setRoot(LoginmenuPage);
    }
    openSetting(){
        this.settingOpened = true;
    }
    swipeLeftCategory(event: Event){
        event.stopPropagation();
    }
    changeCatagory(cata:any):any {
        this.addition = 0;
        this.activeCategoryObject = cata.category;
        this.loading = true;
        this.selectingProduct=false;
        this.selectedProduct = {};
        this.activeCategory=cata.category._id;
                let cart_items = localStorage.getItem('cart_items');
                let cart_items_json = JSON.parse(cart_items);
                if(cart_items_json.length) {
                    for(let cartItemIndex=0; cart_items_json[cartItemIndex]; cartItemIndex++)
                    {
                        for(let productsIndex = 0; this.slider[cata.index].products[productsIndex]; productsIndex++)
                        {
                            if(cart_items_json[cartItemIndex]['itemid'] == this.slider[cata.index].products[productsIndex]['_id'])
                            {
                                this.slider[cata.index].products[productsIndex]['quantity'] = cart_items_json[cartItemIndex]['quantity'];
                            }
                        }
                    }
                }
        this.slides.slideTo(cata.index, 500);
    }
    addToCart(product: any, slide: any){
        this.addition = 20;
        let productIndex = this.slider[slide.index].products.indexOf(product);
        if(!this.slider[slide.index].products[productIndex]['quantity'] || this.slider[slide.index].products[productIndex]['quantity'] == 0)
        {
          this.slider[slide.index].products[productIndex]['quantity'] = 0;
            this.selectingProduct=true;
            this.selectedProduct = product;
        }
        else {
            this.selectingProduct = true;
            this.selectedProduct = product;
            this.updateCart(this.selectedProduct);
        }
    }
    decreaseQuantity(event: Event){
        event.stopPropagation();
        if(this.selectedProduct['quantity'] == 0)
        {
            this.addition = 0;
            this.selectedProduct = {};
            this.selectingProduct=false;
        }
        if(this.selectedProduct['quantity'] > 0) {
            this.selectedProduct['quantity'] = this.selectedProduct['quantity'] - 1;
            this.updateCart(this.selectedProduct);
        }
    }
    increaseQuantity(){
        this.selectedProduct['quantity'] = this.selectedProduct['quantity'] +1;
        this.updateCart(this.selectedProduct);
    }
    updateCart(product: any){
        let cart_items = localStorage.getItem('cart_items');
        if(cart_items) {
            let cart_items_json = JSON.parse(cart_items);
            let toremove = {};
            this.total = 0;
            let found = false;
            let remove = false;
            for (let i = 0; cart_items_json[i]; i++) {
                if (cart_items_json[i]['itemid'] == product['_id']) {
                    found = true;
                    if (product['quantity'] == 0) {
                        remove = true;
                        cart_items_json[i]['quantity'] = product['quantity'];
                        cart_items_json[i]['subtotal'] = parseFloat(product['price']) * product['quantity'];
                        toremove = cart_items_json[i];
                    }
                    else {
                        cart_items_json[i]['quantity'] = product['quantity'];
                        cart_items_json[i]['subtotal'] = parseFloat(product['price']) * product['quantity'];
                    }
                }
                this.total += cart_items_json[i]['subtotal'];
            }
            if (!found) {
                let newItem = {
                    itemid: product['_id'],
                    title: product['title'],
                    dry: product['dry'],
                    quantity: product['quantity'],
                    price: product['price'],
                    subtotal: (parseFloat(product['price']) * product['quantity'])
                };
                cart_items_json.push(newItem);
                this.total += parseFloat(product['price']) * product['quantity'];
            }
            if (remove) {
                let remIndex = cart_items_json.indexOf(toremove);
                if (remIndex > -1) {
                    cart_items_json.splice(remIndex, 1);
                }
            }
            if(this.promoApplied)
            {
                let dis = parseInt(localStorage.getItem('promoDis'));
                this.discount = this.total * (dis / 100);
            }
            localStorage.setItem('cart_items', JSON.stringify(cart_items_json));
        }
        else {
            let cart_items_json = [];
            let newItem = {
                itemid: product['_id'],
                title: product['title'],
                dry: product['dry'],
                quantity: product['quantity'],
                price: product['price'],
                subtotal: (+product['price'] * product['quantity'])
            };
            cart_items_json.push(newItem);
            localStorage.setItem('cart_items', JSON.stringify(cart_items_json));
        }
    }
    safeStyleTry(img:string):any{
        return this.sanitization.bypassSecurityTrustStyle(`url(${img})`);
    }

    //only shades
    safeStyle(i: number):any{
        let whichnumber = i%4;
        let shade1 = 'assets/shades/shade1.png';
        let shade2 = 'assets/shades/shade2.png';
        let shade3 = 'assets/shades/shade3.png';
        let shade4 = 'assets/shades/shade4.png';
        if(whichnumber == 0) {
            return this.sanitization.bypassSecurityTrustStyle(`url(${shade1})`);
        }
        if(whichnumber == 1) {
            return this.sanitization.bypassSecurityTrustStyle(`url(${shade2})`);
        }
        if(whichnumber == 2) {
            return this.sanitization.bypassSecurityTrustStyle(`url(${shade3})`);
        }
        if(whichnumber == 3) {
            return this.sanitization.bypassSecurityTrustStyle(`url(${shade4})`);
        }
    }
    check() {
        if(this.total < 100){
            this.presentToast('Cannot proceed with less than Rs. 100 order!');
        }
        else {
            this.navCtrl.push('CheckoutPage');
        }
    }
    movetobasket(){
        this.navCtrl.push('MybasketPage');
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
    ionViewDidLoad() {
        console.log('ionViewDidLoad CatagoryPage');
    }
    ionViewWillEnter() {
        let promo_code = localStorage.getItem('promoCode');
        if(promo_code) {
            this.promoApplied = true;
            let dis = parseInt(localStorage.getItem('promoDis'));
            this.discount = this.total * (dis / 100);
        }
        this.navCtrl.swipeBackEnabled = false;
        this.platform.registerBackButtonAction(() => {
            if(this.settingOpened)
            {
                this.settingOpened = false;
            }
            else if(this.menuOpened)
            {
                this.menuOpened =false;
                this.menuCtrl.close();
            }
            else if (this.navCtrl.canGoBack()) { // CHECK IF THE USER IS IN THE ROOT PAGE.
                this.navCtrl.pop(); // IF IT'S NOT THE ROOT, POP A PAGE.
            } else {
                this.appMinimize.minimize();
            }
        });
    }

    ionViewWillLeave() {
        this.navCtrl.swipeBackEnabled = true;
    }

}

