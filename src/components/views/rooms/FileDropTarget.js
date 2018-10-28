/*
Copyright 2018 OpenMarket Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

import React from "react";
import sdk from '../../../index';
import { _t } from '../../../languageHandler';

export default class FileDropTarget extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            className: 'mx_RoomView_fileDropTarget_hide'
        }
        this._onDragEnter = this._onDragEnter.bind(this);
        this._onDragLeave = this._onDragLeave.bind(this);
        this._onDragOver = this._onDragOver.bind(this);
        this._onDrop = this._onDrop.bind(this);
    }

    componentDidMount() {
        window.addEventListener('mouseup', this._onDragLeave);
        window.addEventListener('dragenter', this._onDragEnter);
        window.addEventListener('dragover', this._onDragOver);
        document.getElementById('dragbox').addEventListener('dragleave', this._onDragLeave);
        window.addEventListener('drop', this._onDrop);
    }

    componentWillUnmount() {
        window.removeEventListener('mouseup', this._onDragLeave);
        window.removeEventListener('dragenter', this._onDragEnter);
        window.addEventListener('dragover', this._onDragOver);
        document.getElementById('dragbox').removeEventListener('dragleave', this._onDragLeave);
        window.removeEventListener('drop', this._onDrop);
    }

    _onDragEnter(ev) {
        ev.stopPropagation();
        ev.preventDefault();

        this.setState({ className: 'mx_RoomView_fileDropTarget' });

        if (ev.dataTransfer.types.indexOf('Files') >= 0) {
            this.setState({ draggingFile: true })
            ev.dataTransfer.dropEffect = 'copy';
        }
    }

    _onDragOver(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        this.setState({ draggingFile: false });
        const files = [...ev.dataTransfer.files];
        files.forEach(this.uploadFile);
    }

    _onDragLeave(ev) {
        ev.stopPropagation();
        ev.preventDefault();

        this.setState({ className: 'mx_RoomView_fileDropTarget_hide' });
        this.setState({ draggingFile: false });
    }

    _onDrop(ev) {
        ev.preventDefault();

        this.setState({ draggingFile: false });
        const files = [...ev.dataTransfer.files];

        files.forEach(this.uploadFile);
        this.setState({ className: 'mx_RoomView_fileDropTarget_hide' });
    }

    async uploadFile(file) {
        dis.dispatch({action: 'focus_composer'});

        if (MatrixClientPeg.get().isGuest()) {
            dis.dispatch({action: 'require_registration'});
            return;
        }

        try {
            await ContentMessages.sendContentToRoom(file, this.state.room.roomId, MatrixClientPeg.get());
        } catch (error) {
            if (error.name === "UnknownDeviceError") {
                // Let the status bar handle this
                return;
            }
            const ErrorDialog = sdk.getComponent("dialogs.ErrorDialog");
            console.error("Failed to upload file " + file + " " + error);
            Modal.createTrackedDialog('Failed to upload file', '', ErrorDialog, {
                title: _t('Failed to upload file'),
                description: ((error && error.message)
                    ? error.message : _t("Server may be unavailable, overloaded, or the file too big")),
            });

            // bail early to avoid calling the dispatch below
            return;
        }

        // Send message_sent callback, for things like _checkIfAlone because after all a file is still a message.
        dis.dispatch({
            action: 'message_sent',
        });
    }

    render() {
        const TintableSvg = sdk.getComponent("elements.TintableSvg");

        return (
            <div className="mx_RoomView_fileDropTarget">
                <div className="mx_RoomView_fileDropTargetLabel"
                  title={_t("Drop File Here")}>
                    <TintableSvg src="img/upload-big.svg" width="45" height="59" />
                    <br />
                    { _t("Drop file here to upload") }
                </div>
            </div>
        );
    }
}

