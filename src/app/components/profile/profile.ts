import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  private firestore: Firestore = inject(Firestore);
  
  user: User | null = null;
  profilePictureDataUrl: string | null = null;
  isUploading: boolean = false;
  uploadError: string | null = null;
  uploadSuccess: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.loadProfilePicture(user.uid);
      }
    });
  }

  private loadProfilePicture(uid: string): void {
    console.log('Loading profile picture for user:', uid);
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
        console.log('Profile picture loaded:', this.profilePictureDataUrl ? 'Yes' : 'No');
      } else {
        console.log('No profile picture document found');
        this.profilePictureDataUrl = null;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    
    // Validate file type
    if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
      this.uploadError = 'Only JPG and PNG files are allowed';
      return;
    }

    // Validate file size (max 5MB before compression)
    if (file.size > 5 * 1024 * 1024) {
      this.uploadError = 'File size must be less than 5MB';
      return;
    }

    this.uploadError = null;
    this.uploadSuccess = false;
    this.isUploading = true;

    this.compressAndSave(file);
  }

  private compressAndSave(file: File): void {
    const reader = new FileReader();
    
    reader.onerror = () => {
      this.uploadError = 'Error reading file';
      this.isUploading = false;
    };
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      
      img.onerror = () => {
        this.uploadError = 'Error loading image';
        this.isUploading = false;
      };
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            this.uploadError = 'Browser does not support canvas';
            this.isUploading = false;
            return;
          }
          
          // Calculate new dimensions (max 400x400 for smaller data URL)
          let width = img.width;
          let height = img.height;
          const maxSize = 400;

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to data URL (base64)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          // Check size (Firestore has 1MB document limit)
          const sizeInKB = Math.round((dataUrl.length * 3) / 4 / 1024);
          if (sizeInKB > 900) {
            this.uploadError = 'Compressed image still too large. Try a smaller image.';
            this.isUploading = false;
            return;
          }
          
          this.saveToFirestore(dataUrl);
        } catch (error: any) {
          this.uploadError = 'Error processing image';
          this.isUploading = false;
          console.error('Image processing error:', error);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  private saveToFirestore(dataUrl: string): void {
    if (!this.user) {
      this.uploadError = 'User not authenticated';
      this.isUploading = false;
      return;
    }

    console.log('Saving profile picture to Firestore for user:', this.user.uid);
    const userDocRef = doc(this.firestore, 'users', this.user.uid);
    
    from(setDoc(userDocRef, { profilePictureDataUrl: dataUrl }, { merge: true })).pipe(
      catchError(error => {
        console.error('Error saving to Firestore:', error);
        this.uploadError = error.message || 'Failed to save image';
        this.isUploading = false;
        return of(null);
      })
    ).subscribe(result => {
      if (result !== null) {
        console.log('Profile picture saved successfully');
        this.profilePictureDataUrl = dataUrl;
        this.isUploading = false;
        this.uploadSuccess = true;
        setTimeout(() => this.uploadSuccess = false, 3000);
      }
    });
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }
}
