"use client";

import type React from "react";
import { Button } from "@/components/ui/button";

type GenerateButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
};

export default function GenerateButton({
  onClick,
  disabled = false,
  loading = false,
  children = "InK Me Up",
}: GenerateButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      variant="default"
      size="lg"
      className="btn-lg"
    >
      {loading ? "Inking..." : children}
    </Button>
  );
}
