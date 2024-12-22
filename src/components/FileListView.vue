<template>
    <div style="padding: 60px 0;">
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="width: 40%;">| Name</th>
                    <th>| Type</th>
                    <th>| Last Modified</th>
                    <th>| Size</th>
                </tr>
            </thead>
            <tbody>
                <tr class="file-row" @click="(event) => {handleFileSelection(event)}">
                    <td><p class="file-data">This is a test file</p></td>
                    <td><p class="file-data">txt</p></td>
                    <td><p class="file-data">7 December 2024</p></td>
                    <td><p class="file-data">12 KB</p></td>
                </tr>
            </tbody>
      </table>
    </div>
</template>

<script>
export default {
    name: 'FileListView',
    props: {
        enableActions: {
            type: Boolean,
            default: false
        },
    },
    methods: {
        handleFileSelection(event) {
            var fileRow;

            //accessing the <tr> row element
            event.composedPath().forEach((element) => {
                if (element.tagName === "TR") {
                    fileRow = element;
                }
            });
            const fileID = fileRow.id;
            fileRow.classList.toggle('file-selected');

            //enabling/disabling actions upon file selection
            this.$emit("set-actions", fileRow.classList.contains('file-selected'));
        }
    }
}
</script>

<style>
th {
  text-align: left;
  width: 20%;
  padding-bottom: 10px;
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

