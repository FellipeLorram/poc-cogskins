"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export function AlphaTesterDialog() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            We have been invited to be a CogSkins Alpha Tester.
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          What about validate your knowledge and earn exclusive badges?
        </DialogDescription>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>{" Let's Go!"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
