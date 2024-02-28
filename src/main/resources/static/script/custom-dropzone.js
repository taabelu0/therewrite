function registerDropzone(id, Dropzone, url) {
    let myDropzone = new Dropzone(id, {
        url: url + "/api/document",
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
