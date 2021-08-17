import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ver-carrito',
  templateUrl: './ver-carrito.component.html',
  styleUrls: ['./ver-carrito.component.css']
})
export class VerCarritoComponent implements OnInit {

  @Input() carrito : any = {};

  totalProducto: Number;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.calcularTotalProducto();
  }

  calcularTotalProducto(){

    for (let detalle of this.carrito.detallesCarrito) {
      this.totalProducto = detalle.cantidadProducto * detalle.producto.precio;
      detalle.totalProducto = this.totalProducto;
    }
    
  }

  cerrar(){
    this.activeModal.close(this.carrito);
  }

}
