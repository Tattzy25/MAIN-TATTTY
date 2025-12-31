"use client";

import type * as React from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

export function Modal({
	children,
	...props
}: React.ComponentProps<typeof Dialog>) {
	return <Dialog {...props}>{children}</Dialog>;
}

export function ModalTrigger({
	children,
	...props
}: React.ComponentProps<typeof DialogTrigger>) {
	return <DialogTrigger {...props}>{children}</DialogTrigger>;
}

export function ModalContent({
	children,
	...props
}: React.ComponentProps<typeof DialogContent>) {
	return <DialogContent {...props}>{children}</DialogContent>;
}

export function ModalHeader({
	children,
	...props
}: React.ComponentProps<"div">) {
	return <DialogHeader {...(props as any)}>{children}</DialogHeader>;
}

export function ModalTitle({
	children,
	...props
}: React.ComponentProps<typeof DialogTitle>) {
	return <DialogTitle {...props}>{children}</DialogTitle>;
}

export function ModalFooter({
	children,
	...props
}: React.ComponentProps<"div">) {
	return <DialogFooter {...(props as any)}>{children}</DialogFooter>;
}

export function ModalClose({
	children,
	...props
}: React.ComponentProps<typeof DialogClose>) {
	return <DialogClose {...props}>{children}</DialogClose>;
}

export default Modal;
