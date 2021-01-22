<template>
    <v-container
        fluid
        tag="div"
        justify-center
        align-start
    >
        <v-dialog
            v-model="sortSettings.showSortSettings"
            persistent
            max-width="600px"
        >
            <v-card>
                <v-card-title class="headline grey lighten-4">
                    <v-icon class="mr-2">mdi-sort</v-icon>
                    Sortierung
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="8">
                                <v-select
                                    v-model="sortSettings.sortBy"
                                    :items="[
                                        {
                                            text: 'Titel',
                                            value: 'title',
                                        },
                                        {
                                            text: 'Schulfach',
                                            value: 'subject',
                                        },
                                        {
                                            text: 'Datum',
                                            value: 'date',
                                        },
                                        {
                                            text: 'Inhalt',
                                            value: 'content',
                                        },
                                    ]"
                                    label="Sortieren nach"
                                ></v-select>
                            </v-col>
                            <v-col cols="4">
                                <v-btn-toggle
                                    v-model="sortSettings.sortUpDown"
                                    color="primary"
                                    dense
                                    group

                                    class="mt-2"
                                >
                                    <v-btn
                                        :value="1"
                                    >
                                        <v-icon>mdi-sort-alphabetical-ascending</v-icon>
                                    </v-btn>

                                    <v-btn
                                        :value="-1"
                                    >
                                        <v-icon>mdi-sort-alphabetical-descending</v-icon>
                                    </v-btn>
                                </v-btn-toggle>
                            </v-col>
                            <v-col cols="12">
                                <v-switch
                                    v-model="sortSettings.showImportantNotes"
                                    :label="`Wichtige Notizen anzeigen`"
                                ></v-switch>
                                <v-switch
                                    v-model="sortSettings.showNormalNotes"
                                    :label="`Normale Notizen anzeigen`"
                                ></v-switch>
                                <v-switch
                                    v-model="sortSettings.showSuccessNotes"
                                    :label="`Erledigte Notizen anzeigen`"
                                ></v-switch>
                                <v-switch
                                    v-if="sortSettings.showImportantNotes && sortSettings.showNormalNotes"
                                    v-model="sortSettings.separateImportantNotes"
                                    :label="`Wichtige Notizen von normalen Notizen trennen`"
                                ></v-switch>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    
                    
                    <v-btn
                        color="primary"
                        text
                        @click="sortSettings.showSortSettings = false"
                    >
                        Übernehmen & Schließen
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- create note -->
        <v-dialog
            v-model="showCreateNote"
            persistent
            max-width="600px"
        >
            <v-card>
                <v-card-title class="headline grey lighten-4">
                    <v-icon class="mr-2">mdi-note-plus</v-icon>
                    Notiz erstellen
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="createNoteData.title"
                                    label="Titel"
                                    counter
                                    :rules="[rules.required]"
                                    clearable
                                ></v-text-field>
                                <v-combobox
                                    v-model="createNoteData.subject"
                                    :items="$store.state.subjects"
                                    label="Schulfach"
                                    :rules="[rules.required]"
                                    clearable
                                ></v-combobox>
                                <v-dialog
                                    ref="dialog"
                                    v-model="showDatePicker"
                                    :return-value.sync="createNoteData.date"
                                    persistent
                                    width="290px"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="createNoteData.date"
                                            label="Bis wann es erledigt werden soll"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                            :rules="[rules.required]"
                                            clearable
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="createNoteData.date"
                                        scrollable
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            text
                                            @click="showDatePicker = false"
                                        >
                                            Abbrechen
                                        </v-btn>
                                        <v-btn
                                            text
                                            color="primary"
                                            @click="$refs.dialog.save(createNoteData.date)"
                                        >
                                            OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-dialog>
                                <v-switch
                                    v-model="createNoteData.important"
                                    :label="`Als wichtige Notiz markieren`"
                                ></v-switch>
                                <v-textarea
                                    v-model="createNoteData.content"
                                    label="Inhalt"
                                    hint="Markdown kann nicht benutzt werden"
                                    :rules="[rules.required]"
                                    clearable
                                ></v-textarea>
                                
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color=""
                        text
                        @click="resetCreateNoteData"
                    >
                        Abbrechen
                    </v-btn>
                    
                    
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="createNote"
                    >
                        Notiz erstellen
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        
        <v-toolbar
            dense
        >   
            <v-tooltip 
                v-if="!checked.length"
                bottom 
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon

                        v-on="on"
                        v-bind="attrs"

                        @click="showCreateNote = true"
                    >
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <span>Neue Notiz hinzufügen</span>
            </v-tooltip>
            
            <v-tooltip 
                v-else
                bottom 
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon

                        v-on="on"
                        v-bind="attrs"

                        @click="checked = []"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </template>
                <span>Auswahl aufheben</span>
            </v-tooltip>
            
            <v-toolbar-title>
                {{ checked.length ? `${checked.length} Notiz${checked.length == 1 ? '' : 'en'} ausgewählt` : '' }}
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-text-field
                v-if="!checked.length"
                
                v-model="search"

                placeholder="Notizen durchsuchen..."

                hide-details
                prepend-inner-icon="mdi-magnify"
                single-line
            ></v-text-field>

            <v-spacer></v-spacer>
            
            <v-tooltip 
                v-if="checked.length"
                bottom 
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon

                        v-on="on"
                        v-bind="attrs"

                        color="primary"

                        @click="shareNotes"
                    >
                        <v-icon>mdi-share-variant</v-icon>
                    </v-btn>
                </template>
                <span>Ausgewählte {{ `Notiz${checked.length == 1 ? '' : 'en'}` }} teilen</span>
            </v-tooltip>

            <v-tooltip 
                v-if="!checked.length"
                bottom 
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon

                        v-on="on"
                        v-bind="attrs"

                        @click="sortSettings.showSortSettings = true"
                    >
                        <v-icon>mdi-sort</v-icon>
                    </v-btn>
                </template>
                <span>Sortierung einstellen</span>
            </v-tooltip>
            
            <v-tooltip 
                v-else
                bottom 
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        icon

                        v-on="on"
                        v-bind="attrs"

                        color="red"

                        @click="deleteNotes"
                    >
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </template>
                <span>Ausgewählte {{ `Notiz${checked.length == 1 ? '' : 'en'}` }} löschen</span>
            </v-tooltip>
            

        </v-toolbar>
        
        <v-container
            fluid
            fill-height
            tag="div"
            justify-center
            align-start            
        > 
            <Note
                v-for="note in sortedNotes" 
                :key="note.id"

                :note="note"
                :noteEdited="note"
                :checked="checked.includes(note.id)"
                :duringChecking="Boolean(checked.length)"

                @check="checkNote"
                @checkOnly="checkOnlyNote"
            />
        </v-container>
    </v-container>
