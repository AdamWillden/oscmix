/*
 * OscMix Web
 * Copyright (C) 2026 Martin Augustyniak
 * SPDX-License-Identifier: GPL-3.0-or-later
 * https://www.gnu.org/licenses/gpl-3.0.html
 */
"use strict";export function buildOutputSelect({outputs,selected,activeSends,onSelect}){const select=document.createElement("select");select.className="output-select";const active=new Set(activeSends??[]);for(const{index,name}of outputs){const opt=new Option((active.has(index)?"\u2713 ":"")+name,String(index));select.add(opt)}return selected!=null&&(select.value=String(selected)),select.addEventListener("change",()=>onSelect?.(Number(select.value))),select}export function updateOutputName(index,name){document.querySelectorAll(".output-select").forEach(select=>{for(const opt of select.options)Number(opt.value)===index&&(opt.text=(opt.text.startsWith("\u2713 ")?"\u2713 ":"")+name)})}
