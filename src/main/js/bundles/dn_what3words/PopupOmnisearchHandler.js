/*
 * Copyright (C) 2022 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function PopupOmnisearchHandler(){

    let id =  "PopupHandler";
    let type =  [
        "select",
        "clear"
    ];

    return {
        activate: function () {
            const props = this._properties || {};
            this.id = props.id || this.id;
            this.type = props.type || this.type;
        },

        deactivate: function () {
            this._clear();
        },

        handle: function (item, opts) {
            // Check if mode is clear
            if (opts.clear) {
                this._clear();
                return;
            }
            opts = opts || {};
            const store = opts.store;
            const metadata = store.getMetadata();
            if (!metadata || (metadata && metadata.supportsGeometry !== undefined && metadata.supportsGeometry === false)) {
                console.warn("PopupOmnisearchHandler.handle: Unable to render popup item, store does not support geometry");
                return;
            }
            const geometry = item.geometry;
            if (!geometry) {
                console.warn("PopupOmnisearchHandler.handle: Unable to render popup item since no geometry is found.");
                return;
            }
            const mapWidgetModel = this.model;

            this._clear();

            const view = mapWidgetModel.get("view");


            let lat = Math.round(item.geometry.latitude * 1000) / 1000;
            let lon = Math.round(item.geometry.longitude * 1000) / 1000;

            view.popup.open({
                // Set the popup's title to the coordinates of the location
                title: "what3words",
                location: item.geometry // Set the location of the popup to the clicked location
            });
            view.popup.content = `///${item.title} <--> [${lon}, ${lat}]`;

        },

        _clear: function () {
            const view = this.model.get("view");
            view && view.popup.close();
        }
    };
}

export default PopupOmnisearchHandler;