</template>

<script>
import Note from "@/components/Note.vue"

export default {
    data()  {
        return {
            checked: [],
            search: "",
            showCreateNote: false,
            showDatePicker: false,
            createNoteData: {
                title: "",
                subject: "",
                date: "",
                important: false,
                success: false,
                content: "",
            },
            rules: {
                required: v => !!v || 'Dieses Feld muss ausgefüllt werden!',
            },
            sortSettings: {
                showSortSettings: false,

                separateImportantNotes: true,
                showNormalNotes: true,
                showImportantNotes: true,
                showSuccessNotes: false,
                sortBy: 'title',
                sortUpDown: 1
            }
        }
    },
    methods: {
        checkNote(note_checked) {
            if(this.checked.includes(note_checked.id))
                this.checked = this.checked.filter(noteID => noteID != note_checked.id)
            else
                this.checked.push(note_checked.id)
        },
        checkOnlyNote(note_checked) {
            if(!this.checked.includes(note_checked.id))
                this.checked.push(note_checked.id)
        },
        createNote() {
            if (this.createNoteData.title != "" && this.createNoteData.subject != "" && this.createNoteData.date != "" && this.createNoteData.content != "") {
                this.createNoteData.id = this.$uuid.v4()
                this.$store.dispatch('noteAdd', {note: this.createNoteData})
                this.resetCreateNoteData()
            }
        },
        resetCreateNoteData() {
            this.createNoteData = {
                title: "",
                subject: "",
                date: "",
                important: false,
                success: false,
                content: "",
            }
            this.showCreateNote = false
        },
        shareNotes() {},
        deleteNotes() {
            this.$store.dispatch('notesDelete', {list: this.checked})
        },
    },
    computed: {
        sortedNotes () {
            let sortBy = this.sortSettings.sortBy
            let sortUpDown = this.sortSettings.sortUpDown ? this.sortSettings.sortUpDown : 1

            function compare(a, b) {
                if (a[sortBy] < b[sortBy])
                    return -1 * sortUpDown
                if (a[sortBy] > b[sortBy])
                    return 1 * sortUpDown
                return 0
            }

            let notes = []
            let getNotes = this.$store.getters.getNotes
            
            if ((this.sortSettings.showImportantNotes && this.sortSettings.separateImportantNotes) || (this.sortSettings.showImportantNotes && !this.sortSettings.separateImportantNotes && !this.sortSettings.showNormalNotes)) {
                let importantNotes = getNotes.filter(note => note.important == true && note.success == false)
                importantNotes.sort(compare).forEach(note => {
                    if (this.search != ""){
                        let search = new RegExp(this.search)
                        if (search.test(note.title) || search.test(note.subject) || search.test(note.date) || search.test(note.content))
                            notes.push(note)
                    }
                    else
                        notes.push(note)
                })
            }

            if ((this.sortSettings.showNormalNotes && this.sortSettings.separateImportantNotes)  || (!this.sortSettings.showImportantNotes && !this.sortSettings.separateImportantNotes && this.sortSettings.showNormalNotes)) {
                let normalNotes = getNotes.filter(note => note.important != true && note.success != true)
                normalNotes.sort(compare).forEach(note => {
                    if (this.search != ""){
                        let search = new RegExp(this.search)
                        if (search.test(note.title) || search.test(note.subject) || search.test(note.date) || search.test(note.content))
                            notes.push(note)
                    }
                    else
                        notes.push(note)
                })
            }

            if (this.sortSettings.showImportantNotes && this.sortSettings.showNormalNotes && !this.sortSettings.separateImportantNotes) {
                let normalAndImportantNotes = getNotes.filter(note => note.success != true)
                normalAndImportantNotes.sort(compare).forEach(note => {
                    if (this.search != ""){
                        let search = new RegExp(this.search)
                        if (search.test(note.title) || search.test(note.subject) || search.test(note.date) || search.test(note.content))
                            notes.push(note)
                    }
                    else
                        notes.push(note)
                })
            }
            
            if (this.sortSettings.showSuccessNotes) {
                let successNotes = getNotes.filter(note => note.success == true)
                successNotes.sort(compare).forEach(note => {
                    if (this.search != ""){
                        let search = new RegExp(this.search)
                        if (search.test(note.title) || search.test(note.subject) || search.test(note.date) || search.test(note.content))
                            notes.push(note)
                    }
                    else
                        notes.push(note)
                })
            }

            return notes
        }
        
    },
    components: {
        Note
    },
}
</script>

<style>

</style>