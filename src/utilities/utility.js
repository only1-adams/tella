import { Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";

export const openDeleteConfirmation = (title, onConfirm, onCancel) => {
  openConfirmModal({
    title: `Please confirm delete ${title}`,
    children: (
      <Text size="sm">{`Are you sure you want to delete ${title} ? This action can't be undone.`}</Text>
    ),
    labels: { confirm: `Delete ${title}`, cancel: "Cancel" },
    onCancel: () => onCancel(),
    onConfirm: () => onConfirm(),
    confirmProps: { color: "red" },
  });
};
