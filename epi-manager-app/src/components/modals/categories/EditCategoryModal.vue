<script setup lang="ts">
	import { ref, watch } from "vue";
	import { Button } from "@/components/ui/button";
	import {
		Dialog,
		DialogContent,
		DialogFooter,
		DialogHeader,
		DialogTitle,
	} from "@/components/ui/dialog";
	import { Input } from "@/components/ui/input";
	import type { Category } from "@/types/category";

	interface Props {
		open: boolean;
		category: Category | null;
	}

	const props = defineProps<Props>();
	const emit = defineEmits<{
		(e: "update:open", value: boolean): void;
		(e: "save", category: Category): void;
	}>();

	const form = ref<Category | null>(null);

	watch(
		() => props.category,
		(newVal) => {
			form.value = newVal ? { ...newVal } : null;
		},
		{ immediate: true },
	);

	const handleClose = () => emit("update:open", false);

	const handleSave = () => {
		if (form.value) {
			emit("save", form.value);
			handleClose();
		}
	};
</script>

<template>
  <Dialog :open="open" @update:open="val => emit('update:open', val)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Categoria</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <Input
          v-model="form!.name"
          placeholder="Nome da categoria"
        />
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleClose">Cancelar</Button>
        <Button @click="handleSave">Salvar</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
