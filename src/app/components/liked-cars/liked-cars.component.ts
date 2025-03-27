import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Car, CarService } from '../../services/car.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-liked-cars',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './liked-cars.component.html',
  styleUrls: ['./liked-cars.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class LikedCarsComponent implements OnInit {
  likedCars: Car[] = [];
  loading = true;
  error = '';

  constructor(private userService: UserService, private carService: CarService) {}

  ngOnInit(): void {
    this.loadLikedCars();
  }

  loadLikedCars(): void {
    this.loading = true;
    this.userService.getLikedCars().subscribe({
      next: (cars) => {
        this.likedCars = cars;
        
        // Refresh and preload all image URLs
        this.carService.preloadAndRefreshImages(this.likedCars);
        
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load liked cars. Please try again later.';
        this.loading = false;
        console.error('Error loading liked cars:', err);
      }
    });
  }

  unlikeCar(carId: string): void {
    this.userService.unlikeCar(carId).subscribe({
      next: () => {
        // Remove the car from the list
        this.likedCars = this.likedCars.filter(car => car._id !== carId);
      },
      error: (err) => {
        console.error('Error unliking car:', err);
      }
    });
  }

  // Helper method to handle image loading errors
  handleImageError(car: Car): void {
    console.error('Image failed to load:', car.imageUrl);
    
    // If the image URL contains an S3 URL, try to refresh it
    if (car.imageUrl && car.imageUrl.includes('s3')) {
      console.log('S3 image URL failed to load:', car.imageUrl);
      
      // Extract the s3Key from the URL if available
      const s3KeyMatch = car.imageUrl.match(/car-images\/[^?]+/);
      if (s3KeyMatch && s3KeyMatch[0]) {
        const s3Key = s3KeyMatch[0];
        console.log('Attempting to refresh image URL with key:', s3Key);
        
        // Import the car service to refresh the image URL
        const carService = this.userService['http'].get(`http://localhost:3000/api/v1/upload/refresh?key=${s3Key}`);
        carService.subscribe({
          next: (response: any) => {
            if (response && response.imageUrl) {
              console.log('Image URL refreshed successfully');
              car.imageUrl = response.imageUrl;
              
              // Force the image to reload with the new URL
              setTimeout(() => {
                const img = new Image();
                img.src = response.imageUrl;
              }, 100);
            } else {
              // If no valid response, set to undefined to show "No Image Available"
              car.imageUrl = undefined;
            }
          },
          error: (error) => {
            console.error('Failed to refresh image URL:', error);
            car.imageUrl = undefined; // Reset to show the "No Image Available" placeholder
          }
        });
      } else {
        car.imageUrl = undefined;
      }
    } else {
      car.imageUrl = undefined;
    }
  }
}
