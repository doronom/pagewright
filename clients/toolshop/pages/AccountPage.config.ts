import { Page } from '@playwright/test';
import { PageConfig } from '@core/page/types';
import { header } from './sections/header';

export const accountPage = (page: Page): PageConfig => ({
  url: '/account',
  sections: {
    header: header(page),
    overview: {
      fields: {
        title: { locator: page.locator('[data-test="page-title"]'), actions: [] },
      },
    },
  },
});
