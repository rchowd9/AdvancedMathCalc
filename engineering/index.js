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
    formulas: ['bendingstress', 'bearingcapacity', 'manning', 'runoff', 'culvertflow'],
  },
  {
    id: 'mechanical',
    name: 'Mechanical Engineering',
    source: './mechanical.js',
    focus: 'Mechanics, machines, materials, and thermal systems',
    formulas: ['stress', 'beamdeflection', 'torsion', 'buckling', 'bearinglife'],
  },
  {
    id: 'electrical',
    name: 'Electrical Engineering',
    source: './electrical.js',
    focus: 'Circuits, power, electromagnetics, and signals',
    formulas: ['ohmslaw', 'electricpower', 'impedance', 'resonance', 'threephasepower'],
  },
  {
    id: 'computer',
    name: 'Computer Engineering',
    source: './computer.js',
    focus: 'Computer architecture, networks, and digital systems',
    formulas: ['cpuperformance', 'memorybandwidth', 'shannoncapacity', 'pipelineefficiency', 'speedup'],
  },
  {
    id: 'chemical',
    name: 'Chemical Engineering',
    source: './chemical.js',
    focus: 'Reaction systems, transport, thermodynamics, and process chemistry',
    formulas: ['stoichiometry', 'molarity', 'enthalpy', 'equilibrium', 'arrhenius'],
  },
  {
    id: 'aerospace',
    name: 'Aerospace Engineering',
    source: './aerospace.js',
    focus: 'Flight mechanics, propulsion, aerodynamics, and orbital systems',
    formulas: ['dynamicpressure', 'lift', 'drag', 'thrusttoWeight', 'orbitalvelocity'],
  },
  {
    id: 'biomedical',
    name: 'Biomedical Engineering',
    source: './biomedical.js',
    focus: 'Biological systems, medical devices, biomechanics, and imaging',
    formulas: ['bmi', 'bloodflow', 'poiseuilleflow', 'diffusion', 'dose'],
  },
  {
    id: 'industrial',
    name: 'Industrial Engineering',
    source: './industrial.js',
    focus: 'Operations, quality, reliability, optimization, and production systems',
    formulas: ['taktTime', 'throughput', 'oee', 'economicOrderQuantity', 'sixSigma'],
  },
  {
    id: 'environmental',
    name: 'Environmental Engineering',
    source: './environmental.js',
    focus: 'Water quality, air pollution, waste treatment, and environmental risk',
    formulas: ['decay', 'settlingVelocity', 'removalEfficiency', 'airQualityIndex', 'dilution'],
  },
  {
    id: 'materials',
    name: 'Materials Engineering',
    source: './materials.js',
    focus: 'Material properties, failure, phase behavior, and selection',
    formulas: ['density', 'youngsModulus', 'thermalExpansion', 'fractureStress', 'ruleOfMixtures'],
  },
];

export function getEngineeringRole(roleId) {
  return ENGINEERING_ROLES.find(({ id }) => id === roleId);
}