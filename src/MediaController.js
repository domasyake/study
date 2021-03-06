class MediaController {

    constructor(display_root) {
        this.display_root=display_root;
    }

    //動画を再生する
    async PlayVideo(id,first_launch){
        const path="media/movie_"+id+".mp4"
        if(first_launch){
            await Rx.Observable.fromEvent(window,"click").first().toPromise();
        }

        const video=document.createElement("video");
        video.src=path;
        video.className="video";

        this.display_root.appendChild(video);

        video.play();

        return new Promise(resolve=>{
            video.addEventListener("ended",()=>{
                this.display_root.removeChild(video);
                resolve();
            })
        })
    }

    //画像を表示する
    visibleImg(id){
        const path="media/picture_"+id+".png"
        const img=document.createElement("img");
        img.id="description_img";
        img.src=path;

        this.display_root.appendChild(img);
    }

    //現在表示している画像を非表示にする
    invisibleImg(){
        const target=document.getElementById("description_img");
        this.display_root.removeChild(target);
    }
}