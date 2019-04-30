import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeliveryMapPage } from './delivery-map';

@NgModule({
  declarations: [
    DeliveryMapPage,
  ],
  imports: [
    IonicPageModule.forChild(DeliveryMapPage),
  ],
})
export class DeliveryMapPageModule {}
