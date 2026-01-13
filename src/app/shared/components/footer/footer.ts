import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [DatePipe],
  templateUrl: './footer.html',
})
export class Footer {
  customDate= signal(new Date());
}
