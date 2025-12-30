"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import * as React from "react";

export function Modal({ children, ...props }: React.ComponentProps<typeof Dialog>) {
  return <Dialog {...props}>{children}</Dialog>;
}

export function ModalTrigger({ children, ...props }: React.ComponentProps<typeof DialogTrigger>) {
  return <DialogTrigger {...props}>{children}</DialogTrigger>;
}

export function ModalContent({ children, ...props }: React.ComponentProps<typeof DialogContent>) {
  return <DialogContent {...props}>{children}</DialogContent>;
}

export function ModalHeader({ children, ...props }: React.ComponentProps<"div">) {
  return <DialogHeader {...(props as any)}>{children}</DialogHeader>;
}

export function ModalTitle({ children, ...props }: React.ComponentProps<typeof DialogTitle>) {
  return <DialogTitle {...props}>{children}</DialogTitle>;
}

export function ModalFooter({ children, ...props }: React.ComponentProps<"div">) {
  return <DialogFooter {...(props as any)}>{children}</DialogFooter>;
}

export function ModalClose({ children, ...props }: React.ComponentProps<typeof DialogClose>) {
  return <DialogClose {...props}>{children}</DialogClose>;
}

export default Modal;
