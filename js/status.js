/*
 * OscMix Web
 * Copyright (C) 2026 Martin Augustyniak
 * SPDX-License-Identifier: GPL-3.0-or-later
 * https://www.gnu.org/licenses/gpl-3.0.html
 */
"use strict";export function appNameFor(backend){return backend==="oscmix"?"OscMix Web":"TotalMix Web"}export function connectionGlyph(v){return v===2?"\u25D1":(v??0)>=.5?"\u25CF":"\u25CB"}export function paintConnection(el,v){if(!el)return;if(v===2){el.className="online hydrating",el.title="hydrating";return}const up=(v??0)>=.5;el.className="online "+(up?"up":"down"),el.title=up?"connected":"disconnected"}export function dspText(v){return v==null?"":`DSP ${Math.round(v)}%`}
