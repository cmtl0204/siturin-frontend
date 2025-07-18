import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { SimulatorComponent } from '@modules/core/shared/simulator/simulator.component';

export default [
    {
        path: MY_ROUTES.corePages.shared.simulator.base,
        component: SimulatorComponent
    }
] as Routes;
