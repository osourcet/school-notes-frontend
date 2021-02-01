<template>
    <v-app>
        <Nav></Nav>
        <Info></Info>
        <Account></Account>
        <Settings></Settings>
        <v-container
            fluid
            fill-height
            tag="div"
            style="width 100%"
            flex-column
            justify-center
            align-center
            flex-wrap
        >
            <div class="ml-5 mr-5" style="max-width: 800px;">
                <v-alert
                    v-for="error in errors"
                    :key="error"

                    border="left"
                    colored-border
                    type="error"
                    elevation="2"

                    :icon="
                        /([aA][pP][iI]|[sS]erver)/.test(error) ? 'mdi-server-off' : 
                        /([sS]ave|[sS]peiche[rn])/.test(error) ? 'mdi-content-save-alert' : 
                        ''
                    "
                >
                    <div v-html="error"></div>
                </v-alert>
                <v-alert
                    v-for="warning in warnings"
                    :key="warning"
                    
                    border="left"
                    colored-border
                    type="warning"
                    elevation="2"
                >
                    <div v-html="warning"></div>
                </v-alert>
                <v-alert
                    v-for="info in infos"
                    :key="info"
                    
                    border="left"
                    colored-border
                    type="info"
                    elevation="2"
                >
                    <div v-html="info"></div>
                </v-alert>
            </div>
            <v-main
            
            >
                <router-view/>
            </v-main>
        </v-container>
    </v-app>
</template>

<script>
import Nav from '@/components/Nav.vue'
import Info from '@/components/Info.vue'
import Account from '@/components/Account.vue'
import Settings from '@/components/Settings.vue'

import {version} from "./../package.json"

export default {
    name: 'App',

    computed: {
        errors () {
            return this.$store.getters.errors
        },
        warnings () {
            return this.$store.getters.warnings
        },
        infos () {
            return this.$store.getters.infos
        }
    },

    mounted () {
        if (/(alpha|beta)/.test(version))
            this.$store.commit('WARNING_ADD', 1)

        if (this.$store.state.account.jwt == '')
            this.$store.commit('INFO_ADD', "Sie sind nicht angemeldet.")

        if (/(Android)/.test(navigator.userAgent))
            this.$store.commit('INFO_ADD', `
            <div class="v-alert__content">
                <div class="row align-center">
                    <!--<div class="grow col"> 
                        Sie benutzen ein Android Gerät.
                    </div>-->
                    <div class="shrink col">
                        <a href="sn://schoolnotes.ddns.net" class="v-btn v-btn--is-elevated v-btn--has-bg theme--light v-size--default">
                            <span class="v-btn__content">In Android App öffnen</span>
                        </a>
                    </div>
                </div>
            </div>
            `)
    },

    components: {
        Nav,
        Info,
        Account,
        Settings
    },
};
</script>
