const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = document.getElementById("icon");

const c1Input = document.getElementById("c1");
const c2Input = document.getElementById("c2");

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  return {
    r: parseInt(hex.slice(0,2),16),
    g: parseInt(hex.slice(2,4),16),
    b: parseInt(hex.slice(4,6),16)
  };
}

function recolor() {
  ctx.clearRect(0,0,64,64);
  ctx.drawImage(img,0,0);

  const imageData = ctx.getImageData(0,0,64,64);
  const d = imageData.data;

  const c1 = hexToRgb(c1Input.value);
  const c2 = hexToRgb(c2Input.value);

  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i+1], b = d[i+2];

    if (r > 240 && g > 240 && b > 240) {
      d[i] = c1.r; d[i+1] = c1.g; d[i+2] = c1.b;
    } else if (r > 100 && r < 200) {
      d[i] = c2.r; d[i+1] = c2.g; d[i+2] = c2.b;
    }
  }

  ctx.putImageData(imageData,0,0);
}

c1Input.oninput = recolor;
c2Input.oninput = recolor;
img.onload = recolor;

document.getElementById("download").onclick = async () => {
  const zip = new JSZip();
  const blob = await new Promise(r => canvas.toBlob(r));
  zip.file("icon_01_001.png", blob);

  const content = await zip.generateAsync({type:"blob"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(content);
  a.download = "gd-icons.zip";
  a.click();
};
