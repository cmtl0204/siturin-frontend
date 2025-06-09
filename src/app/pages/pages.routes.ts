import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';

export default [{ path: MY_ROUTES.corePages.base, loadChildren: () => import('./core/core.routes') }] as Routes;
