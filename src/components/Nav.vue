<template>
    <div>
        <v-app-bar
            color="primary"
            dark
        >
            <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

            <v-toolbar-title>School Notes</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        elevation="2"
                        fab
                        small

                        v-bind="attrs"
                        v-on="on" 

                        @click="$store.state.show_account = true"
                    >
                        <v-icon v-if="$store.state.account.jwt == ''">mdi-account</v-icon>
                        <v-icon v-else>mdi-logout</v-icon>
                    </v-btn>
                </template>
                <span>{{ $store.state.account.jwt == '' ? 'Account' : 'Logout' }}</span>
            </v-tooltip>

        </v-app-bar>

        <v-navigation-drawer
        v-model="drawer"
        absolute
        temporary
        >
        <v-list
            nav
            dense
        >
            <v-list-item-group
            v-model="group"
            >

            <v-list-item
                @click="openURL('/');"
            >
                <v-list-item-icon>
                <v-icon>mdi-notebook</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Notes</v-list-item-title>
            </v-list-item>

            <!-- <v-list-item
                @click="openURL('/timetable')"
            >
                <v-list-item-icon>
                <v-icon>mdi-timetable</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Stundenplan</v-list-item-title>
            </v-list-item> -->

            <v-list-item
                @click="$store.state.show_account = true"
            >
                <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Account</v-list-item-title>
            </v-list-item>

            <v-list-item
                @click="$store.state.show_settings = true"
            >
                <v-list-item-icon>
                <v-icon>mdi-tune</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Settings</v-list-item-title>
            </v-list-item>

            <v-list-item
                @click="openURL('/help')"
            >
                <v-list-item-icon>
                <v-icon>mdi-help-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Help</v-list-item-title>
            </v-list-item>

            <v-list-item
                @click="$store.state.show_info = true"
            >
                <v-list-item-icon>
                <v-icon>mdi-information</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Info</v-list-item-title>
            </v-list-item>

            </v-list-item-group>
        </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
export default {
    data: () => ({
        drawer: false,
        group: null,
    }),
}
</script>
