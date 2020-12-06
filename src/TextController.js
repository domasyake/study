class TextController {

    constructor(input_box,submit_button,display_area,chat_area,split_controller) {
        this.input_box=input_box;
        this.chat_area=chat_area;
        this.split_controller=split_controller;

        this.current_data=[];
        this.on_area_click=new Rx.Subject();
        this.on_input_submit=new Rx.Subject();

        Rx.Observable.fromEvent(submit_button,"click")
            .subscribe(()=>this.SubmitNextButton());
        Rx.Observable.fromEvent(display_area,"click")
            .subscribe(()=>this.ClickArea());
        this.LoadData();
    }

    async LoadData(){
        this.current_data=await getCsvData("script/test.csv");
        this.StartChat();
    }

    async StartChat(){
        let temp_data=[];

        for (let current_line=0;current_line< this.current_data.length;current_line++){
            let item=this.current_data[current_line];
            const mode=String(item[1]).slice(0,-1);

            switch (mode) {
                case '':
                    this.setText(item[0]);
                    await this.on_area_click.first().toPromise();
                    break;
                case 'i':
                    this.setText(item[0]);
                    await this.on_input_submit.first().toPromise();
                    temp_data.push(String(this.input_box.value));
                    this.resetInput()
                    break;
                case "o":
                    let result_text = item[0];
                    for (let vtem of temp_data){
                        result_text=result_text.replace('$',vtem);
                    }
                    this.setText(result_text)
                    await this.on_area_click.first().toPromise();
                    break;
                case "ls":
                    this.setText(item[0]);
                    const word=await this.getInput();
                    const res_text=this.split_controller.checkWord(word);
                    this.resetInput();
                    this.setText(res_text);

                    await this.on_area_click.first().toPromise();
                    if(!this.split_controller.checkComplete()){
                        current_line--;
                    }
                    break;
                default:
                    break;
            }
        }
    }

    setText(word){
        this.chat_area.innerText=word;
    }

    resetInput(){
        this.input_box.value="";
    }

    async getInput(){
        await this.on_input_submit.first().toPromise();
        return String(this.input_box.value);
    }

    ClickArea(){
        this.on_area_click.onNext();
    }
    SubmitNextButton(){
        this.on_input_submit.onNext()
    }
}
