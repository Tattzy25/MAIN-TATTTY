"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface CreateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
  className?: string;
}

export default function CreateButton({
  onClick,
  disabled = false,
  isGenerating = false,
  className = "",
}: CreateButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size="xl"
      className={`rounded-full px-10 py-3 ${className}`}
    >
      {isGenerating ? "Inking..." : "InK Me Up"}
    </Button>
  );
}
