import { CatalogueInterface } from '@utils/interfaces';

export interface CreateRatifiedInspectionStateInterface {
    cadastreId: string;
    processId: string;
    state: CatalogueInterface;
}

export interface InactivationInspectionStatusInterface {
    cadastreId: string;
    processId: string;
    state: {
        id: string;
        code: string;
    };
  /* causeInactivationType: {
        id: string;
        code: string;
    }; */
    inactivationCauses: {
        code: string;
        name: string;
    }[];
}

export interface TemporarySuspensionInspectionStatusInterface {
    cadastreId: string;
    processId: string;
    state: {
        id: string;
        code: string;
    };
    breachCauses: {
        code: string;
        name: string;
    }[];
}

export interface RecategorizedInspectionStatusInterface {
    cadastreId: string;
    processId: string;
    state: {
        id: string;
        code: string;
    };
    category: {
        id: string;
        code: string;
    };
}

export interface ReclassifiedInspectionStatusInterface {
    cadastreId: string;
    processId: string;
    state: {
        id: string;
        code: string;
    };
    classification: {
        id: string;
        code: string;
    };
    category: {
        id: string;
        code: string;
    };
}





