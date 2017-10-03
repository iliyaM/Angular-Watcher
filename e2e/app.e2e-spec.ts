import { AngularWatcherPage } from './app.po';

describe('angular-watcher App', () => {
  let page: AngularWatcherPage;

  beforeEach(() => {
    page = new AngularWatcherPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
