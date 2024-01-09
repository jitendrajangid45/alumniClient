import { inject } from "@angular/core";
import { ActivatedRouteSnapshot , Router } from "@angular/router";
import { UtilService } from "../utils/util.service";
import { AuthService } from "../services/auth.service";
// import { firstValueFrom } from "rxjs";

// Function to guard routes and allow access only to admin users
export const alumniRouteGuard = async (next: ActivatedRouteSnapshot) => {
    // Injecting utility service and router for navigation
    const utilService = inject(UtilService);
    const router = inject(Router);
    // const authService = inject(AuthService);

    // Retrieving authentication token from local storage
    const authToken = localStorage.getItem('token');
    
    // Checking if authentication token is not present
    if (!authToken) {
        // Navigating to the login route if not authenticated
        router.navigate(['auth', 'login']);
        // Returning false to indicate restricted access
        return false;
    }

    // Decoding the JWT token
    const decodeToken = utilService.decodeJwtToken(authToken);

    // const {email, isVerified, role}=decodeToken;

    // const endPointName=`/auth/roleBasedRouteAccess?email=${email}&isVerified=${isVerified}&role=${role}`;
    // const currentPath = next.routeConfig.path;    

    // const b:any = await firstValueFrom(authService.authGetApi(endPointName));

    // Checking if the decoded token exists and the user has admin role  
    if(authToken && decodeToken.role === 'alumni'){
        // Returning true to indicate access allowed for admin
        return true;
    } else {
        // Navigating to the login route if the user is not an admin
        router.navigate(['auth', 'login']);
        // Returning false to indicate restricted access
        return false;
    }
}

// Function to guard routes and allow access only to admin users
export const adminRouteGuard = async () => {
    // Injecting utility service and router for navigation
    const utilService = inject(UtilService);
    const router = inject(Router);
    
    // Retrieving authentication token from local storage
    const authToken = localStorage.getItem('token');
    
    // Checking if authentication token is not present
    if (!authToken) {
        // Navigating to the login route if not authenticated
        router.navigate(['auth', 'login']);
        // Returning false to indicate restricted access
        return false;
    }

    // Decoding the JWT token
    const decodeToken = utilService.decodeJwtToken(authToken);

    // Checking if the decoded token exists and the user has admin role
    if (decodeToken && decodeToken.role === 'admin') {
        // Returning true to indicate access allowed for admin
        return true;
    } else {
        // Navigating to the login route if the user is not an admin
        router.navigate(['auth', 'login']);
        // Returning false to indicate restricted access
        return false;
    }
};

// Function to guard routes and allow access only to verified email users
export const verifiedEmail = () => {
    // Injecting utility service and router for navigation
    const router = inject(Router);
    if(localStorage.getItem('verify')){
        return true;
    }else{
        // Navigating to the login route if the user is not an admin
        router.navigate(['auth', 'login']);
        // Returning false to indicate restricted access
        return false;    
    }
}

// export const resolveRoute = () =>{
//     const authService = inject(AuthService);
//     const authToken=localStorage.getItem('token');
//     const utilService = inject(UtilService);
//     const decodeToken=utilService.decodeJwtToken(authToken);
//     const {email, isVerified, role}=decodeToken;
//     const endPointName=`/auth/roleBasedRouteAccess?email=${email}&isVerified=${isVerified}&role=${role}`;
//     return authService.authGetApi(endPointName)
// }