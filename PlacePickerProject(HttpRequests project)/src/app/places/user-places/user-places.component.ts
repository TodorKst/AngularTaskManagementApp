import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import {Place} from "../place.model";
import {HttpClient} from "@angular/common/http";
import {catchError, throwError} from "rxjs";
import {PlacesService} from "../places.service";

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  private destroyRef = inject(DestroyRef);
  private placesService = inject(PlacesService);

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.placesService.loadUserPlaces()
      .subscribe({
        next: (data) => {
          this.places.set(data.places)
        },
        error: (error: Error) => {
          this.error.set(error.message);
          this.isFetching.set(false);
        },
        complete: () => {
          this.isFetching.set(false);
        }
      });


    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}