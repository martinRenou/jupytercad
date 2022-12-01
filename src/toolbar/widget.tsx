import { ToolbarModel } from './model';
import { Toolbar, ReactWidget } from '@jupyterlab/ui-components';
import { ToolbarReact } from './toolbar';
import * as React from 'react';

export class ToolbarWidget extends Toolbar {
  constructor(options: ToolbarWidget.IOptions) {
    const { model, ...rest } = options;
    super(rest);
    this.addClass('jpcad-toolbar-widget');
    this._model = model;
    const primitives = ReactWidget.create(
      <ToolbarReact toolbarModel={this._model} />
    );

    this.addItem('primitives', primitives);
    this.addItem('spacer', Toolbar.createSpacerItem());
    // this.addItem('collaborators', );
  }

  private _model: ToolbarModel;
}

export namespace ToolbarWidget {
  export interface IOptions extends Toolbar.IOptions {
    model: ToolbarModel;
  }
}
