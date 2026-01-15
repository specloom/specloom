/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App.tsx";
// Use CSS bundled from @specloom/solidjs package
import "@specloom/solidjs/styles.css";
// App-specific styles (sidebar, layout)
import "../styled-system/styles.css";
// Custom theme overrides
import "./custom-theme.css";

const root = document.getElementById("app");

if (!root) {
  throw new Error("Root element not found");
}

render(() => <App />, root);
