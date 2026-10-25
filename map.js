document.addEventListener("DOMContentLoaded",()=> {
    const $=id=>document.getElementById(id), PROGRESS="kingdomProgress";
    const eras= {
        greek: {
            name:"العصر اليوناني والبطلمي",period:"332–30 ق.م",bg:"greek.jpg",icon:"𓋹",desc:"من الإسكندر الأكبر إلى كليوباترا السابعة.",char:"alexander",levels:3
        }
        ,
        coptic: {
            name:"العصر القبطي",period:"القرون الأولى للميلاد",bg:"coptic.jpg",icon:"✥",desc:"مرحلة مهمة من تاريخ مصر الثقافي والديني.",char:"athanasius",levels:3
        }
        ,
        islamic: {
            name:"العصر الإسلامي",period:"641م وما بعده",bg:"islamic.jpg",icon:"☪",desc:"المدن والعمران والحضارة الإسلامية في مصر.",char:"saladin",levels:3
        }
        ,
        mamluk: {
            name:"العصر المملوكي",period:"1250–1517م",bg:"mamluk.jpg",icon:"⚔",desc:"زمن السلاطين والقلاع وشجرة الدر وعلي بك الكبير.",char:"shajar",levels:3
        }
        ,
        ottoman: {
            name:"العصر العثماني",period:"1517–1805م",bg:"ottoman.jpg",icon:"♜",desc:"مرحلة الحكم العثماني وتغيرات مصر السياسية.",char:"ali-bey",levels:3
        }
        ,
        "muhammad-ali": {
            name:"عصر محمد علي",period:"1805–1952م",bg:"muhammad-ali.jpg",icon:"⚓",desc:"رحلة التحديث وبناء الدولة الحديثة في مصر.",char:"muhammad-ali",levels:3
        }
        ,
        modern: {
            name:"مصر الحديثة",period:"القرن العشرون",bg:"modern.jpg",icon:"𓉐",desc:"محطات من بناء مصر الحديثة وتطور المدن والمجتمع.",char:"zaghloul",levels:3
        }
        ,
        contemporary: {
            name:"مصر المعاصرة",period:"العصر الحالي",bg:"contemporary.jpg",icon:"✦",desc:"محطة أخيرة تربط التاريخ بالجغرافيا والحياة المعاصرة.",char:"modern-egypt",levels:3
        }
    }
    ;
    function defaultProgress() {
        return {
            coins:120,stars:0,currentEra:"greek",unlockedEras:["greek"],levels: {
                greek: {
                    unlocked:1,completed:[]
                }
            }
            ,discoveredCharacters:[]
        }
    }
    function getP() {
        try {
            return {
                ...defaultProgress(),...JSON.parse(localStorage.getItem(PROGRESS)||"{}")
            }
        } catch
        {
            return defaultProgress()
        }
    }
    let p=getP();
    const order=Object.keys(eras);
    function save() {
        localStorage.setItem(PROGRESS,JSON.stringify(p))
    }
    for(const id of order) {
        if(!p.levels[id])p.levels[id]= {
            unlocked:id==="greek"?1:0,completed:[]
        }
        ;
        if(!Array.isArray(p.levels[id].completed))p.levels[id].completed=[]
    }
    if(!Array.isArray(p.unlockedEras))p.unlockedEras=["greek"];
    if(!p.unlockedEras.includes("greek"))p.unlockedEras.unshift("greek");
    for(let i=0;
    i<order.length-1;
    i++) {
        const currentId=order[i],nextId=order[i+1],currentState=p.levels[currentId];
        const completed=currentState&&Array.isArray(currentState.completed)?currentState.completed:[];
        const allLevelsDone=[1,2,3].every(level=>completed.includes(level));
        if(allLevelsDone) {
            if(!p.unlockedEras.includes(nextId))p.unlockedEras.push(nextId);
            p.levels[nextId]??= {
                unlocked:1,completed:[]
            }
            ;
            p.levels[nextId].unlocked=Math.max(1,p.levels[nextId].unlocked||0);
        }
    }
    save();
    $("coins").textContent=p.coins??120;
    $("stars").textContent=p.stars??0;
    let selected=p.currentEra||"greek";
    function show(t,x) {
        $("transitionTitle").textContent=t;
        $("transitionText").textContent=x;
        $("transition").classList.add("show");
        setTimeout(()=>$("transition").classList.remove("show"),1700)
    }
    function render() {
        const tl=$("timeline");
        tl.innerHTML="";
        order.forEach((id,i)=> {
            const e=eras[id],open=p.unlockedEras.includes(id),state=p.levels[id]|| {
                unlocked:0,completed:[]
            }
            ;
            const card=document.createElement("article");
            card.className="royal-era-card"+(open?" is-open":" is-locked")+(id===selected?" is-selected":"");
            card.style.setProperty("--era-image",`url("assets/images/backgrounds/${e.bg}")`);
            const levelButtons=Array.from( {
                length:e.levels
            }
            ,(_,idx)=> {
                const n=idx+1,unlocked=open&&n<=(state.unlocked||0),done=(state.completed||[]).includes(n);
                return `<button class="royal-level ${unlocked?"available":""} ${done?"completed":""}" data-level="${n}" ${unlocked?"":"disabled"} aria-label="المستوى ${n}${unlocked?" متاح":" مغلق"}">${done?"✓":n}</button>`
            }
            ).join("");
            card.innerHTML=`<div class="royal-era-art"><span class="royal-era-number">${String(i+1).padStart(2,"0")}</span><span class="royal-era-symbol">${e.icon}</span></div><div class="royal-era-copy"><h2>${e.name}</h2><p>${e.period}</p><div class="royal-levels">${levelButtons}</div><small class="royal-era-state">${open?`✦ $ {
                state.completed.length===e.levels?"اكتمل العصر":"اختر مستوى للبدء"
            }
            `:"🔒 أكمل العصر السابق لفتح البوابة"}</small></div><div class="royal-lock">${open?"✧":"🔒"}</div>`;
            card.addEventListener("click",ev=> {
                const levelButton=ev.target.closest("[data-level]");
                if(levelButton) {
                    if(levelButton.disabled)return;
                    const n=Number(levelButton.dataset.level);
                    location.href=`game.html?era=${id}&level=${n}`;
                    return;
                }
                if(!open) {
                    show("البوابة مغلقة","أكمل مستويات العصر السابق لفتح هذه البوابة.");
                    return;
                }
                selected=id;
                p.currentEra=id;
                save();
                render();
            }
            );
            tl.appendChild(card);
        }
        );
    }
    render();
    window.KingdomMap= {
        completeLevel(id,l) {
            if(!eras[id])return;
            const state=p.levels[id]||(p.levels[id]= {
                unlocked:1,completed:[]
            }
            );
            if(!state.completed.includes(l))state.completed.push(l);
            state.unlocked=Math.max(state.unlocked||1,l+1);
            p.coins=(p.coins||0)+50;
            p.stars=(p.stars||0)+1;
            const n=order.indexOf(id);
            if(l>=eras[id].levels&&n>=0&&n<order.length-1) {
                const next=order[n+1];
                if(!p.unlockedEras.includes(next))p.unlockedEras.push(next);
                p.levels[next].unlocked=Math.max(1,p.levels[next].unlocked||0)
            }
            save();
        }
    }
    ;
}
);
