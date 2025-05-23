import { Routes, RouterModule } from '@angular/router';
import { ShopPageComponent } from './pages/shop-page/shop-page.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {path : '', redirectTo : '/shop', pathMatch: 'full'},
    {path: 'shop', component : ShopPageComponent}
];

@NgModule({
    imports : [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}