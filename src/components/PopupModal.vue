<template>
   <div class="darkBG">
        <div class="modal">
            <h3>{{ isWarning ? "Are you sure?" : modalHeader }}</h3>
            <p v-if="modalText" class="modal-text">{{ modalText }}</p>
            <input v-else 
                   class="searchbar" 
                   type="text"
                   v-model="fileName"
                   style="margin-bottom: 35px; width: 92%; padding-left: 20px;"/>
            <div class="modal-button-container">
                <button class="modal-button" 
                        @click="() => {this.$emit('disable-popup');}">
                            Cancel
                </button>
                <button class="modal-button" 
                        :style="{backgroundColor: isWarning ? 'rgb(180, 50, 50)' : 'rgb(104, 130, 147)'}"
                        @click="() => {this.fileName ? this.$emit('invoke-action', this.fileName) : this.$emit('invoke-action');}">
                            Confirm
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PopupModal',
        props: {
            isWarning: {
                type: Boolean,
                default: true,
            },
            modalText: {
                type: String,
                default: "",
            },
            modalHeader: {
                type: String,
                optional: true,
            },
            originalFileName: {
                type: String,
                optional: true,
            }
        },
        data() {
            return {
                fileName: this.originalFileName,
            }
        }
    }
</script>

<style>
.darkBG {
  background-color: rgba(0, 0, 0, 0.35);
  z-index: 0;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: rgb(210, 210, 210);
  border-radius: 16px;
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-text {
    margin: 0;
    padding: 0 20px 35px;
    text-align: justify;
}

.modal-button-container {
    display: flex; 
    justify-content: flex-end;
    width: 100%; 
    padding: 0 20px; 
    box-sizing: border-box;
}

.modal-button {
    padding: 10px 30px;
    margin: 0 0 10px 10px;
    background-color: rgb(130, 130, 130);
    color: white;
    border: none;
    font-size: 15px;
    border-radius: 10px;
    transition: 0.15s;
}

.modal-button:hover {
    cursor: pointer;
    filter: brightness(0.9);
}

.modal-button:active {
    transform: scale(0.90);
}
</style>

