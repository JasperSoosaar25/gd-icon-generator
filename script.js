const canvas = document.getElementById("iconCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const img = document.getElementById("iconTemplate");

const c1Text = document.getElementById("primaryColor");
const c1Picker = document.getElementById("primaryColorPicker");

const c2Text = document.getElementById("secondaryColor");
const c2Picker = document.getElementById("secondaryColorPicker");

const generateBtn = document.getElementById("generateBtn");
const status = document.getElementById("status");

function hexToRgb(hex) {
    hex = hex.replace("#", "");
    return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16)
    };
}

function recolorIcon() {
    ctx.clearRect(0, 0, 64, 64);
    ctx.drawImage(img, 0, 0, 64, 64);

    const imageData = ctx.getImageData(0, 0, 64, 64);
    const d = imageData.data;

    const c1 = hexToRgb(c1Text.value);
    const c2 = hexToRgb(c2Text.value);

    for (let i = 0; i < d.length; i += 4) {
        const r = d[i];
        const g = d[i + 1];
        const b = d[i + 2];

        // White → Color 1
        if (r > 240 && g > 240 && b > 240) {
            d[i] = c1.r;
            d[i + 1] = c1.g;
            d[i + 2] = c1.b;
        }

        // Gray → Color 2
        else if (
            Math.abs(r - g) < 10 &&
            Math.abs(r - b) < 10 &&
            r > 100 && r < 200
        ) {
            d[i] = c2.r;
            d[i + 1] = c2.g;
            d[i + 2] = c2.b;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function syncColors() {
    c1Text.value = c1Picker.value;
    c2Text.value = c2Picker.value;
    recolorIcon();
}

c1Text.addEventListener("input", () => {
    c1Picker.value = c1Text.value;
    recolorIcon();
});

c2Text.addEventListener("input", () => {
    c2Picker.value = c2Text.value;
    recolorIcon();
});

c1Picker.addEventListener("input", syncColors);
c2Picker.addEventListener("input", syncColors);

img.onload = recolorIcon;

// ZIP EXPORT
generateBtn.addEventListener("click", async () => {
    status.textContent = "Generating ZIP...";
    const zip = new JSZip();

    const blob = await new Promise(r => canvas.toBlob(r));
    zip.file("icon_01_001.png", blob);

    const content = await zip.generateAsync({ type: "blob" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "gd-icons.zip";
    a.click();

    status.textContent = "Done!";
});
