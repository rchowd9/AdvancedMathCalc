export function taktTime(availableProductionTime, customerDemand) {
  return availableProductionTime / customerDemand;
}

export function throughput(completedUnits, elapsedTime) {
  return completedUnits / elapsedTime;
}

export function oee(availability, performance, quality) {
  return availability * performance * quality;
}

export function economicOrderQuantity(annualDemand, orderCost, holdingCost) {
  return Math.sqrt(2 * annualDemand * orderCost / holdingCost);
}

export function utilization(actualOutput, designCapacity) {
  return actualOutput / designCapacity;
}

export function sixSigmaZScore(specificationLimit, mean, standardDeviation) {
  return (specificationLimit - mean) / standardDeviation;
}

export function cycleTime(workContent, numberOfStations) {
  return workContent / numberOfStations;
}
