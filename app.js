"use strict";

let x = "x";

function f() {
  console.log(x);
}

setTimeout(() => {f();}, 0);