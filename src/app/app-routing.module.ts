import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProfileComponent} from './profile-elements/profile/profile.component';
import {AuthGuardService} from './auth-guard.service';
import {ProfileRoutingModule} from './profile-routing/profile-routing.module';
import {JointPurchaseSearchComponent} from './joint-purchase-elements/joint-purchase-search/joint-purchase-search.component';
import {JointPurchaseComponent} from './joint-purchase-elements/joint-purchase/joint-purchase.component';

const routes: Routes = [
  {
    path: '',
    component: JointPurchaseSearchComponent
  }, {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService]
  }, 
  {
    path: 'search',
    children: [
      {
        path: 'purchase',
        component: JointPurchaseSearchComponent
      }
    ]
  },
  {
    path: 'purchase/:purchase_id',
    component: JointPurchaseComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    ProfileRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
