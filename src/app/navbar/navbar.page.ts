import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.page.html',
  styleUrls: ['./navbar.page.scss'],
})
export class NavbarPage implements OnInit {
  @Input() pageTitle: string;
  constructor() { }
  ngOnInit() {
  }
}
