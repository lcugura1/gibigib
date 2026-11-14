import { z } from 'zod';

export const catalogDtoSchema = z.object({
  gyms: z.array(z.object({ id: z.string(), name: z.string(), address: z.string() })),
  plans: z.array(
    z.object({
      slug: z.string(),
      name: z.string(),
      price: z.number(),
      durationDays: z.number().int().positive(),
      selfService: z.boolean(),
    }),
  ),
});

export type CatalogDto = z.infer<typeof catalogDtoSchema>;
