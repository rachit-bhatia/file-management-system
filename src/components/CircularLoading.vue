<template>
  <div class="progress-bound">
    <div class="circular-progress"></div>
  </div>
</template>
  
<script>
export default {
  name: "CircularLoading",
};
</script>

<style>
.progress-bound {
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  background-color: rgba(147, 147, 147, 0.5);
}

.circular-progress {
  width: 50px;
  height: 50px;
  border: 6px solid #ffffff; 
  border-top: 5px solid rgb(59, 80, 94); 
  border-radius: 100%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>