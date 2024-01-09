
import { Component, Input, inject } from '@angular/core';
import { UtilService } from 'src/app/utils/util.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss'],
})
export class AdminHeaderComponent {
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  canShowSearchAsOverlay = false;

  utilService: UtilService = inject(UtilService);

  getHeadClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';
    } else {
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  userItems = [
    {
      icon: 'far fa-user',
      label: 'Profile',
    },
    {
      icon: 'far fa-cog',
      label: 'Setting',
    },
    {
      icon: 'far fa-power-off',
      label: 'LogOut',
    },
  ];

  logout(){
    this.utilService.logout();
  }
}
