import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'weather',
        loadChildren: () => import('../weather/weather.module').then(m => m.WeatherPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule)
      },
      {
        path: 'about',
        loadChildren: () => import('../about/about.module').then(m => m.AboutPageModule)
      },
      {
        path: '',
        redirectTo: '/weather',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/weather',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
