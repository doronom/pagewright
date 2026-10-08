import { Locator } from '@playwright/test';

export type ActionType =
  'fill' | 'click' | 'check' | 'radio' | 'toggle' | 'selectOption' | 'upload' | 'waitForElement' | 'getText';

export type ActionFunction = (locator: Locator, value?: unknown) => Promise<unknown>;

export interface ActionConfig {
  action: ActionType | (string & {});
  value?: unknown;
}

export interface FieldConfig {
  locator: Locator;
  actions: ActionConfig[];
}

export interface SectionConfig {
  fields: Record<string, FieldConfig>;
}

export interface PageConfig {
  url?: string;
  sections: Record<string, SectionConfig>;
}
