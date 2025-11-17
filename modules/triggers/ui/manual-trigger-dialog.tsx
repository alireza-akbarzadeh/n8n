import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
} from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';

interface ManualTriggerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManualTriggerDialog(props: ManualTriggerDialogProps) {
  const { open, onOpenChange } = props;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Trigger</DialogTitle>
          <DialogDescription>Configure setting for the manual trigger node.</DialogDescription>
          <div className="py-4">
            <div className="text-muted-foreground text-sm">
              Used to manually create a workflow, no configuration available.
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
