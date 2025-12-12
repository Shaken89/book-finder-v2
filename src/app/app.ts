import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { fromEvent, merge, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  title = 'book-finder';
  isOnline: boolean = navigator.onLine;
  showOfflineMessage: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Monitor online/offline status
    merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    ).subscribe(online => {
      this.isOnline = online;
      
      if (!online) {
        this.showOfflineMessage = true;
        // Optionally redirect to offline page
        // this.router.navigate(['/offline']);
      } else {
        // Hide offline message after a delay when back online
        setTimeout(() => {
          this.showOfflineMessage = false;
        }, 3000);
      }
    });
  }
}