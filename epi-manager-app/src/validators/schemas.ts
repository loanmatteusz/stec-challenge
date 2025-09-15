import { z } from "zod";

export const epiFormSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().optional(),
    categoryId: z.string().min(1, "Categoria é obrigatória"),
    ca: z.number().positive("CA deve ser maior que 0"),
    expiration: z.date({
        required_error: "Data de expiração é obrigatória",
        invalid_type_error: "Data inválida",
    }),
});

export type EpiFormValues = z.infer<typeof epiFormSchema>;
