import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Documentation pages only change when a new version is deployed.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
