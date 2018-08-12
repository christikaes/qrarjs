import { QrAr } from "./lib/QrAr";

import "./qrar.css";

const $ = (selector) => {
    return document.querySelector(selector);
};

const myQrAr = new QrAr($("#qrar"));
