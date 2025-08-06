import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { SpecialistDashboardComponent } from '@modules/core/roles/specialist/specialist-dashboard/specialist-dashboard.component';

export default [
    {
        path: MY_ROUTES.corePages.specialist.dashboard.base,
        component: SpecialistDashboardComponent
    }
] as Routes;
