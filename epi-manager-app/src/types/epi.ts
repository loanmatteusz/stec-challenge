import type { Category } from "./category";

export type Epi = {
	id: string;
	name: string;
	description: string;
	ca: number;
	categoryId: string;
	category: Category;
	expiration: Date;
};
