import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


const MATERIAL_MODULES = [
  MatTableModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatTooltipModule,
  MatDividerModule,
  MatProgressSpinnerModule,
  MatFormFieldModule,
  MatInputModule
];


const COMMON_MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule
];


@NgModule({
  imports: [...COMMON_MODULES, ...MATERIAL_MODULES],
  exports: [...COMMON_MODULES, ...MATERIAL_MODULES]
})
export class SharedModule { }
