import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Output,
} from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';

import { TabContentComponent } from '../tab-content/tab-content.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
  imports: [NgForOf, NgClass],
  standalone: true
})
export class TabsComponent implements AfterContentInit {
  @Output() onRemoveTab = new EventEmitter<string>();

  @ContentChildren(TabContentComponent) tabs;

  private tabsLength: number = 0;

  public ngAfterContentInit() {
    // first initialization
    if (this.tabs) {
      this.selectTab(this.tabs.first);
      this.tabsLength = this.tabs.length;
    }

    this.tabs.changes.subscribe(() => {
      if (this.tabs.length > this.tabsLength) {
        this.selectTab(this.tabs.last);
      }

      this.tabsLength = this.tabs.length;
    });
  }

  protected selectTab(tab: TabContentComponent): void {
    if (tab) {
      Promise.resolve().then(() => {
        this.tabs.forEach(tab => tab.isActive = false);
        tab.isActive = true;
      });
    }
  }

  protected removeTab(id: string): void {
    this.tabs = this.tabs.filter((tab) => tab.id !== id);

    if (this.tabs.every((tab) => !tab.isActive)) {
      this.selectTab(this.tabs[0]);
    }

    this.tabsLength--;
    this.onRemoveTab.emit(id);
  }
}
