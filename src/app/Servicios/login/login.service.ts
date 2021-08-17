import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { AppSettings } from "../../app.constantes";
import { Usuario } from "../../Entidades/usuario/usuario";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  //enviamos el objeto usuario a travez de un post para verificar desde el backend si el usuario tiene permisos o no de acceder a la aplicacion
  // tambien verificamos desde el back si el usuario y contraseña ingresados son correctos
  public login(usuario: Usuario){
    return this.http.post(AppSettings.API_URL + '/usuarioLogueado',usuario);
  }
}
