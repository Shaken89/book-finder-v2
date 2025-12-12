import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { User } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { from, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  private firestore: Firestore = inject(Firestore);
  user: User | null = null;
  profilePictureDataUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.loadProfilePicture(user.uid);
      } else {
        this.profilePictureDataUrl = null;
      }
    });
  }

  private loadProfilePicture(uid: string): void {
    const userDocRef = doc(this.firestore, 'users', uid);
    from(getDoc(userDocRef)).pipe(
      catchError(err => {
        console.error('Error loading profile picture:', err);
        return of(null);
      })
    ).subscribe(docSnap => {
      if (docSnap && docSnap.exists()) {
        const data = docSnap.data();
        this.profilePictureDataUrl = data['profilePictureDataUrl'] || null;
      }
    });
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}