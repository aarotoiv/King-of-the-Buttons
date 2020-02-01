<template>
    <div id="player-list">
        <ul>
            <li v-for="item in players" v-bind:key="item.socketId">
                {{item.socketId}}
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'PlayerList',
        template: '#player-list',
        data() {
            return {
                listItems: []
            }
        },
        props: {
            players: Object
        },
        watch: {
            players: { 
                immediate: true,
                handler (val) {
                    this.listItems = val;
                }
            }
        }
    }
</script>
<style scoped>
    #player-list {
        position:absolute;
        width: 300px;
        max-height: 300px;
        min-height: 100px;
        left:10px;
        top:10px;
        background:#fff;
        z-index: 9999;
        border-radius: 10px;
    }
</style>

