import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.html',
})
export class NotFound {
  location = inject(Location);

  goBack() {
    this.location.back();
  }
}
