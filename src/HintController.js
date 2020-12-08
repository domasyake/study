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
                    case 2:
                        use=split_controller;
                        break;
                }
            })
    }
}