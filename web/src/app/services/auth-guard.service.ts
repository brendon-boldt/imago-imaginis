import { Injectable }     from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot }    from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private user: UserService){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // Check to see if user is trying to access admin portion of website
        // If so, make sure they're an admin
        // console.log(route.firstChild.routeConfig.path);
        console.log(route);
        if(route.firstChild != null){
            var routeComponent = route.firstChild.routeConfig.path;
            if(routeComponent == "system-stats"){
                return this.user.isAdmin;
            }
        }
        // Check to see if the user is looking up a profile (not their own) and allow it
        if(route.queryParams.userId != null){
            return true;
        }
        let url: string = state.url;
        return this.checkLogin(url);
    }
    checkLogin(url: string): boolean {
    if (this.authService.isLoggedIn) { return true; }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
    }
}