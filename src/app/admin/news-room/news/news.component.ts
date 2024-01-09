import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from  'primeng/dynamicdialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  providers: [ConfirmationService, MessageService,DialogService]
})
export class NewsComponent implements OnInit {
  news: any[] = [];
  totalCount: number;
  limit = 8;
  currentPage = 1;
  filterText: string;
  searchInput: string;

  constructor(
    private api: ApiService, 
    private router: Router, 
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    public dialogService:DialogService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getAllNews('',1);
  }

  getAllNews(searchText: string, page: number) {
    this.api.getApi(`/news/getAllNews?searchText=${searchText}&page=${page}`).subscribe((response: any) => {
        this.news = response.data.newsData; // Update this line
        this.totalCount = response.data.totalCount;
    });
  }
  

  fetchNews(): void {
    
  }

  createNews(newsData: any): void {
    this.api.postApi('/news/createNews', newsData).subscribe((response: any) => {
    });
  }

  updateNews(newsData: any): void {
    this.api.putApi('/news/updateNews', newsData).subscribe((response: any) => {
    });
  }

  deleteNews(newsId: number): void {
    this.api.deleteApi(`/news/deleteNews?newsId=${newsId}`).subscribe((response: any) => {
      if (response.status === 200) {
        this.ngOnInit();
        // News item deleted successfully, update the news list
        this.fetchNews();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record deleted successfully' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete record' });
      }
    });
  }

  confirmDelete(singleNews: any): void {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.deleteNews(singleNews.newsId);
      },
      reject: () => {

      }
    });
  }

  edit(data){
    const queryParams={
      query:data
    }
    this.router.navigate(['admin','add-news'],{queryParams})
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  // Calculate the total number of pages for pagination
  get totalPages(): number {
    return Math.ceil(this.totalCount / this.limit);
  }

  onPageChanged(newPage: number) {
    this.currentPage = newPage;
    if (this.filterText === undefined) {
      this.filterText = '';
    }
    this.getAllNews(this.filterText, this.currentPage);
  }

  searchNews(): void {
    // Call the getAllNews method with the search input and current page
    this.getAllNews(this.searchInput, this.currentPage);
  }
    
}
