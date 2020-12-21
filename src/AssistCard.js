class AssistCard
{
    constructor(cards_root,data)
    {
        let value=data.user_saved_name;
        this.delete_event=new Rx.Subject();
        this.card_root=document.createElement("div");
        this.data=data;
        this.card_root.className="assist_card";

        let img=document.createElement("img");
        img.className="assist_card_img";
        img.src="img/assist_card_base.jpg";
        this.card_root.appendChild(img);

        let delete_button=document.createElement("img");
        delete_button.className="assist_card_delete_button";
        delete_button.src="img/assist_card_delete_button.png";
        Rx.Observable.fromEvent(delete_button,"click")
            .subscribe(_=>{
                this.delete_event.onNext(value);
                cards_root.removeChild(this.card_root);
            });
        this.card_root.appendChild(delete_button);

        let text=document.createElement("p");
        text.className="assist_card_text"
        text.innerText=value;
        this.card_root.appendChild(text);

        cards_root.appendChild(this.card_root);
    }
}