
async function getCsvData(path) {
    try {
        let xhr = new ActiveXObject("Microsoft.XMLHTTP")
    }
    catch (e) {
        xhr = new XMLHttpRequest()
    }

    xhr.open("GET", path, true)
    xhr.send()
    return new Promise(resolve => {
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4) {
                var data = xhr.responseText
                var result=[]
                var tmp=data.split("\n")
                for (var i=0;i<tmp.length;i++){
                    result[i]=tmp[i].split(',');
                }
                resolve(result);
            }
        };
    })
}

async function getJsonData(path) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", path);
    xmlhttp.send();
    return new Promise(resolve => {
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var data = JSON.parse(xmlhttp.responseText);
                    resolve(data);
                } else {
                }
            }
        }
    });

}