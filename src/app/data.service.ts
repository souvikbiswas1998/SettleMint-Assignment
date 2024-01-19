import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import data from '../assets/data.json'
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  subject: Subject<any> = new Subject()
  $taskDatas: Observable<any[]> = this.subject.asObservable()
  constructor(private snackBar: MatSnackBar) {
    this.$taskDatas.subscribe((data2: any) => {
      if (data2) data.push(data2)
    })
  }

  createtask(taskData: any) {
    console.log(taskData);
    this.subject.next(taskData) //current value emitted
  }

  getAllTask() {
    return this.$taskDatas; // Return the observable for external use
  }

  showSnackbar(message: string, action: string = "Dismiss") {
    this.snackBar.open(message, action, { duration: 3000 })
  }
}
