import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppSettings } from "../../app.constantes";

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private http: HttpClient) { }

  //Obtenemos desde el backend, la lista de productos disponibles
  getProductos() {
    return this.http.get(AppSettings.API_URL + '/productos');
  }

  //mandamos el objeto producto al backend y lo damos de baja, no lo eliminamos fisicamente sino solo logicamente
  deleteProducto(producto: any) {
    return this.http.put(AppSettings.API_URL + '/producto/darBaja', producto);
  }

}
