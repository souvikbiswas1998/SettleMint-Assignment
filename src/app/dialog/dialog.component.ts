import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { DataService } from '../data.service';
import { Router, RouterModule } from '@angular/router';
import data from '../../assets/data.json'
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  standalone: true,
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  imports: [CommonModule, RouterModule, FormsModule, MatButtonModule, MatSelectModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatIconModule,
    MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatCardModule
  ],
  providers: [provideNativeDateAdapter()],
})
export class DialogComponent {
  formGroup!: FormGroup<any>;
  allStatus: string[] = ['To Do', 'In Progress', 'Complete'];
  priorities: string[] = ['High', 'Medium', 'Low'];
  id!: string
  status: string = '';

  constructor(private dataService: DataService, public router: Router,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialog_data: any
  ) {
    if (dialog_data?.id) this.id = dialog_data.id;
    if (dialog_data?.data) this.initialForm(dialog_data?.data)
    else this.initialForm(data.find((task: any) => task.id == +dialog_data.id))
  }

  initialForm(data?: any) {
    this.status = data?.status || 'To Do'
    this.formGroup = new FormGroup({
      status: new FormControl(this.status, Validators.required),
      priority: new FormControl(data?.priority || 'Medium', Validators.required),
      dueDate: new FormControl(data?.dueDate || '', Validators.required),
      taskName: new FormControl(data?.taskName || '', Validators.required),
      taskDescription: new FormControl(data?.taskDescription || '', Validators.required)
    });
  }

  saveFormData() {
    if (this.formGroup.invalid) return this.dataService.showSnackbar('all the form fields are reuired');
    let data2 = this.formGroup.value;
    data2.id = this.id || +new Date()
    if (this.id) {
      let index = data.findIndex((task: any) => task.id == +this.id)
      data[index] = data2;
      this.dataService.createtask(undefined)
    }
    else this.dataService.createtask(data2)
    this.router.navigate(['dashboard']);
    this.dialogRef.close();
  }

  colapseOrExpand(colapse: boolean = true) {
    this.dialogRef.close();
    if (colapse) this.router.navigate([".."], { state: { data: this.formGroup.value } });
    else this.router.navigate([this.dialog_data?.id ? ('/task/' + this.dialog_data?.id) : '/create-task'], { state: { data: this.formGroup.value } })
  }

  setDisable(arg0: string): boolean {
    let status = false;
    switch (this.status) {
      case 'To Do':
        status = !(arg0 !== 'Complete')
        break;
      case 'In Progress':
        status = false
        break;
      case 'Complete':
        status = !(arg0 !== 'In Progress')
        break;
      default:
        status = false
        break;
    }
    return status
  }
}
