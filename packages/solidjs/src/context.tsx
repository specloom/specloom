import type { TenantType } from "@specloom/auth-provider";
import {
  createContext,
  useContext,
  type JSX,
  type ParentProps,
} from "solid-js";
import type { SpecloomClient } from "./client.js";

const SpecloomContext = createContext<SpecloomClient | undefined>(undefined);

export interface SpecloomProviderProps<
  TTenant extends TenantType = TenantType,
> extends ParentProps {
  client: SpecloomClient<TTenant>;
}

export function SpecloomProvider<TTenant extends TenantType = TenantType>(
  props: SpecloomProviderProps<TTenant>,
): JSX.Element {
  return (
    <SpecloomContext.Provider value={props.client}>
      {props.children}
    </SpecloomContext.Provider>
  );
}

export function useSpecloom<TTenant extends TenantType = TenantType>(): SpecloomClient<TTenant> {
  const client = useContext(SpecloomContext);
  if (!client) {
    throw new Error("useSpecloom must be used within SpecloomProvider");
  }
  return client as SpecloomClient<TTenant>;
}

export function useSpec() {
  return useSpecloom().spec;
}

export function useOptionsResolver() {
  return useSpecloom().optionsResolver;
}

export function useAuthProvider<TTenant extends TenantType = TenantType>() {
  return useSpecloom<TTenant>().authProvider;
}

export function useDataProvider() {
  return useSpecloom().dataProvider;
}
