<template>
    <div id="player-list">
        <ul id="player-list-inner">
            <ol class="player-list-line" v-for="item in players" v-bind:key="item.socketId">
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
        max-width: 300px;
        /*CSS HACKS*/
        display:inline-block;
        left:10px;
        top:10px;
        z-index: 9999;
        border-right: solid 2px #fff;

        margin: 0;
        padding:0;
    }
    #player-list-inner {
        margin:0;
        padding:10px;
    }
    .player-list-line {
        margin:0;
        padding:0;
        animation: player-line-entry 0.5s ease-in-out;
        display:block;
    }
    @keyframes player-line-entry {
        from {opacity:0; transform: translateX(-500px);}
        to {opacity: 1; transform:translateX(0px);}
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
        padding-bottom: 10px;
        padding-right: 10px;
        color: #fff;
    }
</style>

