import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import format from 'date-fns/format';

import { ProductosService } from "../../../Servicios/productos/productos.service";
import { CarritoService } from "../../../Servicios/carrito/carrito.service";
import { FechasPromoService } from "../../../Servicios/fechasPromo/fechas-promo.service";

import { VerProductosComponent } from "../../productos/ver-productos/ver-productos.component";
import { AvisosComponent } from "../../dialogo-info/avisos/avisos.component";

@Component({
  selector: 'app-abm-carrito',
  templateUrl: './abm-carrito.component.html',
  styleUrls: ['./abm-carrito.component.css']
})
export class AbmCarritoComponent implements OnInit {

  @Input() carrito: any = {};
  @Input() estadoCarrito: String;

  // a modo de simplificacion no creo la clase productos, el login tiene implementedo la clase usuario para
  //demostrar que se hacerlo
  productos: any;
  totalProducto: number;
  precioTotal: number;
  cantidad: number;
  hayProductos: Boolean;
  //atributo usado en el searchKeyboard (buscara por nombre)
  nombre: String = "nombre";
  productoSeleccionado: any;
  detallesCarrito: any = []
  fechaPromocionable: any;
  seAplicoDescuento: Boolean;
  productoMenorPrecio: any = {};
  posicionProdMenorPrecio: Number;
  tipoDescuento: String;
  titulo: String;



  constructor(private productosServicio: ProductosService, private activeModal: NgbActiveModal, private dialog: NgbModal, private carritoServicio: CarritoService,
    private fechasPromoServicio: FechasPromoService) { }

  ngOnInit(): void {
    //metodo para verificar si el carrito es nuevo o es para modificar uno que todavia no se guardo
    //para cambiar el nombre del titulo
    this.verificarNuevoCarrito();
    //metodo para traer los productos del back-end
    this.cargarProductos();
    //verificamos si la fecha del dia es promocionable
    this.esFechaPromocionable();
    //obtenemos el tipo de carrito que se esta creando para saber que descuento hacer
    this.obtenerTipoCarrito();

  }

  verificarNuevoCarrito() {
    if (this.estadoCarrito == "NUEVO") {
      this.titulo = "Nuevo Carrito";
      this.hayProductos = false;
      this.precioTotal = 0;
      this.detallesCarrito.length = 0;
      this.seAplicoDescuento = false;
      this.carrito.estado = "COMPRA EN CURSO"
      this.productoMenorPrecio.precio = 9999999999999;

      //obtenemos la fecha actual de cuando se creo el carrito
      var fechaActual = format(new Date(), 'yyyy-MM-dd');
      this.carrito.fechaCreacion = fechaActual;
    } else {
      this.titulo = "Modificar Carrito";
      this.hayProductos = true;
      this.detallesCarrito = this.carrito.detallesCarrito;
      this.precioTotal = this.carrito.totalCarrito;
    }
  }

  cargarProductos() {
    this.productosServicio.getProductos().subscribe(
      datos => {
        //guardamos los productos que vienen del backend para poder mostrarlos
        this.productos = datos;
      },
      err => {
        console.log(err);
      }

    )
  }

  esFechaPromocionable() {
    this.fechasPromoServicio.esFechaPromocionable().subscribe(
      datos => {
        //si el back-end devuelve true es fecha promocionable, si devuelve false no lo es
        this.fechaPromocionable = datos;
        console.log(datos);
      },
      err => {
        console.log(err);
      }

    )
  }

  cerrar() {
    console.log(this.carrito);
    this.activeModal.close(this.carrito);
  }

  guardar() {
    if (this.detallesCarrito.length == 0) {
      var mensaje = "No hay ningun Producto Seleccionado";
      this.notificarResultado(mensaje);
    } else {
      this.carrito.estado = "COMPRA FINALIZADA"

      //verificamos si el localstorage trae el usuario vip
      //al poder aplicar solo un tipo de descuento, se considero primero el descuento por usuario vip
      //ya que es el mayor descuento, luego sigue por fecha promocionable y sino el comun
      if (localStorage.getItem('TipoUsuario') == "VIP") {
        //el "+" transforma el string que se encuentra en el localstorage a number y lo guardamos en una variable local
        var descuentoVIP: number = +localStorage.getItem('Descuento');

        //se calcula el descuento sobre el total
        this.precioTotal = this.precioTotal - descuentoVIP - this.productoMenorPrecio.precio;
      } else {
        //verificamos que el backend nos devuelva una fecha promocionable para este dia
        if (this.fechaPromocionable != null) {
          //se calcula el descuento sobre el total
          this.precioTotal = this.precioTotal - this.fechaPromocionable.descuento;
        } else {
          //se calcula el descuento sobre el total
          this.precioTotal = this.precioTotal - 100;
        }
      }

      this.guardarNuevoCarrito();
    }
    //cuando cierro el modal paso el estado del carrito para tomarlo en el componente donde se listan los carros
    //this.activeModal.close();
  }

