import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'face-match-demo';
  menu: {path: string, label: string}[] = [
    {
      label: 'List',
      path: 'face'
    },
    {
      label: 'Match',
      path: 'match'
    },
    {
      label: 'Peeking detector',
      path: 'yaw'
    }
  ]

  constructor() {}
}
