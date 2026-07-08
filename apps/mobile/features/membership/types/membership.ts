export type ActiveMembership = {
  endDate: string;
  status: 'ACTIVE';
  program: {
    name: string;
    durationDays: number;
  };
};
