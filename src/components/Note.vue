<template>
    <div>
        <!-- edit note -->
        <v-dialog
            v-model="showEditNote"
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
                                    v-model="noteEdited.title"
                                    label="Titel"
                                    counter
                                    :rules="[rules.required]"
                                    clearable
                                ></v-text-field>
                                <v-combobox
                                    v-model="noteEdited.subject"
                                    :items="$store.state.subjects"
                                    label="Schulfach"
                                    :rules="[rules.required]"
                                    clearable
                                ></v-combobox>
                                <v-dialog
                                    ref="dialog"
                                    v-model="showDatePicker"
                                    :return-value.sync="noteEdited.date"
                                    persistent
                                    width="290px"
                                >
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                            v-model="noteEdited.date"
                                            label="Bis wann es erledigt werden soll"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                            :rules="[rules.required]"
                                            clearable
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="noteEdited.date"
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
                                            @click="$refs.dialog.save(noteEdited.date)"
                                        >
                                            OK
                                        </v-btn>
                                    </v-date-picker>
                                </v-dialog>
                                <v-switch
                                    v-model="noteEdited.important"
                                    :label="`Als wichtige Notiz markieren`"
                                ></v-switch>
                                <v-switch
                                    v-model="noteEdited.success"
                                    :label="`Als erledigte Notiz markieren`"
                                ></v-switch>
                                <v-textarea
                                    v-model="noteEdited.content"
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
                        @click="showEditNote = false"
                    >
                        Abbrechen
                    </v-btn>
                    
                    
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="editNote"
                    >
                        Notiz ändern
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    
        <v-card
            elevation="2"

            class="ml-4 mr-4 mt-4 mb-4"

            style="min-width: 200px; max-width: 400px;"

            @mousedown="pressStart"
            @mouseup="pressStop"
            @mouseleave="pressStop"

            @touchstart="pressStart"
            @touchend="pressStop"
            @touchcancel="pressStop"
        >
            <v-card-title :class="`headline ${note.success ? 'green' : note.important ? 'orange' : 'grey'} lighten-4`">
                {{ note.title }}
                <v-spacer></v-spacer>
                <v-checkbox
                    v-if="duringChecking"
                    v-model="checked"
                    color="primary"
                    hide-details

                    class="mt-0 ml-4"

                    @click="checkNote"
                ></v-checkbox>
            </v-card-title>

            <v-card-text class="pt-3">
                <v-container
                    fluid
                    tag="div"
                    justify-center
                    align-start
                >
                    <div>{{ note.subject }}</div>
                    <v-divider class="mt-2 mb-2"></v-divider>
                    <div>{{ note.date | formatDate}}</div>
                    <v-divider class="mt-2 mb-2"></v-divider>
                    <div>{{ note.content }}</div>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-tooltip 
                    bottom 
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            icon
                            v-on="on"
                            v-bind="attrs"

                            color="primary"

                            @click="startEditNote"
                        >
                            <v-icon>mdi-pencil</v-icon>
                            
                        </v-btn>
                    </template>
                    <span>Notiz ändern</span>
                </v-tooltip>
                <v-tooltip 
                    v-if="!note.success"
                    bottom 
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            icon
                            v-on="on"
                            v-bind="attrs"

                            color="success"

                            @click="satisfyNote"
                        >
                            <v-icon>mdi-check</v-icon>
                            
                        </v-btn>
                    </template>
                    <span>Notiz als erledigt makieren</span>
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

                            color="error"

                            @click="satisfyNote"
                        >
                            <v-icon>mdi-close</v-icon>
                            
                        </v-btn>
                    </template>
                    <span>Notiz als unerledigt makieren</span>
                </v-tooltip>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
export default {
    props:{
        note: {
            type: Object,
            required: true
        },
        
        duringChecking: {
            type: Boolean,
            default: false
        },

        checked: {
            type: Boolean,
            default: false
        },
        
    },
    data () {
        return {
            showEditNote: false,
            showDatePicker: false,
            pressTimeStart: false,
            rules: {
                required: v => !!v || 'Dieses Feld muss ausgefüllt werden!',
            },
            noteEdited: {
                id: '',
                title: "",
                subject: "",
                date: "",
                important: false,
                success: false,
                content: "",
            },
        }
    },
    methods: {
        checkNote () {
            this.$emit('check', {id: this.note.id});
        },

        satisfyNote () {
            this.noteEdited.id = this.note.id
            this.noteEdited.title = this.note.title
            this.noteEdited.subject = this.note.subject
            this.noteEdited.date = this.note.date
            this.noteEdited.important = this.note.important
            this.noteEdited.success = !this.note.success
            this.noteEdited.content = this.note.content
            this.$store.dispatch('noteUpdate', {note: this.noteEdited})
        },

        startEditNote () {
            this.noteEdited.id = this.note.id
            this.noteEdited.title = this.note.title
            this.noteEdited.subject = this.note.subject
            this.noteEdited.date = this.note.date
            this.noteEdited.important = this.note.important
            this.noteEdited.success = this.note.success
            this.noteEdited.content = this.note.content

            this.showEditNote = true
        },

        editNote () {
            this.$store.dispatch('noteUpdate', {note: this.noteEdited})
            this.showEditNote = false
        },

        pressStart () {
            if (this.pressTimeStart && (new Date().getTime() - this.pressTimeStart) / 1000 > 1) {
                this.$emit('check', {id: this.note.id});
                this.pressTimeStart = false;
            }
            else if (!this.pressTimeStart) {
                this.pressTimeStart = new Date().getTime();
            }

        },

        pressStop () {
            if (this.pressTimeStart && (new Date().getTime() - this.pressTimeStart) / 1000 > 1) {
                this.$emit('check', {id: this.note.id}); 
            }
            this.pressTimeStart = false;
        }
    }
}
</script>

<style>

</style>