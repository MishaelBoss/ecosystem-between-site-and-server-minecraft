'use client';
import { useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

function subscribe() {
  return () => {};
}

export default function Portal({ children }: { children: ReactNode }) {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!isClient) return null;

  return createPortal(children, document.body);
}
