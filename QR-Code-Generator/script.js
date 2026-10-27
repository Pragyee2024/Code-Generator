qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8']; // supports emoji / non-Latin text

const $ = (id) => document.getElementById(id);
const input = $('qrInput');
const fgColor = $('fgColor');
const bgColor = $('bgColor');
const sizeInput = $('size');
const sizeOut = $('sizeOut');
const levelSel = $('level');
const shapeSel = $('shape');
const canvas = $('qrCanvas');
const ctx = canvas.getContext('2d');
const frame = $('frame');
const warnMsg = $('warnMsg');
const statusMsg = $('status');
const pngBtn = $('downloadPng');
const svgBtn = $('downloadSvg');
const copyBtn = $('copyBtn');

const QUIET = 4; 
let current = null; 

function luminance(hex) {
    const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
        .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function contrast(a, b) {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
}

function setEnabled(on) {
    [pngBtn, svgBtn, copyBtn].forEach((b) => (b.disabled = !on));
}

function drawModule(g, shape, x, y, s) {
    if (shape === 'dot') {
        g.beginPath();
        g.arc(x + s / 2, y + s / 2, s * 0.46, 0, Math.PI * 2);
        g.fill();
    } else if (shape === 'round') {
        g.beginPath();
        g.roundRect(x, y, s, s, s * 0.35);
        g.fill();
    } else {
        g.fillRect(x, y, s, s);
    }
}

function render() {
    const text = input.value.trim();
    statusMsg.textContent = '';
    warnMsg.hidden = true;
    sizeOut.textContent = sizeInput.value;

    if (!text) {
        current = null;
        frame.classList.remove('has-code');
        setEnabled(false);
        return;
    }

    let qr;
    try {
        qr = qrcode(0, levelSel.value); 
        qr.addData(text, 'Byte');
        qr.make();
    } catch (err) {
        current = null;
        frame.classList.remove('has-code');
        setEnabled(false);
        warnMsg.textContent = 'Too much text for a QR code. Shorten it or choose a lower error correction level.';
        warnMsg.hidden = false;
        return;
    }

    const count = qr.getModuleCount();
    const total = count + QUIET * 2;
    const cell = Math.max(1, Math.floor(Number(sizeInput.value) / total));
    const px = cell * total;
    canvas.width = px;
    canvas.height = px;

    ctx.fillStyle = bgColor.value;
    ctx.fillRect(0, 0, px, px);
    ctx.fillStyle = fgColor.value;
    for (let r = 0; r < count; r++) {
        for (let c = 0; c < count; c++) {
            if (qr.isDark(r, c)) drawModule(ctx, shapeSel.value, (c + QUIET) * cell, (r + QUIET) * cell, cell);
        }
    }

    current = { qr, count, cell, px };
    frame.classList.add('has-code');
    setEnabled(true);

    if (contrast(fgColor.value, bgColor.value) < 3 || luminance(fgColor.value) > luminance(bgColor.value)) {
        warnMsg.textContent = 'Low contrast or inverted colors: some scanners may not read this code.';
        warnMsg.hidden = false;
    }
}

function buildSvg() {
    const { qr, count } = current;
    const total = count + QUIET * 2;
    const shape = shapeSel.value;
    let shapes = '';
    for (let r = 0; r < count; r++) {
        for (let c = 0; c < count; c++) {
            if (!qr.isDark(r, c)) continue;
            const x = c + QUIET, y = r + QUIET;
            if (shape === 'dot') shapes += `<circle cx="${x + 0.5}" cy="${y + 0.5}" r="0.46"/>`;
            else if (shape === 'round') shapes += `<rect x="${x}" y="${y}" width="1" height="1" rx="0.35"/>`;
            else shapes += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
        }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${sizeInput.value}" height="${sizeInput.value}" shape-rendering="${shape === 'square' ? 'crispEdges' : 'geometricPrecision'}"><rect width="${total}" height="${total}" fill="${bgColor.value}"/><g fill="${fgColor.value}">${shapes}</g></svg>`;
}

function saveBlob(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

pngBtn.addEventListener('click', () => {
    if (!current) return;
    canvas.toBlob((blob) => {
        saveBlob(blob, 'qr-code.png');
        statusMsg.textContent = 'Downloaded qr-code.png';
    }, 'image/png');
});

svgBtn.addEventListener('click', () => {
    if (!current) return;
    saveBlob(new Blob([buildSvg()], { type: 'image/svg+xml' }), 'qr-code.svg');
    statusMsg.textContent = 'Downloaded qr-code.svg';
});

copyBtn.addEventListener('click', () => {
    if (!current) return;
    if (!navigator.clipboard || !window.ClipboardItem) {
        statusMsg.textContent = 'Copying images isn’t supported in this browser. Use Download PNG.';
        return;
    }
    canvas.toBlob((blob) => {
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
            .then(() => (statusMsg.textContent = 'Image copied to clipboard'))
            .catch(() => (statusMsg.textContent = 'Couldn’t copy. Use Download PNG instead.'));
    }, 'image/png');
});

[input, fgColor, bgColor, sizeInput, levelSel, shapeSel].forEach((el) => el.addEventListener('input', render));
levelSel.addEventListener('change', render);
shapeSel.addEventListener('change', render);

render();
