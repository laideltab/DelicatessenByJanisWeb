"use client"

import { useSyncExternalStore } from "react"

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

/**
 * Returns false on the server / during the first client render, true after.
 * Use to gate UI that depends on browser-only state (e.g. localStorage) so
 * SSR HTML matches the first client render.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
}
