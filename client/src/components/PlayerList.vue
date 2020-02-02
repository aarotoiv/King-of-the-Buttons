<template>
    <div id="player-list">
        <ul id="player-list-inner">
            <ol class="player-list-line" v-for="item in players" v-bind:key="item.socketId" v-bind:class="{removed: !item.exists}">
                <div class="player-color" v-bind:style="{background: 'rgb(' + item.color.r + ',' + item.color.g + ',' + item.color.b + ')'}"></div>
                <span class="player-name">{{item.socketId}}</span>
            </ol>
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
        }
    }
</script>
<style scoped>
    #player-list {
        animation: player-list-entry 0.5s ease-in-out;
        position:absolute;
        /*CSS HACKS*/
        display:inline-block;
        left:10px;
        top:10px;
        z-index: 9999;
        border-right: solid 2px #fff;
        margin: 0;
        padding:0;
    }
    @keyframes player-list-entry {
        from {
            opacity:0;
        }
        to {
            opacity:1;
        }
    }
    #player-list-inner {
        margin:0;
        padding:10px;
        transition: height 0.5s ease-in-out;
    }
    .player-list-line {
        margin:0;
        animation: player-line-entry 0.3s ease-in-out;
        display:block;
        height: 25px;
        overflow:hidden;
        padding-left: 0px;
        padding-bottom: 10px;
        padding-right: 10px;
    }
    @keyframes player-line-entry {
        from {
            opacity: 0;
            margin-left: -500px;
            height: 0px;
        }
        to {
            opacity: 1;
            margin-left: 0px;
            height: 25px;
        }
    }
    .player-color {
        width: 25px;
        height: 25px;
        float:left;
    }
    .player-name {
        padding-left: 10px;
        float:left;
        line-height: 25px;
        color: #fff;
    }
    .removed {
        animation: player-line-dispatch 0.5s ease-in-out;
    } 
    @keyframes player-line-dispatch {
        from {
            opacity: 1;
            margin-left: 0px;
            height: 25px;
        } 
        to {
            opacity: 0;
            margin-left: -500px;
            height: 0px;
        }
    }
</style>

