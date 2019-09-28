import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from '../profile-elements/profile/profile.component';
import {Routes, RouterModule} from '@angular/router';
import {OrdersComponent} from '../profile-elements/orders/orders.component';
import {SettingsComponent} from '../profile-elements/settings/settings.component';
import {SecurityComponent} from '../profile-elements/security/security.component';
import {AddressComponent} from '../profile-elements/address/address.component';
import {JointPurchasesComponent} from '../profile-elements/joint-purchases/joint-purchases.component';

export const profileRoutes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      {
        path: '',
        component: OrdersComponent
      }, {
        path: 'orders',
        component: OrdersComponent
      }, {
        path: 'settings',
        pathMatch: 'full',
        component: SettingsComponent
      }, {
        path: 'security',
        pathMatch: 'full',
        component: SecurityComponent
      }, {
        path: 'address',
        pathMatch: 'full',
        component: AddressComponent
      }, {
        path: 'purchases',
        pathMatch: 'full',
        component: JointPurchasesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(profileRoutes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {
}
