/*
 * OscMix Web
 * Copyright (C) 2026 Martin Augustyniak
 * SPDX-License-Identifier: GPL-3.0-or-later
 * https://www.gnu.org/licenses/gpl-3.0.html
 */
"use strict";export async function downloadFrom(url,fallbackName){const r=await fetch(url);if(!r.ok)throw new Error(`download ${r.status}`);const disposition=r.headers.get("Content-Disposition")??"",name=/filename="([^"]+)"/.exec(disposition)?.[1]??fallbackName,blob=await r.blob(),a=document.createElement("a");a.href=URL.createObjectURL(blob),a.download=name,document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(a.href),1e3)}export function pickFile(accept){return new Promise(resolve=>{const input=document.createElement("input");input.type="file",accept&&(input.accept=accept),input.addEventListener("change",async()=>{const file=input.files?.[0];resolve(file?{name:file.name,text:await file.text()}:null)}),input.addEventListener("cancel",()=>resolve(null)),input.click()})}
