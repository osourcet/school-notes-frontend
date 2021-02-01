<template>
    <v-dialog
        v-model="$store.state.show_settings"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
    >
        <v-card>
            <v-toolbar
                dark
                color="primary"
            >
                <v-btn
                    icon
                    dark
                    @click="$store.state.show_settings = false"
                >
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Einstellungen</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    
                    <v-btn
                        dark
                        text
                        @click="$store.state.show_settings = false"
                    >
                        <v-badge
                            v-if="settings != {}"
                            color="warning"
                            dot
                        >
                            Speichern
                        </v-badge>
                        <section v-else>Speichern</section>
                    </v-btn>
                    
                </v-toolbar-items>
                <template v-slot:extension>
                    <v-tabs
                        v-model="tabActive"
                        fixed-tabs
                        slider-color="white"
                    >
                        <v-tab
                            v-for="item in tabHeaders"
                            :key="item"
                            :href="'#tab-' + item"
                        >
                            {{ item }}
                        </v-tab>
                    </v-tabs>
                </template>
            </v-toolbar>
            <v-container
                fluid
                tag="div"
                justify-center
                align-start
                style="max-width: 600px;"
                class="theme--light"
            >
                <v-tabs-items v-model="tabActive">
                    <v-tab-item
                        v-for="item in tabHeaders"
                        :key="item"
                        :value="'tab-' + item"
                    >
                        <v-card
                            v-if="item == 'Konto'"
                            flat
                        >
                            <v-list
                                three-line
                                subheader
                            >
                                <v-subheader>General</v-subheader>
                                <v-list-item>
                                    <v-list-item-action>
                                        <v-checkbox></v-checkbox>
                                    </v-list-item-action>
                                    <v-list-item-content>
                                        <v-list-item-title>Notifications</v-list-item-title>
                                        <v-list-item-subtitle>Notify me about updates to apps or games that I downloaded</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card>

                        <v-card
                            v-if="item == 'Notizen'"
                            flat
                        >
                            <v-list
                                three-line
                                subheader
                            >
                                <v-subheader>Synchronisation</v-subheader>
                                <v-list-item>
                                    <v-list-item-action>
                                        <v-switch
                                            v-model="settings.notes.sync"
                                            color="primary"
                                            disabled
                                        ></v-switch>
                                        <!-- <v-checkbox></v-checkbox> -->
                                    </v-list-item-action>
                                    <v-list-item-content>
                                        <v-list-item-title>Automatische Synchronisation</v-list-item-title>
                                        <v-list-item-subtitle style="-webkit-line-clamp: unset">Synchronisiert die Notizen im Hintergrund automatisch, wenn Sie angemeldet sind.</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-subheader>Automatisierung</v-subheader>
                                <v-list-item>
                                    <v-list-item-action>
                                        <v-switch
                                            v-model="settings.notes.autoDeleteLate"
                                            color="primary"
                                            disabled
                                        ></v-switch>
                                    </v-list-item-action>
                                    <v-list-item-content>
                                        <v-list-item-title>Automatisches Löschen nach 7 Tagen von erledigten Notizen</v-list-item-title>
                                        <v-list-item-subtitle>Die gelöschten Notizen sind nicht wiederherstellbar.</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-action>
                                        <v-switch
                                            v-model="settings.notes.autoDelete"
                                            color="primary"
                                            disabled
                                        ></v-switch>
                                    </v-list-item-action>
                                    <v-list-item-content>
                                        <v-list-item-title>Automatisches Löschen von erledigten Notizen</v-list-item-title>
                                        <v-list-item-subtitle>Löscht die Notizen beim erledigen. Die gelöschten Notizen sind nicht wiederherstellbar!</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-subheader>Notizen lokal speichern / wiederherstellen</v-subheader>
                                <v-list-item>
                                    <v-list-item-action>
                                        <v-btn
                                            color="primary"
                                            icon
                                            large

                                            @click="downloadNotes"
                                        >
                                            <v-icon>mdi-file-download</v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                    <v-list-item-content>
                                        <v-list-item-title>Notizen herunterladen</v-list-item-title>
                                        <v-list-item-subtitle style="-webkit-line-clamp: unset">Es empfield sich, regelmäßig ein Backup zu erstellen.<br>Die Notizen werden in einer "JSON" Datei gespeichert.</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-action>
                                        <v-btn
                                            color="primary"
                                            icon
                                            large
                                            disabled
                                        >
                                            <v-icon dark>mdi-file-restore</v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                    <v-list-item-content>
                                        <v-list-item-title>Notizen wiederherstellen</v-list-item-title>
                                        <v-list-item-subtitle style="-webkit-line-clamp: unset">Sie können ihre Notizen wiederstellen, wenn Sie die Notzen in einer "JSON" Datei vorher gesichert haben.</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-card>
                    </v-tab-item>
                </v-tabs-items>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data: () => ({
        tabHeaders: [
            'Konto',
            'Notizen'
        ],
        tabActive: 'tab-Notizen',
        settings: {
            notes: {
                sync: false,
                autoDeleteLate: false,
                autoDelete: false,
            }
        }
    }),
    methods: {
        downloadNotes() {
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
                backupDate: new Date(),
                notes: this.$store.getters.getNotes,
            })));
            element.setAttribute('download', `school_notes_backup_${new Date().getDate()}_${new Date().getMonth()}_${new Date().getFullYear()}.json`);
        
            element.style.display = 'none';
            document.body.appendChild(element);
        
            element.click();
        
            document.body.removeChild(element);
        },
        uploadNotes() {

        },
    }
}
</script>

<style>

</style>