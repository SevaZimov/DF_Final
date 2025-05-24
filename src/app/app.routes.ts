import { AboutPageComponent } from './about-page/about-page.component';
import { Routes, RouterModule } from '@angular/router';
import { ShopPageComponent } from './pages/shop-page/shop-page.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {path : '', redirectTo : '/shop', pathMatch: 'full'},
    {path: 'shop', component : ShopPageComponent},
    {path: 'about', component : AboutPageComponent}
];

@NgModule({
    imports : [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
