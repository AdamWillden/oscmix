/*
 * OscMix Web
 * Copyright (C) 2026 Martin Augustyniak
 * SPDX-License-Identifier: GPL-3.0-or-later
 * https://www.gnu.org/licenses/gpl-3.0.html
 */
"use strict";export class Button{#element;#onLabel;#offLabel;#autoToggle;#guard;#active=!1;constructor(options={}){const label=options.label??"";this.#onLabel=options.onLabel??label,this.#offLabel=options.offLabel??label,this.#autoToggle=options.autoToggle??!0,this.#guard=options.guard??null;const btn=document.createElement("button");btn.type="button",btn.classList.add(options.variant??"btn"),options.modifier&&btn.classList.add(options.modifier),options.className&&btn.classList.add(...options.className.split(/\s+/).filter(Boolean)),options.title&&(btn.title=options.title),btn.addEventListener("click",()=>{this.#guard&&!this.#guard()||(this.#autoToggle&&(this.active=!this.#active),btn.dispatchEvent(new CustomEvent("user-change",{detail:{active:this.#active}})))}),this.#element=btn,this.active=options.active??!1}get element(){return this.#element}get active(){return this.#active}set active(v){this.#active=!!v,this.#element.classList.toggle("on",this.#active),this.#element.textContent=this.#active?this.#onLabel:this.#offLabel}set label(text){this.#onLabel=this.#offLabel=text,this.#element.textContent=this.#active?this.#onLabel:this.#offLabel}}
