import { ConsolePanel } from '@jupyterlab/console';
import { ServiceManager } from '@jupyterlab/services';
import { BoxPanel, Widget } from '@lumino/widgets';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { IEditorMimeTypeService } from '@jupyterlab/codeeditor';
import { debounce } from '../tools';
import {
  closeIcon,
  CommandToolbarButton,
  expandIcon,
  Toolbar
} from '@jupyterlab/ui-components';
import { CommandRegistry } from '@lumino/commands';

export class ConsoleView extends BoxPanel {
  constructor(options: ConsoleView.IOptions) {
    super({ direction: 'top-to-bottom' });
    this.addClass('jpcad-console');
    const { manager, contentFactory, mimeTypeService, rendermime } = options;
    const clonedRendermime = rendermime.clone();
    this._consolePanel = new ConsolePanel({
      manager,
      contentFactory,
      mimeTypeService,
      rendermime: clonedRendermime,
      kernelPreference: { name: 'python3', shutdownOnDispose: true }
    });
    this._consolePanel.console.node.dataset.jpInteractionMode = 'notebook';
    this.addWidget(this._consolePanel);
    BoxPanel.setStretch(this._consolePanel, 1);

    this._consolePanel.toolbar.addItem('spacer', Toolbar.createSpacerItem());

    this._consolePanel.toolbar.addItem(
      'toggle',
      new CommandToolbarButton({
        label: '',
        icon: expandIcon,
        id: 'jupytercad:toggleConsole',
        commands: options.commandRegistry
      })
    );
    this._consolePanel.toolbar.addItem(
      'close',
      new CommandToolbarButton({
        label: '',
        icon: closeIcon,
        id: 'jupytercad:removeConsole',
        commands: options.commandRegistry
      })
    );
  }

  get consolePanel() {
    return this._consolePanel;
  }

  dispose(): void {
    if (this.isDisposed) {
      return;
    }
    this._consolePanel.dispose();
    super.dispose();
  }
  execute() {
    this._consolePanel.console.execute(false);
  }

  protected onResize(msg: Widget.ResizeMessage): void {
    super.onResize(msg);
    this._resize();
  }
  private _consolePanel: ConsolePanel;
  private _resize = debounce(() => {
    window.dispatchEvent(new Event('resize'));
  }, 200);
}

export namespace ConsoleView {
  export interface IOptions {
    manager: ServiceManager.IManager;
    contentFactory: ConsolePanel.IContentFactory;
    mimeTypeService: IEditorMimeTypeService;
    rendermime: IRenderMimeRegistry;
    commandRegistry: CommandRegistry;
  }
}
