const VERSION = 1; // 版本号
const SAVE_ID = "poti_save"; // 保存 ID
var prevSave = "", autosave; // 上一次保存的数据和自动保存

// 获取玩家初始数据
function getPlayerData() {
    let s = {
        energy: E(0), // 能量

        upgrades: {}, // 升级

        eed: {
            ticks: E(0), // EED 的 ticks
            amount: E(0), // EED 的数量
        },

        refined: {
            energy: E(0), // 精炼能量
            unl: false, // 是否解锁
        },

        stars: E(0), // 星星

        chal: {
            active: 0, // 当前激活的挑战
            completion: [null], // 挑战完成情况
        },

        galactic: {
            energy: E(0), // 银河能量
            unl: false, // 是否解锁
        },

        psi: {
            active: false, // 是否激活
            essence: E(0), // 精华
        },

        meta: {
            energy: E(0), // 元能量
            particles: E(0), // 粒子
            unl: false, // 是否解锁
        },

        time: 0, // 游戏时间

        saved_cam: { x: 0, y: 0 }, // 保存的相机位置
    };

    // 初始化升级数据
    for (let k in UPGRADES) s.upgrades[k] = E(0);
    // 初始化挑战完成情况
    for (let i = 1; i < CHALLENGES.length; i++) s.chal.completion[i] = 0;

    return s;
}

// 重置游戏数据
function wipe(reload) {
    player = getPlayerData(); // 获取初始数据
    reloadTemp(); // 重新加载临时数据
    if (reload) {
        save(); // 保存
        location.reload(); // 重新加载页面
    }
}

// 加载玩家数据
function loadPlayer(load) {
    const DATA = getPlayerData();
    player = deepNaN(load, DATA); // 处理 NaN
    player = deepUndefinedAndDecimal(player, DATA); // 处理未定义和 Decimal
    camera_pos = player.saved_cam; // 加载保存的相机位置
}

// 克隆玩家数据
function clonePlayer(obj, data) {
    let unique = {};

    for (let k in obj) {
        if (data[k] == null || data[k] == undefined) continue;
        unique[k] = Object.getPrototypeOf(data[k]).constructor.name == "Decimal"
            ? E(obj[k])
            : typeof obj[k] == 'object'
                ? clonePlayer(obj[k], data[k])
                : obj[k];
    }

    return unique;
}

