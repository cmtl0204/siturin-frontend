export interface HeaderRegulation {
    classification?: string;
    definition: string;
    alert?: string;
    codeClassification: string;
}

export interface Item {
    label: string;
    person: 'natural' | 'juridica' | 'ambos';
}
