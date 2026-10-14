import docsConfig from "@/docs.config";
import { createDocsAPI } from "@farming-labs/next/api";

export const { GET } = createDocsAPI(docsConfig);

export const revalidate = false;
