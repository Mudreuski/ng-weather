import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-tab-content',
  templateUrl: './tab-content.component.html',
  imports: [NgIf],
  standalone: true
})
export class TabContentComponent {
  @Input({ required: true }) title: string;
  @Input({ required: true }) id: string;

  public isActive: boolean = false;
}
