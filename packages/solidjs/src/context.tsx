import type { TenantType } from "@specloom/auth-provider";
import {
  createContext,
  useContext,
  type JSX,
  type ParentProps,
} from "solid-js";
import type { SpecloomRuntime } from "./client.js";

const SpecloomContext = createContext<SpecloomRuntime | undefined>(undefined);

export interface SpecloomProviderProps<
  TTenant extends TenantType = TenantType,
> extends ParentProps {
  runtime: SpecloomRuntime<TTenant>;
}

export function SpecloomProvider<TTenant extends TenantType = TenantType>(
  props: SpecloomProviderProps<TTenant>,
): JSX.Element {
  return (
    <SpecloomContext.Provider value={props.runtime}>
      {props.children}
    </SpecloomContext.Provider>
  );
}

export function useSpecloom<TTenant extends TenantType = TenantType>(): SpecloomRuntime<TTenant> {
  const runtime = useContext(SpecloomContext);
  if (!runtime) {
    throw new Error("useSpecloom must be used within SpecloomProvider");
  }
  return runtime as SpecloomRuntime<TTenant>;
}

export function useAuthProvider<TTenant extends TenantType = TenantType>() {
  return useSpecloom<TTenant>().authProvider;
}

export function useDataProvider() {
  return useSpecloom().dataProvider;
}
