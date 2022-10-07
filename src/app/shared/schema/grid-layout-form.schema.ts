import {
    RxJsonSchema,
    toTypedRxJsonSchema,
    ExtractDocumentTypeFromTypedRxJsonSchema
} from 'rxdb';

export const GRID_LAYOUT_FORM_SCHEMA_LITERAL = {
    title: 'grid layout form schema',
    description: 'describes for the grid layout form',
    version: 0,
    keyCompression: false,
    primaryKey: 'name',
    type: 'object',
    properties: {
        name: {
            type: 'string',
            maxLength: 100
        },
        layoutConfig: {
            type: 'string',
        }
    },
    required: [
        'name',
        'layoutConfig',
    ]
} as const;

//**schema type
const schemaTyped = toTypedRxJsonSchema(GRID_LAYOUT_FORM_SCHEMA_LITERAL);
//**Document type
export type RxGridLayoutFormDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;
export const GRID_LAYOUT_FORM_SCHEMA: RxJsonSchema<RxGridLayoutFormDocType> = GRID_LAYOUT_FORM_SCHEMA_LITERAL;
