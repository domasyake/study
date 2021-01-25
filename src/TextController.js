class TextController {

    constructor(split_controller,media_controller,moveable_controller,
                hint_controller,save_data_manager,assist_controller) {
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
        this.assist_controller=assist_controller;

        this.SwitchTriAngle(false);
        this.input_box.style.display="none";
        this.input_submit.style.display="none";
        this.check_submit.style.display="none";

        this.regex=/[0-9]/;//数値が含まれているかチェックする正規表現
        this.first_launch=true;//実行時最初のテキストかどうかのフラグ
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
        //ループ開始時にSaveDataから行を読み込む
        for (let current_line=this.save_data_manager.save_data.current_line;current_line< this.current_data.length;current_line++){
            let item=this.current_data[current_line];
            //const mode=String(item[1])
            //ローカルサーバだと改行コードも含まれてしまうのでこっち使う
            let mode=String(item[1]).slice(0,-1);
            let mode_arg=-1;
            if(this.regex.test(mode)){
                let match_char=this.regex.exec(mode)[0];
                mode_arg=Number(match_char);
                mode=mode.replace(match_char,"");
            }

            console.log("command:"+mode+" , arg:"+mode_arg)
            switch (mode) {
                case '':
                    this.setText(item[0]);
                    await this.WaitClick();
                    break;

                case "playMovie":
                    this.setText(item[0]);
                    await this.media_controller.PlayVideo(mode_arg,this.first_launch);
                    await this.WaitClick();
                    break;
                case "picture":
                    this.setText(item[0]);
                    this.media_controller.visibleImg(mode_arg);
                    await this.WaitClick();
                    break;
                case "invPicture":
                    this.setText(item[0]);
                    await this.WaitClick();
                    this.media_controller.invisibleImg();
                    break;

                case "prepareSplit":
                    this.setText(item[0]);
                    this.split_controller.SwitchDisplay(true);
                    await this.WaitClick();
                    break;
                case "exampleSplit":
                    this.setText(item[0]);
                    this.split_controller.exampleSplit(mode_arg);
                    await this.WaitClick();
                    break;
                case "loopSplit":
                    this.split_controller.SwitchDisplay(true);
                    this.input_box.style.display="block";
                    this.input_submit.style.display="block";
                    this.hint_controller.SwitchDisplay(true);
                    this.setText(item[0]);
                    const word=await this.getInput();
                    const result=this.split_controller.checkWord(word);
                    this.setText(result.mess);
                    if(result.success){
                        this.resetInput();
                    }
                    this.input_submit.style.display="none";
                    await this.WaitClick();
                    if(!this.split_controller.checkComplete()){
                        current_line--;
                    }
                    break;
                case "endSplit":
                    this.split_controller.SwitchDisplay(false);
                    this.input_box.style.display="none";
                    this.input_submit.style.display="none";
                    this.hint_controller.SwitchDisplay(false);
                    break;

                case "prepareMove":
                    this.setText(item[0]);
                    this.split_controller.splitForMove();
                    this.moveable_contrller.Prepare();
                    this.moveable_contrller.SwitchDisplay(true);
                    await this.WaitClick();
                    break;
                case "loopMove":
                    this.moveable_contrller.Prepare();
                    this.moveable_contrller.SwitchDisplay(true);
                    this.check_submit.style.display="block";
                    this.setText(item[0]);
                    await this.on_check_submit.first().toPromise();
                    this.check_submit.style.display="none";
                    let res=this.moveable_contrller.CheckComplete();
                    if(res===""){
                    }else{
                        this.setText(res);
                        current_line--;
                        await this.WaitClick();
                        this.check_submit.style.display="block";
                    }
                    break;
                case "endMove":
                    this.setText(item[0]);
                    this.moveable_contrller.SwitchDisplay(false);
                    this.check_submit.style.display="none";
                    await this.WaitClick();
                    break;

                case "prepareAssist":
                    console.log("prepareAssist")
                    this.setText(item[0]);
                    this.assist_controller.Prepare();
                    this.assist_controller.SwitchDisplay(true);
                    await this.WaitClick();
                    break;
                case "testAssist":
                    this.setText(item[0]);
                    this.assist_controller.TestDisplay();
                    this.assist_controller.SwitchDisplay(true);
                    await this.WaitClick();
                    break;
                default:
                    break;
            }
            this.first_launch=false;
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
