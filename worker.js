// importScripts("https://cdnjs.cloudflare.com/ajax/libs/jimp/0.22.9/jimp.min.js");
importScripts("image_options.js");

onmessage = (a) => {
  var t, s;
  void 0 !== a.data[0] && "$init_scripts" === a.data[0]
    ? ((s = a.data.slice(1)), _i(s))
    : ((t = a.data[0]), (s = a.data[1]), (a = a.data[2]), _d(t, s, a));
};
const _i = (a) => {
  importScripts(...a);
};

const _d = async (s, e, a) => {
  try {
    let t;
    if (typeof e === "string") {
      t = self[e]; // Function should exist on self
    } else {
      var r = e.length;
      t = self[e[0]];
      for (let i = 1; i < r; i++) {
        t = t[e[i]];
      }
    }

    if (typeof t !== "function") {
      throw new Error(`Function ${e} not found in worker.`);
    }

    var result = await t(a); // Call function

    if (result instanceof Uint8Array) {
      result = result.buffer;
    }

    postMessage([s, e, "result", result]);
  } catch (error) {
    console.error("worker error : ", error);
    postMessage([s, e, "error", error.toString()]);
  }
};

// _d = async (s, e, a) => {
//   try {
//     let t;
//     if ("string" == typeof e) t = self[e];
//     else {
//       var r = e.length;
//       t = self[e[0]];
//       for (let a = 1; a < r; a++) t = t[e[a]];
//     }
//     var i = await t(a);
//     postMessage([s, e, "result", i]);
//   } catch (a) {
//     postMessage([s, e, "error", a]);
//   }
// };
