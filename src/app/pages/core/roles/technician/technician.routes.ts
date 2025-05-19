import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { TechnicianDashboardComponent } from '@modules/core/roles/technician/technician-dashboard/technician-dashboard.component';

export default [
    {
        path: MY_ROUTES.corePages.technician.dashboard.base,
        component: TechnicianDashboardComponent
    }
] as Routes;
