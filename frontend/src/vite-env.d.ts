/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_WS_URL: string;
  readonly VITE_SUI_PACKAGE_ID: string;
  readonly VITE_SUI_NETWORK: string;
  readonly VITE_SUI_RPC_URL: string;
  readonly VITE_PREDICTION_MARKET_PACKAGE: string;
  readonly VITE_SETTLEMENT_MANAGER_PACKAGE: string;
  readonly VITE_MARKET_FACTORY_PACKAGE: string;
  readonly VITE_YELLOW_WS_ENDPOINT: string;
  readonly VITE_YELLOW_API_KEY: string;
  readonly VITE_ENABLE_3D_GRAPHICS: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_DEBUG_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
