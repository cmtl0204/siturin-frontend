export type ColumnType = 'object' | 'date' | 'number' | 'string' | 'boolean';

export interface ColInterface {
    field: string;
    header: string;
    type?: ColumnType;
    objectName?: string;
}
