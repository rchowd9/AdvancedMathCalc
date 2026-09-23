/**
 * Engineering discipline registry.
 *
 * The existing formula implementations remain available from their legacy
 * root-level files. This registry gives consumers one place to discover all
 * engineering roles and their supported formula families.
 */
export const ENGINEERING_ROLES = [
  {
    id: 'civil',
    name: 'Civil Engineering',
    source: './civil.js',
    focus: 'Structures, geotechnics, transportation, and water systems',
    functions: ['bendingStress', 'shearStress', 'bearingCapacity', 'manningVelocity', 'runoff', 'culvertFlow'],
  },
  {
    id: 'mechanical',
    name: 'Mechanical Engineering',
    source: './mechanical.js',
    focus: 'Mechanics, machines, materials, and thermal systems',
    functions: ['stress', 'strain', 'youngsModulus', 'torsionStress', 'beamDeflection', 'bucklingLoad', 'kineticEnergy', 'shaftTorque'],
  },
  {
    id: 'electrical',
    name: 'Electrical Engineering',
    source: './electrical.js',
    focus: 'Circuits, power, electromagnetics, and signals',
    functions: ['ohmsLaw', 'electricPower', 'resistance', 'capacitance', 'inductiveReactance', 'impedance', 'threePhasePower', 'magneticFlux'],
  },
  {
    id: 'computer',
    name: 'Computer Engineering',
    source: './computer.js',
    focus: 'Computer architecture, networks, and digital systems',
    functions: ['cpuPerformance', 'amdahlSpeedup', 'memoryBandwidth', 'networkThroughput', 'shannonCapacity', 'pipelineEfficiency', 'processorUtilization'],
  },
  {
    id: 'chemical',
    name: 'Chemical Engineering',
    source: './chemical.js',
    focus: 'Reaction systems, transport, thermodynamics, and process chemistry',
    functions: ['molarity', 'idealGasPressure', 'enthalpyChange', 'gibbsFreeEnergy', 'reactionRate', 'arrhenius', 'dilution'],
  },
  {
    id: 'aerospace',
    name: 'Aerospace Engineering',
    source: './aerospace.js',
    focus: 'Flight mechanics, propulsion, aerodynamics, and orbital systems',
    functions: ['dynamicPressure', 'lift', 'drag', 'thrustToWeight', 'rocketDeltaV', 'orbitalVelocity', 'machNumber'],
  },
  {
    id: 'biomedical',
    name: 'Biomedical Engineering',
    source: './biomedical.js',
    focus: 'Biological systems, medical devices, biomechanics, and imaging',
    functions: ['bmi', 'bloodFlow', 'poiseuilleFlow', 'diffusionFlux', 'drugDose', 'oxygenDelivery', 'biomedicalStress'],
  },
  {
    id: 'industrial',
    name: 'Industrial Engineering',
    source: './industrial.js',
    focus: 'Operations, quality, reliability, optimization, and production systems',
    functions: ['taktTime', 'throughput', 'oee', 'economicOrderQuantity', 'utilization', 'sixSigmaZScore', 'cycleTime'],
  },
  {
    id: 'environmental',
    name: 'Environmental Engineering',
    source: './environmental.js',
    focus: 'Water quality, air pollution, waste treatment, and environmental risk',
    functions: ['firstOrderDecay', 'removalEfficiency', 'settlingVelocity', 'dilution', 'detentionTime', 'massBalance', 'airQualityIndex'],
  },
  {
    id: 'materials',
    name: 'Materials Engineering',
    source: './materials.js',
    focus: 'Material properties, failure, phase behavior, and selection',
    functions: ['density', 'youngsModulus', 'thermalExpansion', 'fractureStress', 'ruleOfMixtures', 'hardnessConversion', 'diffusionLength'],
  },
];

export function getEngineeringRole(roleId) {
  return ENGINEERING_ROLES.find(({ id }) => id === roleId);
}