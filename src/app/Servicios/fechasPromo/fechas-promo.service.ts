import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppSettings } from "../../app.constantes";

@Injectable({
  providedIn: 'root'
})
export class FechasPromoService {

  constructor(private http: HttpClient) { }

  //mandamos el Id del usuario por medio de un get para que desde el back nos retorne todos los carritos de ese usuario
  esFechaPromocionable() {
    return this.http.get(AppSettings.API_URL + '/fechaPromocionable');
  }
}
