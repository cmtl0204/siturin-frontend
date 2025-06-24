import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { RoleListComponent } from '@modules/core/admin/roles/role-list/role-list.component';
// import { ManagerDashboardComponent } from '@modules/core/manager/manager-dashboard/manager-dashboard.component';
// import { ProjectComponent } from '@modules/core/manager/project/project.component';

export default [
    {
        path: MY_ROUTES.corePages.admin.roles.base,
        children: [
        {
            path: MY_ROUTES.corePages.admin.roles.list.base,
            component: RoleListComponent
        }
        ]
    }
    // { path: MY_ROUTES.corePages.manager.dashboard.base, component: ManagerDashboardComponent },
    // { path: MY_ROUTES.corePages.manager.project.base, component: ProjectComponent },
] as Routes;
