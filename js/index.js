
function swapItems() {
    const temp = item1.innerHTML;
    item1.innerHTML = item6.innerHTML;
    item6.innerHTML = temp;
}

let R;

function createPentagon() {
    const ctx = pentagon.getContext('2d');
    pentagon.width = 2 * window.innerWidth / 5;
    pentagon.height = window.innerHeight / 2;
    ctx.clearRect(0, 0, pentagon.width, pentagon.height);
    const w = pentagon.width;
    const h = pentagon.height;
    let bias;
    if (w >= h) {
        R = h / (1 + Math.cos(Math.PI / 5));
        bias = R - h / 2;
    }
    else {
        R = w / (2 * Math.cos(Math.PI / 10));
        bias = R * (1 - Math.cos(Math.PI /5)) / 2;
    }
    ctx.fillStyle = "white";
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
        const x = w / 2 + R * Math.cos(2 * Math.PI * i / 5 - Math.PI / 2);
        const y = h / 2 + R * Math.sin(2 * Math.PI * i / 5 - Math.PI / 2) + bias;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
}

function getArea() {
    console.log(R);
    const area = 5 * Math.pow(R, 2) * Math.sin(2 * Math.PI / 5) / 2;
    areaOutput.textContent = `${area.toFixed(2)}px²`;
}

function convertValue(value) {
    const pattern = /^([1-9]\d*(\.\d+)?|0(\.\d+)?)$/;
    if (pattern.test(value)) {
        return parseFloat(value);
    }
    else {
        return false;
    }
}

function checkTriangle() {
    const a = convertValue(side1.value);
    const b = convertValue(side2.value);
    const c = convertValue(side3.value);
    if (!a || !b || !c) return false;
    return (a + b > c && a + c > b && b + c > a);
}

function showTriangleResult() {
    const result = checkTriangle();
    const message = result ? "Трикутник можливо створити" : "Трикутник не існує";
    alert(message);
    setCookie('triangleResult', message, 1);
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
}

function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) return value;
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

function loadFromCookies() {
    const savedResult = getCookie('triangleResult');
    if (savedResult) {
        if (confirm(`${savedResult}. Після натискання кнопки «ОК» дані будуть видалені.`)) {
            deleteCookie('triangleResult');
            alert("Дані з cookies видалені.");
            location.reload();
        }
        return true;
    }
    return false;
}

function boldenFirstLetter(element) {
    const words = element.textContent.split(' ');
    const formattedWords = words.map(word => {
        if (word.length > 0) {
            return `<strong>${word[0]}</strong>${word.slice(1)}`;
        }
        return word;
    });
    element.innerHTML = formattedWords.join(' ');
}


function boldenFirstLetters() {
    if (!boldCheckbox.checked) {
        return;
    }
    item4.querySelectorAll('li').forEach(element => {
        boldenFirstLetter(element);
    });
}

window.onload = 
function () {
    if (loadFromCookies()) {
        document.getElementById('triangleForm').style.display = 'none';
    }
    if (boldCheckbox.checked) {
        boldenFirstLetters();
    }
    changableID.forEach(arr => {
        arr.forEach(id => {
            const element = document.getElementById(id);
            const currData = localStorage.getItem(id);
            if (currData !== '' && currData !== null) {
                element.textContent = currData;
            }
            
        });
    });
};

const areaOutput = document.getElementById('area-output');
const item1 = document.getElementById('item-1');
const item3 = document.getElementById('item-3');
const item4 = document.getElementById('item-4');
const item6 = document.getElementById('item-6');
const pentagon = document.getElementById('pentagon');
const side1 = document.getElementById('side-1');
const side2 = document.getElementById('side-2');
const side3 = document.getElementById('side-3');
const boldCheckbox = document.getElementById('bolden');

document.getElementById('swap').addEventListener('click', swapItems);
document.getElementById('area').addEventListener('click', getArea);
document.getElementById('triangle').addEventListener('click', showTriangleResult);
window.addEventListener('resize', createPentagon);
document.addEventListener('DOMContentLoaded', createPentagon);

boldCheckbox.addEventListener('change', boldenFirstLetters);

let containers = [];
const containersDiv = document.getElementById('containers');
for (var i = 1; i <= 6; i++) {
    const container = document.createElement('textarea');
    container.style.resize = 'vertical';
    container.style.overflowX = 'auto';
    container.placeholder = `${i}`;
    container.wrap = 'off';
    container.className = 'container';
    container.id = `container-${i}`;
    containersDiv.appendChild(container);
    containers.push(container);
};

const saveButton = document.createElement('button');
saveButton.id = 'save';
saveButton.textContent = 'Save';
saveButton.addEventListener('click', saveChanges);
containersDiv.appendChild(saveButton);

const changableID = [
    ['item-1-1'], 
    ['item-2-1', 'item-2-2'], 
    ['area-output', 'side-1', 'side-2', 'side-3'],
    ['item-4-1', 'item-4-2', 'item-4-3', 'item-4-4', 'item-4-5', 'item-4-6'],
    ['item-5-1'],
    ['item-6-1']
];
let currEdit = [null, null, null, null, null, null];
for (var i = 0; i < 6; i++) {
    changableID[i].forEach(id => {
        const element = document.getElementById(id);
        element.addEventListener('dblclick', () => editText(id));
    });
}

function editText(id) {
    let i;
    for (var j = 0; j < 6; j++) {
        changableID[j].forEach(_id => {
            if (id === _id) {
                i = j;
            }
        });
    }
    currEdit[i] = id;
    const element = document.getElementById(id);
    localStorage.setItem(id, element.textContent !== '' ? element.textContent : element.value);
    containers[i].value = localStorage.getItem(id);

}

function saveChanges() {
    for (var i = 0; i < 6; i++) {
        const currId = currEdit[i];
        if (currId !== null) {
            localStorage.setItem(currId, containers[i].value);
            const element = document.getElementById(currId);
            element.textContent = localStorage.getItem(currId);
        }
    }
}
