class FunctionCard {

    constructor(cards_root,data){
        const value=data.user_saved_name;
        this.delete_event=new Rx.Subject();
        this.card_root=document.createElement("div");
        this.data=data;
        this.card_root.className="function_card";

        const img=document.createElement("img");
        img.className="function_card_img";
        img.src="img/function_card.png";
        this.card_root.appendChild(img);

        if(data.delete_able){
            const delete_button=document.createElement("img");
            delete_button.className="function_card_delete_button";
            delete_button.src="img/function_card_delete_button.png";
            Rx.Observable.fromEvent(delete_button,"click")
                .subscribe(_=>{
                    this.delete_event.onNext(value);
                    cards_root.removeChild(this.card_root);
                });
            this.card_root.appendChild(delete_button);
        }

        const text=document.createElement("p");
        text.className="function_card_text"
        text.innerText=value;
        this.card_root.appendChild(text);

        cards_root.appendChild(this.card_root);
    }
}