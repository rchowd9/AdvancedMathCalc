export const CHEMICAL_ENGINEERING = {
  id: 'chemical',
  name: 'Chemical Engineering',
  formulas: {
    molarity: 'moles / solutionVolume',
    idealGas: 'P * V = n * R * T',
    enthalpyChange: 'sum(products) - sum(reactants)',
    gibbsFreeEnergy: 'deltaH - T * deltaS',
    reactionRate: 'k * concentration^order',
    arrhenius: 'A * exp(-Ea / (R * T))',
    dilution: 'C1 * V1 = C2 * V2',
  },
};
