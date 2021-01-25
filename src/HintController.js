class HintController {

    constructor(hint_button,hint_text,hint_controller){
        this.hint_button=hint_button;
        this.hint_text=hint_text;
        Rx.Observable.fromEvent(hint_button,"click")
            .subscribe(_=>{
                const hint=hint_controller.getHint();
                if(hint===""){
                    hint_text.innerText="もうヒントがありません";
                }else{
                    hint_text.innerText=hint;
                }

            });
        this.SwitchDisplay(false);
    }

    SwitchDisplay(flag){
        this.hint_button.style.display=flag?"block":"none";
        this.hint_text.style.display=flag?"block":"none";
    }
}