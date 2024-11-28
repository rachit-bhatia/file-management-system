<template>
    <div class="viewer">
      <h2>My Files</h2>

      <div style="display: flex; align-items: center;">
        <div style="display: inline-flex; align-items: center; margin-right: 30px;">
          <span class="material-icons" style="margin-left: 10px;">add_circle</span>
          <button class="action-button" style="padding: 15px 20px 15px 40px; border-radius: 10px;">Add File</button>
        </div> 
        <button class="action-button" title="Delete">
          <span class="material-icons">delete</span>
        </button>
        <button class="action-button" title="Rename">
          <span class="material-icons">edit</span>
        </button>
        <button class="action-button" title="Download">
          <span class="material-icons">download</span>
        </button>

        <div style="margin-left: auto; display: flex; align-items: center;">
          <span class="material-icons" style="color: rgb(75, 93, 105); margin-left: 10px;">search</span>
          <input type="text" placeholder="Search files"/>
        </div>
      </div>
    </div>
</template>


<script>
export default {
  name: 'ViewerBound',
}
</script>

<style>
.viewer {
  position: absolute;
  margin: 150px 100px;
  padding: 20px 50px;
  margin-bottom: 150px;
  width: calc(100% - 200px);
  height: calc(100% - 200px);
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

.material-icons {
  font-size: 24px;
  position: absolute;
  color: rgb(236, 232, 232);
}

input {
  border-radius: 10px;
  border: 0.5px solid rgb(75, 93, 105);
  padding: 10px 20px 10px 40px;
  width: 400px;
  font-size: 16px;
  box-sizing: border-box;

}
</style>