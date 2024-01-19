import { Component, Directive } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: '[appLinker]',
  standalone: true,
  template: ''
})
export class LinkerComponent {

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private router: Router) {
    const dialogRef = this.dialog.open(DialogComponent, {
      minHeight: '100vh',
      minWidth: '100vw',
      data: { id: this.route.snapshot.params['id'], isOpenInDialog: false, data: this.router.getCurrentNavigation()?.extras?.state?.['data'] },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}
