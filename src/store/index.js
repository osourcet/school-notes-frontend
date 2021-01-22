import Vue from 'vue'
import Vuex from 'vuex'
import { uuid } from 'vue-uuid'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        show_account: false,
        show_account_registration: false,
        show_info: false,
        signed_in: false,
        api:{
            url: "",
        },
        jwt: "",
        notes: [],
        subjects: [
            "Sonstiges",
            {header: "Sprachen"},
            "Deutsch",
            "Englisch",
            "Latein",
            "Französisch",
            {header: "Wissenschaften"},
            "Mathe",
            "Physik",
            "Chemie",
            "Biologie",
            "Informatik",
            "Wirtschaft und Recht",
            {header: "Glaube & Geschichte"},
            "Geschichte",
            "Sozialkunde",
            "Religion",
            "Musik",
            {header: "Anderes"},
            "Sport",
            "Seminar",
        ],
        development: {
            errors: [
                //'Die Notizen werden nicht automatisch gespeichert!'
            ]
        }
    },
    mutations: {
        NOTE_ADD: (state, {note}) => {
            if (!note.id)
                note.id = uuid.v4()
            state.notes.push(note)

        },

        NOTE_UPDATE: (state, {note}) => {
            let notes = state.notes.filter(n => n.id != note.id)
            notes.push(note)
            state.notes = notes
        },

        NOTES_SET: (state, notes) => {state.notes = notes},

        NOTES_DELETE: (state, {list}) => {
            let notes = state.notes.filter(n => !list.includes(n.id))
            state.notes = notes
        },

        ERROR_ADD: () => {},

        ERROR_DELETE: () => {},

        WARNING_ADD: () => {},

        WARNING_DELETE: () => {},

        INFO_ADD: () => {},

        INFO_DELETE: () => {},

        INIT: state => {
            let notes = JSON.parse(localStorage.getItem('school-notes'))
            
            if (notes)
                state.notes = notes.notes
        },

        SYNC_NOTES_LOCAL: state => {
            localStorage.setItem('school-notes', JSON.stringify({notes: state.notes}))
        },

        SYNC_NOTES_API: () => {},
    },
    actions: {
        noteAdd ({commit}, note) {
            commit('NOTE_ADD', note)
            commit('SYNC_NOTES_LOCAL')
        },

        noteUpdate ({commit}, note) {
            commit('NOTE_UPDATE', note)
            commit('SYNC_NOTES_LOCAL')
        },

        notesDelete ({ commit }, list) {
            commit('NOTES_DELETE', list)
            commit('SYNC_NOTES_LOCAL')
        },
    },
    getters: {
        getNotes: state => {
            return state.notes
        }
    },
    modules: {
    }
})
