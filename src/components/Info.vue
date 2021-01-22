<template>
  <div class="text-center">
    <v-dialog
      v-model="$store.state.show_info"
      width="500"
    >

      <v-card>
        <v-card-title class="headline grey lighten-4">
          <v-icon class="mr-2">mdi-information</v-icon>
          Info
        </v-card-title>

        <v-card-text class="pt-3">
            <v-simple-table>
                <template v-slot:default>
                    <tbody>
                        <tr>
                            <td>Frontend Version:</td>
                            <td>{{ versionFrontend }}</td>
                        </tr>
                        <tr>
                            <td>Backend Version:</td>
                            <td>{{ versionBackend }}</td>
                        </tr>
                        <tr>
                            <td>Development:</td>
                            <td>Felix Wochnick <br> Jonas Vogel</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>

            <v-row class="mt-4 justify-space-around">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            elevation="2"
                            fab
                            small

                            v-bind="attrs"
                            v-on="on"

                            class="green accent-3"

                            @click="openURL('https://v3.vuejs.org/', true);"
                        >
                            <v-icon>mdi-vuejs</v-icon>
                        </v-btn>
                    </template>
                    <span>VueJS</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            elevation="2"
                            fab
                            small

                            v-bind="attrs"
                            v-on="on"

                            class="blue white--text"

                            @click="openURL('https://vuetifyjs.com/en/', true);"
                        >
                            <v-icon>mdi-vuetify</v-icon>
                        </v-btn>
                    </template>
                    <span>Vuetify</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            elevation="2"
                            fab
                            small

                            v-bind="attrs"
                            v-on="on"

                            class="orange"

                            @click="openURL('https://github.com/osourcet/school-notes', true);"
                        >
                            <v-icon>mdi-github</v-icon>
                        </v-btn>
                    </template>
                    <span>Github</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            elevation="2"
                            fab
                            small

                            v-bind="attrs"
                            v-on="on"

                            class="green accent-3"

                            @click="openURL('https://nodejs.org/en/', true);"
                        >
                            <v-icon>mdi-nodejs</v-icon>
                        </v-btn>
                    </template>
                    <span>NodeJS</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            elevation="2"
                            fab
                            small

                            v-bind="attrs"
                            v-on="on"

                            class="blue white--text"

                            @click="openURL('https://www.docker.com/', true);"
                        >
                            <v-icon>mdi-docker</v-icon>
                        </v-btn>
                    </template>
                    <span>Docker</span>
                </v-tooltip>
            </v-row>
       
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="$store.state.show_info = false"
          >
            Schließen
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {version} from "./../../package.json"

export default {
    data () {
        return {
            versionFrontend: version,
            versionBackend: "Connection interrupted",
        }
    },
}
</script>