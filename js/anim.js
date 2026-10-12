/*
 * OscMix Web
 * Copyright (C) 2026 Martin Augustyniak
 * SPDX-License-Identifier: GPL-3.0-or-later
 * https://www.gnu.org/licenses/gpl-3.0.html
 */
"use strict";export function cssDurationMs(varName,fallback){const raw=getComputedStyle(document.documentElement).getPropertyValue(varName),n=Number.parseFloat(raw);return Number.isFinite(n)?n:fallback}export function onceTransitionEnd(el,done,fallbackMs){let called=!1;const finish=()=>{called||(called=!0,el.removeEventListener("transitionend",onEnd),clearTimeout(timer),done())},onEnd=e=>{e.target===el&&finish()};el.addEventListener("transitionend",onEnd);const timer=setTimeout(finish,fallbackMs)}export const sleepMs=ms=>new Promise(resolve=>setTimeout(resolve,ms));
