import { Component, inject } from '@angular/core';
import { BookService } from '../../services/book.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-book.component.html',
  styleUrl: './add-book.component.css'
})
export class AddBookComponent {
  bookForm: FormGroup;
  bookService = inject(BookService);
  imageFile: File | null = null; 
  imageError: boolean = false;   

  constructor(private fb: FormBuilder, private router: Router) {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      author: ['', [Validators.required, Validators.minLength(2)]],
      price: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      image: [null, Validators.required]  // Image is required
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
      this.bookForm.patchValue({ image: file });
    }
  }

  addBook() {
    if (this.bookForm.invalid || !this.imageFile) {
      this.imageError = true;
      return;
    }

    const formData = new FormData();
    formData.append('title', this.bookForm.value.title);
    formData.append('author', this.bookForm.value.author);
    formData.append('price', this.bookForm.value.price);
    formData.append('description', this.bookForm.value.description);
    formData.append('stock', this.bookForm.value.stock);
    formData.append('image', this.imageFile);

    this.bookService.addBook(formData).subscribe((res) => {
      if (res.error) {
        return alert(res.error);
      }
      alert('Book Added Successfully');
      this.bookForm.reset();
      this.imageFile = null;
      console.log(res);
      this.router.navigate(['/admin-dashboard']);

    });
  }
}
