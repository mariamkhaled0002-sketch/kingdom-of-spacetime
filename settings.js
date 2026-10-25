document.addEventListener("DOMContentLoaded",()=> {
    const KEY="kingdom_settings",defaults= {
        soundEffects:true,backgroundMusic:true,volume:75,language:"ar"
    }
    ;
    const get=()=> {
        try {
            return {
                ...defaults,...JSON.parse(localStorage.getItem(KEY)||"{}")
            }
        } catch
        {
            return {
                ...defaults
            }
        }
    }
    ;
    const save=s=>localStorage.setItem(KEY,JSON.stringify(s));
    const s=get(),fx=document.getElementById("soundEffects"),music=document.getElementById("backgroundMusic"),vol=document.getElementById("volumeControl"),val=document.getElementById("volumeValue");
    if(fx)fx.checked=s.soundEffects;
    if(music)music.checked=s.backgroundMusic;
    if(vol)vol.value=s.volume;
    if(val)val.textContent=s.volume+"%";
    function update() {
        s.soundEffects=fx.checked;
        s.backgroundMusic=music.checked;
        s.volume=Number(vol.value);
        val.textContent=s.volume+"%";
        save(s);
        window.KingdomAudio?.refresh();
    }
    [fx,music,vol].forEach(x=>x&&x.addEventListener("input",update));
    document.getElementById("resetSettings")?.addEventListener("click",()=> {
        save( {
            ...defaults
        }
        );
        window.KingdomAudio?.refresh(); location.reload()
    }
    );
    window.KingdomSettings= {
        get,save,update:update
    }
}
);
