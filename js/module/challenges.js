const CHALLENGES = [
    null,
    {
        unl: () => hasUpgrade("E1"), // 解锁条件：拥有升级E1
        pos: [21,0], // 位置

        max: 10, // 最大完成次数
        name: `能量减少`, // 挑战名称
        desc(c) { return `能量速率减少 <b>${formatPow(this.base[c],3)}</b>.` }, // 挑战描述
        base: [0.5,0.392,0.266,0.214,0.181,0.145,0.096,0.062,0.053,0.043,0], // 基础值

        effect(c) { // 效果
            if (chalActive(1)) return E(1) // 如果当前挑战是1，返回1
            let x = player.stars.max(1).log10().div(20).mul(c).add(1).root(2) // 计算效果
            return x
        },
        effDesc: x => formatPow(x), // 效果描述
        reward: x => `星星 (<b class="iconly-star"></b>) 在挑战外提升能量速率 <b>${x}</b>.`, // 奖励描述

        goal(c) { return E('e750') }, // 目标
        res: "energy", // 资源类型

        reset: "energy_r", // 重置类型
    },{
        unl: () => hasUpgrade("E1"), // 解锁条件：拥有升级E1
        pos: [22,0], // 位置

        max: 3, // 最大完成次数
        name: `无升级`, // 挑战名称
        desc(c) { return [ // 挑战描述
            `你无法购买 <b>A*</b> 升级，除了 <b>A1</b>.`,
            `你无法购买 <b>B*</b> 升级.`,
            `你无法购买 <b>A*</b> 和 <b>B*</b> 升级，除了 <b>A1</b>.`,
            `???`,
        ][c] },
        base: [CHAL_A_UPGS, PREFIX_TO_UPGS["B"], CHAL_A_UPGS.concat(PREFIX_TO_UPGS["B"])], // 基础值

        reward: x => `解锁更多升级.`, // 奖励描述

        goal(c) { return [E('e1600'),E('e2100'),E('e7200'),EINF][c] }, // 目标
        res: "energy", // 资源类型

        reset: "energy_r", // 重置类型
    },{
        unl: () => hasUpgrade("E1"), // 解锁条件：拥有升级E1
        pos: [23,0], // 位置

        max: 5, // 最大完成次数
        name: `减少维度`, // 挑战名称
        desc(c) { return `<b>EED</b> 的数量不能超过 <b>${this.base[c]}</b>.` }, // 挑战描述
        base: [8,6,4,2,1,1], // 基础值

        effect(c) { // 效果
            let x = c > 0 ? 10-c : EINF
            return x
        },
        effDesc: x => format(x,0), // 效果描述
        reward: x => `每购买 <b>${x}</b> 个维度，增加 <b>1</b> 个 <b>EED</b>.`, // 奖励描述

        goal(c) { return E('e1800') }, // 目标
        res: "energy_p", // 资源类型

        reset: "energy_r", // 重置类型
    },{
        unl: () => hasUpgrade("F6"), // 解锁条件：拥有升级F6
        pos: [24,0], // 位置

        max: 5, // 最大完成次数
        name: `能量减少 II`, // 挑战名称
        desc(c) { return `能量和精炼能量减少 <b>${formatPow(this.base[c],3)}</b>.` }, // 挑战描述
        base: [0.5,0.375,0.239,0.18,0.15,0], // 基础值

        effect(c) { // 效果
            if (chalActive(4)) return E(1) // 如果当前挑战是4，返回1
            let x = player.stars.max(1).log10().div(250).mul(c).add(1).root(3) // 计算效果
            return x
        },
        effDesc: x => formatPow(x), // 效果描述
        reward: x => `星星在挑战外提升精炼能量获取 <b>${x}</b>.`, // 奖励描述

        goal(c) { // 目标
            if (c > 2) return [E('e4200'),E('e34e5'),EINF][c-3]
            return E('e500')
        },
        res: "energy_r", // 资源类型

        reset: "energy_g", // 重置类型
    },{
        unl: () => hasUpgrade("F6"), // 解锁条件：拥有升级F6
        pos: [25,0], // 位置

        max: 3, // 最大完成次数
        name: `无升级 II`, // 挑战名称
        desc(c) { return [ // 挑战描述
            `你无法购买 <b>C*</b> 升级.`,
            `你无法购买 <b>D*</b> 升级.`,
            `你无法购买 <b>C*</b> 和 <b>D*</b> 升级.`,
            `???`,
        ][c] },
        base: [PREFIX_TO_UPGS["C"], PREFIX_TO_UPGS["D"], PREFIX_TO_UPGS["C"].concat(PREFIX_TO_UPGS["D"])], // 基础值

        reward: x => `解锁更多升级.`, // 奖励描述

        goal(c) { return [E('e2400'),E('e38000'),E('e9e9'),EINF][c] }, // 目标
        res: "energy_r", // 资源类型

        reset: "energy_g", // 重置类型
    },{
        unl: () => hasUpgrade("F6"), // 解锁条件：拥有升级F6
        pos: [26,0], // 位置

        max: 5, // 最大完成次数
        name: `指数能量减少`, // 挑战名称
        desc(c) { return `能量速率的指数减少 <b>${formatPow(this.base[c],3)}</b>.` }, // 挑战描述
        base: [0.5,0.433,0.357,0.309,0.272,0], // 基础值

        effect(c) { // 效果
            c = c > 1 ? 2 ** (c-1) : c
            let x = player.energy.max(1).log10().add(1).pow(c*0.55) // 计算效果
            return x
        },
        effDesc: x => formatMult(x), // 效果描述
        reward: x => `能量提升星系能量获取 <b>${x}</b>.`, // 奖励描述

        goal(c) { // 目标
            return E('ee5')
        },
        res: "energy", // 资源类型

        reset: "energy_g", // 重置类型
    },
]

