import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";
import React from "react";
import { LessonList } from "./LessonList";

export type Props = {
  open?: boolean;
  onSelect?: (id: number) => void;
  onClose?: () => void;
};

export const LessonModal = (props: Props) => {
  const { open = false, onClose, onSelect } = props;

  const [lessonIdSelected, setLessonIdSelected] = React.useState<number>();

  const handleLessonSelect = (id: number) => setLessonIdSelected(id);

  const handleSave = () => {
    if (!lessonIdSelected) return;
    onClose?.();
    onSelect?.(lessonIdSelected);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Lesson List</DialogTitle>
      <DialogContent>
        <LessonList onSelect={handleLessonSelect} />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSave}>
          Select
        </Button>
      </DialogActions>
    </Dialog>
  );
};
