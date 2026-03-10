/** All translatable UI keys used by specloom components. */
export interface SpecloomTranslations {
  // Form page
  /** Page title for create mode. Receives `{label}` */
  "form.title.create": string;
  /** Page title for edit mode. Receives `{label}` */
  "form.title.edit": string;
  /** Submit button label for create mode */
  "form.submit.create": string;
  /** Submit button label for edit mode */
  "form.submit.edit": string;
  /** Cancel button label */
  "form.cancel": string;
  /** Unsaved changes indicator */
  "form.unsavedChanges": string;
  /** Validation error alert title */
  "form.validationFailed": string;
  /** Record not found message. Receives `{id}` */
  "form.recordNotFound": string;

  // List page
  /** Record count. Receives `{count}` */
  "list.recordCount": string;
  /** Create button. Receives `{label}` */
  "list.newButton": string;
  /** Search placeholder */
  "list.searchPlaceholder": string;
  /** Inline loading label for list refresh */
  "list.loading": string;
  /** Reset all filters button */
  "list.filterAll": string;
  /** Table column header for row action link */
  "list.openColumn": string;
  /** Table column header for row actions */
  "list.actionsColumn": string;
  /** Toggle all visible rows */
  "list.selectAll": string;
  /** Toggle a row selection */
  "list.selectRow": string;
  /** Row link label for show action */
  "list.action.view": string;
  /** Row link label for edit action */
  "list.action.edit": string;
  /** Selected count. Receives `{count}` */
  "list.selectedCount": string;
  /** Pagination previous button label */
  "list.pagination.previous": string;
  /** Pagination next button label */
  "list.pagination.next": string;
  /** Page size selector label */
  "list.pagination.pageSize": string;
  /** Pagination summary. Receives `{from}`, `{to}`, `{total}` */
  "list.pagination.summary": string;

  // Show page
  /** Page title for show view. Receives `{label}` and `{id}` */
  "show.title": string;
  /** Edit button on show page */
  "show.editButton": string;
  /** Record not found message. Receives `{id}` */
  "show.recordNotFound": string;

  // Common
  /** Back link arrow prefix */
  "common.backPrefix": string;
}

export type TranslationParams = Record<string, string | number>;

export interface I18n {
  /** Translate a key with optional interpolation params. */
  t(key: keyof SpecloomTranslations, params?: TranslationParams): string;
  /** The raw translations object. */
  translations: SpecloomTranslations;
  /** BCP 47 locale string (e.g. "ja-JP", "en-US"). */
  locale: string;
}
