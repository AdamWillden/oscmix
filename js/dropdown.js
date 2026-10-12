/*
 * OscMix Web
 * Copyright (C) 2026 Martin Augustyniak
 * SPDX-License-Identifier: GPL-3.0-or-later
 * https://www.gnu.org/licenses/gpl-3.0.html
 */
"use strict";import{setAddr}from"./net.js";export function renderDropdown(c,dispatch){const select=document.createElement("select");select.className="ctl-select",c.tooltip&&(select.title=c.tooltip);for(const o of c.options??[])select.add(new Option(o.label,String(o.value)));const apply=v=>{typeof v=="number"&&(select.value=String(v))};return apply(c.value),select.addEventListener("change",()=>{const v=Number(select.value);c.value=v,setAddr(c.address,v)}),dispatch.set(c.address,v=>{c.value=v,apply(v)}),select}
