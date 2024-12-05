<template>
    <div class="action-message">
        <span class="material-icons" style="margin-right: 15px; position: relative;">{{ messageIcon }}</span>
        <p style="font-size: large; margin: 0">{{ message }}</p>
    </div>
</template>

<script>
export default {
    name: 'ActionMessage',
    props: {
        message: {
            type: String
        }, 
        messageIcon: {
            type: String
        }
    }
}
</script>

<style>
.action-message {
    position: fixed;
    display: inline-flex;
    align-items: center;
    bottom: 45px;
    right: -300px;
    padding: 10px 50px;
    border-radius: 8px;   
    color: rgb(236, 232, 232);
    background-color: rgb(75, 93, 105);
    box-sizing: border-box;
    transition: transform 0.7s ease;
}
</style>