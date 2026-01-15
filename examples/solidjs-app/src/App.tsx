import { createSignal, createEffect, For, Show } from "solid-js";
import { css } from "styled-system/css";
import { Box, Flex, Stack, HStack } from "styled-system/jsx";
import { ListView, FormView, ShowView } from "@specloom/solidjs";
import { Button } from "~/components/ui/button";
import { listViewSamples } from "./catalog/listViewSamples.js";
import { formViewSamples } from "./catalog/formViewSamples.js";
import { showViewSamples } from "./catalog/showViewSamples.js";

type ViewType = "list" | "form" | "show";
type ThemeType = "default" | "custom";

export default function App() {
  const [viewType, setViewType] = createSignal<ViewType>("list");
  const [selectedSample, setSelectedSample] = createSignal<string>("");
  const [theme, setTheme] = createSignal<ThemeType>("default");

  // テーマ切り替え時にCSSクラスを適用
  createEffect(() => {
    if (theme() === "custom") {
      document.body.classList.add("custom-theme");
    } else {
      document.body.classList.remove("custom-theme");
    }
  });

  const listSamples = Object.entries(listViewSamples);
  const formSamples = Object.entries(formViewSamples);
  const showSamples = Object.entries(showViewSamples);

  const currentSamples = () => {
    switch (viewType()) {
      case "list":
        return listSamples;
      case "form":
        return formSamples;
      case "show":
        return showSamples;
    }
  };

  const currentVM = () => {
    const key = selectedSample();
    if (!key) return null;

    switch (viewType()) {
      case "list":
        return listViewSamples[key as keyof typeof listViewSamples];
      case "form":
        return formViewSamples[key as keyof typeof formViewSamples];
      case "show":
        return showViewSamples[key as keyof typeof showViewSamples];
    }
  };

  const handleViewTypeChange = (type: ViewType) => {
    setViewType(type);
    setSelectedSample("");
  };

  const handleAction = (actionId: string, rowId?: string) => {
    console.log("Action:", actionId, "Row:", rowId);
    alert(`Action: ${actionId}${rowId ? ` (Row: ${rowId})` : ""}`);
  };

  const handleFieldChange = (fieldName: string, value: unknown) => {
    console.log("Field changed:", fieldName, "=", value);
  };

  return (
    <Flex h="100vh">
      {/* サイドバー */}
      <Box
        w="280px"
        borderRight="1px solid"
        borderColor="border.default"
        p="4"
        overflow="auto"
        bg="bg.subtle"
      >
        <Box fontSize="lg" fontWeight="bold" mb="4">
          specloom カタログ
        </Box>

        {/* テーマ切り替え */}
        <Box mb="4">
          <Box fontSize="xs" color="fg.muted" mb="2">
            Theme
          </Box>
          <HStack gap="1">
            <Button
              size="xs"
              variant={theme() === "default" ? "solid" : "outline"}
              onClick={() => setTheme("default")}
            >
              Default
            </Button>
            <Button
              size="xs"
              variant={theme() === "custom" ? "solid" : "outline"}
              onClick={() => setTheme("custom")}
              class={css({
                background:
                  theme() === "custom"
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : undefined,
              })}
            >
              Custom
            </Button>
          </HStack>
        </Box>

        {/* ビュータイプ切り替え */}
        <Box mb="4">
          <Box fontSize="xs" color="fg.muted" mb="2">
            View Type
          </Box>
          <HStack gap="1">
            <For each={["list", "form", "show"] as ViewType[]}>
              {(type) => (
                <Button
                  size="sm"
                  variant={viewType() === type ? "solid" : "outline"}
                  onClick={() => handleViewTypeChange(type)}
                >
                  {type === "list" ? "List" : type === "form" ? "Form" : "Show"}
                </Button>
              )}
            </For>
          </HStack>
        </Box>

        {/* サンプル一覧 */}
        <Box>
          <Box fontSize="xs" color="fg.muted" mb="2">
            Samples
          </Box>
          <Stack gap="1">
            <For each={currentSamples()}>
              {([key, vm]) => (
                <Button
                  size="sm"
                  variant={selectedSample() === key ? "subtle" : "ghost"}
                  justifyContent="flex-start"
                  onClick={() => setSelectedSample(key)}
                  class={css({ textAlign: "left" })}
                >
                  <Box>
                    <Box fontWeight="medium">{key}</Box>
                    <Box fontSize="xs" color="fg.muted">
                      {vm.label}
                    </Box>
                  </Box>
                </Button>
              )}
            </For>
          </Stack>
        </Box>
      </Box>

      {/* メインコンテンツ */}
      <Box flex="1" p="6" overflow="auto">
        <Show
          when={currentVM()}
          fallback={
            <Flex align="center" justify="center" h="100%" color="fg.muted">
              ← サイドバーからサンプルを選択してください
            </Flex>
          }
        >
          {(vm) => (
            <Box>
              {/* メタ情報 */}
              <Box mb="4" p="3" bg="bg.subtle" borderRadius="md" fontSize="sm">
                <span class={css({ color: "fg.muted" })}>Resource: </span>
                <span class={css({ fontWeight: "medium" })}>
                  {vm().resource}
                </span>
                <span class={css({ mx: "2", color: "border.default" })}>|</span>
                <span class={css({ color: "fg.muted" })}>Type: </span>
                <span class={css({ fontWeight: "medium" })}>{vm().type}</span>
                <Show when={viewType() === "form"}>
                  <span class={css({ mx: "2", color: "border.default" })}>
                    |
                  </span>
                  <span class={css({ color: "fg.muted" })}>Mode: </span>
                  <span class={css({ fontWeight: "medium" })}>
                    {(vm() as any).mode}
                  </span>
                </Show>
                <span class={css({ mx: "2", color: "border.default" })}>|</span>
                <span class={css({ color: "fg.muted" })}>Theme: </span>
                <span
                  class={css({
                    fontWeight: "medium",
                    color: theme() === "custom" ? "purple.600" : undefined,
                  })}
                >
                  {theme() === "custom" ? "Custom" : "Default"}
                </span>
              </Box>

              {/* コンポーネント表示 */}
              <Show when={viewType() === "list"}>
                <ListView
                  vm={vm() as any}
                  onAction={handleAction}
                  onRowClick={(rowId) => console.log("Row clicked:", rowId)}
                  onSort={(field, order) => console.log("Sort:", field, order)}
                  onSearch={(query) => console.log("Search:", query)}
                  onFilterChange={(id, active) =>
                    console.log("Filter:", id, active)
                  }
                  onSelectionChange={(ids) => console.log("Selection:", ids)}
                />
              </Show>

              <Show when={viewType() === "form"}>
                <FormView
                  vm={vm() as any}
                  onAction={handleAction}
                  onFieldChange={handleFieldChange}
                  onSubmit={() => console.log("Submit")}
                />
              </Show>

              <Show when={viewType() === "show"}>
                <ShowView vm={vm() as any} onAction={handleAction} />
              </Show>
            </Box>
          )}
        </Show>
      </Box>
    </Flex>
  );
}
