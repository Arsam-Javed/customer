import {Component, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import {CatagoryProvider} from "../../providers/catagory/catagory";
import { Socket } from 'ng-socket-io';
import {TokenProvider} from "../../providers/token/token";
import {Observable} from "rxjs/Observable";
import { Content } from 'ionic-angular';
/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild(Content) content: Content;
  everchatted = false;
  conversation: any={};
  messages : Array<any> = [];
  myid:string = '';
  message: string = "";
  width: string = '';
  height: string = '';
    preventBlur: boolean = false;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public categoryService: CatagoryProvider,
              public socket: Socket,
              public tokenProvider: TokenProvider,
              private keyboard: Keyboard,
              public renderer: Renderer2) {
        this.myid = this.tokenProvider.id();
        this.width = platform.width() - 16 + 'px';
      this.socket.disconnect();
      this.socket.removeAllListeners();
      this.socket.connect();
      // this.socket.removeAllListeners();
      this.socket.on('connect', () => {
          console.log('connected');
          this.socket.emit('authenticate', {token: localStorage.getItem('user_token')}); //send the jwt
      });
      // this.socket.disconnect();
      // this.socket.removeAllListeners();
      // this.socket.connect();
      // this.socket.on('connect', () => {
      //     console.log('connected');
      //     this.socket.emit('authenticated', {token: localStorage.getItem('token')}); //send the jwt
      // });
        // this.height = this.platform.height() -120 + 'px';
      // this.socket.connect();
      // this.socket.removeAllListeners();
      // this.socket.on('connect', () => {
      //     console.log('connected');
      //     this.socket.emit('authenticate', {token: localStorage.getItem('user_token')}); //send the jwt
      // });
      this.height = '900px';
        console.log(this.myid);
        this.categoryService.getMessages()
            .subscribe(res=>{
                console.log(res);
              if(res.success)
              {
                if(res.messages && res.messages.length)
                {
                  this.everchatted = true;
                  this.conversation = res.conversation;
                  this.messages = res.messages;
                    // let scrollto = document.getElementById('scroller');
                    // console.log(scrollto);
                    // scrollto.scrollIntoView();
                    setTimeout(()=>{    //<<<---    using ()=> syntax
                        // let scrollto = document.getElementById('scroller');
                        // scrollto.scrollIntoView();
                    },500);
                    setTimeout(()=>{
                        this.scrollPage();
                    },200);
                }
                else {
                    this.conversation = res.conversation;
                }
              }
            });
      this.updatechat().subscribe(message => {
          this.everchatted = true;
          if(message['conversationID'] == this.conversation['_id'])
          {
              this.messages.push(message);
              // let scrollto = document.getElementById('scroller');
              // scrollto.scrollIntoView();
              setTimeout(()=>{    //<<<---    using ()=> syntax
                  // this.scrolltobottom();
              },500);
              setTimeout(()=>{
                  this.scrollPage();
              },1000);
          }

          // console.log(this.content.contentHeight);
          // this.content.scrollTo(0, this.content.scrollHeight, 200);
      });
  }
    shouldBlur(event) {
        if (this.preventBlur) {
            event.target.focus();

            // Reset so other elements will blur the keyboard
            this.preventBlur = false;
        }
    }

    resetBlur() {
        this.preventBlur = false;
    }

    flipBlur() {
        this.preventBlur = true;
    }
  sendMessage(){

      // let input: HTMLInputElement = <HTMLInputElement> document.getElementById('sendmessageinput');
      // console.log(input);
      // input.focus();
      // console.log(this.renderer.selectRootElement('#sendmessageinput'));

      // this.keyboard.onKeyboardHide()
      //     .subscribe(res=>{
      //         this.keyboard.show();
      //     });
        // event.preventDefault();
        this.everchatted = true;
        console.log('sending message');
        let to = '';
        if(this.conversation['to'] == this.myid)
        {
            to = this.conversation['from'];
        }
        else if(this.conversation['from'] == this.myid)
        {
            to = this.conversation['to'];
        }
        this.socket.emit('sendmessagetoadmin', { message: this.message, to: to});
        console.log('after emitiing');
        this.message = "";

      // this.renderer.selectRootElement('#sendmessageinput').focus();
    }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
      // this.socket.removeAllListeners();

  }
    // ionViewWillLeave() {
    //     this.socket.disconnect();
    // }
    scrollhojayar(){
      // console.log('hereeeeeeeeeeeeeee');
      // let scrollto: HTMLDivElement = <HTMLDivElement> document.getElementById('tuhi');
      //   scrollto.style.bottom = 'auto';
      //   this.scrollPage();

    }
    updatechat() {
        let observable = new Observable(observer => {
            this.socket.on('updatechat', (data) => {
                // console.log(data);
                //this.socket.emit('messageseen', { conversation: this.conversation});
                data = JSON.parse(data);
                observer.next(data);
            });
        });
        return observable;
    }
    scrollPage(){
        this.content.scrollToBottom(300);
    }
}
