class FileSelect {
  constructor() {
    this.dropbox = document.getElementById('dropbox');
    this.fileInput = document.getElementById('file');
    this.previewImageContainer = document.getElementById('preview-image');
    this.sendFilesBtn = document.getElementById('send-files');
    this.images = [];
    this.init();
  }

  init() {
    this.eventHandler();
  }

  eventHandler() {
    this.fileInput.addEventListener(
      'change',
      () => {
        const fileList = event.target.files;
        this.handleFiles(fileList);
      },
      false
    );

    this.dropbox.addEventListener(
      'dragenter',
      () => this.dragenter(event),
      false
    );

    this.dropbox.addEventListener(
      'dragover',
      () => this.dragover(event),
      false
    );

    this.dropbox.addEventListener('drop', () => this.dropFile(event), false);

    this.sendFilesBtn.addEventListener('click', () => this.sendFiles(), false);
  }

  handleFiles(file) {
    const fileList = file;
    if (!fileList[0]) return;

    for (var i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const imageType = /^image\//;

      if (!imageType.test(file.type)) continue;

      const img = this.createImageElement(file);
      this.images.push(file);

      var reader = new FileReader();
      reader.onload = (aImg => {
        return e => {
          aImg.src = e.target.result;
        };
      })(img);
      reader.readAsDataURL(file);
    }
  }

  sendFiles() {
    const endpoint = '/';
    const options = {
      method: 'POST',
      body: this.images
    };

    /** Connect to API */
    // fetch(endpoint, options).then(data => {
    //   while (this.previewImageContainer.firstChild) {
    //     this.previewImageContainer.removeChild(
    //       this.previewImageContainer.firstChild
    //     );
    //   }
    // });

    setTimeout(() => {
      while (this.previewImageContainer.firstChild) {
        this.previewImageContainer.removeChild(
          this.previewImageContainer.firstChild
        );
      }
    }, 500);
  }

  dragenter(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  dragover(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  dropFile(event) {
    event.stopPropagation();
    event.preventDefault();
    const files = event.dataTransfer.files;
    const error = [];
    const fileList = [];
    for (let file of files) {
      if (!file.type.includes('image')) {
        error.push(file);
      } else {
        fileList.push(file);
      }
    }

    if (error.length !== 0) this.errorHandler(error);

    this.handleFiles(fileList);
  }

  createImageElement(file) {
    const img = document.createElement('img');
    img.classList.add('preview');
    img.file = file;
    this.previewImageContainer.appendChild(img);
    return img;
  }

  errorHandler(error) {
    const errorSection = document.createElement('section');
    errorSection.classList.add('error-message');

    error.map(val => {
      const error = document.createElement('div');
      error.classList.add('error-info');
      error.innerHTML = `${val.name} couldn't be added!`;
      errorSection.appendChild(error);
    });

    document.body.appendChild(errorSection);

    setTimeout(() => {
      errorSection.remove();
    }, 2000);
  }
}

(() => {
  new FileSelect();
})();
