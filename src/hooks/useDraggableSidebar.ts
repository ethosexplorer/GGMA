import React, { useState, useEffect, useCallback, useRef } from 'react';

export interface DraggableItem {
  id: string;
  label: string;
  icon: any;
  [key: string]: any;
}

/**
 * Universal drag-and-drop sidebar reordering hook with localStorage persistence.
 * Used across all dashboard portals (Provider, Attorney, Patient, Business, Founder).
 *
 * @param defaultItems - The default sidebar/tab items array
 * @param storageKey - A unique localStorage key for this dashboard
 */
export function useDraggableSidebar<T extends DraggableItem>(
  defaultItems: T[],
  storageKey: string
) {
  const [items, setItems] = useState<T[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const savedOrder: string[] = JSON.parse(stored);
        // Rebuild the items in saved order, handling additions/removals
        const itemMap = new Map(defaultItems.map(item => [item.id, item]));
        const ordered: T[] = [];
        // Add items in saved order (if they still exist)
        for (const id of savedOrder) {
          const item = itemMap.get(id);
          if (item) {
            ordered.push(item);
            itemMap.delete(id);
          }
        }
        // Append any new items that weren't in the saved order
        for (const item of itemMap.values()) {
          ordered.push(item);
        }
        return ordered;
      }
    } catch {
      // Fall through to default
    }
    return defaultItems;
  });

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Persist to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items.map(i => i.id)));
    } catch {
      // Silently ignore storage errors
    }
  }, [items, storageKey]);

  const handleDragStart = useCallback((index: number) => {
    dragItem.current = index;
  }, []);

  const handleDragEnter = useCallback((index: number) => {
    dragOverItem.current = index;
  }, []);

  const handleDragEnd = useCallback(() => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    setItems(prev => {
      const updated = [...prev];
      const [removed] = updated.splice(dragItem.current!, 1);
      updated.splice(dragOverItem.current!, 0, removed);
      return updated;
    });

    dragItem.current = null;
    dragOverItem.current = null;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const resetOrder = useCallback(() => {
    setItems(defaultItems);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Silently ignore
    }
  }, [defaultItems, storageKey]);

  return {
    items,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    handleDragOver,
    resetOrder,
  };
}
