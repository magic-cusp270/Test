import Panel from '../libs/panel';
import menuView from '../views/menu.dot';
import constants from '../../config/constants.yml';
import LoginMasqPanel from './login_masq';
import SearchInput from '../ui_components/search_input';
import nconf from '../../local_modules/nconf_getter';

export default class Menu {
  constructor() {
    this.panel = new Panel(this, menuView);
    this.isOpen = false;
    this.menuItems = constants.menu;
    this.isDirectionActive = nconf.get().direction.enabled;

    this.isMasqEnabled = nconf.get().masq.enabled;
    if (this.isMasqEnabled) {
      this.masqPanel = new LoginMasqPanel();

      this.initPromise = this.masqPanel.init().then(() => {
        this.panel.update();
      });
    }
  }

  toggleFavorite() {
    this.close();
    PanelManager.toggleFavorite();
  }

  toggleDirection() {
    this.close();
    if (this.isDirectionActive) {
      PanelManager.toggleDirection();
    }
  }

  async open() {
    if (this.initPromise) {
      await this.initPromise;
    }
    this.isOpen = true;

    await Promise.all([
      this.panel.addClassName(.3, '.menu__panel', 'menu__panel--active'),
      this.panel.addClassName(0, '.menu__overlay', 'menu__overlay--active'),
      this.panel.addClassName(.6, '.menu__overlay', 'menu__overlay--fade_active'),
    ]);
  }

  async close() {
    this.isOpen = false;
    await Promise.all([
      this.panel.removeClassName(.3, '.menu__panel', 'menu__panel--active'),

      this.panel.removeClassName(.6, '.menu__overlay', 'menu__overlay--fade_active'),
      this.panel.removeClassName(0, '.menu__overlay', 'menu__overlay--active'),
    ]);
  }

  async search() {
    PanelManager.resetLayout();
    await this.close();
    SearchInput.select();
  }
}
