class HintController {

    constructor(hint_button,hint_text,
                save_data_manager,
                split_controller)
    {
        Rx.Observable.fromEvent(hint_button,"click")
            .subscribe(_=>{

                let step=save_data_manager.save_data.current_step;
                let use=null;
                switch (step) {
                    case 1:
                        use=split_controller;
                        break;
                }
                const hint=use.getHint();
                console.log("aaa"+hint)
                if(hint===""){
                    hint_text.innerText="もうヒントがないよ";
                }else{
                    hint_text.innerText=hint;
                }

            })
    }
}