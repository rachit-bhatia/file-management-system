<template>
    <div style="padding: 60px 0;">
        <table>
            <thead>
                <tr>
                    <th style="width: 40%;"> | Name <hr></th>
                    <th> | Type <hr></th>
                    <th> | Last Modified <hr></th>
                    <th> | Size <hr></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="file in fileList" 
                    :id="file.fileId" 
                    :key="file.fileId" 
                    class="file-row" 
                    @click="(event) => {handleFileSelection(event)}">
                        <td><p class="file-data">{{ file.fileName }}</p></td>
                        <td><p class="file-data">{{ file.fileType }}</p></td>
                        <td><p class="file-data">{{ file.uploadDate }}</p></td>
                        <td><p class="file-data">{{ file.fileSize }}</p></td>
                </tr>
            </tbody>
      </table>
    </div>
</template>

<script>
export default {
    name: 'FileListView',
    data () {
        return {
            selectedFileId: null,
        }
    },
    props: {
        fileList: {
            type: Array
        }
    },
    methods: {          
        handleFileSelection(event) {
            //removing selection from previously selected file
            if (this.selectedFileId) {
                const selectedFile = document.getElementById(this.selectedFileId);
                selectedFile.classList.remove('file-selected');
            }
            var fileRow;

            //accessing the <tr> row element
            event.composedPath().forEach((element) => {
                if (element.tagName === "TR") {
                    fileRow = element;
                }
            });

            //add selection only on another file 
            if (fileRow.id != this.selectedFileId) {
                this.selectedFileId = fileRow.id;
                fileRow.classList.add('file-selected');
            }

            this.$emit("set-actions", fileRow.classList.contains('file-selected'));
            this.$emit("set-fileId", this.selectedFileId);
        }
    }
}
</script>

<style>
table {
    border-collapse: collapse;
    width: 100%;
    max-height: 100px;
    overflow-y: scroll;
}
th {
  text-align: left;
  width: 20%;
  padding-bottom: 10px;
}

hr {
    border: 0.5px solid rgba(120, 120, 120, 0.499);
}

tr {
    font-size: 18px;
}

.file-data {
    margin: 10px 0px;
}

.file-row:hover {
    background-color: rgba(159, 159, 159, 0.4);
}

.file-selected, .file-selected:hover {
    background-color: rgba(92, 152, 168, 0.4);
}
</style>

