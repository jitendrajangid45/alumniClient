import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { ResponseType, IAlumnus } from 'src/app/types/auth.type';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'src/app/pagination/pagination.module';
@Component({
  selector: 'app-alumni',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationModule],
  templateUrl: './alumni.component.html',
  styleUrls: ['./alumni.component.scss']
})
export class AlumniComponent implements OnInit {
  // injecting services in component
  apiService:ApiService = inject(ApiService);
  alumnus:IAlumnus[] = [];
  totalItems: number = 0;
  limit = 8;
  currentPage = 1;
  filterText: string = '';
  // Calculate the total number of pages for pagination
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.limit);
  }
  ngOnInit() {
    this.getAlumnus(this.currentPage,this.filterText);
  }
  // loading alumnus
  getAlumnus(currentPage, searchText){
    this.apiService.getApi(`/alumnus?currentPage=${currentPage}&searchText=${searchText}`).subscribe((resp:ResponseType<{alumnus:IAlumnus[],totalCount:number}>)=>{
      if(resp.status === 200){
        
        this.alumnus=resp.data.alumnus;
        this.totalItems=resp.data.totalCount;
      }else {
        this.alumnus = [];
        this.totalItems = 1;
      }
    })
  }
  // Function to handle page change event
  onPageChanged(newPage:number) {
    this.currentPage = newPage;
    if (this.filterText === undefined) {
      this.filterText = '';
    }
    this.getAlumnus(this.currentPage,this.filterText);
  }
  // searching alumni using email and name
  searchAlumni(){
    this.currentPage = 1;
    this.getAlumnus(this.currentPage,this.filterText)
  }
  // verify user by admin
  verifyUser(id) {
    this.apiService.putApi(`/alumnus/verifyUserByAdmin`,{userId:id}).subscribe((resp:any)=>{
      if(resp.status === 200){
        alert('user successfully verified')
        this.getAlumnus(this.currentPage,this.filterText);
      }else {
        alert('something went wrong')
      }
    })
  }
}