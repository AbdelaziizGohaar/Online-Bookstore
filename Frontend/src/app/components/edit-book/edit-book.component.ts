import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../types/book';

@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-book.component.html',
  styleUrl: './edit-book.component.css'
})
export class EditBookComponent implements OnInit {
  @Input() bookId !: number;
  editBookForm!: FormGroup;
  bookService = inject(BookService);
  imageFile: File | null = null; 
  imageError = false;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute // Inject ActivatedRoute
  ) {}
  ngOnInit() {
    this.editBookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      author: ['', [Validators.required, Validators.minLength(2)]],
      price: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      image: ['']
    });
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.bookId = +id;
        this.loadBookDetails(this.bookId);
      }
    });  }

  loadBookDetails(id: number) {
    this.bookService.getBookDetails(id).subscribe(book => {
      if (book) {
        this.editBookForm.patchValue({
          title: book.title,
          author: book.author,
          price: book.price,
          description: book.description,
          stock: book.stock,
          image: book.image
        });
      }
    });
  }

  onFileSelect(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.imageError = true;
        this.imageFile = null;
        return;
      }

      this.imageError = false;
      this.imageFile = file;
      this.editBookForm.patchValue({ image: file });
    }
  }

  updateBook() {
    if (this.editBookForm.invalid) return;

    const bookData = new FormData();

    bookData.append('title', this.editBookForm.value.title);    
    bookData.append('author', this.editBookForm.value.author);
    bookData.append('price', this.editBookForm.value.price);
    bookData.append('description', this.editBookForm.value.description);
    bookData.append('stock', this.editBookForm.value.stock);
    
    if (this.imageFile) {
      bookData.append('image', this.imageFile);
    }
    this.bookService.updateBook(this.bookId, bookData).subscribe((res) => {
      if (res.error) {
        return alert(res.error);
      }
      alert('Book Updated Successfully');
      console.log(res);
      this.imageFile = null;
      this.editBookForm.reset();
      this.router.navigate(['/admin-dashboard']);

    });
  }

  goBack() {
    this.router.navigate(['/admin-dashboard']);
  }
}
