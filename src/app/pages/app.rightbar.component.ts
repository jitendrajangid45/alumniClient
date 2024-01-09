import { Component, ElementRef } from '@angular/core';
import { LayoutService } from '../services/app.layout.service';

@Component({
  selector: 'app-rightbar',
  templateUrl: './app.rightbar.component.html',
})
export class AppRightBarComponent {
  constructor(public layoutService: LayoutService, public el: ElementRef) {}
}
