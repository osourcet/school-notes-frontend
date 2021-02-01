<template>
    <div>
        <!-- edit note -->
        <v-dialog
            v-model="showEditNote"
            persistent
            max-width="600px"
        >
            <v-card>
                <v-form ref="noteEdit" v-model="noteEdit">
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
                            @click="$refs.noteEdit.reset(); showEditNote = false;"
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
                </v-form>
            </v-card>
        </v-dialog>

        <!-- edit note -->
        <v-dialog
            v-model="showSaveError"
            persistent
            max-width="600px"
        >
            <v-card>
                <v-card-title class="headline orange lighten-5 warning--text">
                    <v-icon class="mr-2 warning--text">mdi-alert</v-icon>
                    Notiz vorhanden (W 02)
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                Diese Notiz befindet sich schon in ihren Notizen.<br>Dieser Fehler kann auftreten, wenn die Notiz ihnen geteilt wurde, dann von einer Person verändert wurde und die "neue" Version Ihnen wieder geteilt wurde.<br>Wenn Sie sie trotzdem hinzufügen, wird die ID der Notiz geändert.
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    
                    <v-spacer></v-spacer>
                    <v-btn
                        color=""
                        text
                        @click="showSaveError = false"
                    >
                        Abbrechen
                    </v-btn>
                    
                    
                    <v-btn
                        color="warning"
                        text
                        @click="forceSave = true; showSaveError = false; saveNote()"
                    >
                        Hinzufügen
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
                    <div>{{ note.date | formatDateFromUnix}}</div>
                    <v-divider class="mt-2 mb-2"></v-divider>
                    <div>{{ note.content }}</div>
                </v-container>
            </v-card-text>

            <v-card-actions>
                
                <v-spacer></v-spacer>
                <v-tooltip
                    v-if="!shared"
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
                    v-if="!note.success && !shared"
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
                    v-if="note.success && !shared"
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
                <v-tooltip
                    bottom
                    v-if="shared"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            icon
                            v-on="on"
                            v-bind="attrs"

                            color="primary"

                            @click="saveNote"
                        >
                            <v-icon>mdi-download</v-icon>
                            
                        </v-btn>
                    </template>
                    <span>Notiz in meinen Notizen speichern</span>
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

        shared: {
            type: Boolean,
            default: false,
        },
        
    },
    data () {
        return {
            noteEdit: false,
            showEditNote: false,
            showDatePicker: false,
            showSaveError: false,
            pressTimeStart: false,
            forceSave: false,
            rules: {
                required: v => !!v || 'Dieses Feld muss ausgefüllt werden!',
            },
            noteEdited: {
                _id: '',
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
            this.$emit('check', {_id: this.note._id});
        },

        satisfyNote () {
            this.noteEdited._id = this.note._id
            this.noteEdited.title = this.note.title
            this.noteEdited.subject = this.note.subject
            this.noteEdited.date = this.note.date
            this.noteEdited.important = this.note.important
            this.noteEdited.success = !this.note.success
            this.noteEdited.content = this.note.content
            this.$store.dispatch('noteUpdate', {note: this.noteEdited})
        },

        startEditNote () {
            this.noteEdited._id = this.note._id
            this.noteEdited.title = this.note.title
            this.noteEdited.subject = this.note.subject
            this.noteEdited.date = `${new Date(this.note.date).getFullYear()}-${new Date(this.note.date).getMonth()+1}-${new Date(this.note.date).getDate()}`
            this.noteEdited.important = this.note.important
            this.noteEdited.success = this.note.success
            this.noteEdited.content = this.note.content

            this.showEditNote = true
        },

        editNote () {
            this.$refs.noteEdit.validate()
            if (this.noteEdit) {
                this.$store.dispatch('noteUpdate', {
                    note: {
                        _id: this.noteEdited._id,
                        title: this.noteEdited.title,
                        subject: this.noteEdited.subject,
                        date: new Date(this.noteEdited.date.split('-')[0], this.noteEdited.date.split('-')[1] - 1, this.noteEdited.date.split('-')[2]).getTime(),
                        important: this.noteEdited.important,
                        success: this.noteEdited.success,
                        content: this.noteEdited.content,
                    }
                })
                this.$refs.noteEdit.reset()
                this.showEditNote = false
            }
        },

        saveNote () {
            console.log(this.$store.getters.getNotes.filter(n => n._id == this.note._id).length)
            if (this.$store.getters.getNotes.filter(n => n._id == this.note._id).length == 0) {
                this.$store.dispatch('noteAdd', {note: this.note})
            }
            else if (this.forceSave) {
                this.note._id = this.$uuid.v4()
                this.$store.dispatch('noteAdd', {note: this.note})
                this.forceSave = false
            }
            else if (this.$store.getters.getNotes.filter(n => n._id == this.note._id).length > 0) {
                this.showSaveError = true
            }
        },

        pressStart () {
            if (this.pressTimeStart && (new Date().getTime() - this.pressTimeStart) / 1000 > 1) {
                this.$emit('check', {_id: this.note._id});
                this.pressTimeStart = false;
            }
            else if (!this.pressTimeStart) {
                this.pressTimeStart = new Date().getTime();
            }

        },

        pressStop () {
            if (this.pressTimeStart && (new Date().getTime() - this.pressTimeStart) / 1000 > 1) {
                this.$emit('check', {_id: this.note._id}); 
            }
            this.pressTimeStart = false;
        }
    }
}
</script>

<style>

</style>