function registerDropzone(id, Dropzone, url) {
    let myDropzone = new Dropzone(id, {
        url: url + "/file/upload",
        method: "POST",
        enctype: "multipart/form-data",
        paramName: "file",
    });
    myDropzone.on("complete", function (file) {
        setTimeout(() => {
            myDropzone.removeAllFiles();
        }, 1200);
    });
}
