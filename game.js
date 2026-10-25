document.addEventListener("DOMContentLoaded", () => {
  "use strict";
  // بيانات العصور والشخصيات: كانت مفقودة، لذلك كانت اللعبة تعرض صورة الإسكندر كصورة افتراضية.
  const eraData = {
    coptic: ["العصر القبطي", "✝️", "القديس أثناسيوس الرسولي", "coptic", "athanasius"],
    greek: ["العصر اليوناني والبطلمي", "🏛️", "الإسكندر الأكبر", "greek", "alexander"],
    mamluk: ["العصر المملوكي", "⚔️", "شجرة الدر", "mamluk", "shajar"],
    islamic: ["العصر الإسلامي", "🕌", "صلاح الدين الأيوبي", "islamic", "saladin"],
    "muhammad-ali": ["عصر محمد علي", "⚓", "محمد علي باشا", "muhammad-ali", "muhammad-ali"],
    ottoman: ["العصر العثماني", "♜", "علي بك الكبير", "ottoman", "ali-bey"],
    modern: ["مصر الحديثة", "🏙️", "سعد زغلول", "modern", "zaghloul"],
    contemporary: ["مصر المعاصرة", "✦", "مصر المعاصرة", "contemporary", "modern-egypt"]
  };

  // كل شخصية مرتبطة باسمها وصورتها ووصفها، مع استخدام الصور الموجودة داخل assets.
  const chars = {
    alexander: ["الإسكندر الأكبر", "assets/images/characters/alexander.jpg", "قاد الإسكندر الأكبر حملته إلى مصر سنة 332 ق.م، وأسّس مدينة الإسكندرية."],
    athanasius: ["القديس أثناسيوس الرسولي", "assets/images/characters/athanasius.jpg", "شخصية بارزة في تاريخ الكنيسة القبطية في القرن الرابع الميلادي."],
    shajar: ["شجرة الدر", "assets/images/characters/shajar.jpg", "حكمت مصر لفترة قصيرة في القرن الثالث عشر، وكان لها دور مهم في نهاية العصر الأيوبي وبداية المملوكي."],
    saladin: ["صلاح الدين الأيوبي", "assets/images/characters/saladin.jpg", "أسّس الدولة الأيوبية في مصر، واشتهر بدوره في تاريخ المنطقة خلال الحروب الصليبية."],
    "ali-bey": ["علي بك الكبير", "assets/images/characters/ali-bey.jpg", "كان من أبرز الشخصيات السياسية والعسكرية في مصر خلال القرن الثامن عشر."],
    "muhammad-ali": ["محمد علي باشا", "assets/images/characters/muhammad-ali.jpg", "بدأ حكمه لمصر سنة 1805، وعمل على تحديث الجيش والإدارة والتعليم."],
    zaghloul: ["سعد زغلول", "assets/images/characters/zaghloul.jpg", "كان قائدًا للحركة الوطنية المصرية وثورة 1919."],
    "modern-egypt": ["مصر المعاصرة", "assets/images/characters/modern_egypt.jpg", "تعرّف على ملامح مصر المعاصرة وتطور مدنها ومعالمها."]
  };

  const $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const ERA = params.get("era") || "coptic";
  const LEVEL = Math.max(1, Number(params.get("level")) || 1);
  const BOARD = 7;
  const types = ["ruby","sapphire","emerald","topaz","amethyst","diamond"];
  const symbols = {ruby:"♜",sapphire:"📜",emerald:"🪙",topaz:"♛",amethyst:"⚜",diamond:"🏺"};
  const eraOrder = ["coptic","greek","mamluk","islamic","muhammad-ali","ottoman","modern","contemporary"];
  const bg = {greek:"greek.jpg",coptic:"coptic.jpg",islamic:"islamic.jpg",mamluk:"mamluk.jpg",ottoman:"ottoman.jpg","muhammad-ali":"muhammad-ali.jpg",modern:"modern.jpg",contemporary:"contemporary.jpg"};

  const eraTileInfo = {
    coptic:{ruby:["✝️","صليب قبطي"],
        sapphire:["📜","مخطوطة قبطية"],
        emerald:["🕊️","حمامة السلام"],
        topaz:["⛪","كنيسة"],
        amethyst:["🌿","زخرفة نباتية"],
        diamond:["🏺","إناء فخاري"]},

    greek:{ruby:["🏛️","معبد يوناني"],
        sapphire:["📜","لفافة بردي"],
        emerald:["🪙","عملة بطلمية"],
        topaz:["👑","تاج ملكي"],
        amethyst:["⚜️","إكليل الغار"],
        diamond:["🏺","جرة فخارية"]},

    mamluk:{ruby:["⚔️","سيف مملوكي"],
        sapphire:["📜","مخطوطة تاريخية"],
        emerald:["🪙","عملة مملوكية"],
        topaz:["👑","تاج سلطاني"],
        amethyst:["🛡️","درع مملوكي"],
        diamond:["🏰","قلعة مملوكية"]},

    islamic:{ruby:["🕌","مسجد إسلامي"], 
        sapphire:["📜","مخطوطة تاريخية"],
        emerald:["☪️","هلال إسلامي"],
        topaz:["🪬","زخرفة تراثية"],
        amethyst:["🗡️","سيف تاريخي"],
        diamond:["🏺","قطعة أثرية"]},

    "muhammad-ali":{ruby:["⚓","مرساة بحرية"],
        sapphire:["📜","وثيقة تاريخية"],
        emerald:["🪙","عملة مصرية"],
        topaz:["👑","شعار الحكم"],
        amethyst:["🌾","سنابل القمح"],
        diamond:["🏭","مصنع"]},

    ottoman:{ruby:["🛡️","درع عثماني"],
        sapphire:["📜","فرمان عثماني"],
        emerald:["🪙","عملة عثمانية"],
        topaz:["👑","تاج سلطاني"],
        amethyst:["🌙","هلال عثماني"],
        diamond:["🕌","مسجد عثماني"]},

    modern:{ruby:["🇪🇬","علم مصر"],
        sapphire:["📰","صحيفة مصرية"],
        emerald:["🪙","عملة مصرية"],
        topaz:["🏛️","مبنى حكومي"],
        amethyst:["🚂","قطار"]
        ,diamond:["🏙️","مدينة مصرية"]},

    contemporary:{ruby:["🚆","قطار كهربائي"],
        sapphire:["📱","هاتف ذكي"],
        emerald:["💳","بطاقة دفع إلكتروني"],
        topaz:["🏙️","مدينة حديثة"],
        amethyst:["💡","ابتكار تكنولوجي"],
        diamond:["🌐","شبكة رقمية"]}
  };

  function tileInfo(type) {
    const x = (eraTileInfo[ERA] || eraTileInfo.coptic)[type];
    return x
      ? {symbol:x[0], name:x[1]}
      : {symbol:symbols[type] || "💎", name:"جوهرة"};
  }

  const eraLevelGoalTypes = {
    coptic:[["ruby","sapphire","emerald"],["topaz","diamond","ruby"],["amethyst","emerald","sapphire"]],
    greek:[["diamond","emerald","sapphire"],["ruby","topaz","diamond"],["amethyst","sapphire","emerald"]],
    mamluk:[["ruby","diamond","amethyst"],["emerald","topaz","ruby"],["sapphire","diamond","emerald"]],
    islamic:[["topaz","ruby","sapphire"],["diamond","emerald","topaz"],["amethyst","ruby","diamond"]],
    "muhammad-ali":[["emerald","ruby","diamond"],["topaz","sapphire","emerald"],["amethyst","diamond","ruby"]],
    ottoman:[["ruby","sapphire","topaz"],["diamond","emerald","ruby"],["amethyst","topaz","diamond"]],
    modern:[["emerald","diamond","sapphire"],["ruby","amethyst","topaz"],["sapphire","diamond","ruby"]],
    contemporary:[["ruby","emerald","diamond"],["sapphire","topaz","amethyst"],["diamond","ruby","sapphire"]]
  };

  const questions = {
    coptic:[
      ["ما المدينة التي أصبحت مركزًا مهمًا للمسيحية في مصر؟",["الإسكندرية","أسوان","الأقصر","الفيوم"],0,"كانت الإسكندرية مركزًا مهمًا للحياة الفكرية والدينية في مصر."],
      ["في أي قرن عاش القديس أثناسيوس الرسولي؟",["القرن الرابع الميلادي","القرن الأول","القرن الثامن","القرن الثاني عشر"],0,"عاش أثناسيوس الرسولي في القرن الرابع الميلادي."],
      ["ما اسم اللغة التي كانت منتشرة في مصر خلال العصر القبطي؟",["القبطية","اللاتينية","الفرنسية","الإنجليزية"],0,"اللغة القبطية كانت امتدادًا للغة المصرية القديمة."]
    ],
    greek:[
      ["من أسس مدينة الإسكندرية؟",["الإسكندر الأكبر","صلاح الدين","محمد علي","سعد زغلول"],0,"أسس الإسكندر الأكبر مدينة الإسكندرية عام 331 قبل الميلاد."],
      ["ما البحر الذي تقع عليه مدينة الإسكندرية؟",["البحر المتوسط","البحر الأحمر","بحر العرب","الخليج العربي"],0,"تقع الإسكندرية على ساحل البحر المتوسط."],
      ["ما اسم المنارة الشهيرة التي كانت في الإسكندرية؟",["منارة الإسكندرية","منارة القاهرة","منارة الأقصر","منارة أسوان"],0,"كانت منارة الإسكندرية من عجائب العالم القديم."]
    ],
    mamluk:[
      ["من هي شجرة الدر؟",["حاكمة مصر","ملكة إنجلترا","إمبراطورة رومانية","عالمة يونانية"],0,"كانت شجرة الدر حاكمة لمصر في مرحلة انتقالية مهمة."],
      ["ما المدينة التي كانت عاصمة دولة المماليك في مصر؟",["القاهرة","الإسكندرية","أسوان","المنصورة"],0,"كانت القاهرة مركز الحكم المملوكي."],
      ["بماذا اشتهر المماليك عسكريًا؟",["الفروسية","الملاحة البحرية فقط","صناعة السيارات","الطيران"],0,"اشتهر المماليك بالقوة العسكرية والفروسية."]
    ],
    islamic:[
      ["من هو صلاح الدين الأيوبي؟",["قائد ومؤسس الدولة الأيوبية","حاكم روماني","ملك يوناني","قائد عثماني"],0,"أسس صلاح الدين الدولة الأيوبية وكان له دور كبير في تاريخ مصر والشام."],
      ["ما المدينة التي كانت مركز حكم صلاح الدين في مصر؟",["القاهرة","الإسكندرية","أسوان","بورسعيد"],0,"كانت القاهرة مركزًا مهمًا لحكم الدولة الأيوبية في مصر."],
      ["ما القلعة الشهيرة المرتبطة بتاريخ القاهرة الإسلامي؟",["قلعة صلاح الدين","قلعة الإسكندرية","قلعة أسوان","قلعة رشيد"],0,"قلعة صلاح الدين من أشهر معالم القاهرة التاريخية."]
    ],
    "muhammad-ali":[
      ["متى تولى محمد علي حكم مصر؟",["1805","1798","1882","1919"],0,"تولى محمد علي حكم مصر سنة 1805."],
      ["ما المجال الذي اهتم به محمد علي بشكل كبير؟",["الجيش والتعليم والزراعة","السينما","الطيران","الفضاء"],0,"شهد عصر محمد علي إصلاحات واسعة في الجيش والتعليم والزراعة والصناعة."],
      ["أين يوجد مسجد محمد علي الشهير؟",["قلعة القاهرة","الأهرامات","الإسكندرية","الأقصر"],0,"يقع مسجد محمد علي داخل قلعة صلاح الدين بالقاهرة."]
    ],
    ottoman:[
      ["من هو علي بك الكبير؟",["أمير مملوكي قوي النفوذ","ملك يوناني","قائد روماني","عالم قبطي"],0,"كان علي بك الكبير من أبرز أمراء المماليك في القرن الثامن عشر."],
      ["ما الدولة التي كانت مصر تتبعها اسميًا خلال العصر العثماني؟",["الدولة العثمانية","الدولة الرومانية","الدولة اليونانية","الدولة الفرنسية"],0,"أصبحت مصر ولاية عثمانية بعد دخول العثمانيين إليها سنة 1517."],
      ["ما المدينة التي كانت مركز الحكم في مصر؟",["القاهرة","أسوان","الأقصر","الفيوم"],0,"ظلت القاهرة مركزًا رئيسيًا للحكم والإدارة."]
    ],
    modern:[
      ["من قاد الحركة الوطنية المرتبطة بثورة 1919؟",["سعد زغلول","صلاح الدين","الإسكندر الأكبر","محمد علي"],0,"كان سعد زغلول من أبرز قادة الحركة الوطنية وثورة 1919."],
      ["في أي عام اندلعت ثورة 1919؟",["1919","1805","1882","1952"],0,"اندلعت ثورة 1919 ضد الاحتلال البريطاني."],
      ["ما المدينة التي تُعد عاصمة مصر الحديثة؟",["القاهرة","الإسكندرية","الأقصر","بورسعيد"],0,"القاهرة هي عاصمة جمهورية مصر العربية."]
    ],
    contemporary:[
      ["ما المجال الذي أصبح من أهم مجالات التطور في مصر المعاصرة؟",["التكنولوجيا","الزراعة فقط","الكتابة على البردي","العربات الحربية"],0,"شهدت مصر توسعًا في مجالات التكنولوجيا والتحول الرقمي."],
      ["ما وسيلة النقل الحديثة التي تعتمد على الكهرباء؟",["القطار الكهربائي","العربة التي تجرها الخيول","السفينة الشراعية","الجمل"],0,"توسعت مصر في مشروعات النقل الكهربائي الحديثة."],
      ["ما أحد مظاهر التوسع العمراني الحديث؟",["المدن الجديدة","المعابد القديمة فقط","القلاع المملوكية فقط","القرى الفرعونية"],0,"تُعد المدن الجديدة أحد أبرز مظاهر التوسع العمراني الحديث."]
    ]
  };

  let board = [], moves = 0, score = 0;
  let coins = Number(localStorage.getItem("kingdomCoins") || 0);
  let stars = Number(localStorage.getItem("kingdomStars") || 0);
  let finished = false, processing = false, selected = null, questionIndex = 0;
  let progress = {};

  try {
    progress = JSON.parse(localStorage.getItem("kingdomProgress") || "{}");
  } catch {
    progress = {};
  }

  progress.unlockedEras ??= ["coptic"];
  progress.levels ??= {};
  progress.discoveredCharacters ??= [];
  progress.levels[ERA] ??= {unlocked:1, completed:[]};

  const currentEra =
    (typeof eraData !== "undefined" && eraData[ERA]) ||
    (typeof eraData !== "undefined" && eraData.coptic) ||
    ["العصر القبطي","✝️","","coptic","alexander"];

  const currentEraName = currentEra[0];
  const currentEraIcon = currentEra[1];

  if ($("scene") && bg[ERA]) {
    $("scene").style.backgroundImage = `url("assets/images/backgrounds/${bg[ERA]}")`;
  }

  if ($("gameTitle")) $("gameTitle").textContent = "مملكة الزمكان";
  if ($("levelTitle")) $("levelTitle").textContent = `${currentEraName} - المستوى ${LEVEL}`;
  if ($("eraIcon")) $("eraIcon").textContent = currentEraIcon;

  const selectedGoalTypes =
    eraLevelGoalTypes[ERA]?.[Math.min(LEVEL - 1, 2)] ||
    ["ruby","sapphire","emerald"];

  const goals = selectedGoalTypes.map((type,i) => ({
    type,
    target: 7 + LEVEL + i * 2,
    current: 0,
    completed: false
  }));

  const moveBudget = 20 + LEVEL * 2;
  moves = moveBudget;

  function randomType() {
    return types[Math.floor(Math.random() * types.length)];
  }

  function hasImmediateMatches(b) {
    for (let r=0;r<BOARD;r++) {
      for (let c=0;c<BOARD;c++) {
        const v=b[r][c];
        if (!v) continue;
        if (c>=2 && b[r][c-1]===v && b[r][c-2]===v) return true;
        if (r>=2 && b[r-1][c]===v && b[r-2][c]===v) return true;
      }
    }
    return false;
  }

  function swapOn(b,r1,c1,r2,c2) {
    [b[r1][c1],b[r2][c2]] = [b[r2][c2],b[r1][c1]];
  }

  function possibleMove(b=board) {
    for (let r=0;r<BOARD;r++) {
      for (let c=0;c<BOARD;c++) {
        for (const [dr,dc] of [[0,1],[1,0]]) {
          const nr=r+dr, nc=c+dc;
          if (nr>=BOARD || nc>=BOARD) continue;
          swapOn(b,r,c,nr,nc);
          const ok=hasImmediateMatches(b);
          swapOn(b,r,c,nr,nc);
          if (ok) return true;
        }
      }
    }
    return false;
  }

  function makeBoard() {
    let tries=0;
    do {
      board=[];
      for (let r=0;r<BOARD;r++) {
        board[r]=[];
        for (let c=0;c<BOARD;c++) {
          let v;
          do {
            v=randomType();
          } while (
            (c>=2 && board[r][c-1]===v && board[r][c-2]===v) ||
            (r>=2 && board[r-1][c]===v && board[r-2][c]===v)
          );
          board[r][c]=v;
        }
      }
      tries++;
    } while ((!possibleMove(board) || hasImmediateMatches(board)) && tries<100);
  }

  function render() {
    const root=$("gameBoard");
    if (!root) return;
    root.innerHTML="";
    for (let r=0;r<BOARD;r++) {
      for (let c=0;c<BOARD;c++) {
        const type=board[r][c];
        const info=tileInfo(type);
        const button=document.createElement("button");
        button.type="button";
        button.className=`gem ${type}`;
        button.dataset.row=r;
        button.dataset.col=c;
        button.dataset.type=type;
        button.textContent=info.symbol;
        button.setAttribute("aria-label",info.name);
        button.title=info.name;
        button.addEventListener("click",()=>pick(r,c));
        root.appendChild(button);
      }
    }
  }
    function findMatches() {
    const found=new Set();

    for (let r=0;r<BOARD;r++) {
      let start=0;
      for (let c=1;c<=BOARD;c++) {
        const cur=c<BOARD?board[r][c]:null;
        const prev=board[r][c-1];
        if (c<BOARD && cur===prev && cur) continue;
        if (prev && c-start>=3) {
          for (let x=start;x<c;x++) found.add(`${r},${x}`);
        }
        start=c;
      }
    }

    for (let c=0;c<BOARD;c++) {
      let start=0;
      for (let r=1;r<=BOARD;r++) {
        const cur=r<BOARD?board[r][c]:null;
        const prev=board[r-1][c];
        if (r<BOARD && cur===prev && cur) continue;
        if (prev && r-start>=3) {
          for (let x=start;x<r;x++) found.add(`${x},${c}`);
        }
        start=r;
      }
    }

    return [...found].map(s=>{
      const [r,c]=s.split(",").map(Number);
      return {r,c};
    });
  }

  function pick(r,c) {
    if (processing || finished || moves<=0) return;

    if (!selected) {
      selected={r,c};
      highlightSelected();
      return;
    }

    if (Math.abs(selected.r-r)+Math.abs(selected.c-c)!==1) {
      selected={r,c};
      highlightSelected();
      return;
    }

    const first=selected;
    selected=null;
    clearHighlight();
    swapOn(board,first.r,first.c,r,c);

    if (!findMatches().length) {
      swapOn(board,first.r,first.c,r,c);
      render();
      return;
    }

    moves--;
    processing=true;
    updateUI();
    resolve();
  }

  function highlightSelected() {
    clearHighlight();
    if (!selected) return;
    document.querySelector(
      `.gem[data-row="${selected.r}"][data-col="${selected.c}"]`
    )?.classList.add("selected");
  }

  function clearHighlight() {
    document.querySelectorAll(".gem.selected")
      .forEach(x=>x.classList.remove("selected"));
  }

  async function resolve() {
    let combo=0;

    while (true) {
      const matches=findMatches();
      if (!matches.length) break;

      combo++;
      const removed={};

      matches.forEach(({r,c})=>{
        const t=board[r][c];
        if (t) removed[t]=(removed[t]||0)+1;
        board[r][c]=null;
      });

      goals.forEach(g=>{
        if (g.completed) return;
        g.current+=removed[g.type]||0;

        if (g.current>=g.target) {
          g.current=g.target;
          g.completed=true;
          sound("goalComplete");
        }
      });

      score+=matches.length*10*combo;
      sound("match");
      render();
      updateUI();
      await wait(180);

      for (let c=0;c<BOARD;c++) {
        let write=BOARD-1;

        for (let r=BOARD-1;r>=0;r--) {
          if (board[r][c]) {
            board[write][c]=board[r][c];
            if (write!==r) board[r][c]=null;
            write--;
          }
        }

        while (write>=0) board[write--][c]=randomType();
      }

      render();
      await wait(180);
    }

    processing=false;
    updateUI();

    if (goalMet()) {
      finish();
      return;
    }

    if (moves<=0) {
      lose();
      return;
    }

    if (!possibleMove()) {
      shuffleBoard();
      render();
      updateUI();
    }
  }

  function shuffleBoard() {
    const a=board.flat().filter(Boolean);

    for (let i=a.length-1;i>0;i--) {
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }

    let i=0;
    for (let r=0;r<BOARD;r++) {
      for (let c=0;c<BOARD;c++) board[r][c]=a[i++];
    }

    if (hasImmediateMatches(board) || !possibleMove(board)) makeBoard();
    sound("shuffle");
  }

  function goalMet() {
    return goals.every(g=>g.current>=g.target);
  }

  function updateUI() {
    if ($("movesCount")) $("movesCount").textContent=moves;
    if ($("movesPanelCount")) $("movesPanelCount").textContent=moves;
    if ($("scoreCount")) $("scoreCount").textContent=score;
    if ($("scoreTopCount")) $("scoreTopCount").textContent=score;
    if ($("gameCoins")) $("gameCoins").textContent=coins;
    if ($("gameStars")) $("gameStars").textContent=stars;

    if ($("levelObjectiveShort")) {
      $("levelObjectiveShort").textContent=goals
        .map(g=>`${tileInfo(g.type).symbol} ${g.target}`)
        .join(" • ");
    }

    goals.forEach((g,i)=>{
      const card=$(`goalCard${i+1}`);
      const symbol=$(`goal${i+1}Symbol`);
      const label=$(`goal${i+1}Label`);
      const current=$(`goal${i+1}Current`);
      const target=$(`goal${i+1}Target`);

      g.completed=g.current>=g.target;

      if (card) {
        card.classList.toggle("completed",g.completed);
        card.classList.toggle("goal-done",g.completed);

        if (g.completed) card.dataset.completed="true";
        else delete card.dataset.completed;
      }

      if (symbol) symbol.textContent=tileInfo(g.type).symbol;
      if (label) label.textContent=tileInfo(g.type).name;
      if (current) current.textContent=Math.min(g.current,g.target);
      if (target) target.textContent=g.target;
    });

    const total=goals.reduce((s,g)=>s+g.target,0);
    const done=goals.reduce((s,g)=>s+Math.min(g.current,g.target),0);
    const pct=total?Math.min(100,Math.round(done/total*100)):0;

    if ($("levelProgressFill")) $("levelProgressFill").style.width=`${pct}%`;
    if ($("levelProgressText")) $("levelProgressText").textContent=`${done} / ${total}`;
    if ($("selectedGoalNotice")) $("selectedGoalNotice").style.display="block";

    if ($("selectedGoalName")) {
      $("selectedGoalName").textContent=goals
        .map(g=>tileInfo(g.type).name)
        .join(" + ");
    }

    updateBoosterCount("royalSealCount","royalSeal");
    updateBoosterCount("extraMovesCount","extraMoves");
    updateBoosterCount("gemPowerCount","gemPower");
    updateBoosterCount("compassCount","compass");
  }

  function updateBoosterCount(id,key) {
    const el=$(id);
    if (!el) return;
    let n=Number(localStorage.getItem(`booster_${key}`));
    if (!Number.isFinite(n)) n=2;
    el.textContent=n;
  }

  function finish() {
    if (finished) return;

    finished=true;
    score+=100;
    coins+=50;
    stars++;

    localStorage.setItem("kingdomCoins",coins);
    localStorage.setItem("kingdomStars",stars);

    progress.levels[ERA]??={unlocked:1,completed:[]};

    if (!progress.levels[ERA].completed.includes(LEVEL)) {
      progress.levels[ERA].completed.push(LEVEL);
    }

    if (LEVEL<3) {
      progress.levels[ERA].unlocked=Math.max(
        progress.levels[ERA].unlocked||1,
        LEVEL+1
      );
    }

    if (LEVEL>=3) {
      const next=eraOrder[eraOrder.indexOf(ERA)+1];

      if (next) {
        if (!progress.unlockedEras.includes(next)) {
          progress.unlockedEras.push(next);
        }

        progress.levels[next]??={unlocked:1,completed:[]};
        progress.levels[next].unlocked=1;
      }
    }

    localStorage.setItem("kingdomProgress",JSON.stringify(progress));

    if ($("finalScore")) $("finalScore").textContent=score;
    if ($("finalCoins")) $("finalCoins").textContent=coins;
    if ($("finalMoves")) $("finalMoves").textContent=moves;

    sound("win");
    openModal("levelCompleteModal");
  }

  function lose() {
    finished=true;
    sound("lose");

    if ($("wrongAnswerText")) {
      $("wrongAnswerText").textContent="انتهت الحركات قبل إكمال أهداف المستوى.";
    }

    if ($("historicalTip")) {
      $("historicalTip").textContent="حاول مرة أخرى ورتب القطع بذكاء لتحقيق جميع المتطلبات.";
    }

    openModal("wrongModal");
  }

  function openQuestion() {
    questionIndex=0;
    showQuestion(questions[ERA]||questions.coptic);
  }

  function showQuestion(list) {
    if (questionIndex>=list.length) {
      finishQuestions();
      return;
    }

    const q=list[questionIndex];
    const opts=[...q[1]];
    const correct=q[1][q[2]];
    const tip=q[3];

    if ($("questionText")) $("questionText").textContent=q[0];
    if ($("questionCounter")) {
      $("questionCounter").textContent=`${questionIndex+1} / ${list.length}`;
    }

    const char=
      (typeof chars!=="undefined"&&chars[currentEra[4]]) ||
      (typeof chars!=="undefined"&&chars.alexander);

    if (char && $("questionCharacterImage")) {
      const img=$("questionCharacterImage");
      img.onerror=()=>{img.style.display="none";};
      img.src=char[1];
      img.alt=char[0];
      img.style.display="block";
    }

    if (char && $("questionCharacterName")) {
      $("questionCharacterName").textContent=char[0];
    }

    if ($("questionCharacterEra")) {
      $("questionCharacterEra").textContent=currentEraName;
    }

    const container=$("questionOptions");
    if (!container) return;
    container.innerHTML="";

    if ($("answerFeedback")) {
      $("answerFeedback").classList.remove("show","correct","wrong");
    }

    opts.sort(()=>Math.random()-0.5).forEach(opt=>{
      const b=document.createElement("button");
      b.type="button";
      b.className="answer-option";
      b.textContent=opt;
      b.addEventListener("click",()=>answer(opt,correct,tip,b,container,list));
      container.appendChild(b);
    });

    const next=$("closeQuestionModal");

    if (next) {
      next.textContent="اختار إجابتك";
      next.disabled=true;
      next.onclick=null;
    }

    openModal("questionModal");
  }

  function answer(choice,correct,tip,clicked,container,list) {
    const buttons=container.querySelectorAll(".answer-option");
    buttons.forEach(b=>b.disabled=true);

    const next=$("closeQuestionModal");
    if (next) next.disabled=false;

    if (choice===correct) {
      clicked.classList.add("correct");

      if ($("answerFeedback")) {
        $("answerFeedback").classList.add("show","correct");
      }

      if ($("feedbackIcon")) $("feedbackIcon").textContent="✓";
      if ($("feedbackTitle")) $("feedbackTitle").textContent="إجابة صحيحة!";
      if ($("feedbackText")) $("feedbackText").textContent="أحسنت! إجابتك صحيحة.";

      sound("correct");
      questionIndex++;

      if (next) {
        next.textContent=questionIndex<list.length?"السؤال التالي":"اكتشاف الشخصية";
        next.onclick=()=>{
          if (questionIndex<list.length) {
            showQuestion(list);
          } else {
            closeModal("questionModal");
            showCorrect();
          }
        };
      }
    } else {
      clicked.classList.add("wrong");

      buttons.forEach(b=>{
        if (b.textContent===correct) b.classList.add("correct");
      });

      if ($("answerFeedback")) {
        $("answerFeedback").classList.add("show","wrong");
      }

      if ($("feedbackIcon")) $("feedbackIcon").textContent="✕";
      if ($("feedbackTitle")) $("feedbackTitle").textContent="إجابة غير صحيحة";
      if ($("feedbackText")) $("feedbackText").textContent=tip;

      sound("wrong");

      if (next) {
        next.textContent="حاول مرة أخرى";
        next.onclick=()=>{
          closeModal("questionModal");
          showQuestion(list);
        };
      }
    }
  }
    function showCorrect() {
    const era=(typeof eraData!=="undefined"&&eraData[ERA])||currentEra;
    const char=
      (typeof chars!=="undefined"&&chars[era[4]]) ||
      (typeof chars!=="undefined"&&chars.alexander);

    if (char && $("unlockedCharacterImage")) {
      const img=$("unlockedCharacterImage");
      img.onerror=()=>{img.style.display="none";};
      img.src=char[1];
      img.alt=char[0];
      img.style.display="block";
    }

    if (char && $("unlockedCharacterName")) {
      $("unlockedCharacterName").textContent=char[0];
    }

    if (char && $("unlockedCharacterInfo")) {
      $("unlockedCharacterInfo").textContent=char[2];
    }

    progress.discoveredCharacters??=[];

    if (char && !progress.discoveredCharacters.includes(char[0])) {
      progress.discoveredCharacters.push(char[0]);
    }

    localStorage.setItem("kingdomProgress",JSON.stringify(progress));
    openModal("correctModal");
    sound("win");
  }

  function finishQuestions() {
    closeModal("questionModal");
    showCorrect();
  }

  function openModal(id) {
    const m=$(id);
    if (!m) return;

    m.classList.remove("hidden");
    m.classList.add("show");

    Object.assign(m.style,{
      display:"flex",
      position:"fixed",
      inset:"0",
      width:"100%",
      height:"100%",
      alignItems:"center",
      justifyContent:"center",
      zIndex:"9999",
      boxSizing:"border-box"
    });
  }

  function closeModal(id) {
    const m=$(id);
    if (!m) return;

    m.classList.remove("show");
    m.classList.add("hidden");
    m.style.display="none";
  }

  /* NEXT LEVEL / NEXT ERA */

  if ($("nextLevelButton")) {
    $("nextLevelButton").onclick=()=>{
      closeModal("correctModal");

      if (LEVEL<3) {
        location.href=`game.html?era=${encodeURIComponent(ERA)}&level=${LEVEL+1}`;
        return;
      }

      const next=eraOrder[eraOrder.indexOf(ERA)+1];
      location.href=next
        ? `game.html?era=${encodeURIComponent(next)}&level=1`
        : "map.html";
    };
  }

  if ($("continueAfterWin")) {
    $("continueAfterWin").onclick=()=>{
      closeModal("levelCompleteModal");
      openQuestion();
    };
  }

  if ($("backToMapAfterWin")) {
    $("backToMapAfterWin").onclick=()=>{
      location.href="map.html";
    };
  }

  if ($("openQuestionButton")) {
    $("openQuestionButton").onclick=()=>{
      if (finished) openQuestion();
    };
  }

  /* RETRY */

  if ($("retryQuestionButton")) {
    $("retryQuestionButton").onclick=()=>{
      closeModal("wrongModal");
      finished=false;
      processing=false;
      selected=null;
      moves=moveBudget;
      score=0;

      goals.forEach(g=>{
        g.current=0;
        g.completed=false;
      });

      makeBoard();
      render();
      updateUI();
    };
  }

  /* PAUSE */

  if ($("pauseButton")) {
    $("pauseButton").onclick=()=>{
      if (!finished) openModal("pauseModal");
    };
  }

  if ($("resumeGameButton")) {
    $("resumeGameButton").onclick=()=>{
      closeModal("pauseModal");
    };
  }

  /* SETTINGS */

  if ($("gameSettingsButton")) {
    $("gameSettingsButton").onclick=()=>{
      openModal("gameSettingsModal");
    };
  }

  document.querySelectorAll("[data-close]").forEach(b=>{
    b.addEventListener("click",()=>closeModal(b.dataset.close));
  });

  document.addEventListener("keydown",e=>{
    if (e.key!=="Escape") return;

    [
      "questionModal",
      "correctModal",
      "wrongModal",
      "pauseModal",
      "gameSettingsModal",
      "levelCompleteModal"
    ].forEach(id=>{
      const m=$(id);
      if (m && m.classList.contains("show")) closeModal(id);
    });
  });

  /* GOAL CARD SELECTION */

  for (let i=1;i<=3;i++) {
    const card=$(`goalCard${i}`);
    if (!card) continue;

    card.addEventListener("click",()=>{
      if (card.classList.contains("completed")) return;

      document.querySelectorAll(".goal-card").forEach(x=>{
        x.classList.remove("selected");
      });

      card.classList.add("selected");
    });
  }

  /* BOOSTERS */

  function getBoosterCount(key) {
    const storage=`booster_${key}`;
    let n=Number(localStorage.getItem(storage));

    if (!Number.isFinite(n)) {
      n=2;
      localStorage.setItem(storage,n);
    }

    return n;
  }

  function useBooster(key) {
    const n=getBoosterCount(key);

    if (n<=0) {
      showToast("لا يوجد لديك من هذا المعزز");
      return false;
    }

    localStorage.setItem(`booster_${key}`,n-1);
    updateUI();
    return true;
  }

  /* ROYAL SEAL */

  if ($("royalSealBooster")) {
    $("royalSealBooster").onclick=()=>{
      if (processing || finished) return;

      const goal=goals.find(g=>!g.completed);

      if (!goal) {
        showToast("كل المتطلبات مكتملة بالفعل");
        return;
      }

      let pos=null;

      for (let r=0;r<BOARD && !pos;r++) {
        for (let c=0;c<BOARD && !pos;c++) {
          if (board[r][c]!==goal.type) pos={r,c};
        }
      }

      if (!pos) {
        showToast("لا توجد قطعة مناسبة للتغيير");
        return;
      }

      if (!useBooster("royalSeal")) return;

      board[pos.r][pos.c]=goal.type;
      render();
      updateUI();
      sound("booster");
      showToast("تم تفعيل الختم الملكي");
    };
  }

  /* EXTRA MOVES */

  if ($("extraMovesBooster")) {
    $("extraMovesBooster").onclick=()=>{
      if (finished || processing) return;
      if (!useBooster("extraMoves")) return;

      moves+=5;
      updateUI();
      sound("booster");
      showToast("تمت إضافة 5 حركات");
    };
  }

  /* GEM POWER */

  if ($("gemPowerBooster")) {
    $("gemPowerBooster").onclick=()=>{
      if (processing || finished) return;

      const goal=goals
        .filter(g=>!g.completed)
        .sort((a,b)=>a.current-b.current)[0];

      if (!goal) {
        showToast("كل المتطلبات مكتملة بالفعل");
        return;
      }

      let pos=null;

      for (let r=0;r<BOARD && !pos;r++) {
        for (let c=0;c<BOARD && !pos;c++) {
          if (board[r][c]===goal.type) pos={r,c};
        }
      }

      if (!pos) {
        showToast("لا توجد جوهرة مناسبة الآن");
        return;
      }

      if (!useBooster("gemPower")) return;

      board[pos.r][pos.c]=randomType();
      score+=50;
      render();
      updateUI();
      sound("booster");
      showToast("قوة الجواهر فعّالة!");
    };
  }

  /* COMPASS */

  function findHintMove() {
    for (let r=0;r<BOARD;r++) {
      for (let c=0;c<BOARD;c++) {
        for (const [dr,dc] of [[0,1],[1,0]]) {
          const nr=r+dr,nc=c+dc;
          if (nr>=BOARD || nc>=BOARD) continue;

          swapOn(board,r,c,nr,nc);
          const ok=hasImmediateMatches(board);
          swapOn(board,r,c,nr,nc);

          if (ok) return {r1:r,c1:c,r2:nr,c2:nc};
        }
      }
    }

    return null;
  }

  if ($("compassBooster")) {
    $("compassBooster").onclick=()=>{
      if (processing || finished) return;

      const move=findHintMove();

      if (!move) {
        showToast("لا توجد حركة مناسبة");
        return;
      }

      if (!useBooster("compass")) return;

      const a=document.querySelector(
        `.gem[data-row="${move.r1}"][data-col="${move.c1}"]`
      );

      const b=document.querySelector(
        `.gem[data-row="${move.r2}"][data-col="${move.c2}"]`
      );

      a?.classList.add("hint");
      b?.classList.add("hint");

      sound("booster");
      showToast("البوصلة حددت لك حركة مناسبة");

      setTimeout(()=>{
        a?.classList.remove("hint");
        b?.classList.remove("hint");
      },1800);
    };
  }

  /* SOUND SETTINGS */

  const soundEffects=$("gameSoundEffects");
  const musicSwitch=$("gameMusic");

  function readAudioSettings(){
    try {
      return {soundEffects:true,backgroundMusic:true,volume:75,...JSON.parse(localStorage.getItem("kingdom_settings")||"{}")}
    } catch {
      return {soundEffects:true,backgroundMusic:true,volume:75};
    }
  }

  function writeAudioSettings(next){
    localStorage.setItem("kingdom_settings",JSON.stringify(next));
    window.KingdomAudio?.refresh();
  }

  if (soundEffects) {
    const s=readAudioSettings();
    soundEffects.checked=s.soundEffects!==false;
    soundEffects.addEventListener("change",()=>{
      writeAudioSettings({...readAudioSettings(),soundEffects:soundEffects.checked});
    });
  }

  if (musicSwitch) {
    const s=readAudioSettings();
    musicSwitch.checked=s.backgroundMusic!==false;
    musicSwitch.addEventListener("change",()=>{
      writeAudioSettings({...readAudioSettings(),backgroundMusic:musicSwitch.checked});
    });
  }

  /* AUDIO */

  let audioContext=null;

  function sound(type) {
    if (window.KingdomAudio) {
      window.KingdomAudio.play(type);
      return;
    }
  }

  /* TOAST */

  function showToast(message) {
    const toast=$("toast");
    if (!toast) return;

    toast.textContent=message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer=setTimeout(()=>{
      toast.classList.remove("show");
    },2200);
  }

  function wait(ms) {
    return new Promise(resolve=>setTimeout(resolve,ms));
  }

  /* INITIALIZE GAME */

  makeBoard();
  render();
  updateUI();

  document.addEventListener("pointerdown",()=>{
    try {
      const C=window.AudioContext||window.webkitAudioContext;

      if (
        !audioContext &&
        C &&
        localStorage.getItem("kingdom_settings.soundEffects")!=="off"
      ) {
        audioContext=new C();
      }
    } catch {}
  },{once:true});

});