<template>
  <div style="margin: 40px 100px 0px;">
    <h1>FMS Storage</h1>
    <div class="viewer">
      <h2>My Files</h2>

      <div style="display: flex; align-items: center;">
        <div style="display: inline-flex; align-items: center; margin-right: 30px;">
          <input type="file" ref="fileInput" @change="uploadFile" style="display: none;"/>
          <span class="material-icons" style="margin-left: 10px;">add_circle</span>
          <button class="action-button" @click="triggerFileSelection" title="Upload" style="padding: 15px 20px 15px 40px; border-radius: 10px;">Add File</button>
        </div> 
        <button class="action-button" title="Delete" @click="displayDeletePopup" :disabled="actionsDisabled">
          <span class="material-icons">delete</span>
        </button>
        <button class="action-button" title="Rename" @click="displayRenamePopup" :disabled="actionsDisabled">
          <span class="material-icons">edit</span>
        </button>
        <button class="action-button" title="Download" @click="downloadFile" :disabled="actionsDisabled">
          <span class="material-icons">download</span>
        </button>

        <!-- <div style="margin-left: auto; width: 40%; display: flex; align-items: center;">
          <span class="material-icons" style="color: rgb(75, 93, 105); margin-left: 10px;">search</span>
          <input class="searchbar" type="text" placeholder="Search files"/>
        </div> -->
      </div>

      <FileListView :fileList="fileList" @set-actions="setActionsMode" @set-fileId="setFileId"/>
      <CircularLoading v-if="loadingState"/>
    </div>

    <PopupModal v-if="showPopup" 
                :isWarning="this.popupProps.isWarning"
                :modalText="this.popupProps.modalText"
                :modalHeader="this.popupProps.modalHeader"
                :originalFileName="this.popupProps.originalFileName"
                @disable-popup="() => {this.showPopup = false;}"
                @invoke-action="this.popupProps.action"/>

    <ActionMessage :message="actionMessage" 
                   :message-icon="actionMessageIcon" 
                   :style="{transform: showActionMessage ? 'translateX(-340px)' : 'initial'}"/>
  </div>
</template>


<script>
import axios from 'axios';
import ActionMessage from './components/ActionMessage.vue';
import FileListView from './components/FileListView.vue';
import CircularLoading from './components/CircularLoading.vue';
import PopupModal from './components/PopupModal.vue';

