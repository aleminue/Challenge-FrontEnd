import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Usuario } from "../../Entidades/usuario/usuario";
import { LoginService } from "../../Servicios/login/login.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario = new Usuario();
  user : String;
  pass : String;
  alertaLogin : Boolean;
  datosRespuesta : any;
  error : String;

  constructor(private router : Router, private loginServicio : LoginService) { }

  ngOnInit(): void {
    this.alertaLogin = false;
  }

  loguearse(){
    if ((this.user == null || this.user == "") && (this.pass == null || this.pass == "")) {
      this.error = "Ingrese Un Usuario y Contraseña"
      this.alertaLogin = true;
    }else{
      //asignamos los valores devueltos de los input que se guardan con el ngModel a las variables user y pass a la clase usuario
      this.usuario.user = this.user;
      this.usuario.pass = this.pass;
      console.log(this.usuario);
      //enviamos el usuario por parametro al servicio para controlar si el usuario y contraseña son correctos, si no lo es devolvemos el error
      this.loginServicio.login(this.usuario).subscribe(
        data => {
          this.datosRespuesta = data;
          console.log(this.datosRespuesta);
          //aca se obtiene lo que se retorna desde el backend y podria guardarse un token al localstorage por ejemplo (codigo comentado)
          //despues utilizar ese token donde haga falta
          //localStorage.setItem('Token', this.datosRespuesta.token);

          //aca guardamos el Id del usuario retornado del back en el localstorage para luego utilizarlo en las peticiones
          localStorage.setItem('IdUsuario',this.datosRespuesta.idUsuario)

          //aca guardamos el tipo de usuario que retorna del back para despues utilizarlo (puede ser VIP, etc)
          localStorage.setItem('TipoUsuario',this.datosRespuesta.tipoUsuario.nombre);

          //aca guardamos el descuento que viene por el tipo de usuario (descuento por ser vip)
          localStorage.setItem('Descuento',this.datosRespuesta.tipoUsuario.descuento);

          //guardamos el nombre del usuario en el localstorage
          localStorage.setItem('NombreUsuario',this.datosRespuesta.nombre);
          
         this.router.navigate(['inicio']);   
        },
        //el error en este caso lo usamos para mostrarlo en la web
        err => {
          this.error = err.error.text;
          this.alertaLogin = true;     
        }
      );
    }
  }

}
