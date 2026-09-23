export function cpuPerformance(executionTime) {
  return 1 / executionTime;
}

export function amdahlSpeedup(parallelFraction, parallelSpeedup) {
  return 1 / ((1 - parallelFraction) + parallelFraction / parallelSpeedup);
}

export function memoryBandwidth(transfersPerSecond, bytesPerTransfer) {
  return transfersPerSecond * bytesPerTransfer;
}

export function networkThroughput(dataSize, transferTime) {
  return dataSize / transferTime;
}

export function shannonCapacity(bandwidth, signalToNoise) {
  return bandwidth * Math.log2(1 + signalToNoise);
}

export function pipelineEfficiency(usefulStages, totalStages) {
  return usefulStages / totalStages;
}

export function processorUtilization(busyTime, elapsedTime) {
  return busyTime / elapsedTime;
}
