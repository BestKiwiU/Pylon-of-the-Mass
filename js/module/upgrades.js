const UPGRADES = {
    "A1": {
        unl: () => true,
        pos: [0,1],

        desc: `每秒生成<b>+1</b>能量。`,
        curr: "energy",

        cost: E(0),
    },
    "A2": {
        unl: () => hasUpgrade("A1"),
        pos: [1,1],
        max: EINF,

        get base() { return Decimal.add(2, upgradeEffect("A4")).mul(simpleUpgradeEffect("C8")) },

        get desc() { return `每级增加能量生成速率<b>${formatMult(this.base)}</b>。` },
        curr: "energy",

        cost: a => Decimal.pow(3,a.sumBasePO(tmp.slow_scale_1.mul(0.1))).mul(10),
        bulk: a => a.div(10).log(3).sumBasePO(tmp.slow_scale_1.mul(0.1),true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "A3": {
        unl: () => hasUpgrade("A2"),
        pos: [1,0],

        desc: `能量以降低的速率提升其生成速率。`,
        curr: "energy",

        cost: E(100),

        effect(a) {
            let e = Decimal.add(hasUpgrade("A6") ? 0.5 : 1/3,upgradeEffect("A10"))
            let x = expPow(player.energy.add(1),e)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "A4": {
        unl: () => hasUpgrade("A3"),
        pos: [1,-1],
        max: EINF,

        get base() { return Decimal.add(0.5, simpleUpgradeEffect("A8",0)) },

        get desc() { return `每级增加<b>A2</b>的基础值<b>+${format(this.base)}</b>。` },
        curr: "energy",

        cost: a => Decimal.pow(10,a.pow(hasUpgrade("C1") ? 1.75 : 2)).mul(1e3),
        bulk: a => a.div(1e3).log(10).root(hasUpgrade("C1") ? 1.75 : 2).floor().add(1),

        effect(a) {
            let x = a.mul(this.base)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "A5": {
        unl: () => hasUpgrade("A4"),
        pos: [0, -1],
        max: EINF,

        get base() { return player.energy.add(10).log10() },

        get desc() { return `每级增加能量生成速率<b>${formatMult(this.base)}</b>。（基于lg[<b class="iconly-bolt"></b>]）` },
        curr: "energy",

        cost: a => Decimal.pow(1e3,a.sumBasePO(tmp.slow_scale_1.mul(0.1))).mul(1e6),
        bulk: a => a.div(1e6).log(1e3).sumBasePO(tmp.slow_scale_1.mul(0.1),true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "A6": {
        unl: () => hasUpgrade("A3"),
        pos: [2,0],

        desc: `改进<b>A3</b>。`,
        curr: "energy",

        cost: E(1e15),
    },
    "A7": {
        unl: () => hasUpgrade("A6"),
        pos: [3,0],

        desc: `解锁<b>无尽能量维度</b>（EEDs）。`,
        curr: "energy",

        cost: E(1e32),
    },
    "A8": {
        unl: () => hasUpgrade("A7"),
        pos: [2,-1],

        desc: `充能能量以降低的速率提升<b>A4</b>的基础值。`,
        curr: "energy",

        cost: E(1e64),

        effect(a) {
            let x = player.eed.amount.add(1).log10().root(2).div(25)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "A9": {
        unl: () => hasUpgrade("A7"),
        pos: [-1, -1],
        max: EINF,

        get base() { return player.eed.amount.add(10).log10() },

        get desc() { return `每级增加能量生成速率<b>${formatMult(this.base)}</b>。（基于lg[<b class="iconly-bolt"></b>P]）` },
        curr: "energy",

        cost: a => Decimal.pow(1e5,a.sumBasePO(tmp.slow_scale_1.mul(0.1))).mul(1e100),
        bulk: a => a.div(1e100).log(1e5).sumBasePO(tmp.slow_scale_1.mul(0.1),true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "A10": {
        unl: () => hasUpgrade("A6"),
        pos: [2,1],
        max: 15,

        desc: `每级增加<b>A3</b>的指数<b>+0.01</b>。`,
        curr: "energy",

        cost: a => Decimal.pow(1e10,Decimal.pow(1.1,a).sub(1).mul(10)).mul(1e300),
        bulk: a => a.div(1e300).log(1e10).div(10).add(1).log(1.1).floor().add(1),

        effect(a) {
            let x = a.div(100)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "A11": {
        unl: () => player.refined.unl,
        pos: [-1,1],

        desc: `充能能量以降低的速率提升精炼能量的获取。`,
        curr: "energy",

        cost: E('e729'),

        effect(a) {
            let x = player.eed.amount.max(1).log10().div(1000).pow(0.6).sub(1).pow10().add(1)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "A12": {
        unl: () => hasUpgrade("F5"),
        pos: [-1,0],
        max: EINF,

        desc: `每级增加能量的指数<b>+0.1</b>。`,
        curr: "energy",

        cost: a => Decimal.pow('ee6',a.sumBase(1.5)).mul('e5e5'),
        bulk: a => a.div('e5e5').log('ee6').sumBase(1.5,true).floor().add(1),

        effect(a) {
            let x = a.div(10).add(1)
            return x
        },
        effDesc: x => formatPow(x),
    },

    "B1": {
        unl: () => hasUpgrade("A7"),
        pos: [4,1],
        max: EINF,

        desc: `每级增加<b>EED</b>的数量<b>+1</b>。`,
        curr: "energy",

        cost: a => Decimal.pow(20,a.sumBasePO(tmp.slow_scale_1.mul(hasUpgrade("C9") ? 1/3 : 0.5))).mul(1e33),
        bulk: a => a.div(1e33).log(20).sumBasePO(tmp.slow_scale_1.mul(hasUpgrade("C9") ? 1/3 : 0.5),true).floor().add(1),

        effect(a) {
            let x = a
            return x
        },
        effDesc: x => "+"+format(x,0),
    },
    "B2": {
        unl: () => hasUpgrade("A7"),
        pos: [5, 1],
        max: EINF,

        get base() { return Decimal.add(hasUpgrade("C2") ? 1.3 : 1.25, tmp.galaxy.effect) },

        get desc() { return `每级增加<b>EED</b>的时间速度<b>${formatMult(this.base)}</b>。` },
        curr: "energy",

        cost: a => Decimal.pow(10,a.scale(Decimal.div(500,hasUpgrade("F9")?upgradeEffect("F1"):1),3,"E2")).mul(1e33),
        bulk: a => a.div(1e33).log(10).scale(Decimal.div(500,hasUpgrade("F9")?upgradeEffect("F1"):1),3,"E2",true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "B3": {
        unl: () => hasUpgrade("B1"),
        pos: [4,2],
        max: EINF,

        desc: `每级增加<b>EED</b>的数量<b>+1</b>。`,
        curr: "energy_p",

        cost: a => Decimal.pow(1e35,a.sumBasePO(tmp.slow_scale_1.mul(0.5))).mul(1e140),
        bulk: a => a.div(1e140).log(1e35).sumBasePO(tmp.slow_scale_1.mul(0.5),true).floor().add(1),

        effect(a) {
            let x = a
            return x
        },
        effDesc: x => "+"+format(x,0),
    },
    "B4": {
        unl: () => hasUpgrade("A7"),
        pos: [5,2],
        max: EINF,

        get base() { return Decimal.add(hasUpgrade("C2") ? 1.3 : 1.25, tmp.galaxy.effect).pow(simpleUpgradeEffect("B5")) },

        get desc() { return `每级增加<b>EED</b>的时间速度<b>${formatMult(this.base)}</b>。` },
        curr: "energy_p",

        cost: a => Decimal.pow(10,a.sumBasePO(tmp.slow_scale_1.mul(0.1))).mul(1e300),
        bulk: a => a.div(1e300).log(10).sumBasePO(tmp.slow_scale_1.mul(0.1),true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "B5": {
        unl: () => hasUpgrade("C6"),
        pos: [6,1],

        desc: `充能能量以极大降低的速率提升<b>B4</b>的基础值。`,

        cost: E('e7500'),
        curr: "energy_p",

        effect(a) {
            let x = player.eed.amount.max(1).log10().add(10).log10()
            return x
        },
        effDesc: x => formatPow(x),
    },
    "B6": {
        unl: () => hasUpgrade("G7"),
        pos: [6,2],
        max: EINF,

        get base() { return Decimal.add(2, hasUpgrade("G9") ? upgradeEffect("G4",0) : 0) },

        get desc() { return `每级增加<b>EED</b>的数量及其时间速度的指数<b>${formatMult(this.base)}</b>。` },
        curr: "energy_p",

        cost: a => a.sumBasePO(Decimal.mul(0.1, simpleUpgradeEffect("G11"))).pow_base(10).mul(1e100).pow_base(10),
        bulk: a => a.log10().div(1e100).log10().sumBasePO(Decimal.mul(0.1, simpleUpgradeEffect("G11")),true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },

    "C1": {
        unl: () => player.refined.unl,
        pos: [-1,21],

        desc: `略微降低<b>A4</b>的成本。`,
        curr: "energy_r",

        cost: E(1),
    },
    "C2": {
        unl: () => player.refined.unl,
        pos: [1,21],

        desc: `增加<b>B2</b>和<b>B4</b>的基础值<b>+0.05</b>。`,
        curr: "energy_r",

        cost: E(1),
    },
    "C3": {
        unl: () => hasUpgrade("C1"),
        pos: [-1,20],

        desc: `将能量生成速率提升至<b>1.05</b>次方。`,
        curr: "energy_r",

        cost: E(10),
    },
    "C4": {
        unl: () => hasUpgrade("C2"),
        pos: [1,20],

        desc: `重置时解锁<b>EED</b>（升级<b>A7</b>）。`,
        curr: "energy_r",

        cost: E(10),

        on_buy() {
            if (!hasUpgrade("A7")) player.upgrades["A7"] = E(1)
        },
    },
    "C5": {
        unl: () => hasUpgrade("C3"),
        pos: [-1,19],

        desc: `未使用的精炼能量提升能量生成速率。`,
        curr: "energy_r",

        cost: E(50),

        effect(a) {
            let x = player.refined.energy.add(1).pow(2)
            if (hasUpgrade("C11")) x = x.pow(upgradeEffect("C11"));
            x = hasUpgrade("C14") ? x.overflow('ee4',0.5) : x.min('ee4')
            return x
        },
        effDesc: x => formatMult(x),
    },
    "C6": {
        unl: () => hasUpgrade("C4"),
        pos: [1,19],

        desc: `解锁<b>能量星系</b>。`,
        curr: "energy_r",

        cost: E(1e3),
    },
    "C7": {
        unl: () => hasUpgrade("C5"),
        pos: [0,19],
        max: EINF,

        get base() { return Decimal.add(2, upgradeEffect("C12")) },

        get desc() { return `每级增加精炼能量获取<b>${formatMult(this.base)}</b>。` },
        curr: "energy_r",

        cost: a => Decimal.pow(10,a.sumBasePO(tmp.slow_scale_1.mul(0.1))).mul(1e3),
        bulk: a => a.div(1e3).log(10).sumBasePO(tmp.slow_scale_1.mul(0.1),true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "C8": {
        unl: () => hasUpgrade("C6"),
        pos: [4,20],

        desc: `<b>能量星系</b>的直径提升<b>A2</b>的基础值。`,
        curr: "energy_r",

        cost: E(5e5),

        effect(a) {
            let x = expPow(tmp.galaxy.diameter.max(1),0.75)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "C9": {
        unl: () => hasUpgrade("C6"),
        pos: [4,19],

        desc: `略微降低<b>B1</b>的成本。`,
        curr: "energy_r",

        cost: E(5e6),
    },
    "C10": {
        unl: () => hasUpgrade("C6"),
        pos: [-1,22],

        desc: `<b>能量星系</b>的直径增加<b>EED</b>的数量。`,
        curr: "energy_r",

        cost: E(1e9),

        effect(a) {
            let x = tmp.galaxy.diameter.max(1).log10().pow(1.5).floor()
            return x
        },
        effDesc: x => "+"+format(x,0),
    },
    "C11": {
        unl: () => hasUpgrade("C10"),
        pos: [0,22],

        desc: `精炼能量提升<b>C5</b>的效果。`,
        curr: "energy_r",

        cost: E(1e13),

        effect(a) {
            let x = expPow(player.refined.energy.max(1).log10().add(1),0.75)
            return x
        },
        effDesc: x => formatPow(x),
    },
    "C12": {
        unl: () => hasUpgrade("C11"),
        pos: [1,22],
        max: EINF,

        get base() { return Decimal.add(1, simpleUpgradeEffect("E7",0)) },

        get desc() { return `每级增加<b>C7</b>的基础值<b>+${format(this.base)}</b>。` },
        curr: "energy_r",

        cost: a => Decimal.pow(10,a.pow(2)).mul(1e15),
        bulk: a => a.div(1e15).log(10).root(2).floor().add(1),

        effect(a) {
            let x = a.mul(this.base)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "C13": {
        unl: () => player.chal.completion[2] > 1,
        pos: [3,22],

        desc: `重置时被动生成<b>100%</b>的精炼能量。`,
        curr: "energy_r",

        cost: E(1e38),
    },
    "C14": {
        unl: () => player.chal.completion[2] > 2,
        pos: [5,21],

        desc: `<b>C5</b>的硬上限现在变为软上限。`,
        curr: "energy_r",

        cost: E(1e210),
    },

    "D1": {
        unl: () => hasUpgrade("C6"),
        pos: [2,21],
        max: EINF,

        desc: `每级增加<b>能量星系</b>的直径<b>+100%</b>。`,
        curr: "energy_r",

        cost: a => Decimal.pow(5,a).mul(1e2),
        bulk: a => a.div(1e2).log(5).floor().add(1),

        effect(a) {
            let x = a.add(1)
            return x
        },
        effDesc: x => formatMult(x,0),
    },
    "D2": {
        unl: () => hasUpgrade("C6"),
        pos: [3,21],
        max: EINF,

        desc: `每级增加<b>能量星系</b>的直径<b>+100%</b>。`,
        curr: "energy_p",

        cost: a => Decimal.pow('e200',a.sumBasePO(tmp.slow_scale_1.mul(0.1))).mul('e2000'),
        bulk: a => a.div('e2000').log('e200').sumBasePO(tmp.slow_scale_1.mul(0.1),true).floor().add(1),

        effect(a) {
            let x = a.add(1)
            return x
        },
        effDesc: x => formatMult(x,0),
    },
    "D3": {
        unl: () => hasUpgrade("C6"),
        pos: [4,21],
        max: EINF,

        desc: `每级增加<b>能量星系</b>的直径<b>+100%</b>。`,
        curr: "energy",

        cost: a => Decimal.pow('e100',a.sumBasePO(tmp.slow_scale_1.mul(0.1))).mul('e1000'),
        bulk: a => a.div('e1000').log('e100').sumBasePO(tmp.slow_scale_1.mul(0.1),true).floor().add(1),

        effect(a) {
            let x = a.add(1)
            return x
        },
        effDesc: x => formatMult(x,0),
    },
    "D4": {
        unl: () => player.chal.completion[2] > 1,
        pos: [4,22],
        max: EINF,

        desc: `每级增加<b>能量星系</b>的直径<b>+100%</b>。`,
        curr: "star",

        cost: a => Decimal.pow(10,a).mul(1e12),
        bulk: a => a.div(1e12).log(10).floor().add(1),

        effect(a) {
            let x = a.add(1)
            return x
        },
        effDesc: x => formatMult(x,0),
    },

    "E1": {
        unl: () => hasUpgrade("UNLOCK2"),
        pos: [19,0],

        desc: `解锁<b>挑战</b>。`,
        curr: "star",

        cost: E(10),
    },
    "E2": {
        unl: () => player.chal.completion[2] > 0,
        pos: [19,1],

        desc: `能量以降低的速率提升星星生成。`,
        curr: "energy",

        cost: E('e2850'),

        effect(a) {
            let x = player.energy.max(1).log10().div(100).root(3).pow_base(10)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "E3": {
        unl: () => player.chal.completion[2] > 0,
        pos: [19,-1],

        desc: `充能能量以降低的速率提升星星生成。`,
        curr: "energy_p",

        cost: E('e15000'),

        effect(a) {
            let x = player.eed.amount.max(1).log10().div(1000).root(3).pow_base(20)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "E4": {
        unl: () => player.chal.completion[2] > 1,
        pos: [20,-1],

        desc: `精炼能量以降低的速率提升星星生成。`,
        curr: "energy_r",

        cost: E('e39'),

        effect(a) {
            let x = player.refined.energy.max(1).log10().div(10).root(3).pow_base(300)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "E5": {
        unl: () => player.chal.completion[2] > 2,
        pos: [21,-1],
        max: EINF,

        get base() { return Decimal.add(3, simpleUpgradeEffect("E7",0)) },

        get desc() { return `每级增加星星生成<b>${formatMult(this.base)}</b>。` },
        curr: "star",

        cost: a => Decimal.pow(10,a.sumBasePO(tmp.slow_scale_1.mul(0.1))).mul(1e15),
        bulk: a => a.div(1e15).log(10).sumBasePO(tmp.slow_scale_1.mul(0.1),true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "E6": {
        unl: () => hasUpgrade("E5"),
        pos: [22,-1],

        get base() { return Decimal.add(2, 0) },

        get desc() { return `每完成一个挑战，星星生成增加<b>${formatMult(this.base)}</b>。` },
        curr: "star",

        cost: E('1e20'),

        effect(a) {
            let x = 0
            for (let i = 1; i < CHALLENGES.length; i++) x += player.chal.completion[i]
            return this.base.pow(x)
        },
        effDesc: x => formatMult(x),
    },
    "E7": {
        unl: () => hasUpgrade("E6"),
        pos: [23,-1],

        desc: `星星以降低的速率提升<b>C12</b>和<b>E5</b>的基础值。`,
        curr: "star",

        cost: E('1e32'),

        effect(a) {
            let x = player.stars.max(1).log10().root(2).div(5)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "E8": {
        unl: () => hasUpgrade("E7"),
        pos: [21,1],

        desc: `<b>EED</b>的数量提升其时间速度。`,
        curr: "star",

        cost: E('1e36'),

        effect(a) {
            let x = tmp.eed.dimensions.sub(1).max(0).root(2).div(20).add(1)
            return x
        },
        effDesc: x => formatPow(x),
    },
    "E9": {
        unl: () => player.chal.completion[5] > 0,
        pos: [23,1],

        desc: `银河能量以降低的速率提升星星生成。`,
        curr: "energy_g",

        cost: E(1e19),

        effect(a) {
            let x = player.galactic.energy.max(1).log10().root(2).div(30).add(1)
            return x
        },
        effDesc: x => formatPow(x),
    },
    "E10": {
        unl: () => hasUpgrade("E9"),
        pos: [24,1],

        desc: `星星增加<b>EED</b>的数量。`,
        curr: "star",

        cost: E(1e230),

        effect(a) {
            let x = player.stars.max(1).log10().root(3).div(10).add(1)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "E11": {
        unl: () => player.chal.completion[5] > 2,
        pos: [24,-1],
        max: EINF,

        get base() { return Decimal.add(1, 0) },

        get desc() { return `每级增加<b>能量星系</b>直径的指数<b>+${format(this.base)}</b>。` },
        curr: "star",

        cost: a => Decimal.pow('e5e3',a.sumBase(1.1)).mul('e9e4'),
        bulk: a => a.div('e9e4').log('e5e3').sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = this.base.mul(a).add(1)
            return x
        },
        effDesc: x => formatPow(x),
    },

    "F1": {
        unl: () => player.galactic.unl,
        pos: [20,39],
        max: EINF,

        get base() { return Decimal.add(1.5, upgradeEffect("F8",0)) },

        get desc() { return `每级使<b>A2</b>、<b>A5</b>、<b>A9</b>、<b>B1</b>、<b>B3-4</b>、<b>C7</b>、<b>D2-3</b>和<b>E5</b>的成本折算<b>${formatMult(this.base)}</b>更慢。` },
        curr: "energy_g",

        cost: a => Decimal.pow(10,a.sumBase(1.25).pow(1.5)),
        bulk: a => a.log(10).root(1.5).sumBase(1.25,true).floor().add(1),

        effect(a) {
            if (player.psi.active) return E(1)
            let x = this.base.pow(-1).pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "F2": {
        unl: () => hasUpgrade("F1"),
        pos: [19,40],

        desc: `重置时解锁精炼能量生成（升级<b>C13</b>）。改进精炼能量的公式。`,
        curr: "energy_g",

        cost: E(100),

        on_buy() {
            if (!hasUpgrade("C13")) player.upgrades["C13"] = E(1)
        },
    },
    "F3": {
        unl: () => hasUpgrade("F1"),
        pos: [21,40],

        desc: `重置时解锁<b>能量星系</b>（升级<b>C6</b>）。<b>能量星系</b>更强。`,
        curr: "energy_g",

        cost: E(100),

        on_buy() {
            if (!hasUpgrade("C6")) player.upgrades["C6"] = E(1)
        },
    },
    "F4": {
        unl: () => hasUpgrade("F2"),
        pos: [19,39],

        desc: `增加能量生成速率<b>×1e100</b>，然后<b>^1.1</b>。`,
        curr: "energy_g",

        cost: E(1e3),
    },
    "F5": {
        unl: () => hasUpgrade("F3"),
        pos: [21,39],

        desc: `解锁新的升级<b>A</b>。`,
        curr: "energy_g",

        cost: E(1e9),
    },
    "F6": {
        unl: () => hasUpgrade("F2"),
        pos: [19,41],

        desc: `重置时保留前3个挑战。解锁新的挑战。`,
        curr: "energy_g",

        cost: E(1e10),
    },
    "F7": {
        unl: () => hasUpgrade("F3"),
        pos: [21,41],
        max: EINF,

        get base() { return Decimal.add(3, upgradeEffect("G4",0)) },

        get desc() { return `每级增加银河能量生成<b>${formatMult(this.base)}</b>。` },
        curr: "energy_g",

        cost: a => Decimal.pow(10,a.sumBasePO(Decimal.mul(0.1,simpleUpgradeEffect("F13")))).mul(1e7),
        bulk: a => a.div(1e7).log(10).sumBasePO(Decimal.mul(0.1,simpleUpgradeEffect("F13")),true).floor().add(1),

        effect(a) {
            let x = Decimal.pow(this.base,a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "F8": {
        unl: () => player.chal.completion[5] > 1,
        pos: [20,38],
        max: EINF,

        get base() { return Decimal.add(0.05, simpleUpgradeEffect("G5",0)) },

        get desc() { return `每级增加<b>F1</b>的基础值<b>+${format(this.base)}</b>。` },
        curr: "energy_g",

        cost: a => Decimal.pow(1e12,a.sumBase(1.1)).mul(1e34),
        bulk: a => a.div(1e34).log(1e12).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = this.base.mul(a)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "F9": {
        unl: () => player.chal.completion[5] > 1,
        pos: [22,40],

        desc: `<b>F1</b>现在影响<b>B2</b>的折算。`,
        curr: "energy_g",

        cost: E(1e53),
    },
    "F10": {
        unl: () => player.chal.completion[5] > 1,
        pos: [22,38],

        desc: `银河能量提升能量生成速率。`,
        curr: "energy_g",

        cost: E(1e120),

        effect(a) {
            let x = expPow(player.galactic.energy.add(1),Decimal.add(2,simpleUpgradeEffect("F12",0)))
            return x
        },
        effDesc: x => formatMult(x),
    },
    "F11": {
        unl: () => player.chal.completion[5] > 2,
        pos: [23,40],

        desc: `重置时被动生成<b>100%</b>的银河能量。`,
        curr: "energy_g",

        cost: E(1e190),
    },
    "F12": {
        unl: () => hasUpgrade("F11"),
        pos: [23,37],

        desc: `改进<b>F10</b>。`,
        curr: "energy_g",

        cost: E(1e250),

        effect(a) {
            if (player.psi.active) return E(0)
            let x = player.galactic.energy.max(10).log10().log10()
            return x
        },
        effDesc: x => "+"+format(x)+"到指数",
    },
    "F13": {
        unl: () => hasUpgrade("UNLOCK4"),
        pos: [19,38],

        desc: `<b>F1</b>现在以降低的速率影响<b>F7</b>的成本。`,
        curr: "energy_g",

        cost: E('e12222'),

        effect(a) {
            let x = upgradeEffect("F1").log10().pow(-2)
            return x
        },
        effDesc: x => formatMult(x),
    },

    "G1": {
        unl: () => hasUpgrade("UNLOCK4"),
        pos: [40,19],
        max: EINF,

        get base() { return Decimal.add(2, upgradeEffect("G4",0)) },

        get desc() { return `每级增加能量生成速率<b>${formatMult(this.base)}</b>。` },
        curr: "psi",

        cost: a => Decimal.pow(10,a.sumBasePO(Decimal.mul(0.1, simpleUpgradeEffect("G11")))).mul(10),
        bulk: a => a.div(10).log(10).sumBasePO(Decimal.mul(0.1, simpleUpgradeEffect("G11")),true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatPow(x),
    },
    "G2": {
        unl: () => hasUpgrade("G1"),
        pos: [39,20],

        desc: `银河能量提升灵能精华。`,
        curr: "psi",

        cost: E(1e3),

        effect(a) {
            let x = player.galactic.energy.max(1).log10().add(1)
            if (hasUpgrade("G6")) x = x.pow(x.log10().add(1))
            return x
        },
        effDesc: x => formatMult(x),
    },
    "G3": {
        unl: () => hasUpgrade("G2"),
        pos: [41,20],
        max: EINF,

        get base() { return Decimal.add(3, upgradeEffect("G4",0)) },

        get desc() { return `每级增加灵能精华生成速率<b>${formatPow(this.base)}</b>。` },
        curr: "psi",

        cost: a => Decimal.pow(10,a.sumBasePO(Decimal.mul(0.1, simpleUpgradeEffect("G11")))).mul(1e7),
        bulk: a => a.div(1e7).log(10).sumBasePO(Decimal.mul(0.1, simpleUpgradeEffect("G11")),true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
  "G4": {
        unl: () => hasUpgrade("G3"),
        pos: [41,19],
        max: EINF,

        get base() { return Decimal.add(0.5, 0) },

        get desc() { return `增加 <b>F7</b>, <b>G1</b>, 和 <b>G3</b> 的基础值，每级增加 <b>+${format(this.base)}</b>。` },
        curr: "psi",

        cost: a => Decimal.pow(100,a.pow(2.1)).mul(1e11),
        bulk: a => a.div(1e11).log(100).root(2.1).floor().add(1),

        effect(a) {
            let x = this.base.mul(a)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "G5": {
        unl: () => hasUpgrade("G4"),
        pos: [39,21],

        desc: `<b>G4</b> 现在以 10% 的效果影响 <b>F8</b> 的基础值。`,
        curr: "psi",

        cost: E(1e30),

        effect(a) {
            let x = upgradeEffect("G4").div(10)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "G6": {
        unl: () => hasUpgrade("G5"),
        pos: [39,19],

        desc: `改进 <b>G2</b>。`,
        curr: "psi",

        cost: E(1e39),
    },
    "G7": {
        unl: () => hasUpgrade("G6"),
        pos: [41,21],

        desc: `解锁新的 <b>B</b> 升级。`,
        curr: "psi",

        cost: E(1e79),
    },
    "G8": {
        unl: () => hasUpgrade("G2"),
        pos: [38,20],

        desc: `充能能量提升灵能精华。`,
        curr: "psi",

        cost: E(1e82),

        effect(a) {
            let x = player.eed.amount.max(1).log10().add(1)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "G9": {
        unl: () => hasUpgrade("G5"),
        pos: [37,20],

        desc: `<b>G4</b> 现在影响 <b>B6</b> 的基础值。`,
        curr: "psi",

        cost: E(1e103),
    },
    "G10": {
        unl: () => hasUpgrade("G9"),
        pos: [40,22],

        desc: `你可以在膨胀之外生成灵能精华。`,
        curr: "psi",

        cost: E(1e105),
    },
    "G11": {
        unl: () => hasUpgrade("G10"),
        pos: [38,22],

        desc: `<b>F1</b> 现在以大幅降低的效果影响 <b>B6</b>, <b>G1</b>, 和 <b>G3</b> 的成本。`,
        curr: "psi",

        cost: E('1e588'),

        effect(a) {
            let x = upgradeEffect("F1").log10().abs().root(1.5482).div(5).add(1).pow(-1)
            return x
        },
        effDesc: x => formatMult(x),
    },

    "AUTO1": {
        unl: () => hasUpgrade("A7"),
        pos: [6,0],

        desc: `自动购买 <b>A*</b> 而不消耗资源。`,
        curr: "energy",

        cost: E(1e100),
    },
    "AUTO2": {
        unl: () => hasUpgrade("AUTO1"),
        pos: [6,-1],

        desc: `自动购买 <b>B*</b> 而不消耗资源。`,
        curr: "energy_p",

        cost: E('1e500'),
    },
    "AUTO3": {
        unl: () => player.chal.completion[2] > 2,
        pos: [5,19],

        desc: `自动购买 <b>C*</b> 而不消耗资源。`,
        curr: "energy_r",

        cost: E(1e100),
    },
    "AUTO4": {
        unl: () => hasUpgrade("AUTO3"),
        pos: [5,20],

        desc: `自动购买 <b>D*</b> 而不消耗资源。`,
        curr: "energy_r",

        cost: E('1e150'),
    },
    "AUTO5": {
        unl: () => hasUpgrade("E8"),
        pos: [22,1],

        desc: `自动购买 <b>E*</b> 而不消耗资源。`,
        curr: "star",

        cost: E('1e45'),
    },
    "AUTO6": {
        unl: () => hasUpgrade("UNLOCK4"),
        pos: [22,41],

        desc: `自动购买 <b>F*</b> 而不消耗资源。`,
        curr: "energy_g",

        cost: E('e7200'),
    },
    "AUTO7": {
        unl: () => hasUpgrade("G11"),
        pos: [40,23],

        desc: `自动购买 <b>G*</b> 而不消耗资源。`,
        curr: "psi",

        cost: E('e500'),
    },
    "AUTO8": {
        unl: () => hasUpgrade("META9"),
        pos: [38,38],

        desc: `自动购买 <b>META*</b> 而不消耗资源。`,
        curr: "meta",

        cost: E(1000),
    },

    "UNLOCK1": {
        unl: () => hasUpgrade("A7"),
        pos: [3,-1],

        desc: `解锁下一个路径。`,
        curr: "energy",

        cost: Decimal.pow(2,1024),

        on_buy() {doCameraLerp(0, 20*250)},
    },
    "UNLOCK2": {
        unl: () => hasUpgrade("C12"),
        pos: [2,22],

        desc: `解锁下一个路径。`,
        curr: "energy_r",

        cost: E(1e21),

        on_buy() {doCameraLerp(20*250, 0)},
    },
    "UNLOCK3": {
        unl: () => hasUpgrade("C14"),
        pos: [5,22],

        desc: `再次解锁下一个路径。`,
        curr: "energy_r",

        cost: E(2).pow(1024),

        on_buy() {doCameraLerp(20*250, 40*250)},
    },
    "UNLOCK4": {
        unl: () => hasUpgrade("C12"),
        pos: [20,37],

        desc: `解锁下一个路径。`,
        curr: "energy_g",

        cost: E('e700'),

        on_buy() {doCameraLerp(40*250, 20*250)},
    },
    "UNLOCK5": {
        unl: () => hasUpgrade("G11"),
        pos: [37,23],

        desc: `解锁最终路径。`,
        curr: "energy",

        cost: E('eee3'),

        on_buy() {doCameraLerp(40*250, 40*250)},
    },

    "META1": {
        unl: () => player.meta.unl,
        pos: [42,39],

        desc: `重置时解锁精炼和银河能量生成，并保留挑战完成进度。`,
        curr: "meta_p",

        cost: E(1e6),

        on_buy() {
            if (!hasUpgrade("C6")) player.upgrades["C6"] = E(1);
            if (!hasUpgrade("F11")) player.upgrades["F11"] = E(1);
        },
    },
    "META2": {
        unl: () => player.meta.unl,
        pos: [43,39],
        max: EINF,

        get base() { return Decimal.add(3, upgradeEffect("META4",0)) },

        get desc() { return `每级增加元粒子生成 <b>${formatMult(this.base)}</b>。` },
        curr: "meta_p",

        cost: a => Decimal.pow(10,a.sumBase(1.1)).mul(1e6),
        bulk: a => a.div(1e6).log(10).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "META3": {
        unl: () => player.meta.energy.gte(2),
        pos: [38,41],
        max: EINF,

        get base() { return Decimal.add(0.5, MPEffect(3,0)) },

        get desc() { return `每级延迟能量溢出 <b>+${format(this.base)}</b>。` },
        curr: "meta_p",

        cost: a => Decimal.pow(1e5,a.sumBase(1.1)).mul(1e14),
        bulk: a => a.div(1e14).log(1e5).sumBase(1.1,true).floor().add(1),

        effect(a) {
            let x = this.base.mul(a)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "META4": {
        unl: () => player.meta.energy.gte(4),
        pos: [37,41],
        max: EINF,

        get base() { return Decimal.add(1, MPEffect(2,0)) },

        get desc() { return `每级增加 <b>META2</b> 的基础值 <b>+${format(this.base)}</b>。` },
        curr: "meta_p",

        cost: a => Decimal.pow(100,a.pow(2)).mul(1e25),
        bulk: a => a.div(1e25).log(100).root(2).floor().add(1),

        effect(a) {
            let x = this.base.mul(a)
            return x
        },
        effDesc: x => "+"+format(x),
    },
    "META5": {
        unl: () => player.meta.energy.gte(5),
        pos: [38,40],

        desc: `元能量获取翻倍。`,
        curr: "meta_p",

        cost: E(1e35),
    },
    "META6": {
        unl: () => player.meta.energy.gte(10),
        pos: [37,40],

        desc: `重置时解锁 <b>G10</b>。`,
        curr: "meta_p",

        cost: E(1e45),

        on_buy() {
            if (!hasUpgrade("G10")) player.upgrades["G10"] = E(1);
        },
    },
    "META7": {
        unl: () => player.meta.energy.gte(17),
        pos: [38,39],

        desc: `再次翻倍元能量获取。`,
        curr: "meta_p",

        cost: E(1e60),
    },
    "META8": {
        unl: () => player.meta.energy.gte(36),
        pos: [37,39],
        max: EINF,

        get base() { return Decimal.add(2, 0) },

        get desc() { return `每级增加元能量获取 <b>${formatMult(this.base)}</b>。` },
        curr: "meta_p",

        cost: a => Decimal.pow(1e20,a.sumBase(1.5)).mul(1e75),
        bulk: a => a.div(1e75).log(1e20).sumBase(1.5,true).floor().add(1),

        effect(a) {
            let x = this.base.pow(a)
            return x
        },
        effDesc: x => formatMult(x),
    },
    "META9": {
        unl: () => player.meta.energy.gte(216),
        pos: [40,39],

        desc: `改进前四个元粒子的效果。`,
        curr: "meta_p",

        cost: E(1e108),

        effect(a) {
            let x = expPow(player.meta.energy.add(1),0.5)
            return x
        },
        effDesc: x => formatMult(x),
    },

    "END1": {
        unl: () => hasUpgrade("AUTO8"),
        pos: [36,36],

        desc: `自动获取元能量，并且不会重置任何内容。`,
        curr: "meta",

        cost: E(1e50),
    },
    "END2": {
        unl: () => hasUpgrade("END1"),
        pos: [34,34],

        desc: `改进元粒子获取。`,
        curr: "meta",

        cost: E(1.586e51),
    },
    "END3": {
        unl: () => hasUpgrade("END2"),
        pos: [32,32],

        desc: `能量溢出更弱。`,
        curr: "meta",

        cost: E(8.048e90),
    },
    "END4": {
        unl: () => hasUpgrade("END3"),
        pos: [30,30],

        desc: `解锁黑洞。`,
        curr: "meta",

        cost: E('6.1769e383'),

        on_buy() {doCameraLerp(20*250, 20*250)},
    },
}

const UPG_KEYS = Object.keys(UPGRADES)
const PREFIXES = ["A","B","C","D","E","F","G","AUTO","UNLOCK","META","END"]

function getUpgrades(prefix) { return UPG_KEYS.filter(key => key.split(prefix)[0] == "" && Number(key.split(prefix)[1])) }

const PREFIX_TO_UPGS = (()=>{
    let x = {}
    PREFIXES.forEach(y => {x[y] = getUpgrades(y)})
    return x
})()

const CHAL_A_UPGS = PREFIX_TO_UPGS["A"].filter(x => x != "A1")

function getUpgradeCost(id) {
    let u = UPGRADES[id]

    return Decimal.gt(u.max ?? 1,1) ? u.cost(player.upgrades[id]) : u.cost
}

function buyUpgrade(id, all = false, auto = false) {
    let u = UPGRADES[id], lvl = player.upgrades[id], max = u.max ?? 1

    if (tmp.lock_upg.includes(id) || !u.unl() || lvl.gte(max)) return

    let cost = getUpgradeCost(id), curr = CURRENCIES[u.curr]

    if (curr.amount.gte(cost)) {
        let bulk = player.upgrades[id].add(1)

        if ((all || auto) && Decimal.gt(max, 1)) {
            bulk = bulk.max(u.bulk(curr.amount).min(max))
            cost = u.cost(bulk.sub(1))
        }

        player.upgrades[id] = bulk
        if (!auto) {
            curr.amount = curr.amount.sub(cost).max(0)
            if (u.on_buy) u.on_buy()
        }
    }
}

function hasUpgrade(id) { return player.upgrades[id].gte(1) }
function upgradeEffect(id,def=1) { return tmp.upgs_effect[id] ?? def }
function simpleUpgradeEffect(id,def=1) { return hasUpgrade(id) ? tmp.upgs_effect[id] ?? def : def }

function setupUpgrades() {
    for (let id in UPGRADES) {
        let u = UPGRADES[id], max = u.max ?? 1, curr = CURRENCIES[u.curr]

        createGridElement('upgrade-' + id, {
            unl: ()=>u.unl() || hasUpgrade(id),

            pos: u.pos,
            sub_html: `<div class="grid-element-info">(${u.pos.join(', ')}) ${id}</div>`,
            html: `
            <button onclick="buyUpgrade('${id}')" class="grid-button" id="upgrade-grid-${id}"></button>
            <button onclick="buyUpgrade('${id}',true)" class="upgrade-grid-buy-max" style="display: ${Decimal.gt(max,1) ? "block" : "none"}">购买最大</button>
            `,

            updateHTML() {
                let u_el = el("upgrade-grid-" + id), lvl = player.upgrades[id], bought = lvl.gte(max)

                let h = ""
                if (Decimal.gt(max,1)) h += `<div>[等级 ${format(lvl,0) + (Decimal.lt(max,EINF) ? " / " + format(max,0) : "")}]</div>`
                h += u.desc

                if (u.effDesc) h += `<br>效果: ${u.effDesc(tmp.upgs_effect[id])}`

                var cost = getUpgradeCost(id)

                if (!bought) h += `<br>成本: ${format(cost,0)} ${curr.name}`

                u_el.innerHTML = h
                u_el.className = el_classes({"grid-button": true, bought, locked: !bought && (tmp.lock_upg.includes(id) || curr.amount.lt(cost))})
            },
        })
    }
}

function updateUpgradesTemp() {
    for (let id in UPGRADES) {
        let u = UPGRADES[id]
        if (u.effect) tmp.upgs_effect[id] = u.effect(player.upgrades[id])
    }

    let auto = []

    if (hasUpgrade("AUTO1")) auto.push(...PREFIX_TO_UPGS["A"]);
    if (hasUpgrade("AUTO2")) auto.push(...PREFIX_TO_UPGS["B"]);
    if (hasUpgrade("AUTO3")) auto.push(...PREFIX_TO_UPGS["C"]);
    if (hasUpgrade("AUTO4")) auto.push(...PREFIX_TO_UPGS["D"]);
    if (hasUpgrade("AUTO5")) auto.push(...PREFIX_TO_UPGS["E"]);
    if (hasUpgrade("AUTO6")) auto.push(...PREFIX_TO_UPGS["F"]);
    if (hasUpgrade("AUTO7")) auto.push(...PREFIX_TO_UPGS["G"]);
    if (hasUpgrade("AUTO8")) auto.push(...PREFIX_TO_UPGS["META"]);

    tmp.auto_upg = auto

    let lock = []

    if (chalActive(2)) lock.push(...getChallengeBase(2));
    if (chalActive(5)) lock.push(...getChallengeBase(5));

    tmp.lock_upg = lock
}

function resetUpgrades(id,keep=[]) {
    for (let i of PREFIX_TO_UPGS[id]) if (!keep.includes(i)) player.upgrades[i] = E(0)
}
