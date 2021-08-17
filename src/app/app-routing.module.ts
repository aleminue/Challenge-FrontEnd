import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarritoComponent } from "./Componentes/carrito/lista-carritos/carrito.component";
import { InicioComponent } from "./Componentes/inicio/inicio.component";
import { LoginComponent } from "./Componentes/login/login.component";


//definimos las rutas que van a llamar a cada componente, rutas padres y en el caso del inicio, sus rutas hijas
const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'inicio',
    component: InicioComponent,
    children: [
      {
        path: '',
        redirectTo: 'carritos',
        pathMatch: 'full'
      },
      {
        path: 'carritos',
        component: CarritoComponent
      }
     
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
