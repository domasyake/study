class TextController {

    constructor(split_controller,media_controller,moveable_controller,hint_controller,save_data_manager) {
        this.input_box=document.getElementById("input_box");
        this.chat_text=document.getElementById("chat_text");
        this.input_submit=document.getElementById("input_submit");
        this.check_submit=document.getElementById("check_submit");
        this.triangle=document.getElementById("chat_triangle");
        this.split_controller=split_controller;
        this.media_controller=media_controller;
        this.moveable_contrller=moveable_controller;
        this.hint_controller=hint_controller;
        this.save_data_manager=save_data_manager;

        this.SwitchTriAngle(false);
        this.input_box.style.display="none";
        this.input_submit.style.display="none";
        this.check_submit.style.display="none";

        this.current_data=[];
        this.on_area_click=new Rx.Subject();
        this.on_input_submit=new Rx.Subject();
        let on_check_submit=new Rx.Subject();
        this.on_check_submit=on_check_submit;

        Rx.Observable.fromEvent(this.input_submit,"click")
            .subscribe(()=>this.SubmitNextButton());
        Rx.Observable.fromEvent(document.getElementById("chat_area"),"click")
            .subscribe(()=>this.ClickArea());
        Rx.Observable.fromEvent(this.check_submit,"click")
            .subscribe(()=>on_check_submit.onNext());
    }

    async LoadData(file_name){
        this.current_data=await getCsvData(file_name);
    }

    async StartChat(){
        let temp_data=[];

        for (let current_line=this.save_data_manager.save_data.current_line;current_line< this.current_data.length;current_line++){
            let item=this.current_data[current_line];
            const mode=String(item[1]).slice(0,-1);

            switch (mode) {
                case '':
                    this.setText(item[0]);
                    await this.WaitClick();
                    break;
                case "loopSplit":
                    this.split_controller.SwitchDisplay(true);
                    this.input_box.style.display="block";
                    this.input_submit.style.display="block";
                    this.hint_controller.SwitchDisplay(true);
                    this.setText(item[0]);
                    const word=await this.getInput();
                    const res_text=this.split_controller.checkWord(word);
                    this.resetInput();
                    this.setText(res_text);

                    await this.WaitClick();

                    if(!this.split_controller.checkComplete()){
                        current_line--;
                    }
                    break;
                case "clearFunction":
                    this.split_controller.SwitchDisplay(false);
                    this.setText(item[0]);
                    await this.WaitClick();

                    break;
                case "playMovie1":
                    this.setText(item[0]);
                    await this.media_controller.PlayVideo("media/play.mp4");
                    await this.WaitClick();

                    break;
                case "picture1":
                    this.setText(item[0]);
                    this.media_controller.visibleImg("media/desc.png");
                    await this.WaitClick();

                    break;
                case "invPicture1":
                    this.setText(item[0]);
                    this.media_controller.invisibleImg();
                    await this.WaitClick();

                    break;
                case "loopMove":
                    this.check_submit.style.display="block";
                    this.setText(item[0]);
                    await this.on_check_submit.first().toPromise();
                    let res=this.moveable_contrller.CheckComplete();
                    if(res===""){
                    }else{
                        this.setText(res);
                        current_line--;
                        await this.WaitClick();

                    }
                    break;
                case "endSplit":
                    this.split_controller.SwitchDisplay(false);
                    this.input_box.style.display="none";
                    this.input_submit.style.display="none";
                    this.hint_controller.SwitchDisplay(false);
                    break;
                case "endMove":
                    this.check_submit.style.display="none";
                    break;
                default:
                    break;
            }
            this.save_data_manager.pushCurrentLine(current_line+1);
        }
    }

    setText(word){
        this.chat_text.innerText=word;
    }

    resetInput(){
        this.input_box.value="";
    }

    async getInput(){
        await this.on_input_submit.first().toPromise();
        return String(this.input_box.value);
    }

    async WaitClick(){
        this.SwitchTriAngle(true);
        await this.on_area_click.first().toPromise();
        this.SwitchTriAngle(false);
    }

    SwitchTriAngle(flag){
        this.triangle.style.display=flag?"block":"none";
    }

    ClickArea(){
        this.on_area_click.onNext();
    }
    SubmitNextButton(){
        this.on_input_submit.onNext()
    }
}
