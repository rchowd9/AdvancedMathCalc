// computer.js
// Computer Engineering Module

window.COMPUTER_FORMULAS = new Set([
  'binaryaddition',
  'cachehitrate',
  'cpuperformance',
  'amdahllaw',
  'memorybandwidth',
  'networkthroughput',
  'instructioncycles',
  'samplingrate',
  'nyquist',
  'shannoncapacity',
  'latency',
  'speedup',
  'biterrorrate',
  'packetloss',
  'cachemisspenalty',
  'pipelineefficiency',
  'diskthroughput',
  'clockcycles',
  'processorutilization',
  'parallelfraction'
]);

function solveComputer(input) {

  const match = input.match(/^([a-zA-Z]+)\(([\s\S]*)\)$/);

  if (!match) {
    throw new Error("Invalid computer engineering syntax.");
  }

  const mode = match[1].toLowerCase();
  const args = match[2].split(',').map(x => Number(x.trim()));

  const result = (() => {
    switch(mode) {

    case 'binaryaddition':
      return (args[0] + args[1]).toString(2);

    case 'cachehitrate':
      return `Hit Rate = ${(args[0]/args[1])*100}%`;

    case 'cpuperformance':
      return `Performance = ${1/args[0]}`;

    case 'amdahllaw':
      return `Speedup = ${1/((1-args[0]) + args[0]/args[1])}`;

    case 'memorybandwidth':
      return `Bandwidth = ${args[0]*args[1]} bytes/s`;

    case 'networkthroughput':
      return `${args[0]/args[1]} bps`;

    case 'instructioncycles':
      return `${args[0]*args[1]} cycles`;

    case 'samplingrate':
      return `${args[0]} samples/sec`;

    case 'nyquist':
      return `Minimum Sampling Frequency = ${2*args[0]} Hz`;

    case 'shannoncapacity':
      return `${args[0]*Math.log2(1+args[1])} bps`;

    case 'latency':
      return `${args[0]+args[1]} ms`;

    case 'speedup':
      return `${args[0]/args[1]}`;

    case 'biterrorrate':
      return `${args[0]/args[1]}`;

    case 'packetloss':
      return `${(args[0]/args[1])*100}%`;

    case 'cachemisspenalty':
      return `${args[0]-args[1]} ns`;

    case 'pipelineefficiency':
      return `${(args[0]/args[1])*100}%`;

    case 'diskthroughput':
      return `${args[0]/args[1]} MB/s`;

    case 'clockcycles':
      return `${args[0]*args[1]} cycles`;

    case 'processorutilization':
      return `${(args[0]/args[1])*100}%`;

    case 'parallelfraction':
      return `${args[0]/args[1]}`;

    default:
      throw new Error("Unknown Computer Engineering formula.");
    }
  })();
  const outputUnits = {
    binaryaddition: 'dimensionless binary integer', cachehitrate: '%', cpuperformance: 's⁻¹ (execution time in s)',
    amdahllaw: 'dimensionless speedup', memorybandwidth: 'bytes/s', networkthroughput: 'bps',
    instructioncycles: 'cycles', samplingrate: 'samples/s', nyquist: 'Hz', shannoncapacity: 'bps',
    latency: 'ms', speedup: 'dimensionless ratio', biterrorrate: 'dimensionless ratio', packetloss: '%',
    cachemisspenalty: 'ns', pipelineefficiency: '%', diskthroughput: 'MB/s', clockcycles: 'cycles',
    processorutilization: '%', parallelfraction: 'dimensionless ratio'
  };
  return `${result}\nOutput units: ${outputUnits[mode]}.`;
}