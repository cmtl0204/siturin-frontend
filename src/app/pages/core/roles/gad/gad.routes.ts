import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { GadDashboardComponent } from '@modules/core/roles/gad/gad-dashboard/gad-dashboard.component';

export default [{ path: MY_ROUTES.corePages.gad.dashboard.base, component: GadDashboardComponent }] as Routes;
