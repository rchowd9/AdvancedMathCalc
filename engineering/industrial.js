export const INDUSTRIAL_ENGINEERING = {
  id: 'industrial',
  name: 'Industrial Engineering',
  formulas: {
    taktTime: 'availableProductionTime / customerDemand',
    throughput: 'completedUnits / elapsedTime',
    oee: 'availability * performance * quality',
    economicOrderQuantity: 'sqrt(2 * annualDemand * orderCost / holdingCost)',
    utilization: 'actualOutput / designCapacity',
    sixSigmaZScore: '(specificationLimit - mean) / standardDeviation',
    cycleTime: 'workContent / numberOfStations',
  },
};
