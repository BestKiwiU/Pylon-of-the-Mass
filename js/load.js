function loadGame(start=true, gotNaN=false) {
    // 加载游戏数据
    if (!gotNaN) prevSave = localStorage.getItem(SAVE_ID)
    player = getPlayerData()
    load(prevSave)
    reloadTemp()

    // 如果是首次加载，初始化游戏
    if (start) {
        doCreateGridElements() // 创建网格元素
        setupHTML() // 设置HTML
        setupCanvas() // 设置画布
        cameraEvent() // 绑定相机事件

        setTimeout(() => {
            updateTemp() // 更新临时数据
            loop() // 开始游戏循环

            el("app").style.display = "" // 显示游戏界面

            updateGEsDisplay() // 更新网格元素显示
            updateGEsHTML() // 更新网格元素HTML
            
            autosave = setInterval(save, 60000, true) // 设置自动保存
            setInterval(loop, 1000/FPS) // 设置游戏循环
        }, 100);
    }
}

function doCreateGridElements() {
    // 创建“最终之星”网格元素
    createGridElement("final-star", {
        unl: ()=>hasUpgrade("UNLOCK5"), // 解锁条件
        pos: [40,40], // 位置

        html: `
        <img id="final-star-img" src="style/spark.png" draggable="false">
        `, // HTML内容
    })

    // 创建“黑洞”网格元素
    createGridElement("black-hole", {
        persist: true, // 持久化

        unl: ()=>hasUpgrade("END4"), // 解锁条件
        pos: [20,20], // 位置

        html: `
        <img id="black-hole-img" src="style/black-hole.png" draggable="false">
        `, // HTML内容
    })

    // 创建资源网格元素
    CURR_GRIDS.forEach(x => {createCurrencyGridElement(x)})

    // 创建重置网格元素
    for (let i in RESETS) createResetGridElement(i);

    // 设置挑战
    setupChallenges()

    // 创建“EED”网格元素
    createGridElement("EED",{
        unl: () => hasUpgrade("A7"), // 解锁条件

        html: `
        <p>你有 <span id="EED-amount">0</span> <b class='iconly-bolt'></b>P，能量速率增加 <b id="EED-effect">???</b>。</p>
        <p>时间速度: <b id="EED-tickspeed">1/s</b></p>
        <div id="EED-ctns"></div>
        `, // HTML内容

        style: {
            "background" : "#111", // 背景颜色
        },

        pos: [4, -1], size: [2, 2], // 位置和大小

        updateHTML() {
            el('EED-amount').innerHTML = format(player.eed.amount, 0) + " " + formatGain(player.eed.amount, tmp.currency_gain.energy_p)
            el('EED-tickspeed').innerHTML = format(tmp.eed.tickspeed) + "/s"
            el('EED-effect').innerHTML = formatMult(tmp.eed.effect)

            let dim = tmp.eed.dimensions, h = "", ticks = player.eed.ticks

            if (dim.lte(8)) for (let i = 1; i <= dim.floor().toNumber(); i++) {
                h += `<div>能量维度 ${format(i,0)} | ${F.exponential_sum(ticks, dim.sub(i)).format(0)}</div>`
            } else for (let i = 1; i <= 4; i++) {
                if (i == 1) h += `<div>能量维度 1 | ${F.exponential_sum(ticks, dim.sub(1)).format(0)}</div>`;
                else if (i == 2) h += `<div>...</div>`;
                else h += `<div>能量维度 ${format(dim.sub(4).add(i),0)} | ${F.exponential_sum(ticks, 4-i).format(0)}</div>`;
            }

            el('EED-ctns').innerHTML = h
        },
    })

    // 创建“能量星系”网格元素
    createGridElement("energy-galaxy",{
        unl: () => hasUpgrade("C6"), // 解锁条件
        style: {
            "background" : "#111", // 背景颜色
        },
        pos: [2, 19], size: [2, 2], // 位置和大小
        html: `
        <div style="position: relative; height: 400px; width: 100%;"><div id="energy-galaxy"><img id="energy-galaxy-img" draggable="false" src="style/galaxy.png"></div></div>
        <p>你的能量星系直径为 <b id="energy-galaxy-diameter">123</b> 光年，转换为 <b id="energy-galaxy-effect">+123</b> 额外 <b>B2</b> 和 <b>B4</b> 的基础值。</p>
        `, // HTML内容
        updateHTML() {
            el('energy-galaxy-img').style.width = tmp.galaxy.diameter.root(9).div(10).max(0).min(1).toNumber()*400 + "px"

            el('energy-galaxy-diameter').innerHTML = format(tmp.galaxy.diameter,0)
            el('energy-galaxy-effect').innerHTML = "+"+format(tmp.galaxy.effect,4)
        },
    })

    // 创建“PSI按钮”网格元素
    createGridElement("psi-btn",{
        unl: ()=>hasUpgrade("UNLOCK4"), // 解锁条件
        pos: [40,21], // 位置

        html: `
        <button onclick="enterPSI()" class="grid-button">
        扩张会强制重置星系能量。在扩张中，所有前星系资源和 <b>EED</b> 的时间速度会减少到指数的 <b>^0.75</b>，且升级 <b>F1</b> 和 <b>F12</b> 无效。Psi 精华 (<b class='iconly-delta'></b>) 根据你的能量生成。<br><br><div id="psi-text"></div>
        </button>
        `, // HTML内容

        updateHTML() {
            el('psi-text').innerHTML = player.psi.active ? "停止扩张。" : "开始扩张。"
        },
    })

    // 创建“元粒子”网格元素
    createGridElement("meta-particle",{
        unl: () => player.meta.unl, // 解锁条件
        style: {
            "background" : "#111", // 背景颜色
        },
        pos: [42, 40], size: [2, 2], // 位置和大小
        html: `
        <p>你有 <span id="meta-particle-amount">0</span> <b class='iconly-infinity'></b>P（基于你的能量和元能量）。</p>
        <div id="meta-particle-effect"></div>
        `, // HTML内容
        updateHTML() {
            el('meta-particle-amount').innerHTML = format(player.meta.particles, 0) + " " + formatGain(player.meta.particles, tmp.currency_gain.meta_p)

            el('meta-particle-effect').innerHTML = META_PARTICLE_EFFECTS.filter(v => v[0]()).map((v,i) => v[2](tmp.meta_p_effects[i])).join("<br>")
        },
    })

    // 创建“终结”网格元素
    createGridElement("the-end",{
        unl: () => hasUpgrade("END4"), // 解锁条件

        pos: [20, 20], // 位置
        
        html: `
        <button onclick="the_end()" class="grid-button">
        <p>将所有物质吸入黑洞！将所有潜在能量转化为 <span id="hidden-text-te">????</span> 生产！</p><p>这是终结，但代价是什么？</p>
        </button>
        `, // HTML内容

        updateHTML() {
            const N = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?!+-*/=()[]{}\\|;:'"~@#$%^&`
            var n = ''

            for (let i = 0; i < 4; i++) {
                n += N[Math.floor(Math.random()*N.length)]
            }

            el('hidden-text-te').textContent = n
        },
    })

    // 设置升级
    setupUpgrades()
}