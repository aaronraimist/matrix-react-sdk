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
