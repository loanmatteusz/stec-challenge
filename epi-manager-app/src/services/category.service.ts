import type { Category } from "@/types/category";
import { api } from "./api";

export const categoryService = {
    async getAll(params?: { page?: number; pageSize?: number; name?: string }): Promise<{ data: Category[]; totalItems: number }> {
        const response = await api.get("/categories", { params });
        return response.data;
    },

    async getById(id: string): Promise<Category> {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    async create(category: Partial<Category>): Promise<Category> {
        const response = await api.post("/categories", category);
        return response.data;
    },

    async update(id: string, category: Partial<Category>): Promise<Category> {
        const response = await api.put(`/categories/${id}`, category);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/categories/${id}`);
    },
};
