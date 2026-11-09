export const ALL_GYMS = 'all';

export const gymIdOf = (scope: string) => (scope === ALL_GYMS ? undefined : scope);

export interface GymRef {
  id: string;
  name: string;
}
