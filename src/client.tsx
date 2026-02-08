import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/react-start/client";
import { createRouter } from "./router";

createRouter();

hydrateRoot(document, <StartClient />);
