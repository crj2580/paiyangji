var EnemyType = [
    {
        type: 0,
        textureName: "enemy01.png",
        bulletType: "Bullet02.png",
        HP: 1,
        moveType: MW.ENEMY_MOVE_TYPE.ATTACK,
        attackMode: MW.ENEMY_MOVE_TYPE.NORMAL,
        scoreValue: 30
    },
    {
        type: 1,
        textureName: "enemy02.png",
        bulletType: "Bullet02.png",
        HP: 3,
        moveType: MW.ENEMY_MOVE_TYPE.ATTACK,
        attackMode: MW.ENEMY_MOVE_TYPE.NORMAL,
        scoreValue: 60
    },
    {
        type: 2,
        textureName: "enemy03.png",
        bulletType: "Bullet02.png",
        HP: 5,
        moveType: MW.ENEMY_MOVE_TYPE.HORIZONTAL,
        attackMode: MW.ENEMY_ATTACK_MODE.TSUIHIKIDAN,
        scoreValue: 100
    },
    {
        type: 3,
        textureName: "enemy04.png",
        bulletType: "Bullet02.png",
        HP: 8,
        moveType: MW.ENEMY_MOVE_TYPE.OVERLAP,
        attackMode: MW.ENEMY_MOVE_TYPE.NORMAL,
        scoreValue: 150
    },
    {
        type: 4,
        textureName: "enemy05.png",
        bulletType: "Bullet02.png",
        HP: 14,
        moveType: MW.ENEMY_MOVE_TYPE.HORIZONTAL,
        attackMode: MW.ENEMY_ATTACK_MODE.TSUIHIKIDAN,
        scoreValue: 250
    },
    {
        type: 5,
        textureName: "enemy01.png",
        bulletType: "Bullet02.png",
        HP: 2,
        moveType: MW.ENEMY_MOVE_TYPE.ATTACK,
        attackMode: MW.ENEMY_MOVE_TYPE.VERTICAL,
        scoreValue: 40
    }
];

var SupplyType = [
    {
        type: 0,
        textureName: "supply01.png",
        cureMode: MW.CURE_MODE.ADD_HP,
        cureHp: 1
    },
    {
        type: 1,
        textureName: "supply02.png",
        cureMode: MW.CURE_MODE.ADD_HP,
        cureHp: 2
    },
    {
        type: 2,
        textureName: "supply03.png",
        cureMode: MW.CURE_MODE.ADD_HP,
        cureHp: 3
    }
]
