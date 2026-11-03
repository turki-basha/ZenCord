/*
 * ZenCord, a Discord client mod
 * Copyright (c) 2026 ZenCord Team and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

function parseHeaders(headers) {
    const result = new Headers();
    if (!headers)
        return result;

    const headersArr = headers.trim().split("\n");
    for (var i = 0; i < headersArr.length; i++) {
        var row = headersArr[i];
        var index = row.indexOf(":")
            , key = row.slice(0, index).trim().toLowerCase()
            , value = row.slice(index + 1).trim();

        result.append(key, value);
    }
    return result;
}

function blobTo(to, blob) {
    if (to === "arrayBuffer" && blob.arrayBuffer) return blob.arrayBuffer();
    return new Promise((resolve, reject) => {
        var fileReader = new FileReader();
        fileReader.onload = event => resolve(event.target.result);
        if (to === "arrayBuffer") fileReader.readAsArrayBuffer(blob);
        else if (to === "text") fileReader.readAsText(blob, "utf-8");
        else reject("unknown to");
    });
}

function GM_fetch(url, opt) {
    return new Promise((resolve, reject) => {
        // https://www.tampermonkey.net/documentation.php?ext=dhdg#GM_xmlhttpRequest
        const options = opt || {};
        options.url = url;
        options.data = options.body;
        options.responseType = "blob";
        options.onload = resp => {
            var blob = resp.response;
            resp.blob = () => Promise.resolve(blob);
            resp.arrayBuffer = () => blobTo("arrayBuffer", blob);
            resp.text = () => blobTo("text", blob);
            resp.json = async () => JSON.parse(await blobTo("text", blob));
            resp.headers = parseHeaders(resp.responseHeaders);
            resp.ok = resp.status >= 200 && resp.status < 300;
            resolve(resp);
        };
        options.ontimeout = () => reject("fetch timeout");
        options.onerror = () => reject("fetch error");
        options.onabort = () => reject("fetch abort");
        GM_xmlhttpRequest(options);
    });
}
export const fetch = GM_fetch;
