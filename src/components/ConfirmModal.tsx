import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

export const ConfirmModal = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: ConfirmModalProps) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-4 border-red-600 -rotate-1 shadow-[6px_6px_0px_0px_rgba(211,18,18,1)]">
        {/* Star accents */}
        <div className="absolute top-2 left-2 opacity-10 pointer-events-none">
          <Star className="h-5 w-5 text-red-600" />
        </div>
        <div className="absolute top-2 right-2 opacity-10 pointer-events-none">
          <Star className="h-5 w-5 text-white" />
        </div>
        
        <DialogHeader>
          <DialogTitle className="text-red-600 -rotate-1">{title}</DialogTitle>
          <DialogDescription className="text-white/80 -rotate-1">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="border-2 border-white text-white hover:bg-white hover:text-red-600 -rotate-1"
          >
            {cancelText}
          </Button>
          <Button 
            variant={variant === "destructive" ? "destructive" : "default"} 
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-800 text-white font-bold -rotate-1"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};