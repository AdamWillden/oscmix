/*
 * OscMix Web
 * Copyright (C) 2026 Martin Augustyniak
 * SPDX-License-Identifier: GPL-3.0-or-later
 * https://www.gnu.org/licenses/gpl-3.0.html
 */
"use strict";import{setAddr}from"./net.js";import{createSwatchPicker}from"./swatchPicker.js";const COLORS={1:"#e9e9e9",2:"#9aa0aa",3:"#e08a3c",4:"#d24b4b",5:"#4a7fd0",6:"#4caf6a",7:"#d8c04a",8:"#d06aa8"};export const StripColor=(()=>{const picker=createSwatchPicker({colors:Object.entries(COLORS).map(([idx,hex])=>({value:idx,color:hex})),noneTitle:"Default",onPick:(target,value)=>{const idx=parseInt(value,10),applied=idx===0?1:idx;target.apply(applied),setAddr(target.address,applied)}});return{showPicker(e,address,apply){picker.show(e,{address,apply})}}})();
