import { QrAr } from './QrAr';
import THREE from 'three';

/**
* @Method: Creates a new QrAr3d component in the given element
* @Param {root: HTMLElement, model: THREE.Group, modelSize: number }
*/
export function QrAr3d (
    root: HTMLElement,
    model: THREE.Group,
    modelSize: number
) : void {
  new QrAr(root, model, modelSize);
}

/**
* @Method: Creates a new QrAr3d component in the given element
* @Param {root: HTMLElement, model: THREE.Group, modelSize: number }
*/
export function QrAr2d (
    root: HTMLElement,
    content: HTMLElement
) : void {
  // TODO: To implement 2d model
}
