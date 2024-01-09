import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AppConfig {
    inputStyle: string;
    colorScheme: string;
    theme: string;
    ripple: boolean;
    menuMode: string;
    scale: number;
}

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;

    // birthdayHoverActive:boolean;
    // staticBirthdayMobileActive:boolean;
    // staticBirthdayDesktopInactive:boolean;
    // overlayBirthdayActive:boolean;
}




@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  config: AppConfig = {
    ripple: false,
    inputStyle: 'outlined',
    menuMode: 'static',
    colorScheme: 'light',
    theme: 'lara-light-indigo',
    scale: 14,
  };

  state: LayoutState = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,

    // birthdayHoverActive:false,
    // staticBirthdayDesktopInactive:false,
    // staticBirthdayMobileActive:false,
    // overlayBirthdayActive:false,
  };


  private configUpdate = new Subject<AppConfig>();

  private overlayOpen = new Subject<any>();

  configUpdate$ = this.configUpdate.asObservable();

  overlayOpen$ = this.overlayOpen.asObservable();

  onMenuToggle() {
        console.log('menu');
    if (this.isOverlay()) {
      console.log('111111');
      
      this.state.overlayMenuActive = !this.state.overlayMenuActive;
      if (this.state.overlayMenuActive) {
        this.overlayOpen.next(null);
      }
    }

    if (this.isDesktop()) {
            console.log('222222222222');
      this.state.staticMenuDesktopInactive =
        !this.state.staticMenuDesktopInactive;
    } else {
      this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;

      if (this.state.staticMenuMobileActive) {
        this.overlayOpen.next(null);
      }
    }
  }

  // onBirthdayToggle() {
  //   console.log('birthday');
    
  //   if (this.isOverlay()) {
  //     this.state.overlayBirthdayActive = !this.state.overlayBirthdayActive;
  //     if (this.state.overlayBirthdayActive) {
  //       this.overlayOpen.next(null);
  //     }
  //   }

  //   if (this.isDesktop()) {
  //     this.state.staticBirthdayDesktopInactive =
  //       !this.state.staticBirthdayDesktopInactive;
  //   } else {
  //     this.state.staticBirthdayMobileActive = !this.state.staticBirthdayMobileActive;

  //     if (this.state.staticBirthdayMobileActive) {
  //       this.overlayOpen.next(null);
  //     }
  //   }
  // }

  showProfileSidebar() {
    this.state.profileSidebarVisible = !this.state.profileSidebarVisible;
    if (this.state.profileSidebarVisible) {
      this.overlayOpen.next(null);
    }
  }

  showConfigSidebar() {
    this.state.configSidebarVisible = true;
  }

  isOverlay() {
    return this.config.menuMode === 'overlay';
  }

  isDesktop() {  
    return window.innerWidth > 991;
  }

  isMobile() {
    return !this.isDesktop();
  }

  onConfigUpdate() {
    this.configUpdate.next(this.config);
  }
}
