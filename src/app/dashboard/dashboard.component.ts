import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, formatDate } from '@angular/common';
import { DataService } from '../data.service';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MatIconModule } from '@angular/material/icon';
import data from '../../assets/data.json';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule, DragDropModule, MatFormFieldModule, MatButtonModule,
        MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule, MatIconModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
    bgcolor = 'lightyellow';
    format = (value: string) => formatDate(value, 'MMM dd, YYYY', this.locale)
    format2 = (value: string) => formatDate(value, 'dd/MM/YYYY HH:MM', this.locale)
    localData: any = data;
    formGroup!: FormGroup;

    allStatus: string[] = ['To Do', 'In Progress', 'Complete'];
    priorities: string[] = ['High', 'Medium', 'Low'];

    toDoList: any = [];
    inProgressList: any = [];
    completeList: any = [];
    constructor(@Inject(LOCALE_ID) public locale: string, private dataService: DataService, public dialog: MatDialog, private router: Router) {
        // console.log(this.router.getCurrentNavigation()?.extras?.state);
        let extra = this.router.getCurrentNavigation()?.extras?.state;
        if (extra) this.openDialog(extra?.['id'], extra?.['data'])
    }
    ngOnDestroy(): void {
    }
    setData() {
        this.toDoList = this.localData?.filter((e: any) => e.status == 'To Do');
        this.inProgressList = this.localData?.filter((e: any) => e.status == 'In Progress');
        this.completeList = this.localData?.filter((e: any) => e.status == 'Complete');
    }

    ngOnInit(): void {
        this.reset();
        this.setData()
        this.dataService.$taskDatas.subscribe(() => {
            this.localData = data
            this.setData()
        })
    }

    // see https://stackoverflow.com/questions/53144939/angular-cdk-connecting-multiple-drop-zones-with-cdkdroplistconnectedto
    delete(id: any) {
        if (confirm("Are you sure?") == true) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === id) data.splice(i, 1);
            }
            this.localData = data;
            this.setData();
            this.dataService.showSnackbar("Task Deleted Successfully")
        } else {
            this.dataService.showSnackbar("Task not Deleted")
        }
    }


    drop(event: any) {
        // console.log(event.item.data);
        // console.log(event.container.id);
        if (event?.item?.data) {
            event.item.data.status = event.container.id;
            event.item.data.lastUpdated = new Date();
        }
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
    }

    getDraggedItem1(item: any) {
        return true
    }
    getDraggedItem2(item: any) {
        return item.data.status !== 'Complete'
    }
    getDraggedItem3(item: any) {
        return item.data.status !== 'To Do'
    }

    onEntered(enter: any) {
        console.log('ee', enter);
    }


    filterData(reset = false) {
        if (reset) this.reset();
        this.localData = data;
        let filter: any = this.formGroup.value;
        if (filter.dueDate) filter.dueDate.setHours(23, 59, 59)
        Object.keys(filter).forEach(key => {
            if (filter[key] !== null && filter[key] !== '') {
                if (key !== 'dueDate')
                    this.localData = this.localData.filter((each: any) => each[key] === filter[key])
                else
                    this.localData = data.filter((each: any) => new Date(each.dueDate) < filter.dueDate)
            }
        });
        this.setData();
    }

    reset() {
        this.formGroup = new FormGroup({
            status: new FormControl(''),
            priority: new FormControl(''),
            dueDate: new FormControl(''),
        });
    }

    openDialog(id?: any, data?: any) {
        const dialogRef = this.dialog.open(DialogComponent, {
            height: '75%',
            width: '66%',
            maxWidth: '600px',
            data: { id: id, isOpenInDialog: true, data: data },
        });

        // dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed');
        // });
    }
}
