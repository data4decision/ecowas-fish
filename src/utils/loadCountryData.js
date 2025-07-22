// src/utils/loadCountryData.js
export async function loadCountryData(countryCode) {
  try {
    const map = {
      benin: () => import("../data/benin_data.json"),
      burkinafaso: () => import("../data/burkina-faso-data.json"),
      cape: () => import("../data/cape-data.json"),
      cote: () => import("../data/cote-data.json"),
      gambia: () => import("../data/gambia.json"),
      ghana: () => import("../data/ghana-data.json"),
      guinea: () => import("../data/guinea.json"),
      guineabissau: () => import("../data/guinea-bissau.json"),
      liberia: () => import("../data/liberia.json"),
      mali: () => import("../data/mali.json"),
      niger: () => import("../data/niger.json"),
      nigeria: () => import("../data/nigeria.json"),
      senegal: () => import("../data/senegal.json"),
      sierraleone: () => import("../data/sierra-leone.json"),
      togo: () => import("../data/togo.json")
    };

    const key = countryCode.toLowerCase().replace(/[-_\s]/g, "");
    const loader = map[key];
    if (!loader) throw new Error("Unsupported country");
    const result = await loader();
    return result.default;
  } catch (err) {
    console.error("Error loading country data:", err);
    return [];
  }
}
