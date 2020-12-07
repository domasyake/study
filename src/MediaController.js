class MediaController {

    constructor(display_root) {
        this.display_root=display_root;
    }

    async PlayVideo(path){
        let video=document.createElement("video");
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

    visibleImg(path){
        let img=document.createElement("img");
        img.id="description_img";
        img.src=path;

        this.display_root.appendChild(img);
    }

    invisibleImg(){
        let target=document.getElementById("description_img");
        this.display_root.removeChild(target);
    }
}