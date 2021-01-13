class HintController {

    constructor(hint_button,hint_text,
                save_data_manager,
                split_controller)
    {
        this.hint_button=hint_button;
        this.hint_text=hint_text;
        Rx.Observable.fromEvent(hint_button,"click")
            .subscribe(_=>{

                let step=save_data_manager.save_data.current_step;
                let use=split_controller;
                // switch (step) {
                //     case 2:
                //         use=split_controller;
                //         break;
                //}
                const hint=use.getHint();
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