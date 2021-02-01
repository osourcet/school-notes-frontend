<template>
    <v-container
        fluid
        tag="div"
        justify-center
        align-start

        style="width: 800px;"
    >
        <v-layout row warp>
            <v-flex xs12>

                <div class="mb-5 mt-5 ml-3 text-h5">FAQ</div>

                <v-expansion-panels>
                    <v-expansion-panel
                        v-for="(item, index) in faq"
                        :key="index"
                    >
                        <v-expansion-panel-header>
                            <div v-html="item.q"></div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <div v-html="item.a"></div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>

                <div class="mb-5 mt-5 ml-3 text-h5">Warnungen & Fehler</div>

                <v-expansion-panels>
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            Warnungen
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-simple-table>
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-left">
                                                Warnung
                                            </th>
                                            <th class="text-left">
                                                Beschreibung
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="(item, index) in $store.getters.notificationsTemplates.warnings"
                                            :key="index"
                                        >
                                            <td v-html="item.name"></td>
                                            <td v-html="item.discription"></td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                        <v-expansion-panel-header>
                            Fehler
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-simple-table>
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-left">
                                                Fehler
                                            </th>
                                            <th class="text-left">
                                                Beschreibung
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr
                                            v-for="(item, index) in $store.getters.notificationsTemplates.errors"
                                            :key="index"
                                        >
                                            <td v-html="item.name"></td>
                                            <td v-html="item.discription"></td>
                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            faq: [
                {
                    q: 'Wie kann man eine Notiz erstellen?', 
                    a: `Drücken sie in der Toolbar auf <i aria-hidden="true" class="v-icon notranslate mdi mdi-plus theme--light"></i>-Button Drücken um eine Notitz zu erstellen.`
                },
                {
                    q: 'Wie kann man eine Notiz bearbeiten?', 
                    a: ''
                },
                {
                    q: 'Wie kann man eine Notiz / Notizen löschen?', 
                    a: ''
                },
                {
                    q: 'Wie kann man eine Notiz / Notizen teilen?', 
                    a: ''
                },
            ]
        }
    }
}
</script>

<style>

</style>