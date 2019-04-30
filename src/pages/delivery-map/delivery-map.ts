import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import {
    ActionSheetController, AlertController, App, IonicPage, LoadingController, NavController, Platform,
    ToastController
} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { Observable } from 'rxjs/Observable';
import {NativeGeocoder} from "@ionic-native/native-geocoder";
declare var google: any;

@IonicPage()
@Component({
  selector: 'page-delivery-map',
  templateUrl: 'delivery-map.html',
})
export class DeliveryMapPage {
    @ViewChild('map') mapElement: ElementRef;
    @ViewChild('searchbar', { read: ElementRef }) searchbar: ElementRef;
    addressElement: HTMLInputElement = null;
    searchdata: string = '';

    map: any;
    marker: Array<any> = [];
    loading: any;
    place: string='Your Location';
    selectedLocation: any = {};
    catIcon: Object = {
        url: 'assets/icon/location/location.png',
        size: new google.maps.Size(45, 65),
        scaledSize: new google.maps.Size(40, 60),
        origin: new google.maps.Point(0,0)
    };

    constructor(
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController,
        public app: App,
        public nav: NavController,
        public zone: NgZone,
        public platform: Platform,
        public alertCtrl: AlertController,
        public actionSheetCtrl: ActionSheetController,
        public geolocation: Geolocation,
        private nativeGeocoder: NativeGeocoder,
        public navCtrl: NavController
    ) {
        this.platform.ready().then(() =>
            this.loadMaps());
    }

    loadMaps() {
        if (!!google) {
            this.initializeMap();
            this.initAutocomplete();
        } else {
            this.errorAlert('Error', 'Something went wrong with the Internet Connection. Please check your Internet.')
        }
    }

    errorAlert(title, message) {
        let alert = this.alertCtrl.create({
            title: title,
            message: message,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        this.loadMaps();
                    }
                }
            ]
        });
        alert.present();
    }


    initAutocomplete(): void {
        this.addressElement = this.searchbar.nativeElement.querySelector('.searchbar-input');
        this.createAutocomplete(this.addressElement).subscribe((locationObj) => {
            console.log('Searchdata', locationObj);
            let options = {
                center: locationObj.geometry.location,
                zoom: 10
            };
            this.map.setOptions(options);
            this.addMarker(locationObj.geometry.location, locationObj.formatted_address);
        });
    }

    createAutocomplete(addressEl: HTMLInputElement): Observable<any> {
        const autocomplete = new google.maps.places.Autocomplete(addressEl);
        autocomplete.bindTo('bounds', this.map);
        return new Observable((sub: any) => {
            google.maps.event.addListener(autocomplete, 'place_changed', () => {
                const place = autocomplete.getPlace();
                if (!place.geometry) {
                    sub.error({
                        message: 'Autocomplete returned place with no geometry'
                    });
                } else {
                    sub.next(place);
                }
            });
        });
    }

    initializeMap() {
        this.zone.run(() => {
            var mapEle = this.mapElement.nativeElement;
            this.map = new google.maps.Map(mapEle, {
                zoom: 10,
                center: { lat: 33.6844, lng: 73.0479 },
                mapTypeId: google.maps.MapTypeId.TERRAIN,
                disableDoubleClickZoom: false,
                disableDefaultUI: true,
                zoomControl: true,
                scaleControl: true,
            });
            this.getCurrentPosition();
        });
        google.maps.event.addListener(this.map, "click", (e) => {
            let latlng = {lat: e.latLng.lat(), lng: e.latLng.lng()};
            let geocoder = new google.maps.Geocoder;
            geocoder.geocode({'location': latlng}, (results, status) => {
                if (status === 'OK') {
                    if (results[0]) {
                        this.addMarker(e.latLng, results[0].formatted_address);
                    } else {
                        this.addMarker(e.latLng, "Selected Location");
                    }
                } else {
                    this.addMarker(e.latLng, 'Selected Location');
                }
            });


        });
    }

    showToast(message) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            cssClass: "toastClass"
        });
        toast.present();
    }

    getCurrentPosition() {
        this.loading = this.loadingCtrl.create({
            content: 'Locating You...'
        });
        this.loading.present();

        let locationOptions = { timeout: 30000, enableHighAccuracy: true };

        this.geolocation.getCurrentPosition(locationOptions).then(
            (position) => {
                this.loading.dismiss().then(() => {
                    let myPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    let options = {
                        center: myPos,
                        zoom: 14
                    };
                    this.map.setOptions(options);
                    let latlng = {lat: position.coords.latitude, lng: position.coords.longitude};
                    let geocoder = new google.maps.Geocoder;
                    geocoder.geocode({'location': latlng}, (results, status) => {
                        if (status === 'OK') {
                            if (results[0]) {
                                this.addMarker(myPos, results[0].formatted_address);
                            } else {
                                this.addMarker(myPos, "Your Current Location");
                            }
                        } else {
                            this.addMarker(myPos, "Your Current Location");
                        }
                    });

                });
            },
            (error) => {
                this.loading.dismiss().then(() => {
                    this.place = "";
                    this.showToast(error.message);
                });
            }
        )
    }

    setMapOnAll(map) {
        for (var i = 0; i < this.marker.length; i++) {
            this.marker[i].setMap(map);
        }
    }
    clearMarkers() {
        this.setMapOnAll(null);
    }
    addMarker(position, content) {
        this.clearMarkers();
        this.marker = [];
        this.zone.run(() => {
            this.selectedLocation = position;
        });
        let marker = new google.maps.Marker({
            map: this.map,
            icon: this.catIcon,
            position: position,
            optimized: false
        });
        this.marker.push(marker);
        this.addInfoWindow(marker, content);
        return marker;
    }

    addInfoWindow(marker, content) {
        this.zone.run(() => {
            this.place = content;
        });
        let infoWindow = new google.maps.InfoWindow({
            content: content
        });

        google.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(this.map, marker);
        });
    }
    confirmLocation(){
        let data = {
            location_type: 'map',
            address: this.place,
            location: this.selectedLocation
        };
        localStorage.setItem('deliverylocation', JSON.stringify(data));
        this.navCtrl.push('ConfirmorderPage');
    }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DeliveryMapPage');
  }

}
