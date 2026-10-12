/*
 * OscMix Web
 * Copyright (C) 2026 Martin Augustyniak
 * SPDX-License-Identifier: GPL-3.0-or-later
 * https://www.gnu.org/licenses/gpl-3.0.html
 */
"use strict";let open=null;export function closePopupMenu(){open?.remove(),open=null}document.addEventListener("mousedown",e=>{open&&!open.contains(e.target)&&closePopupMenu()},!0),document.addEventListener("keydown",e=>{e.key==="Escape"&&closePopupMenu()});export function openPopupMenu(x,y,entries){closePopupMenu();const menu=document.createElement("div");menu.className="cr-menu";for(const entry of entries)menu.appendChild(menuEntry(entry));menu.style.left=`${x}px`,menu.style.top=`${y}px`,document.body.appendChild(menu);const r=menu.getBoundingClientRect();return r.right>window.innerWidth-4&&(menu.style.left=`${Math.max(4,window.innerWidth-r.width-4)}px`),r.bottom>window.innerHeight-4&&(menu.style.top=`${Math.max(4,y-r.height)}px`),open=menu,menu}function menuEntry(entry){const el=document.createElement("div");return el.className="cr-menu-item"+(entry.disabled?" disabled":"")+(entry.checked?" checked":""),el.textContent=entry.label,!entry.disabled&&entry.onClick&&el.addEventListener("click",e=>{e.stopPropagation(),entry.checked===void 0?closePopupMenu():el.classList.toggle("checked"),entry.onClick()}),el}
