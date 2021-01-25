
//CSVを読み込んでリストにして返す
async function getCsvData(path) {
    try {
        let xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    catch (e) {
        xhr = new XMLHttpRequest()
    }

    xhr.open("GET", path, true);
    xhr.send();
    return new Promise(resolve => {
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4) {
                const data = xhr.responseText;
                const result=[];
                const tmp=data.split("\n");
                for (let i=0;i<tmp.length;i++){
                    result[i]=tmp[i].split(',');
                }
                resolve(result);
            }
        };
    })
}


//JSONを読み込む
async function getJsonData(path) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", path);
    xmlhttp.send();
    return new Promise(resolve => {
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                if(xmlhttp.status === 200){
                    const data = JSON.parse(xmlhttp.responseText);
                    resolve(data);
                }else{
                    resolve(null);
                }
            }
        }
    });

}