import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ViewOtherProfileComponent } from './view-other-profile.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes:Routes=[{
    path:'viewProfile',
    component:ViewOtherProfileComponent
}]
@NgModule({
    declarations:[ViewOtherProfileComponent],
    imports:[HttpClientModule,CommonModule,FormsModule,ReactiveFormsModule,RouterModule.forChild(routes)],
    exports:[ViewOtherProfileComponent]
})

export class ViewOtherProfileModule {}