/*
 * OscMix Web
 * Copyright (C) 2026 Martin Augustyniak
 * SPDX-License-Identifier: GPL-3.0-or-later
 * https://www.gnu.org/licenses/gpl-3.0.html
 */
"use strict";export function onEditTrigger(el,handler){el.addEventListener("contextmenu",e=>{e.preventDefault(),handler(e)}),el.addEventListener("click",e=>{e.ctrlKey&&handler(e)})}