// 处理 NaN
function deepNaN(obj, data) {
    for (let k in obj) {
        if (typeof obj[k] == 'string') {
            if (data[k] == null || data[k] == undefined ? false : Object.getPrototypeOf(data[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) obj[k] = data[k];
        } else {
            if (typeof obj[k] != 'object' && isNaN(obj[k])) obj[k] = data[k];
            if (typeof obj[k] == 'object' && data[k] && obj[k] != null) obj[k] = deepNaN(obj[k], data[k]);
        }
    }
    return obj;
}

// 处理未定义和 Decimal
function deepUndefinedAndDecimal(obj, data) {
    if (obj == null) return data;
    for (let k in data) {
        if (obj[k] === null) continue;
        if (obj[k] === undefined) obj[k] = data[k];
        else {
            if (Object.getPrototypeOf(data[k]).constructor.name == "Decimal") obj[k] = E(obj[k]);
            else if (typeof obj[k] == 'object') deepUndefinedAndDecimal(obj[k], data[k]);
        }
    }
    return obj;
}

// 阻止保存
function preventSaving() { return tmp.the_end; }

// 保存游戏
function save() {
    let str = btoa(JSON.stringify(player)); // 将玩家数据转换为 Base64
    if (preventSaving() || findNaN(str, true)) return; // 如果阻止保存或数据中有 NaN，则返回
    if (localStorage.getItem(SAVE_ID) == '') wipe(); // 如果保存数据为空，则重置
    localStorage.setItem(SAVE_ID, str); // 保存数据
    prevSave = str; // 更新上一次保存的数据
    console.log("游戏已保存！");
    // addNotify("游戏已保存！")
}

// 加载游戏
function load(x) {
    if (typeof x == "string" & x != '') {
        loadPlayer(JSON.parse(atob(x))); // 加载玩家数据
    } else {
        wipe(); // 重置游戏
    }
}

// 导出游戏数据
function exporty() {
    let str = btoa(JSON.stringify(player)); // 将玩家数据转换为 Base64
    save(); // 保存游戏
    let file = new Blob([str], { type: "text/plain" }); // 创建文件
    window.URL = window.URL || window.webkitURL;
    let a = document.createElement("a"); // 创建下载链接
    a.href = window.URL.createObjectURL(file);
    a.download = "POTI 存档 - " + new Date().toGMTString() + ".txt"; // 设置文件名
    a.click(); // 触发下载
}

// 复制游戏数据
function export_copy() {
    let str = btoa(JSON.stringify(player)); // 将玩家数据转换为 Base64

    let copyText = document.getElementById('copy'); // 获取复制文本框
    copyText.value = str;
    copyText.style.visibility = "visible"; // 显示文本框
    copyText.select(); // 选中文本
    document.execCommand("copy"); // 复制文本
    copyText.style.visibility = "hidden"; // 隐藏文本框
}

// 导入游戏数据
function importy() {
    loadgame = prompt("粘贴你的存档。警告：将覆盖你当前的存档！"); // 提示用户粘贴存档
    if (loadgame != null) {
        let keep = player; // 保存当前玩家数据
        try {
            if (findNaN(loadgame, true)) { // 检查是否有 NaN
                error("导入错误，因为数据包含 NaN");
                return;
            }
            localStorage.setItem(SAVE_ID, loadgame); // 保存存档
            location.reload(); // 重新加载页面
        } catch (error) {
            error("导入错误");
            player = keep; // 恢复玩家数据
        }
    }
}

// 从文件导入游戏数据
function importy_file() {
    let a = document.createElement("input"); // 创建文件输入框
    a.setAttribute("type", "file");
    a.click(); // 触发文件选择
    a.onchange = () => {
        let fr = new FileReader(); // 创建文件读取器
        fr.onload = () => {
            let loadgame = fr.result; // 获取文件内容
            if (findNaN(loadgame, true)) { // 检查是否有 NaN
                error("导入错误，因为数据包含 NaN");
                return;
            }
            localStorage.setItem(SAVE_ID, loadgame); // 保存存档
            location.reload(); // 重新加载页面
        };
        fr.readAsText(a.files[0]); // 读取文件内容
    };
}

// 确认重置游戏
function wipeConfirm() {
    if (confirm(`确定要重置你的存档吗？`)) wipe(true); // 提示用户确认重置
}

// 检查 NaN
function checkNaN() {
    let naned = findNaN(player); // 查找 NaN
    if (naned) {
        warn("游戏数据因 " + naned.bold() + " 而出现 NaN"); // 显示警告
        resetTemp(); // 重置临时数据
        loadGame(false, true); // 加载游戏
        tmp.start = 1;
        tmp.pass = 1;
    }
}

// 判断是否为 NaN
function isNaNed(val) {
    return typeof val == "number" ? isNaN(val) : Object.getPrototypeOf(val).constructor.name == "Decimal" ? isNaN(val.mag) : false;
}

// 查找 NaN
function findNaN(obj, str = false, data = getPlayerData(), node = 'player') {
    if (str ? typeof obj == "string" : false) obj = JSON.parse(atob(obj)); // 如果是字符串，则解析
    for (let k in obj) {
        if (typeof obj[k] == "number") if (isNaNed(obj[k])) return node + '.' + k; // 如果是数字且为 NaN，则返回路径
        if (str) {
            if (typeof obj[k] == "string") if (data[k] == null || data[k] == undefined ? false : Object.getPrototypeOf(data[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) return node + '.' + k; // 如果是字符串且为 NaN，则返回路径
        } else {
            if (obj[k] == null || obj[k] == undefined ? false : Object.getPrototypeOf(obj[k]).constructor.name == "Decimal") if (isNaN(E(obj[k]).mag)) return node + '.' + k; // 如果是 Decimal 且为 NaN，则返回路径
        }
        if (typeof obj[k] == "object") {
            let node2 = findNaN(obj[k], str, data[k], (node ? node + '.' : '') + k); // 递归查找
            if (node2) return node2;
        }
    }
    return false;
}