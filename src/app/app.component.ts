import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <div class="navbar">
      <div class="navbar-brand">
        <div class="navbar-title">Car Management Warehouse</div>
      </div>
      
      <div class="navbar-center" *ngIf="isLoggedIn()">
        <a [routerLink]="['/cars']" class="nav-link">Cars</a>
        <a [routerLink]="['/liked-cars']" class="nav-link">Liked Cars</a>
        <a *ngIf="isAdmin()" [routerLink]="['/users']" class="nav-link">Users</a>
      </div>
      
      <div class="navbar-right">
        <div class="user-info" *ngIf="isLoggedIn()">
          <span class="user-role" [ngClass]="{'admin-role': isAdmin(), 'user-role': !isAdmin()}">
            {{ isAdmin() ? 'Administrator' : 'User' }}
          </span>
          <span class="user-permissions">
            {{ isAdmin() ? 'Full access' : 'Limited access' }}
          </span>
        </div>
        
        <div class="navbar-actions">
          <button *ngIf="!isLoggedIn()" (click)="navigateToLogin()" class="login-btn">Login</button>
          <button *ngIf="isLoggedIn()" (click)="logout()" class="logout-btn">Logout</button>
        </div>
      </div>
    </div>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #343a40;
      color: white;
      padding: 10px 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      height: 60px;
    }
    
    /* Left section - Brand */
    .navbar-brand {
      display: flex;
      align-items: center;
    }
    
    .navbar-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
    }
    
    /* Center section - Navigation links */
    .navbar-center {
      display: flex;
      gap: 20px;
      align-items: center;
      justify-content: center;
    }
    
    .nav-link {
      color: white;
      text-decoration: none;
      font-weight: 500;
      padding: 6px 12px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }
    
    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }
    
    /* Right section - User info and actions */
    .navbar-right {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .user-role {
      display: inline-block;
      padding: 5px 12px;
      border-radius: 50px;
      font-weight: 500;
      font-size: 0.85rem;
    }
    
    .admin-role {
      background-color: #28a745;
      color: white;
    }
    
    .user-role {
      background-color: #007bff;
      color: white;
    }
    
    .user-permissions {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.8);
      margin-left: 5px;
    }
    
    .navbar-actions {
      display: flex;
      align-items: center;
    }
    
    .login-btn, .logout-btn {
      padding: 6px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .login-btn {
      background-color: #4CAF50;
      color: white;
    }
    
    .logout-btn {
      background-color: #f44336;
      color: white;
    }
    
    .login-btn:hover, .logout-btn:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
      .navbar {
        flex-direction: column;
        height: auto;
        padding: 15px;
      }
      
      .navbar-brand, .navbar-center, .navbar-right {
        width: 100%;
        margin-bottom: 10px;
        justify-content: center;
      }
      
      .navbar-right {
        flex-direction: column;
        gap: 10px;
      }
      
      .user-info {
        flex-direction: column;
        align-items: center;
      }
      
      .user-permissions {
        margin-left: 0;
        margin-top: 5px;
      }
    }
  `],
})
export class AppComponent {
  title = 'car-management';
  
  constructor(private authService: AuthService, private router: Router) {}
  
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  
  isUser(): boolean {
    return this.authService.isUser();
  }
  
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
