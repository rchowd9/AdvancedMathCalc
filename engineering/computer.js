export const COMPUTER_ENGINEERING = {
  id: 'computer',
  name: 'Computer Engineering',
  formulas: {
    cpuPerformance: '1 / executionTime',
    amdahlSpeedup: '1 / ((1 - p) + p / s)',
    memoryBandwidth: 'transfersPerSecond * bytesPerTransfer',
    networkThroughput: 'dataSize / transferTime',
    shannonCapacity: 'bandwidth * log2(1 + signalToNoise)',
    pipelineEfficiency: 'usefulStages / totalStages',
    processorUtilization: 'busyTime / elapsedTime',
  },
};
