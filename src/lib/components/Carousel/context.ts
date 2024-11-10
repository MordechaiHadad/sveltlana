import type { Direction } from "./types.js";

export interface IContext {
    currentSlide: number;
    direction: Direction;
    length: number;
    carousel?: HTMLElement;
    currentItem?: HTMLElement;
}