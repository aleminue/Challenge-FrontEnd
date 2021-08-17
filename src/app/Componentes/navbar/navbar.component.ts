import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  nombreUsuario : String;

  constructor(private router : Router) { }

  ngOnInit(): void {
    this.nombreUsuario = localStorage.getItem('NombreUsuario');
  }

  cerrarSesion(){
    this.router.navigate(['/login']);
    localStorage.clear();
  }

}
