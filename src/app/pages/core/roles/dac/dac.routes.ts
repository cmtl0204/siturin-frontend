import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { DacDashboardComponent } from '@modules/core/roles/dac/dac-dashboard/dac-dashboard.component';

export default [{ path: MY_ROUTES.corePages.dac.dashboard.base, component: DacDashboardComponent }] as Routes;
