// ________________Абонементи_________________//

export const subscriptionPasses = [
  {
    serviceName: '1 тренування',
    plans: [
      { id: '1', availability: '1 тренування', price: '150', quantity: '1', serviceName: 'тренування' },
    ],
  },
  {
    serviceName: '8 тренувань',
    plans: [
      { id: '2', availability: '1 місяць', price: '700', quantity: '8', serviceName: 'тренувань' },
    ],
  },
  {
    serviceName: '12 тренувань',
    plans: [
      { id: '3', availability: '1 місяць', price: '800', quantity: '12', serviceName: 'тренувань' },
    ],
  },
  {
    serviceName: 'Безліміт',
    plans: [
      { id: '4', availability: '1 місяць',   price: '900',  quantity: 'Безліміт', serviceName: '' },
      { id: '5', availability: '3 місяці',   price: '2400', quantity: '3',         serviceName: 'місяці' },
      { id: '6', availability: '6 місяців',  price: '4500', quantity: '6',         serviceName: 'місяців' },
      { id: '7', availability: '1 рік',      price: '8400', quantity: '12',        serviceName: 'місяців' },
    ],
  },
];

// Щомісячні: перші 3 тарифи + Безліміт на 1 місяць
export const monthPass = [
  ...subscriptionPasses.slice(0, 3).map(s => s.plans[0]),
  subscriptionPasses[3].plans[0],
];

// Довгострокові: Безліміт на 3 / 6 / 12 місяців
export const yearPass = subscriptionPasses[3].plans.slice(1);

// ________________Персональні тренування_________________//

export const coachPasses = [
  {
    serviceName: 'Тренування з тренером',
    plans: [
      { id: '8',  availability: '1 тренування з тренером',  price: '500',  quantity: '1',  serviceName: 'тренування з тренером' },
      { id: '9',  availability: '4 тренування з тренером',  price: '2000', quantity: '4',  serviceName: 'тренування з тренером' },
      { id: '10', availability: '8 тренувань з тренером',   price: '3300', quantity: '8',  serviceName: 'тренувань з тренером' },
      { id: '11', availability: '12 тренувань з тренером',  price: '4600', quantity: '12', serviceName: 'тренувань з тренером' },
    ],
  },
];

export const coachServices = coachPasses[0].plans;

// ________________Плани тренування/харчування_________________//

export const plansPasses = [
  {
    serviceName: 'План харчування',
    plans: [
      { id: '12', availability: '1 тиждень', price: '500',  quantity: '1',  serviceName: 'тиждень' },
      { id: '13', availability: '1 місяць',  price: '1000', quantity: '30', serviceName: 'днів' },
    ],
  },
  {
    serviceName: 'План тренування',
    plans: [
      { id: '14', availability: '1 місяць', price: '500', quantity: '1', serviceName: 'тиждень' },
    ],
  },
];

export const foodPlanFullProgram = plansPasses[0].plans;
export const trainingPlanFullProgram = plansPasses[1].plans;
