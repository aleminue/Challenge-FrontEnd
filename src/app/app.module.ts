import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { CountdownModule } from 'ngx-countdown';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarritoComponent } from './Componentes/carrito/lista-carritos/carrito.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavbarComponent } from './Componentes/navbar/navbar.component';
import { InicioComponent } from './Componentes/inicio/inicio.component';
import { LoginComponent } from './Componentes/login/login.component';
import { AbmCarritoComponent } from './Componentes/carrito/abm-carrito/abm-carrito.component';
import { VerCarritoComponent } from './Componentes/carrito/ver-carrito/ver-carrito.component';
import { VerProductosComponent } from "./Componentes/productos/ver-productos/ver-productos.component";
import { AvisosComponent } from './Componentes/dialogo-info/avisos/avisos.component';

@NgModule({
  declarations: [
    AppComponent,
    CarritoComponent,
    NavbarComponent,
    InicioComponent,
    LoginComponent,
    AbmCarritoComponent,
    VerCarritoComponent,
    VerProductosComponent,
    AvisosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    AutocompleteLibModule,
    CountdownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
