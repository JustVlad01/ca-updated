import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car } from './car.service';

export interface User {
  _id: string;
  email: string;
  role: string;
  likedCars?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/v1/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Like a car
  likeCar(carId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/like/${carId}`, {});
  }

  // Unlike a car
  unlikeCar(carId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/like/${carId}`);
  }

  // Get liked cars
  getLikedCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/liked-cars`);
  }

  // Check if a car is liked
  isCarLiked(carId: string, likedCars: string[]): boolean {
    return likedCars.includes(carId);
  }
}
