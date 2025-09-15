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

    const props = defineProps<{
        open: boolean;
    }>();
    const emit = defineEmits<{
        (e: "update:open", value: boolean): void;
        (e: "create", category: Omit<Category, "id">): void;
    }>();

    const form = ref<Omit<Category, "id">>({
        name: "",
    });

    watch(
        () => props.open,
        (isOpen) => {
            if (isOpen) {
                form.value = { name: "" };
            }
        },
    );

    const handleClose = () => emit("update:open", false);

    const handleCreate = () => {
        if (!form.value.name.trim()) return;
        emit("create", { ...form.value });
        handleClose();
    };
</script>

<template>
  <Dialog :open="open" @update:open="val => emit('update:open', val)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Criar Categoria</DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <Input
          v-model="form.name"
          placeholder="Nome da categoria"
        />
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleClose">Cancelar</Button>
        <Button @click="handleCreate">Criar</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
