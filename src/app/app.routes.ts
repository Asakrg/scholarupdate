import { Routes } from '@angular/router';
import { HomeComponent } from './public/home';
import { DetailsComponent } from './public/details';
import { CategoriesComponent } from './public/categories';
import { ResourcesComponent } from './public/resources';
import { AboutComponent } from './public/about';
import { ContactComponent } from './public/contact';
import { PrivacyComponent } from './public/privacy';
import { AdminLoginComponent } from './admin/login';
import { AdminCMSComponent } from './admin/cms';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'ScholarshipHub | Premium Academic Opportunities'
  },
  {
    path: 'scholarship/:id',
    component: DetailsComponent,
    title: 'Scholarship Details | ScholarshipHub'
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    title: 'Academic Classification & Metadata | ScholarshipHub'
  },
  {
    path: 'resources',
    component: ResourcesComponent,
    title: 'Scholarship Resources, Guides & FAQs | ScholarshipHub'
  },
  {
    path: 'resources/:id',
    component: ResourcesComponent,
    title: 'Resource Guide | ScholarshipHub'
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'About Us | ScholarshipHub'
  },
  {
    path: 'contact',
    component: ContactComponent,
    title: 'Contact Us | ScholarshipHub'
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
    title: 'Privacy Policy | ScholarshipHub'
  },
  {
    path: 'adm/auth',
    component: AdminLoginComponent,
    title: 'CMS Admin Portal Sign In | ScholarshipHub'
  },
  {
    path: 'adm',
    component: AdminCMSComponent,
    title: 'Academic CMS Workspace Dashboard | ScholarshipHub'
  },
  {
    path: 'admin/login',
    redirectTo: ''
  },
  {
    path: 'admin',
    redirectTo: ''
  },
  {
    path: '**',
    redirectTo: ''
  }
];
