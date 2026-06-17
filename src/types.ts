/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MechanicalCheck {
  id: number;
  name: string;
  thaiLabel: string;
  status: 'PASS' | 'FAIL';
  comments: string;
}

export interface EquipmentRow {
  rowId: string;
  equipmentId: string;
  visualStatus: 'Normal' | 'Damaged';
  crackStatus: 'No Cracks' | 'Cracks Found';
  base64File: string;
  fileName: string;
  driveLink: string;
}

export interface InspectionReport {
  timestamp: string;
  operatorName: string;
  reviewerName: string;
  machineId: string;
  mechanicalChecks: MechanicalCheck[];
  sid: number;
  errorX: number;
  errorY: number;
  alignmentResult: 'PASS' | 'FAIL';
  protectionGear: {
    equipmentId: string;
    visualStatus: 'Normal' | 'Damaged';
    crackStatus: 'No Cracks' | 'Cracks Found';
    fileName?: string;
    imageUrl?: string;
  }[];
  operatorSignature: string;
  reviewerSignature: string;
  suggestions: string;
  collimatorLinks?: string[];
}
