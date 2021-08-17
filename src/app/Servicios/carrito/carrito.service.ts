import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppSettings } from "../../app.constantes";

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  constructor(private http: HttpClient) { }

  //mandamos el Id del usuario por medio de un get para que desde el back nos retorne todos los carritos de ese usuario
  getCarritos(idUsuario : any) {
    return this.http.get(AppSettings.API_URL + '/carritos/' + idUsuario);
  }

  //guardamos un nuevo carrito, le pasamos el carro al backend a traves de un post
  saveCarrito(carrito: any) {
    return this.http.post(AppSettings.API_URL + '/carritos/nuevo' , carrito);
  }
}
