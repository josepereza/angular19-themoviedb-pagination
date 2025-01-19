import {
  Component,
  signal,
  computed,
  effect,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MovieService } from './movie.service';
import { Movie } from './movie';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Movie Search App</span>
    </mat-toolbar>

    <div #goUp class="container">
      <mat-form-field class="search-field">
        <mat-label>Search Movies</mat-label>
        <input
          matInput
          type="text"
          [(ngModel)]="searchQuery"
          (keyup.enter)="search()"
        />
      </mat-form-field>

      <button mat-raised-button color="primary" (click)="page = 1; search()">
        Search
      </button>
      <button
        mat-raised-button
        color="primary"
        (click)="page = 1; getsearchTrending()"
        style="margin-left: 20px;"
      >
        Trending
      </button>

      @if (loading()) {
      <mat-spinner></mat-spinner>
      }

      <div class="movies-grid">
        @for (movie of movies(); track movie.id) {
        <mat-card class="movie-card">
          @if (movie.poster_path) {
             @defer (on viewport){
          <img
            mat-card-image
            [src]="'https://image.tmdb.org/t/p/w500' + movie.poster_path"
            [alt]="movie.title"
          />
          } @placeholder {
          <div>Large component placeholder</div>
          } }
          <mat-card-content style="color:black">
            <h2>{{ movie.title }}</h2>
            <p class="rating">Rating: {{ movie.vote_average }}/10</p>
            <p class="overview">{{ movie.overview }}</p>
            <p class="release-date">Release Date: {{ movie.release_date }}</p>
          </mat-card-content>
        </mat-card>
        }
      </div>

      <button
        mat-raised-button
        color="primary"
        (click)="atras()"
        style="margin-left: 20px;"
      >
        Atras
      </button>
      <button
        mat-raised-button
        color="primary"
        (click)="siguiente()"
        style="margin-left: 20px;"
      >
        Siguiente
      </button>
    </div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .search-field {
        width: 100%;
        max-width: 500px;
        margin-right: 16px;
      }

      .movies-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }

      .movie-card {
        height: 100%;
      }

      .movie-card img {
        height: 450px;
        object-fit: cover;
      }

      .overview {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }

      .rating {
        color: #f5c518;
        font-weight: bold;
      }

      mat-spinner {
        margin: 20px auto;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  @ViewChild('goUp', { static: true }) contentPage!: ElementRef;

  page = 1;
  totalPage = 1;
  controlSearch = false;

  siguiente() {
    this.contentPage.nativeElement.scrollIntoView();
    if (this.totalPage > 1) {
      this.page++;
    } else {
      this.page = 1;
    }

    if (this.controlSearch) {
      this.search();
    } else {
      this.getsearchTrending();
    }
  }
  atras() {
    this.contentPage.nativeElement.scrollIntoView();
    if (this.page > 1) {
      this.page--;
    } else {
      this.page = 1;
    }

    if (this.controlSearch) {
      this.search();
    } else {
      this.getsearchTrending();
    }
  }
  ngOnInit(): void {
    this.getsearchTrending();
  }
  private movieService = inject(MovieService);

  searchQuery = '';
  movies = signal<Movie[]>([]);
  loading = signal(false);

  search() {
    this.controlSearch = true;
    if (this.searchQuery.trim()) {
      this.loading.set(true);
      this.movieService.searchMovies(this.searchQuery, this.page).subscribe({
        next: (response) => {
          this.movies.set(response.results);
          this.loading.set(false);
          this.totalPage = response.total_pages;
        },
        error: (error) => {
          console.error('Error fetching movies:', error);
          this.loading.set(false);
        },
      });
    } else {
      this.getsearchTrending();
    }
  }
  getsearchTrending() {
    this.controlSearch = false;
    this.movieService.searchTrending(this.page).subscribe((data) => {
      this.movies.set(data.results);
      this.totalPage = data.total_pages;
    });
  }
}
