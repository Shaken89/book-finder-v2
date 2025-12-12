import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-offline',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './offline.html',
  styleUrl: './offline.css'
})
export class OfflineComponent {
  reload(): void {
    window.location.reload();
  }
}
