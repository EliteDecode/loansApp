// Login hooks
export { useLoginHook } from "./useLoginHook";
export type { LoginValues, UserRole } from "./useLoginHook";

export { useDirectorLoginHook } from "./useDirectorLoginHook";
export type { LoginValues as DirectorLoginValues } from "./useDirectorLoginHook";

export { useManagerLoginHook } from "./useManagerLoginHook";
export type { LoginValues as ManagerLoginValues } from "./useManagerLoginHook";

export { useAgentLoginHook } from "./useAgentLoginHook";
export type { LoginValues as AgentLoginValues } from "./useAgentLoginHook";

// Client hooks
export { useClientAddHook } from "./useClientAddHook/useClientAddHook";
export type {
  ClientFormValues,
  UseClientAddReturn,
} from "./useClientAddHook/useClientAddHook";

export { useClientEditHook } from "./useClientEditHook/useClientEditHook";
export type { UseClientEditReturn } from "./useClientEditHook/useClientEditHook";

// Helper functions
export * from "./helpers";
