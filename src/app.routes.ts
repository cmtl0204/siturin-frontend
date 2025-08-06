import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { AppLayoutMain } from '@layout/component/app.layout-main';
import { AppLayoutBlank } from '@layout/component/app.layout-blank';
import { AppLayoutAuth } from '@layout/component/app.layout-auth';
import { tokenGuard } from '@/guards/token.guard';

export const appRoutes: Routes = [
    {
        path: 'main',
        component: AppLayoutMain,
        canActivate: [tokenGuard],
        children: [
            { path: MY_ROUTES.dashboards.base, loadChildren: () => import('./app/pages/dashboards/dashboard.routes') },
            { path: MY_ROUTES.corePages.base, loadChildren: () => import('./app/pages/core/core.routes') },
        ]
    },

    {
        path: MY_ROUTES.errorPages.base,
        component: AppLayoutBlank,
        children: [{ path: '', loadChildren: () => import('./app/layout/errors/errors.routes') }]
    },

    {
        path: MY_ROUTES.authPages.base,
        component: AppLayoutAuth,
        children: [{ path: '', loadChildren: () => import('./app/pages/auth/auth.routes') }]
    },

    { path: '', redirectTo: '/main/dashboards', pathMatch: 'full' },

    { path: '**', redirectTo: MY_ROUTES.errorPages.notFound.absolute }
];
