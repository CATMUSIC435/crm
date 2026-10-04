export type GisLayerCategory = 'TRANSPORT' | 'AIRPORT' | 'PLANNING' | 'HEATMAP' | 'ENVIRONMENT';

export class GisLayerEntity {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly name: string,
    public readonly category: GisLayerCategory,
    public readonly color: string,
    public readonly badge: string,
    public readonly geoJson: any,
  ) {}
}

export interface ZoningMasterplanDetail {
  projectId: string;
  projectName: string;
  decisionNumber: string;
  approvalDate: string;
  issuingAuthority: string;
  scale: string;
  buildingDensity: string;
  greenAndAmenityRatio: string;
  farCoefficient: string;
  maxFloors: string;
  legalStatus: string;
  landUseTerm: string;
  infrastructureHighlights: string[];
  zoningClassification: string;
}
