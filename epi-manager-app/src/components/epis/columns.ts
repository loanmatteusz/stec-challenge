import type { ColumnDef } from "@tanstack/vue-table";
import { ArrowUpDown } from "lucide-vue-next";
import { h } from "vue";
import type { Epi } from "@/types/epi";
import DropdownAction from "../DropdownAction.vue";
import Button from "../ui/button/Button.vue";
import { Checkbox } from "../ui/checkbox";

export type ColumnsOptions = {
	onEdit: (epi: Epi) => void;
	onDelete: (id: string) => void;
}

export const createColumns = ({ onEdit, onDelete }: ColumnsOptions): ColumnDef<Epi>[] => [
	{
		id: "select",
		header: ({ table }) =>
			h(Checkbox, {
				modelValue:
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate"),
				"onUpdate:modelValue": (value) =>
					table.toggleAllPageRowsSelected(!!value),
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
		header: () => h("div", { class: "text-right" }, "Name"),
		cell: ({ row }) => h("div", { class: "text-right" }, row.getValue("name")),
	},

	{
		accessorKey: "description",
		header: () => h("div", { class: "text-right" }, "Description"),
		cell: ({ row }) => h("div", { class: "text-right" }, row.getValue("description")),
	},

	{
		accessorKey: "ca",
		header: () => h("div", { class: "text-right" }, "CA"),
		cell: ({ row }) => h("div", { class: "text-right" }, row.getValue("ca")),
	},

	{
		accessorKey: "category",
		header: () => h("div", { class: "text-right" }, "Category"),
		cell: ({ row }) => h("div", { class: "text-right" }, row.original.category?.name || "-"),
	},

	{
		accessorKey: "expiration",
		header: () => h("div", { class: "text-right" }, "Expiration"),
		cell: ({ row }) => {
			const date = new Date(row.getValue("expiration"));
			return h("div", { class: "text-right" }, date.toLocaleDateString());
		},
	},

	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const epi = row.original;

			return h(
				"div",
				{ class: "flex justify-end" },
				h(DropdownAction as any, {
					epi,
					onEdit: () => onEdit(epi),
					onDelete: () => onDelete(epi.id),
				})
			);
		},
	},
];
