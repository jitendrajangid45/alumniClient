
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() currentPage: number;
  @Input() totalPages: number;
  @Input() pagesToShow: number = 5; // Number of page links to display at a time

  @Output() pageChanged = new EventEmitter<number>();

  get pages(): number[] {
    const startPage = Math.max(
      1,
      this.currentPage - Math.floor(this.pagesToShow / 2)
    );
  
    const endPage = Math.min(this.totalPages, startPage + this.pagesToShow - 1); 

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }

  navigateToPage(page: number | string) {
    if (page === 'previous' && this.currentPage > 1) {
      this.pageChanged.emit(this.currentPage - 1);
    } else if (page === 'next' && this.currentPage < this.totalPages) {
      this.pageChanged.emit(this.currentPage + 1);
    } else if (typeof page === 'number') {
      this.pageChanged.emit(page);
    }
  }
}
