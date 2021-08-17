import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { VerCarritoComponent } from "../ver-carrito/ver-carrito.component";
import { AbmCarritoComponent } from "../abm-carrito/abm-carrito.component";

import { CarritoService } from "../../../Servicios/carrito/carrito.service";
import { CountdownEvent } from 'ngx-countdown';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  //definimos un array de objetos del tipo any, a diferencia del usuario que esta la entidad creada
  //lo hago asi a proposito para que sepan que lo se hacer de las 2 formas
  carritosTerminados : any = [] ;
  carritosEnCurso : any = [];
  hayCarritosEnCurso : Boolean;
  hayCarritos : Boolean;

  constructor(private dialog: NgbModal, private carritoServicio : CarritoService) { }

  ngOnInit(): void {
    this.hayCarritosEnCurso = false;
    this.hayCarritos = false;
    //cuando se carga el componente lo primero que hacemos es cargar los carritos a la tabla
    this.cargarCarritos();
  }

  nuevoCarrito(){
    //abrimos un modal con las caracteristicas siguientes
    const dialogRef = this.dialog.open(AbmCarritoComponent, {
      animation: true,
      scrollable: true,
      size: 'lg',
      backdrop: 'static',
      centered: true
    });
    dialogRef.componentInstance.estadoCarrito = "NUEVO";
    //cuando se cierrra el modal se agrega a la lista de carritos el carro que se trajo de la pantalla abm
    dialogRef.closed.subscribe(result => {
      if (result.estado == "COMPRA EN CURSO") {
        this.hayCarritosEnCurso = true;
        this.carritosEnCurso.push(result);
        console.log(result);
      }else{
        this.cargarCarritos();
      }

      if (this.carritosEnCurso.length != 0) {
        this.hayCarritos = true;
      }
    });
  }

  cargarCarritos(){
    //enviamos el id del usuario que en este caso esta almacenado en el localstorage
    this.carritoServicio.getCarritos(localStorage.getItem('IdUsuario')).subscribe(
      datos =>{
        //guardamos los carritos obtenidos desde el back en el array de objetos carritos para poder mostrarlos
        this.carritosTerminados = datos;

        if (this.carritosTerminados.length != 0) {
          this.hayCarritos = true;
        }
      },
      //el error en este caso lo mostramos en consola, pero se podria trabajar con el de la manera que sea requerida
      err =>{
        console.log(err);
      }
      
    );
  }

  verCarrito(carrito: any) {
    const dialogRef = this.dialog.open(VerCarritoComponent, {
      animation: true,
      scrollable: true,
      size: 'lg',
      backdrop: 'static',
      centered: true
    });
    dialogRef.componentInstance.carrito = carrito;
    dialogRef.closed.subscribe(result => {
      
      
    });
  }

  completarCarrito(carrito: any){
    const dialogRef = this.dialog.open(AbmCarritoComponent, {
      animation: true,
      scrollable: true,
      size: 'lg',
      backdrop: 'static',
      centered: true
    });
    dialogRef.componentInstance.carrito = carrito;
    dialogRef.closed.subscribe(result => {
      
      
    });
  }

  //este metodo hara que si la cuenta regresiva termina, entonces se elimina el carrito que no fue comprado
  carritoExpirado(infoCarrito : CountdownEvent, indice : number){
    if (infoCarrito.action == "done") {
      //se elimina el carrito de la lista
      this.carritosEnCurso.splice(indice,1);
      this.cargarCarritos();
    }

    if(this.carritosEnCurso.length == 0){
      this.hayCarritosEnCurso = false;
    }

    if (this.carritosEnCurso.length == 0 && this.carritosTerminados != 0) {
      this.hayCarritos = false;
    }
  }

}
