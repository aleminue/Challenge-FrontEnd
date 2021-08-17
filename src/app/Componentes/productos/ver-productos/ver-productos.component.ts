import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProductosService } from "../../../Servicios/productos/productos.service";
import { AvisosComponent } from "../../dialogo-info/avisos/avisos.component";

@Component({
  selector: 'app-ver-productos',
  templateUrl: './ver-productos.component.html',
  styleUrls: ['./ver-productos.component.css']
})
export class VerProductosComponent implements OnInit {

  //aca tomamos el valor que viene desde el componente "abm-carrito" cuando abrimos el modal, tomamos el objeto producto y lo guardamos
  // en una variable tambien llamada producto
  @Input() producto : any;

  constructor(private activeModal: NgbActiveModal, private productosServicio: ProductosService, private dialog: NgbModal) { }

  ngOnInit(): void {
  }

  eliminar(){
    const dialogRef = this.dialog.open(AvisosComponent, {
      animation: true,
      scrollable: true,
      size: 'lg',
      backdrop: 'static',
      centered: true
    });
    const mensaje = "¿Esta seguro que desea eliminar el producto?"
    dialogRef.componentInstance.mensaje = mensaje;
    //cuando se acepta la eliminacion, se llama al metodo que elimina el producto
    dialogRef.result.then(result => {
      if (result) {
        this.eliminarProducto();
      }
    });
  }
  
  //enviamos el objeto Producto al servicio
  eliminarProducto(){
    this.productosServicio.deleteProducto(this.producto).subscribe(
      datos =>{
        const mensaje = "Se elimino correctamente el Producto.";
        this.notificarResultado(mensaje);
        this.cerrar();
      },
      //el error siempre debe tomarse para utilizarlo
      err =>{

      }
    )
    
  }

  notificarResultado(mensaje: string) {
    const dialogRef = this.dialog.open(AvisosComponent, {
      animation: true,
      scrollable: true,
      size: 'lg',
      backdrop: 'static',
      centered: true
    });
    dialogRef.componentInstance.mensaje = mensaje;
  }


  cerrar(){
    this.activeModal.close();
  }

}
