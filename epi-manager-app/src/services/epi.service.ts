import type { Epi } from "@/types/epi";
import { api } from "./api";

export const epiService = {
    async getAll(params?: { page?: number; pageSize?: number; name?: string; ca?: number; category?: string }): Promise<{ data: Epi[]; totalItems: number }> {
        const response = await api.get("/epis", { params });
        return response.data;
    },

    async getById(id: string): Promise<Epi> {
        const response = await api.get(`/epis/${id}`);
        return response.data;
    },

    async create(epi: Partial<Epi>): Promise<Epi> {
        const response = await api.post("/epis", epi);
        return response.data;
    },

    async update(id: string, epi: Partial<Epi>): Promise<Epi> {
        const response = await api.put(`/epis/${id}`, epi);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/epis/${id}`);
    },
};