  guardarNuevoCarrito() {
    //creo una nueva variable para enviar los datos al back
    var carritoDto: any = {};
    //asigno el ID del usuario logueado al carritoDto
    carritoDto.idUsuario = localStorage.getItem('IdUsuario');
    //se asigna el precio total con descuento aplicado al carrito
    this.carrito.precioTotal = this.precioTotal;
    //se asigna el carrito al carritoDto para llevarlo al back-end
    carritoDto.carrito = this.carrito;

    this.carritoServicio.saveCarrito(carritoDto).subscribe(
      datos => {
        const mensaje = "Se guardo Correctamente el carrito.";
        this.notificarResultado(mensaje);
        this.cerrar();
      },
      err => {

      }
    );
  }


  agregarProducto() {
    //si selecciono un producto y su cantidad entonces pasa sino no
    if ((this.productoSeleccionado != undefined && this.productoSeleccionado != "") && (this.cantidad != undefined && this.cantidad != 0)) {
      var esRepetido = false;

      //recorremos la lista de productos que ya selecciono para agregar la cantidad y calcular el precio al que ya esta
      // y no agregar otro item a la lista
      for (let detalle of this.detallesCarrito) {
        if (detalle.producto.nombre == this.productoSeleccionado.nombre) {
          esRepetido = true;
          //es el metodo que calculara la cantidad por producto
          this.sumarCantidad(detalle);
          //es el metodo que calculara el total por producto
          this.sumarPrecios(detalle);

          //se obtiene el producto con el menor precio, para descontarlo del total si es VIP
          if (detalle.producto.precio <= this.productoMenorPrecio.precio) {
            //se guarda el producto con menor precio
            this.productoMenorPrecio = detalle.producto;
            //se guarda la posicion en la lista del producto con menor precio para despues eliminar una unidad si es vip
            this.posicionProdMenorPrecio = this.detallesCarrito.indexOf(detalle);
          }
        }

      }

      //si el producto no es repetido, agrega uno nuevo a la lista
      if (esRepetido == false) {
        var detalleCarrito: any = {};
        detalleCarrito.cantidadProducto = 0;
        //agrego el producto al detalle del carrito
        detalleCarrito.producto = this.productoSeleccionado;
        //agregamos el detalle a los detalles del carrito
        this.detallesCarrito.push(detalleCarrito);
        this.carrito.detallesCarrito = this.detallesCarrito;
        //es el metodo que calculara la cantidad por producto
        this.sumarCantidad(detalleCarrito);
        //es el metodo que calculara el total por producto
        this.sumarPrecios(detalleCarrito);

        //recorro nuevamente la lista para determinar el elemento mas barato y descontarlo si es VIP
        for (let detalle of this.detallesCarrito) {
          if (detalle.producto.precio <= this.productoMenorPrecio.precio) {
            //se guarda el producto con menor precio
            this.productoMenorPrecio = detalle.producto;
            //se guarda la posicion en la lista del producto con menor precio para despues eliminar una unidad si es vip
            this.posicionProdMenorPrecio = this.detallesCarrito.indexOf(detalle);
          }
        }
      }

      this.cantidad = 0;
      this.productoSeleccionado = undefined;
      this.hayProductos = true;

    } else {

    }



  }

  sumarCantidad(detalleCarrito: any) {
    detalleCarrito.cantidadProducto = detalleCarrito.cantidadProducto + this.cantidad
  }

  sumarPrecios(detalleCarrito: any) {
    var totalAnterior: number = 0;
    //si el producto seleccionado tiene un total lo guardo en otra variable para despues al total nuevo restarle el total anterior
    //de esa forma me da bien el total del carrito
    if (detalleCarrito.totalProducto != undefined && detalleCarrito.totalProducto != 0) {
      totalAnterior = detalleCarrito.totalProducto;
    }

    detalleCarrito.totalProducto = detalleCarrito.producto.precio * detalleCarrito.cantidadProducto;
    //es el metodo que calculara el total del carrito
    this.calcularTotal(totalAnterior, detalleCarrito);

  }

  calcularTotal(totalAnterior: number, detalleCarrito: any) {
    this.precioTotal = this.precioTotal + detalleCarrito.totalProducto - totalAnterior;
    this.carrito.precioTotal = this.precioTotal;

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

  verificaDescuento() {
    if (localStorage.getItem('TipoUsuario') == "VIP") {
      this.precioTotal = this.precioTotal - 500;
    } else {
      this.precioTotal = this.precioTotal - 100;
    }
  }

  obtenerTipoCarrito() {
    if (localStorage.getItem('TipoUsuario') == "VIP") {
      //guardo el tipo de carrito
      this.carrito.tipoCarrito = "VIP"
    } else {
      if (this.fechaPromocionable != null) {
        //guardo el tipo de carrito
        this.carrito.tipoCarrito = "Fecha Promocionable"
      } else {
        //guardo el tipo de carrito
        this.carrito.tipoCarrito = "Comun"
      }
    }
  }
}
