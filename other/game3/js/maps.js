// 肤质: {
//   keys: ["skin_type"], //0	油性皮肤 1	干性皮肤 2	中性皮肤 3	混合性皮肤
// }
//图片 img/icon img/medicine img/ball img/face-cover
const medicineMap = {
  咖啡因: {
    description: "可以让眼部血管收缩，减轻血管扩张，消除水肿；",
    chengfen: '咖啡因',
    gongxiao: '消除浮肿和眼袋，淡化黑眼圈；',
    shuoming: `1. 紧实和重建作用：刺激成纤维细胞更新，刺激胶原蛋白生成；
    2. 减脂作用：刺激脂肪细胞，释放甘油脂肪酸；
    3. 咖啡因可以通过促进皮肤组织的血液循环，来消除疲惫眼睛下的浮肿和眼袋，淡化黑眼圈。`
  },
  维A醇: {
    description: "促进真皮层胶原蛋白合成，同时能增加皮肤厚度与弹性；",
  },
  霍霍巴籽油: {
    description: "保湿润泽肌肤",
    chengfen: '霍霍巴籽油',
    gongxiao: '保湿润泽肌肤',
    shuoming: `1. 是一种与人体皮脂结构类似的，多不饱和的液态蜡酯，几乎完全由具有高分子量的单不饱和直链脂肪酸和醇的蜡酯组成。
    2. 超强的渗透性使其能很快地被皮肤吸收并扩散到角质层中，在皮肤表面形成一层液膜，保湿修护；同时还能有效的促进皮肤有益菌群生长，维护皮肤的微生态屏障。`,
    img2D:false,
    img3D:false
  },
  水杨酸: {
    description: "抑制炎症反应、抗菌消炎、平衡油脂分泌；",
    chengfen: '水杨酸',
    gongxiao: '祛痘、平衡油脂分泌；',
    shuoming: `1. 水杨酸可以溶解附着在死亡皮肤细胞蛋白质上，并帮助剥落皮肤表面死皮，有助于加快新皮肤细胞再生。
    2. 水杨酸可以有效清除毛孔或皮脂腺堵塞物，并防止皮脂溢出。由于其脂溶性特性，可以很容易渗透进腺体，并从中清除死亡细胞和皮脂。`
  },
  积雪草提取物: {
    description:
      "对瘢痕成纤维细胞活力有促进作用，对于祛红色痘印、轻微新鲜痘疤都有很好的改善辅助作用，抗炎抗菌能力也很强。",
    chengfen: '积雪草甙',
    gongxiao: '舒缓、祛痘、修复痘印',
    shuoming: `1. 含有多种a－香树脂醇型的三萜成分，可促进瘢痕成纤维细胞的活力，帮助受损的组织愈合，改善痘印，镇静皮肤；
    2. 同时可以刺激胶原蛋白合成，促进皮肤新陈代谢，辅助改善浅层痘疤。`,
    img2D:false,
    img3D:false
  },
  维生素C: {
    description:
      "提升皮肤的弹性；如果你的皮肤足够耐受，也可以使用含有视黄醇的眼霜。",
  },
  "LR2412四氢茉莉酸维A醇": {
    description:
      "刺激胶原蛋白的生成，增加成纤维母细胞的活性，促进皮肤的新陈代谢。",
    chengfen: '四氢茉莉酸',
    gongxiao: '改善细纹，增强肌肤弹性，紧致',
    shuoming: `其灵感来于植物的疤痕组织再生，作用于表皮的再生能力；强化肌肤组织、改善肌肤弹性的能力，该作用改善了全部年龄信号：肌肤微观起伏、细纹、弹性减弱、干燥；
      四氢茉莉酸与维A酸的功效类似，但是性质更温和，容易渗透到真皮和表皮交界，刺激【胶原蛋白】的生成，增加【成纤维母细胞】的活性，并且能够促进整个皮肤的新陈代谢。
      *该成分还未通过国内FDA的审核`
  },
  苯乙基间苯二酚: {
    description:
      "通过抑制酪氨酸酶的活性来抑制黑色素的形成，具有高校的美白能力和皮肤适应性；",
    chengfen: 'Symwite 377',
    gongxiao: '抗氧化，美白淡斑',
    shuoming: `1. 具有优异的皮肤美白效果，是有报道的活性最高的酪氨酸酶抑制剂之一，是曲酸的22倍；能有效抑制B16V细胞合成黑色素的活性，是曲酸的210倍。
      2. 能改善肤色不均，降低紫外线照射肌肤引起的皮肤着色。同时它也是一款优秀的抗氧剂及具有抗皱能力。
      `
  },
  烟酰胺: {
    description:
      "属于维生素B3，可以抑制黑色素转移到角质形成细胞，还可加速细胞代谢来达到美白效果。",
    chengfen: '烟酰胺',
    gongxiao: '均匀肤色，减少褐黄暗沉；',
    shuoming: `1. 是维生素B3的衍生物，能通过抑制黑素体向皮肤表面迁移，高效安全的均匀肤色，减少色斑；
    2. 通过加强真皮层微循环，增加皮肤水分；同时促进胶原蛋白的合成，维持肌肤弹性，改善细纹和皱纹。`,
    img2D: true,
    img3D: true
  },
  // 新增
  神经酰胺: {
    description: "神经酰胺属于一种典型的天然脂质，是由鞘安醇基链结合一个脂肪酸；能有效提升肌肤的含水量，修护肌肤屏障功能；",
    chengfen: '神经酰胺',
    gongxiao: '强化皮肤水分，保护肌肤屏障；',
    shuoming: `1. 属于神经鞘脂类，是由脂肪酸和鞘氨脂碱基组成的一类化合物，是细胞间基质的主要成分，在保持角质层水分的平衡中十分关键；
    2. 通过将富含蛋白质的角质细胞连接起来，减少有害物质入侵，修复皮肤的屏障功能，同时促进丝聚合蛋白mRNA的表达水平，起到保湿锁水的功效。`,
    img2D: true,
    img3D: false
  },
  玻尿酸: {
    description: "保湿、补水，修复肌肤屏障",
    chengfen: '透明质酸',
    gongxiao: '保湿、补水，修复肌肤屏障',
    shuoming: `1. 俗名玻尿酸，是线型直链状高分子黏多糖，由葡萄糖醛酸和N-乙酰氨基葡萄糖组成的双糖单位重复连接而成，广泛分布于人体的各类组织内。
    2. 透明质酸分子中含有大量的羧基和羟基，最大能够吸收其重量近千倍的水，可以高度锁水保湿；同时还能通过促进细胞增殖和分化，修复和维护皮肤屏障功能。`,
    img2D: true,
    img3D: false
  },
  视黄醇: {
    description: "增加表皮的弹性和厚度，缓解胶原蛋白的降解，促进胶原蛋白的产生，促进角质代谢，使皮肤外观通透；",
    chengfen: '视黄醇',
    gongxiao: '淡化细纹、 促进肌肤代谢；',
    shuoming: `视黄醇即维生素A，护肤界的“抗老一哥”；
    1. 可以诱导真皮弹力蛋白的合成和弹性纤维的形成，改善皮肤的弹性；
    2. 促进表皮层角化细胞代谢，促进角质层剥脱；
    3. 减少基底层黑色素生成与转运，使皮肤外观通透；`
  },
  "乙酰基六肽-8": {
    description: "促进真皮层胶原蛋白合成，同时能增加皮肤厚度与弹性；",
    chengfen: '乙酰基六肽-8',
    gongxiao: '增加肌肤弹性，紧致，改善皱纹；',
    shuoming: `1. 由人工合成，作用机制类似于肉毒杆菌的安全有效的生物活性多肽，可通过局部阻断神经传递肌肉收缩信息，放松面部肌肉，抚平皱纹。
    2. 抑制金属蛋白酶和弹性蛋白酶活性的同时，增加蛋白聚糖合成，从而促进真皮层胶原蛋白合成，恢复肌肤弹性，抗皱紧致。`,
    img2D: true,
    img3D: false
  },
  玻色因: {
    description: "促进糖胺聚糖、蛋白多糖的合成，帮助表皮与真皮紧密联结、维持真皮弹性；同时可以促进胶原蛋白的合成等功效。",
    chengfen: '玻色因',
    gongxiao: '抗皱紧致，淡化细纹',
    shuoming: `1. 化学名为羟丙基四氢吡喃三醇，是一种木糖衍生物，主要作用靶点为糖胺聚糖GAGs（细胞外基质的重要组成部分），可以显著改善皮肤老化表现，温和不刺激。
    2. 在表皮层，促进多种GAGs的合成及相关信号通路改善屏障；在真-表皮连接处（DEJ），能上调包括层粘连蛋白、IV型、VII型胶原蛋白表达，强化DEJ结构的紧密和稳定，综合性的改善皮肤细纹，使皮肤紧致有弹性。`,
    img2D: true,
    img3D: true
  },
  抗坏血酸葡糖苷AA2G: {
    description: "维C衍生物，能刺激胶原蛋白合成，抑制黑色素形成，对已存在的黑色素有还原作用，淡化色斑。",
    chengfen: '抗坏血酸葡糖苷',
    gongxiao: '美白淡斑，提亮肤色；',
    shuoming: `1. 是一种维生素C衍生物，可以通过抑制络氨酸酶活性，减少新的黑色素形成，达到美白淡斑的功效。
    2．通过减少细胞内自由基，保护皮肤免受紫外线损伤，同时促进成纤维细胞中的胶原蛋白合成，减少皱纹和粗糙。`,
    img2D: true,
    img3D: true
  },
  依克多因: {
    description: "具有保湿、修复于一体的功效",
    chengfen: '依克多因',
    gongxiao: '防护、舒缓、修复、保湿',
    shuoming: `1. 从生长在极端环境的微生物细胞内被发现，是一种亲水性强的环状氨基酸衍生物。
    2. 高效保湿的同时，还可以提高细胞应激能力和免疫功能，抗炎舒缓，修复紫外线引起的皮肤损伤。 `,
    img2D: true,
    img3D: true
  },
  接骨木提取物: {
    description: "可以让眼部血管收缩，减轻血管扩张，消除水肿；",
    chengfen: '接骨木花提取物',
    gongxiao: '去黑眼圈、眼袋',
    shuoming: `1. 该提取物中包括多种木脂素、黄酮和黄酮苷类、环烯醚萜类等活性成分。能够有效防止组胺与黑色素细胞的结合，抑制肌肤炎症和和色素过剩生成；
    2. 通过减少VCAM-1和ICAM-1的表达，减少血管内皮细胞连接蛋白的表达，进而有效降低细胞质和红细胞漏出，紧致眼下皮肤，降低水肿和黑眼圈。`,
    img2D:false,
    img3D:false
  },
  去黑眼圈眼袋混合草本萃取配方: {
    description: "中草药植物复配组方富含类黄酮和多酚，有助于增强血管弹性，减少组胺和炎症，促进血液循环，淡化黑眼圈。",
    chengfen: '丹参根,芍药根(白牡丹)提取、牛膝根、银杏叶、川芎根、茶提取物、白芨根、当归根和月季花',
    gongxiao: '去黑眼圈、眼袋',
    shuoming: `中草药植物复配组方富含类黄酮和多酚，有助于增强血管弹性，减少组胺和炎症，促进血液循环，淡化黑眼圈。`
  },
  角鲨烷: {
    description: "锁水保湿，修复受损屏障",
    chengfen: '角鲨烷',
    gongxiao: '锁水保湿，修复受损屏障',
    shuoming: `由6个个异戊二烯双键组成的碳氢化物，属于类萜结构，氧化稳定性高；
    温和、安全、低刺激，接近人体皮脂，亲和力强；能与皮肤皮脂膜融为一体, 形成天然保护膜；
    修复表皮，帮助肌肤与皮脂间的平衡，增进细胞新陈代谢，使皮肤毛孔张开；
    它可以帮助肌肤锁水、抗炎，皮肤屏障受损的时候，及时为肌肤补充角鲨烷。`
  },
  丹参净妍: {
    description: "丹参净妍是结合中医“整体、辨证、综合”的思想",
    chengfen: '丁二醇、丹参根提取物、黄芩根提取物、当归根提取物、丁香花蕾提取物、甘草根提取物、积雪草提取物',
    gongxiao: '控油、祛痘、疏通毛孔',
    shuoming: `丹参净妍是结合中医“整体、辨证、综合”的思想，按照“君、臣、佐、使”的组方原则，通过优化组间比例，实现组方协同增效，解决肌肤痤疮问题。
    丹参净妍取丹参抑菌、控油、消炎之效，纳丁香、黄芩促透吸收、疏通毛孔之功，采当归活血化瘀、改善毛囊角化之力，收甘草、积雪草调和、修复之益，实现“安全、有效”祛痘。                 
    1）抑制5α-还原酶活性，平衡皮脂分泌； 
    2）抑制毛囊皮脂中痤疮相关病原菌群生长，抑菌消炎； 
    3）良好的抑痘活性，改善因化妆品引起的肌肤痤疮状态； 
    4）通过促进吸收、疏通毛孔、改善毛囊角化三种途径协同提升祛痘功效。 `
  },
  "10-羟基癸酸": {
    description: "减少皮脂分泌，减少活跃的皮脂腺数量，抑制粉刺的生成，抑制痤疮丙酸杆菌的增殖，可重建粉刺型皮肤的生理平衡",
    chengfen: '丁二醇、10-羟基癸酸、癸二酸、1，10-癸二醇',
    gongxiao: '控油、祛痘',
    shuoming: `1. 又称“蜂王浆酸”，是一种不饱和脂肪酸，可以通过减少活跃的皮脂腺数量，控制油脂过多分泌，收缩毛孔，并抑制黑头、粉刺的生成；
    2. 通过抑制痤疮丙酸杆菌的增殖，消炎抗菌，平滑肌肤，重建粉刺型皮肤的生理平衡。`,
    img2D: true,
    img3D: true
  },
  ACNILYS桃金娘: {
    description: "ACNILYS®能够调节皮脂细胞因激素变化而诱导的脂质合成，抑制皮脂细胞的5α还原酶活性，抑制痤疮丙酸杆菌增殖",
    chengfen: '水, 丙二醇,桃金娘果提取物',
    gongxiao: '控油、祛痘',
    shuoming: `ACNILYS®能够调节皮脂细胞因激素变化而诱导的脂质合成，抑制皮脂细胞的5α还原酶活性，抑制痤疮丙酸杆菌增殖，抵御痤疮丙酸杆菌引起的炎症，减少氧化角鲨烯诱导的炎症。减少皮脂分泌，减少丘疹和皮肤发红，提高水合度和亮度`
  },
  symrepair100: {
    description: "α-红没药醇协同复配接近皮脂保护层的主要成份",
    chengfen: '己基癸醇、红没药醇、N-棕榈酰羟基脯氨酸鲸蜡酯、硬脂酸、油菜甾醇类',
    gongxiao: '修复、重建皮肤屏障',
    shuoming: `α-红没药醇协同复配接近皮脂保护层的主要成份：己基癸醇、十六烷基羟脯氨酸棕榈酰胺、硬脂酸、油菜甾醇构成类似天然皮肤神经酰胺的皮肤角质层双分子模型，迅速重组类似皮肤自身的脂质双分子层，加上天然抗炎成分α-红没药醇，可快速修复并重建皮肤自我保护屏障功能。`
  }
};

