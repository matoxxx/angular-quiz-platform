import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.styl']
})
export class HeaderComponent implements OnInit {
  i18nRouting = environment.routing;
  allowRegistrations = environment.allowRegistrations;

  constructor(
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
