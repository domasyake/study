class AssistCard{

    constructor(cards_root,user_saved_name,data){
        const value=user_saved_name;
        const submit_event=new Rx.Subject();
        this.submit_event=submit_event;
        this.card_root=document.createElement("div");
        this.data=data;
        this.card_root.className="assist_card";
        const img=document.createElement("img");
        img.className="assist_card_img";
        img.src="img/assist_card.png";
        this.card_root.appendChild(img);

        const text=document.createElement("p");
        text.className="assist_card_text"
        text.innerText=value;
        this.card_root.appendChild(text);

        const submit=document.createElement("input");
        submit.classList="as_submit submit";
        submit.value="ヒント表示";
        this.card_root.appendChild(submit);
        Rx.Observable.fromEvent(submit,"click")
            .subscribe(_=>submit_event.onNext())

        //子持ちの場合はホルダー追加
        if(data.child_category.length>0){
            const pin=document.createElement("img");
            pin.className="moveable_pin";
            pin.src="img/move_able_pin.png";
            this.card_root.appendChild(pin);

            const holder=document.createElement("div");
            holder.className="as_child_root";
            this.holder=holder;
            this.card_root.appendChild(holder);
        }else{
            this.holder=null;
        }

        cards_root.appendChild(this.card_root);
    }
}