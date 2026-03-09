import {
  createContext,
  useContext,
  type JSX,
  type ParentProps,
} from "solid-js";
import type { I18n, SpecloomTranslations, TranslationParams } from "./types.js";
import { jaTranslations } from "./ja.js";
import { enTranslations } from "./en.js";

function createI18nInstance(translations: SpecloomTranslations): I18n {
  return {
    t(key: keyof SpecloomTranslations, params?: TranslationParams) {
      let result = translations[key];
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          result = result.replaceAll(`{${k}}`, String(v));
        }
      }
      return result;
    },
    translations,
  };
}

const defaultI18n = createI18nInstance(jaTranslations);

const I18nContext = createContext<I18n>(defaultI18n);

export interface I18nProviderProps extends ParentProps {
  translations?: Partial<SpecloomTranslations>;
  /** Use a preset locale. Defaults to "ja". */
  locale?: "ja" | "en";
}

/**
 * Provides i18n translations to specloom components.
 * Default locale is Japanese ("ja").
 */
export function I18nProvider(props: I18nProviderProps): JSX.Element {
  const base = props.locale === "en" ? enTranslations : jaTranslations;
  const merged = props.translations
    ? { ...base, ...props.translations }
    : base;
  const i18n = createI18nInstance(merged);

  return (
    <I18nContext.Provider value={i18n}>{props.children}</I18nContext.Provider>
  );
}

/** Access the i18n instance. Works without a provider (defaults to Japanese). */
export function useI18n(): I18n {
  return useContext(I18nContext);
}
