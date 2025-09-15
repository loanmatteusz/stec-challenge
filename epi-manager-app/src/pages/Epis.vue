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
	import { createColumns } from "@/components/epis/columns";
	import DataTable from "@/components/epis/data-table.vue";
	import EditEpiModal from "@/components/modals/epis/EditEpiModal.vue";
	import NewEpiModal from "@/components/modals/epis/NewEpiModal.vue";
	import { Button } from "@/components/ui/button";
	import {
		DropdownMenu,
		DropdownMenuCheckboxItem,
		DropdownMenuContent,
		DropdownMenuTrigger,
	} from "@/components/ui/dropdown-menu";
	import { Input } from "@/components/ui/input";
	import { epiService } from "@/services/epi.service";
	import type { Epi } from "@/types/epi";

	const toast = useToast();

	const data = ref<Epi[]>([]);

	const isCreateOpen = ref(false);
	const isEditOpen = ref(false);
	const epiToEdit = ref<Epi | null>(null);

	const totalCount = ref(0);
	const pageIndex = ref(0);
	const pageSize = ref(10);
	const filterName = ref("");
	const filterCa = ref("");
	const filterCategory = ref("");


	async function fetchEpis() {
		try {
			const response = await epiService.getAll({
				page: pageIndex.value + 1,
				pageSize: pageSize.value,
				name: filterName.value || undefined,
				ca: Number(filterCa.value) || undefined,
				category: filterCategory.value || undefined,
			});

			data.value = response.data;
			totalCount.value = response.totalItems;
		} catch (error) {
			console.error("Erro ao buscar epis:", error);
		}
	}

	async function handleCreateEpi(epi: Epi) {
		try {
			await epiService.create(epi);
			await fetchEpis();
			toast.success("Epi created successfully");
		} catch (error) {
			console.error({ error });
			toast.error(`Epi creation failed`);
		}
	}

	async function handleEditEpi(epi: Epi) {
		try {
			await epiService.update(epi.id, epi);
			await fetchEpis();
			toast.success("Epi updated successfully");
		} catch (error) {
			console.log({ error });
			toast.error(`Epi update failed`);
		}
	}

	function handleCreateModal() {
		isCreateOpen.value = true;
	}

	function handleEditModal(epi: Epi) {
		epiToEdit.value = epi;
		isEditOpen.value = true;
	}

	async function removeEpi(id: string) {
		try {
			await epiService.delete(id);
			await fetchEpis();
			toast.success(`Epi deleted successfully`);
		} catch (error) {
			console.error("Erro ao deletar epi:", error);
			toast.error(`Epi deleted failed`);
		}
	}

	watch([filterName, filterCa, filterCategory, pageIndex, pageSize], fetchEpis, { immediate: true });

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
		onDelete: removeEpi,
	});

	const table = useVueTable({
		data,
		columns: columns as ColumnDef<Epi>[],
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
    <h1 class="flex font-bold text-2xl">Epis</h1>
    <div class="flex flex-col md:flex-row items-start md:items-center py-4 gap-2">
		<Input
			class="max-w-md w-full md:w-auto"
			placeholder="Filter Epis by Name"
			v-model="filterName"
		/>
		<Input
			class="max-w-md w-full md:w-auto"
			placeholder="Filter by CA"
			v-model="filterCa"
		/>
		<Input
			class="max-w-md w-full md:w-auto"
			placeholder="Filter by Category"
			v-model="filterCategory"
		/>
	
		<Button
			variant="outline"
			@click="handleCreateModal"
		>
			New EPI
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

  <NewEpiModal
    v-model:open="isCreateOpen"
    @create="handleCreateEpi"
  />

  <EditEpiModal
    v-model:open="isEditOpen"
    :epi="epiToEdit"
    @save="handleEditEpi"
  />
</template>
