// types.d.ts
import "expo-constants";

// Extend the ManifestExtra interface to include your custom properties.
declare module 'expo-constants' {
  interface ManifestExtra {
    googleClientIdWeb: string;
    googleClientIdIos: string;
    googleClientIdAndroid: string;
  }
}

declare module 'expo-constants' {
  export const manifest2: {
    extra: ManifestExtra;
  };
}
