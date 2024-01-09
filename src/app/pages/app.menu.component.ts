import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../services/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
          {
            label: '', 
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/pages/dashboard'] },
                { label: 'Job-Board', icon: 'pi pi-fw pi-briefcase', routerLink: ['/pages/job-board'] },
                { label: 'Members', icon: 'pi pi-fw pi-user', routerLink: ['/pages/members'] },
                { label: 'My-Group', icon: 'pi pi-fw pi-users', routerLink: ['/pages/mygroup'] },
                { label: 'News-Room', icon: 'pi pi-fw pi-book', routerLink: ['/pages/news-room'] },
                { label: 'Events', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/pages/events'] },
                { label: 'Chat-Room', icon: 'pi pi-fw pi-comments', routerLink: ['/pages/chat'] }, 
            ]
          },
        ];
    }
}
