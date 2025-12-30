"use client";

import React, { createContext, useContext, useMemo, useState, useCallback } from "react";

/**
 * SelectionProvider (single-selection per namespace)
 *
 * IDs are expected to be namespaced like "colors-2" or "styles-0".
 * The provider enforces one selected ID per namespace (the prefix before the first hyphen).
 *
 * API:
 * - getSelectedIds(): string[]  (list of currently selected ids)
 * - isSelected(id: string): boolean
 * - getSelectedFor(namespace: string): string | undefined
 * - select(id: string): void
 * - toggle(id: string): void
 * - clear(): void
 */

type SelectionContextValue = {
  selectedIds: string[];
  isSelected: (id: string) => boolean;
  getSelectedFor: (namespace: string) => string | undefined;
  toggle: (id: string) => void;
  select: (id: string) => void;
  clear: () => void;
};

const SelectionContext = createContext<SelectionContextValue | undefined>(undefined);

function getNamespaceFromId(id: string) {
  const idx = id.indexOf("-");
  return idx === -1 ? id : id.slice(0, idx);
}

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  // store selections as a map: namespace -> id
  const [selectedMap, setSelectedMap] = useState<Record<string, string | undefined>>(() => ({
    styles: "styles-1",
    colors: "colors-1",
    aspect: "aspect-1",
  }));

  const isSelected = useCallback(
    (id: string) => {
      const ns = getNamespaceFromId(id);
      return selectedMap[ns] === id;
    },
    [selectedMap],
  );

  const getSelectedFor = useCallback(
    (namespace: string) => selectedMap[namespace],
    [selectedMap],
  );

  const select = useCallback((id: string) => {
    const ns = getNamespaceFromId(id);
    setSelectedMap((prev) => ({ ...prev, [ns]: id }));
  }, []);

  const toggle = useCallback((id: string) => {
    const ns = getNamespaceFromId(id);
    setSelectedMap((prev) => {
      if (prev[ns] === id) {
        const next = { ...prev };
        delete next[ns];
        return next;
      }
      return { ...prev, [ns]: id };
    });
  }, []);

  const clear = useCallback(() => {
    setSelectedMap({});
  }, []);

  const selectedIds = useMemo(() => Object.values(selectedMap).filter(Boolean) as string[], [selectedMap]);

  const value: SelectionContextValue = useMemo(
    () => ({ selectedIds, isSelected, getSelectedFor, toggle, select, clear }),
    [selectedIds, isSelected, getSelectedFor, toggle, select, clear],
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return ctx;
}