export default {
  name: 'App',

  data() {
    return {
      actionMessage: "",
      showActionMessage: false,
      actionMessageIcon: "",
      actionMessageDuration: 3500,
      loadingState: false,
      actionsDisabled: true,
      fileList: [],
      fileId: null,
      showPopup: false,
      popupProps: {
        isWarning: true,
        modalText: "Warning! This action cannot be undone.",
        modalHeader: "",
        originalFileName: "",
        action: null,
      },
    }
  },

  mounted() {
    this.getAllFiles();
  },

  components: {
    ActionMessage,
    FileListView,
    CircularLoading,
    PopupModal,
  },

  methods: {
    triggerFileSelection() {
      this.$refs.fileInput.click();
    },
    
    setActionsMode(isSelected) {
      this.actionsDisabled = !isSelected;
    },

    setFileId(id) {
      this.fileId = id;
    },

    async getAllFiles() {
      this.loadingState = true;
      try {
        const response = await axios.get("http://localhost:3000/fms-api/filedata");
        const fileList = response.data.files;
        this.fileList = fileList; 
      } catch (error) {
        console.log(error);
      } finally {
        this.loadingState = false;
      }
    },

    async uploadFile() {
      const file = this.$refs.fileInput.files[0];
      const formData = new FormData();
      formData.append("file", file);
      console.log(file);
      this.loadingState = true;

      try {
        const response = await axios.post("http://localhost:3000/fms-api/uploadfile", formData, {headers: {"Content-Type": "multipart/form-data"}});
        console.log(response);

        if (response.status === 201) {
          this.actionMessage="File uploaded successfully";
          this.actionMessageIcon="check_circle";
        } else {
          this.actionMessage="Upload failed";
          this.actionMessageIcon="cancel";
        }
      } 

      catch (error) {
        console.log(error);
        this.actionMessage="Upload failed";
        this.actionMessageIcon="cancel";
      } 

      finally {
        this.getAllFiles();

        //display action message popup for 3.5 seconds
        this.showActionMessage = true;
        setTimeout(() => {
          this.showActionMessage = false;
          this.actionMessage = "";
        }, this.actionMessageDuration);
      }
    },

    displayDeletePopup() {
      this.showPopup = true;
      this.popupProps.isWarning = true;
      this.popupProps.modalHeader = "Delete File";
      this.popupProps.modalText = "Deleting this file will permanently remove it from the system. This action cannot be undone.";
      this.popupProps.originalFileName = "";
      this.popupProps.action = this.deleteFile;
    },

    async deleteFile() {
      this.showPopup = false;
      const fileId = this.fileId;
      this.loadingState = true;

      try {
        const response = await axios.delete(`http://localhost:3000/fms-api/deletefile/${fileId}`);
        console.log(response);

        if (response.status === 200) {
          this.actionMessage="File deleted";
          this.actionMessageIcon="delete";
        } else {
          this.actionMessage="Error deleting file";
          this.actionMessageIcon="cancel";
        }
      } 
      
      catch (error) {
        console.log(error);
        this.actionMessage="Error deleting file";
        this.actionMessageIcon="cancel";
      } 

      finally {
        this.getAllFiles();

        this.showActionMessage = true;
        setTimeout(() => {
          this.showActionMessage = false;
          this.actionMessage = "";
        }, this.actionMessageDuration);
      }
    },

    async downloadFile() {
      const fileId = this.fileId;

      try {
        this.loadingState = true;
        const response = await axios.get(`http://localhost:3000/fms-api/downloadfile/${fileId}`, 
                                         {responseType: 'blob'},  //returning response as blob to enable downloading
                                        );
        console.log(response);

        if (response.status === 200) {
          const urlObject = URL.createObjectURL(response.data);
          const anchorTag = document.createElement('a');
          anchorTag.href = urlObject;
          anchorTag.download = response.headers['x-content-title'];  //setting a.download makes the file downloadable when clicked and sets the saved file's name 

          //appending the <a>, triggerring the click, and removing it
          document.body.appendChild(anchorTag);
          anchorTag.click();  //triggers the file save menu
          document.body.removeChild(anchorTag);
          URL.revokeObjectURL(urlObject);

        } else {
          this.actionMessage="File download failed";
          this.actionMessageIcon="cancel";
          this.showActionMessage = true;
        }
      } 
      
      catch (error) {
        console.log(error);
        this.actionMessage="File download failed";
        this.actionMessageIcon="cancel";
        this.showActionMessage = true;
      } 

      finally {
        this.loadingState = false;
        setTimeout(() => {
          this.showActionMessage = false;
          this.actionMessage = "";
        }, this.actionMessageDuration);
      }
    },

    async displayRenamePopup() {
      this.popupProps.isWarning = false;
      this.popupProps.modalHeader = "Rename File";
      this.popupProps.modalText = "";
      
      const fileId = this.fileId;

      try {
        const response = await axios.get(`http://localhost:3000/fms-api/filedata/${fileId}`);

        if (response.status == 200) {
          const originalName = response.data.fileMetadata.fileName;
          const fileNameStripped = originalName.substring(0, originalName.lastIndexOf("."));  //stripping the file extension
          this.popupProps.originalFileName = fileNameStripped;
          this.popupProps.action = this.renameFile;
          this.showPopup = true;
        }
        console.log(response);

      } catch (error) {
        console.log(error);
      }
    },

    async renameFile(newFileName) {
      const fileId = this.fileId;
      this.showPopup = false;
      var newFileNameFull = "";

      try {
        const response = await axios.get(`http://localhost:3000/fms-api/filedata/${fileId}`);

        if (response.status == 200) {
          const originalName = response.data.fileMetadata.fileName;
          const fileExtension = originalName.substring(originalName.lastIndexOf(".") + 1); //extracting the file extension
          newFileNameFull = `${newFileName}.${fileExtension}`;
          console.log("New file name: ", newFileNameFull);
        }
        console.log(response);

      } catch (error) {
        console.log(error);
      }

      try {
        const response = await axios.put(`http://localhost:3000/fms-api/renamefile/${fileId}`, {newFileName: newFileNameFull});
        console.log(response);

        if (response.status === 200) {
          this.actionMessage="File renamed successfully";
          this.actionMessageIcon="check_circle";
        } else {
          this.actionMessage="Error renaming file";
          this.actionMessageIcon="cancel";
        }
      } 
      
      catch (error) {
        console.log(error);
        this.actionMessage="Error renaming file";
        this.actionMessageIcon="cancel";
      } 

      finally {
        this.getAllFiles();

        this.showActionMessage = true;
        setTimeout(() => {
          this.showActionMessage = false;
          this.actionMessage = "";
        }, this.actionMessageDuration);
      }
    },
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  color: #2c3e50;
}

html, body {
  margin: 0;
  padding: 0;
  background-color: #e6eef6;
}

.viewer {
  position: relative;
  padding: 20px 50px;
  border-radius: 25px;
  background-color: rgb(191, 199, 205);
  box-sizing: border-box;
}

.action-button {
  padding: 25px;
  margin-right: 15px;
  border-radius: 50%;
  background-color: rgb(104, 130, 147);
  color: rgb(236, 232, 232);
  font-size: 16px;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: 0.15s;
}

.action-button:hover {
  cursor: pointer;
  background-color: rgb(75, 93, 105);
}

.action-button:disabled {
  background-color: rgba(133, 133, 133, 0.549);
  cursor: not-allowed;
}

.action-button:active {
  transform: scale(0.90);
}

.material-icons {
  font-size: 24px;
  position: absolute;
  color: rgb(236, 232, 232);
}

.searchbar {
  border-radius: 10px;
  border: 0.5px solid rgb(75, 93, 105);
  padding: 10px 20px 10px 40px;
  width: 100%;
  font-size: 16px;
  box-sizing: border-box;

}
</style>