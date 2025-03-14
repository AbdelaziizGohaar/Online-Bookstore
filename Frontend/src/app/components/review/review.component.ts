import { Component, Input, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Review } from '../../types/review';
import { ReviewsService } from '../../services/reviews.service';
import { HttpParams } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-review',
  imports: [],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent implements OnInit{
  @Input() bookId!: number;
  //bookId: number = 21; // Replace with actual book ID

  reviewService = inject(ReviewsService);
  router = inject(Router);

  reviews : Review[] = [];

  constructor(){
    console.log("Inside ReviewComponent");

  }

  ngOnInit(): void {
    this.fetchReviews();
  }

  fetchReviews(): void {
    this.reviewService.getReviews(this.bookId).subscribe({
      next: (data) => {
        console.log("Fetched reviews:", data);

        this.reviews = data.map(review => ({
          ...review,
          updatedAt: new Date(review.updatedAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        }));
      },
      error: (error) => {
        console.error('Error fetching reviews:', error);
      }
    });
  }



}
