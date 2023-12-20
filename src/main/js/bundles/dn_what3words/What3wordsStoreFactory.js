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
import What3wordsStore from "./What3wordsStore";

function What3wordsStoreFactory() {
    let _registration;

    function _unregisterStore() {
        const reg = _registration;
        _registration = undefined;
        if (reg) {
            reg.unregister();
        }
    }

    return {
        activate() {
            this._initStore();
        },
        _initStore() {
            const props = this._properties;
            props.apiKey = this.model.get("apiKey");
            const store = new What3wordsStore(props);
            _registration = this._componentContext.getBundleContext().registerService(["ct.api.Store"], store, props);
        },
        deactivate() {
            _unregisterStore();
        }
    };
}

export default What3wordsStoreFactory;
