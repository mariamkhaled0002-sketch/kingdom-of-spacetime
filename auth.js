document.addEventListener("DOMContentLoaded",()=> {
    const $=id=>document.getElementById(id);
    const USERS="kingdom_users",CURRENT="kingdom_current_user",REM="kingdom_remember_me";
    let users=[];
    try {
        users=JSON.parse(localStorage.getItem(USERS))||[]
    } catch
    {
    }
    ;
    const loginTab=$("loginTab"),registerTab=$("registerTab"),loginForm=$("loginForm"),registerForm=$("registerForm");
    function msg(el,text,type) {
        el.textContent=text;
        el.className="form-message "+type
    }

    function switchTab(register) {
        loginTab.classList.toggle("active",!register);
        registerTab.classList.toggle("active",register);
        loginForm.classList.toggle("hidden",register);
        registerForm.classList.toggle("hidden",!register)
    }
    
    loginTab.onclick=()=>switchTab(false);
    registerTab.onclick=()=>switchTab(true);
    $("forgotPassword").onclick=()=>msg($("loginMessage"),"في نسخة الـ Front-End التجريبية لا يوجد بريد لاستعادة كلمة المرور. أنشئ حسابًا جديدًا أو استخدم بيانات الحساب المحفوظة.","error");
    registerForm.addEventListener("submit",e=> {
        e.preventDefault();
        const name=$("registerName").value.trim(),email=$("registerEmail").value.trim().toLowerCase(),pass=$("registerPassword").value,confirm=$("registerConfirmPassword").value;
        if(!name||!email||!pass)return;
        if(pass!==confirm)return msg($("registerMessage"),"كلمتا المرور غير متطابقتين.","error");
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return msg($("registerMessage"),"اكتب بريدًا إلكترونيًا صحيحًا.","error");
        if(users.some(u=>u.email===email))return msg($("registerMessage"),"هذا البريد مسجل بالفعل.","error");
        const user= {
            id:Date.now().toString(),name,email,password:pass,coins:120,stars:0,createdAt:new Date().toISOString()
        }
        ;
        users.push(user);
        localStorage.setItem(USERS,JSON.stringify(users));
        localStorage.setItem(CURRENT,JSON.stringify(user));
        localStorage.setItem(REM,"1");
        localStorage.setItem("kingdomProgress",JSON.stringify( {
            coins:120,stars:0,currentEra:"greek",unlockedEras:["greek"],levels: {
                greek: {
                    unlocked:1,completed:[]
                }
            }
            ,discoveredCharacters:[]
        }
        ));
        msg($("registerMessage"),"تم إنشاء الحساب بنجاح ✨ جاري فتح الرحلة...","ok");
        setTimeout(()=>location.href="instructions.html",700)
    }
    );

    loginForm.addEventListener("submit",e=> {
        e.preventDefault();
        const key=$("loginUsername").value.trim().toLowerCase(),pass=$("loginPassword").value;
        const user=users.find(u=>(u.email===key||u.name.toLowerCase()===key)&&u.password===pass);
        if(!user)return msg($("loginMessage"),"بيانات الدخول غير صحيحة.","error");
        localStorage.setItem(CURRENT,JSON.stringify(user));
        localStorage.setItem(REM,$("rememberMe").checked?"1":"0");
        msg($("loginMessage"),"تم الدخول بنجاح 👑","ok");
        setTimeout(()=>location.href="instructions.html",450)
    }
    );
    try {
        const remembered=JSON.parse(localStorage.getItem(CURRENT));
        if(remembered&&localStorage.getItem(REM)==="1")$("loginUsername").value=remembered.email
    } catch
    {
    }
}
);
