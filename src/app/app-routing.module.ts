import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './auth/not-found/not-found.component';
import { LoaderComponent } from './loader/loader.component';
import { adminRouteGuard } from './auth/auth.guard';
const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'pages', redirectTo: 'pages/dashboard', pathMatch: 'full' },
  { path: 'pages', loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule) },
  { path: 'auth', redirectTo: 'auth/login', pathMatch: 'full',},
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m=>m.AuthModule) },
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full',},
  { path:'admin',loadChildren:()=>import('./admin/admin.module').then(m=>m.AdminModule) , canActivateChild:[adminRouteGuard] },
  { path:'loader',component:LoaderComponent},
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
