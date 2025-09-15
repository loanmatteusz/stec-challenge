import type { ColumnDef } from "@tanstack/vue-table";
import { ArrowUpDown } from "lucide-vue-next";
import { h } from "vue";
import type { Category } from "@/types/category";
import DropdownAction from "../DropdownAction.vue";
import Button from "../ui/button/Button.vue";
import { Checkbox } from "../ui/checkbox";

export type ColumnsOptions = {
	onEdit: (category: Category) => void;
	onDelete: (id: string) => void;
}

export const createColumns = ({ onEdit, onDelete }: ColumnsOptions): ColumnDef<Category>[] => [
	{
		id: "select",
		header: ({ table }) =>
			h(Checkbox, {
				modelValue:
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate"),
				"onUpdate:modelValue": (value) => table.toggleAllPageRowsSelected(!!value),
				ariaLabel: "Select all",
				class: "h-4 w-4",
			}),
		cell: ({ row }) =>
			h(Checkbox, {
				modelValue: row.getIsSelected(),
				"onUpdate:modelValue": (value) => row.toggleSelected(!!value),
				ariaLabel: "Select row",
				class: "h-4 w-4",
			}),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "name",
		header: ({ column }) =>
			h(
				Button,
				{
					variant: "ghost",
					onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
				},
				() => ["Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
			),
		cell: ({ row }) => h("div", {}, row.getValue("name")),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const category = row.original;

			return h(
				"div",
				{ class: "flex justify-end" },
				h(DropdownAction as any, {
					category,
					onEdit: () => onEdit(category),
					onDelete: () => onDelete(category.id),
				})
			);
		},
	},
];
