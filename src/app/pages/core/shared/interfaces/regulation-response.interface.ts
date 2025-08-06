export interface RegulationResponseInterface {
    category: string;
    items: {
        id: string;
        isCompliant: boolean;
        score: number;
    };
}