// 获取挑战基础值
function getChallengeBase(c, def=1) { return player.chal.active == c ? CHALLENGES[c].base[player.chal.completion[c]] : def }

// 检查当前挑战是否激活
function chalActive(c) { return player.chal.active == c }

// 获取挑战效果
function getChalEffect(c, def=1) { return tmp.chal_effect[c] ?? def }

// 进入挑战
function enterChallenge(i) {
    let active = player.chal.active, c = CHALLENGES[active], comps = player.chal.completion

    if (active > 0 && CURRENCIES[c.res].amount.gte(c.goal(comps[active]))) {
        comps[active] = Math.min(comps[active] + 1, c.max)
    }

    doReset(CHALLENGES[i == 0 ? active : i].reset,true)
    if (i > 0 && comps[i] < CHALLENGES[i].max) player.chal.active = i
    else player.chal.active = 0
}

// 设置挑战
function setupChallenges() {
    for (let i = 1; i < CHALLENGES.length; i++) {
        let c = CHALLENGES[i], max = c.max, curr = CURRENCIES[c.res]

        createGridElement(`chal-${i}`, {
            unl: c.unl,
            pos: c.pos,

            html: `
            <button onclick="enterChallenge(${i})" class="grid-button" id="challenge-grid-${i}"></button>
            `,

            updateHTML() {
                let c_el = el("challenge-grid-" + i), lvl = player.chal.completion[i], comp = lvl >= max, goal = c.goal(lvl)

                let h = `<b>${c.name}</b> [${lvl}/${max}]`

                let u = c.effDesc ? c.effDesc(tmp.chal_effect[i]) + (comp ? " " : " ➜ " + c.effDesc(c.effect(lvl+1))) : ""

                h += `<div>${c.desc(lvl)}</div><div>Reward: ${c.reward(u)}</div>`

                if (!comp) h += `<div>Goal: ${format(goal,0)} ${curr.name}</div>`

                c_el.innerHTML = h
                c_el.className = el_classes({"grid-button": true, bought: comp, locked: !comp && chalActive(i) && curr.amount.lt(goal)})
            },
        })
    }

    createGridElement(`chal-exit`, {
        unl: ()=>player.chal.active>0,
        pos: [20,1],

        html: `
        <button onclick="enterChallenge(0)" class="grid-button" id="challenge-button"></button>
        `,

        updateHTML() {
            let c = CHALLENGES[player.chal.active], goal = c.goal(player.chal.completion[player.chal.active]), curr = CURRENCIES[c.res]
            el('challenge-button').innerHTML = `${curr.amount.gte(goal) ? "完成" : "退出"} 挑战 <b>[${c.name}]</b>`
        },
    })
}

// 更新挑战临时数据
function updateChallengesTemp() {
    for (let i = 1; i < CHALLENGES.length; i++) {
        let c = CHALLENGES[i], lvl = player.chal.completion[i]
        if (c.effect) tmp.chal_effect[i] = c.effect(lvl)
    }
}
