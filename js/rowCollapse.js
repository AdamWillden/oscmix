/*
 * OscMix Web
 * Copyright (C) 2026 Martin Augustyniak
 * SPDX-License-Identifier: GPL-3.0-or-later
 * https://www.gnu.org/licenses/gpl-3.0.html
 */
"use strict";import{Store}from"./store.js";const KEY="collapsedRows";function collapsed(){const v=Store.get(KEY,[]);return Array.isArray(v)?v:[]}export function initRowCollapse(){const folded=new Set(collapsed());for(const btn of document.querySelectorAll(".row-toggle")){const bus=btn.dataset.bus,row=btn.closest(".row");if(!bus||!row)continue;const apply=isFolded=>{row.classList.toggle("collapsed",isFolded),btn.title=isFolded?"show this row":"hide this row",btn.setAttribute("aria-expanded",String(!isFolded))};apply(folded.has(bus)),btn.addEventListener("click",()=>{const isFolded=!row.classList.contains("collapsed");isFolded?folded.add(bus):folded.delete(bus),Store.set(KEY,[...folded]),apply(isFolded)})}}