const skinMap = {

  黑眼圈: {
    name: 'eyesattr',
    avarage: 'dark_circle_score',
    keys: [
      {
        name: "dark_circle_left",
        cover: 3,
        point: []
      },
      {
        name: "dark_circle_right",
        cover: 3,
        point: []
      },
    ],
    description:
      "位于眼下环形青黑色或茶黑色的区域；分为色素型、血管型、结构型三种；",
    cause:
      "血管型为眼周的血液循环不太通畅，局部血氧量降低时，偏紫红色的缺氧血红蛋白的研究就会显出来；色素型为眼周黑素细胞增多，眼周色素沉积；随着皮肤的老化和松弛，眼周部分会出现突出的眼袋和凹陷的泪沟，这会导致光线照，从而造成阴影形成结构型的黑眼圈；",
    how: "尝试使用添加维A醇或咖啡因成分的眼部护肤品",
    medicines: ["依克多因", "接骨木提取物"],
  },
  痘痘: {
    name: "acnespotmole",
    avarage: 'acne_score',
    keys: [
      {
        name: "acne_list",
        num: "acne_num",
        cover: 3,
        point: []
      },
    ],
    description: "痤疮俗称“青春痘”或”粉刺”是累积毛囊皮脂腺的慢性炎症；",
    cause:
      "由于角质代谢不畅、皮脂腺分泌过多等，导致毛囊开口处堵塞，痤疮丙酸杆菌大量繁殖，继续引发炎症和痘痘。",
    how: "抗炎舒缓，使用水杨酸类抗炎祛痘成分；",
    medicines: ["积雪草提取物"],
  },
  色斑: {
    name: "acnespotmole",
    avarage: 'speckle_score',
    keys: [
      {
        name: "speckle_list",
        num: "speckle_num",
        point: []
      },
    ],
    description: "肤色的深浅主要由表皮中黑色素的含量和状态决定",
    cause:
      "在黑色素形成过程中，酪氨酸被酪氨酸酶催化，再经过多步氧化反应生成黑色素，黑色素再迁移至表皮层，你就黑了~所以，酪氨酸酶的量和活性是决定你肤色的关键。",
    how: "抑制酪氨酸酶的量和活性；",
    medicines: ["抗坏血酸葡糖苷AA2G", "烟酰胺"],
  },
  毛孔: {
    name: 'blackheadpore',
    avarage: 'pore_score',
    keys: [
      {
        name: "circles",
        num: "pore",
        cover: 4,
        point: []
      }
    ],
    description:
      "是毛囊的开口，毛囊侧面挂着的皮脂腺生产出皮脂，顺着毛发出口方向平铺到皮肤表面，起到保护滋润的作用。",
    cause: `
      1、油脂过于旺盛：油脂分泌过剩代谢不畅，堆积在毛囊里，膨胀毛孔；
      2、自然衰老：胶原蛋白流失，弹力纤维萎缩，不足以支撑皮肤组织中的毛孔，进而变大；
      3、护肤不当，使用彩妆等产品清洁不彻底，堵塞毛孔，导致毛孔粗大。
    `,
    how:
      "加强保湿，增加透明质酸的含量，补充天然保湿因子；加速新陈代谢，减少油脂，老废角质堵塞毛孔；抗衰老、紧致肌肤，增加肌肤丰盈度。",
    medicines: ["10-羟基癸酸"],
  },
  眼袋: {
    name: 'eyesattr',
    avarage: 'eye_bags_score',
    keys: [
      {
        name: "eye_bags_left",
        cover: 3,
        point: []
      },
      {
        name: "eye_bags_right",
        cover: 3,
        point: []
      },
    ],
    description: "又称眼脸皮肤松弛，通常指发生在下脸的皮肤松弛。",
    cause:
      "在下睑，由于年龄的逐渐增长，胶原蛋白减少和脂肪松弛，导致皮肤与眼隔之间的张力下降， 以致眶内脂肪、组织，经眶隔膜薄弱环节将眼隔推出，久而久之就成了我们通常所说的眼袋。",
    how:
      "这种眼袋往往是由紫外线和老化所造成的，想要合理预防这种眼袋，只能通过防晒和使用抗氧化、抗老产品来进行早期预防。",
    medicines: ["依克多因", "接骨木提取物"],
  },
  黑头: {
    name: 'blackheadpore',
    avarage: 'blackhead_score',
    keys: [
      {
        name: "circles",
        num: 'blackhead',
        cover: 2,
        point: []
      },
    ],
    description:
      "黑头即黑头粉刺，是一种由皮脂腺分泌的皮脂和毛囊导管脱落的上皮细胞等组成的“栓”样物。",
    cause: `当毛囊口细胞角化过度时，堵塞的毛囊口致皮脂排泄不顺，便会在皮肤表面形成向外突出的小山丘，即“脂栓”。堵塞的毛囊口逐步扩大，向外暴露的脂栓因空气中的灰尘、环境污染等因素被逐步氧化，进而变黑变硬，最后形成黑头。`,
    how:
      "果酸、水杨酸：软化角质黑头；霍霍巴油、角鲨烷：良好的亲脂性，润滑黑头，帮助黑头流出；",
    medicines: ["10-羟基癸酸"],
  },

  皱纹: {
    name: "wrinkle",
    avarage: 'wrinkle_score',
    keys: [
      {
        name: "wrinkle_data",
        num: "wrinkle_num",
        cover: 4,
        point: []
      }
    ],
    description:
      "皮肤老化一般有两种表现形式，自然老化和因环境因素所导致的老化；",
    cause: "自然老化指随着年龄的增长，机体内存在的如遗传、重力、内分泌及免疫功能等不可抗拒因素引起的老化；环境所导致的老化则主要是由于紫外线、空气污染等因素所造成的皮肤加速衰老。",
    how:
      "增加表皮的弹性和厚度，缓解胶原蛋白的降解，促进胶原蛋白的产生，促进角质代谢，使皮肤外观通透；",
    medicines: ["乙酰基六肽-8", "玻色因"],
  },

  光滑度: {
    name: "acnespotmole",
    avarage: 'smooth_score',
    keys: [
      {
        name: "mole_list",
        num: "mole_num",
        cover: 3,
        point: []
      },
    ],
    description:
      "肌肤光滑度是皮肤的光泽程度、滋润程度、弹性程度以及细腻程度等的综合体现",
    cause: "皮肤物理性屏障，角质层防御系统破坏，导致皮肤后续出现各种问题，如干燥、瘙痒、脱屑、泛红、敏感等，均会导致肌肤的光泽度问题。",
    how:
      "保湿，补水，提升肌肤的水分含量以及促进肌肤胶原蛋白的合成，使肌肤润泽，富有弹性，",
    medicines: ["玻尿酸", "神经酰胺", "霍霍巴籽油"],
  },

};