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
import apprt_request from "apprt-request";

const coordsUrl = "https://api.what3words.com/v3/convert-to-3wa";

function MapClickPopupHandler() {

    let _clickHandle;
    let mapWidgetModel;
    let key;

    function cleanup() {
        _clear();
        _clickHandle && _clickHandle.remove();
    }

    function _clear() {
        const view = mapWidgetModel && mapWidgetModel.get("view");
        if (view) {
            view.popup.content = "";
            view.popup.close();
        }
    }

    return {
        activateTool: function () {
            mapWidgetModel = this.mapWidgetModel;
            key = this.what3wordsModel.get("apiKey");
            const view = mapWidgetModel.get("view");
            if(!view){
                return;
            }

            view.popup.autoOpenEnabled = false;
            _clickHandle = view.on("click", (event) => {
                _clear();

                if(key === ""){
                    console.warn("API key for what3words is empty!");
                    return;
                }

                let latitude = event.mapPoint.latitude;
                let lat = Math.round(latitude * 1000) / 1000;
                let longitude = event.mapPoint.longitude;
                let lon = Math.round(longitude * 1000) / 1000;

                view.popup.open({
                    // Set the popup's title to the coordinates of the location
                    title: "what3words for: [" + lon + ", " + lat + "]",
                    location: event.mapPoint // Set the location of the popup to the clicked location
                });

                let queryParams = {key, coordinates: `${latitude},${longitude}`};

                apprt_request(coordsUrl, {query: queryParams}).then(
                    (response) => {
                        view.popup.content = `///${response.words}`;
                    }
                ).catch((e) => {
                    console.warn("Geocoding failed: " + e.response.data.error.message);
                })

            });
        },
        deactivateTool: cleanup,
        deactivate: cleanup
    }

}

export default MapClickPopupHandler;

