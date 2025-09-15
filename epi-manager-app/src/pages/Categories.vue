<script setup lang="ts">
import type {
	ColumnDef,
	ColumnFiltersState,
	ExpandedState,
	SortingState,
	VisibilityState,
} from "@tanstack/vue-table";
import {
	getCoreRowModel,
	getExpandedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useVueTable,
} from "@tanstack/vue-table";
import { ChevronDown } from "lucide-vue-next";
import { computed, ref, watch } from "vue";
import { useToast } from "vue-toastification";
import { createColumns } from "@/components/categories/columns";
import DataTable from "@/components/categories/data-table.vue";
import EditCategoryModal from "@/components/modals/categories/EditCategoryModal.vue";
import NewCategoryModal from "@/components/modals/categories/NewCategoryModal.vue";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { categoryService } from "@/services/category.service";
import type { Category } from "@/types/category";

const toast = useToast();

const data = ref<Category[]>([]);

const isCreateOpen = ref(false);
const isEditOpen = ref(false);
const categoryToEdit = ref<Category | null>(null);

const totalCount = ref(0);
const pageIndex = ref(0);
const pageSize = ref(10);
const filterName = ref("");

async function fetchCategories() {
	try {
		const response = await categoryService.getAll({
			page: pageIndex.value + 1,
			pageSize: pageSize.value,
			name: filterName.value || undefined,
		});

		data.value = response.data;
		totalCount.value = response.totalItems;
	} catch (error) {
		console.error("Erro ao buscar categorias:", error);
	}
}

async function handleCreateCategory(category: Category) {
	try {
		await categoryService.create(category);
		await fetchCategories();
		toast.success("Category created successfully");
	} catch (error) {
		console.error({ error });
		toast.error(`Category creation failed`);
	}
}

async function handleEditCategory(category: Category) {
	try {
		await categoryService.update(category.id, { name: category.name });
		await fetchCategories();
		toast.success("Category updated successfully");
	} catch (error) {
		console.log({ error });
		toast.error(`Category update failed`);
	}
}

function handleCreateModal() {
	isCreateOpen.value = true;
}

function handleEditModal(category: Category) {
	categoryToEdit.value = category;
	isEditOpen.value = true;
}

async function removeCategory(id: string) {
	try {
		await categoryService.delete(id);
		await fetchCategories();
		toast.success(`Category deleted successfully`);
	} catch (error) {
		console.error("Erro ao deletar categoria:", error);
		toast.error(`Category deleted failed`);
	}
}

watch([filterName, pageIndex, pageSize], fetchCategories, { immediate: true });

function prevPage() {
	if (pageIndex.value > 0) {
		pageIndex.value--;
	}
}

function nextPage() {
	const maxPage = Math.ceil(totalCount.value / pageSize.value) - 1;
	if (pageIndex.value < maxPage) {
		pageIndex.value++;
	}
}

const startItem = computed(() => pageIndex.value * pageSize.value + 1);
const endItem = computed(() =>
	Math.min((pageIndex.value + 1) * pageSize.value, totalCount.value),
);

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});

const columns = createColumns({
	onEdit: handleEditModal,
	onDelete: removeCategory,
});

const table = useVueTable({
	data,
	columns: columns as ColumnDef<Category>[],
	getCoreRowModel: getCoreRowModel(),
	getSortedRowModel: getSortedRowModel(),
	getFilteredRowModel: getFilteredRowModel(),
	getExpandedRowModel: getExpandedRowModel(),
	getPaginationRowModel: getPaginationRowModel(),
	pageCount: Math.ceil(totalCount.value / pageSize.value),
	state: {
		get sorting() {
			return sorting.value;
		},
		get columnFilters() {
			return columnFilters.value;
		},
		get columnVisibility() {
			return columnVisibility.value;
		},
		get rowSelection() {
			return rowSelection.value;
		},
		get expanded() {
			return expanded.value;
		},
	},
});
</script>

<template>
  <div class="w-full">
    <h1 class="flex font-bold text-2xl">Categories</h1>
    <div class="flex items-center py-4 gap-2">
      <Input
        class="max-w-sm"
        placeholder="Filter categories..."
        v-model="filterName"
      />

      <Button
        variant="outline"
        @click="handleCreateModal"
      >
        New Category
      </Button>

      <div class="flex-1"></div>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline">
            Columns <ChevronDown class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="column in table.getAllColumns().filter(c => c.getCanHide())"
            :key="column.id"
            class="capitalize"
            :model-value="column.getIsVisible()"
            @update:model-value="(value) => column.toggleVisibility(!!value)"
          >
            {{ column.id }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <DataTable :columns="columns" :data="data" />

    <div class="flex items-center justify-end gap-2 py-4">
      <div class="text-sm text-muted-foreground">
        {{ startItem }} - {{ endItem }} of {{ totalCount }}
      </div>
        <Button
          variant="outline"
          size="sm"
          :disabled="pageIndex === 0"
          @click="prevPage"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="pageIndex >= Math.ceil(totalCount / pageSize) - 1"
          @click="nextPage"
        >
          Next
        </Button>
    </div>
  </div>

  <NewCategoryModal
    v-model:open="isCreateOpen"
    @create="handleCreateCategory"
  />

  <EditCategoryModal
    v-model:open="isEditOpen"
    :category="categoryToEdit"
    @save="handleEditCategory"
  />
</template>
