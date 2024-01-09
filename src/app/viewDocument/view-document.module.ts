import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewDocumentComponent } from './view-document.component';

@NgModule({
  declarations: [ViewDocumentComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule,],
  exports: [ViewDocumentComponent],
})
export class DemoModule {}
