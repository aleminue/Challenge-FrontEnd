import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-avisos',
  templateUrl: './avisos.component.html',
  styleUrls: ['./avisos.component.css']
})
export class AvisosComponent implements OnInit {

  @Input() mensaje : String;

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  cerrar(){
    this.activeModal.close();
  }

}
