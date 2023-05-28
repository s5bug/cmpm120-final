import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    let basePath;
    if(env["GITHUB_ACTIONS"] === "true") {
        basePath = "/" + env["GITHUB_REPOSITORY"].split("/")[1];
    } else {
        basePath = "/";
    }
    return {
        build: {
          assetsInlineLimit: 0,
            rollupOptions: {
              input: {
                app: './core-gameplay-1.html',
              },
            },
          },
          server: {
            open: '/core-gameplay-1.html',
          },
        base: basePath
    }
})
