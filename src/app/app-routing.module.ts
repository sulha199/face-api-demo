import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaceListComponent } from './containers/face-list/face-list.component';
import { FaceMatchComponent } from './containers/face-match/face-match.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'face'
  },
  {
    path: 'face',
    component: FaceListComponent
  },
  {
    path: 'match',
    component: FaceMatchComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
