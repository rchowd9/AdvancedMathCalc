export const AEROSPACE_ENGINEERING = {
  id: 'aerospace',
  name: 'Aerospace Engineering',
  formulas: {
    dynamicPressure: '0.5 * rho * velocity^2',
    lift: '0.5 * rho * velocity^2 * wingArea * liftCoefficient',
    drag: '0.5 * rho * velocity^2 * referenceArea * dragCoefficient',
    thrustToWeight: 'thrust / weight',
    rocketDeltaV: 'specificImpulse * g0 * ln(massRatio)',
    orbitalVelocity: 'sqrt(mu / orbitalRadius)',
    machNumber: 'velocity / speedOfSound',
  },
};
