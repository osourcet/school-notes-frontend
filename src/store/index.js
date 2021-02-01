import Vue from 'vue'
import Vuex from 'vuex'
import { uuid } from 'vue-uuid'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        show_account: false,
        show_account_registration: false,
        show_settings: false,
        show_info: false,
        backend:{
            baseUrl: '',
            version: ''
        },
        account: {
            username: "",
            jwt: "",
        },
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
        notifications: {
            errors: [],
            warnings: [],
            infos: [],
            templates: {
                errors: [
                    {name: 'E 01', content: 'Die Verbindung zum Backend-Server konnte nicht aufgebaut werden. (E 01)', discription: 'Dieser Fehler tritt auf, wenn der Backend Server nicht mehr von diesem Gerät erreicht werden kann.<br>Das kann passieren, wenn<br>- Ihr Gerät kein Internetverbindung hat.<br>- der Server offline ist.<br>Sie können die Webseite trotzdem eingeschrängt verwenden.'},
                ],
                warnings: [
                    {name: 'W 01', content: 'Sie benutzen eine Testversion. (W 01)', discription: 'Sie benutzen eine Version, in der neue Features experimentel eingebunden sind.<br>Es wird nicht garantiert, dass die Webseite fehlerfrei funktioniert.'},
                ],
                infos: [
                    'Sie sind nicht angemeldet.',
                ]
            }
        }
    },
    mutations: {
        NOTE_ADD: (state, {note}) => {
            if (!note._id)
                note._id = uuid.v4()
            state.notes.push(note)

        },

        NOTE_UPDATE: (state, {note}) => {
            let notes = state.notes.filter(n => n._id != note._id)
            notes.push(note)
            state.notes = notes
        },

        NOTES_SET: (state, notes) => {state.notes = notes},

        NOTES_DELETE: (state, {list}) => {
            let notes = state.notes.filter(n => !list.includes(n._id))
            state.notes = notes
        },

        ERROR_ADD: (state, error) => {
            if (typeof error === 'number')
                state.notifications.errors.push(state.notifications.templates.errors[error - 1].content)
            else
                state.notifications.errors.push(error)
        },

        ERROR_DELETE: () => {},

        WARNING_ADD: (state, warning) => {
            if (typeof warning === 'number')
                state.notifications.warnings.push(state.notifications.templates.warnings[warning - 1].content)
            else
                state.notifications.warnings.push(warning)
        },

        WARNING_DELETE: () => {},

        INFO_ADD: (state, info) => {
            if (typeof info === 'number')
                state.notifications.infos.push(state.notifications.templates.infos[info - 1])
            else
                state.notifications.infos.push(info)
        },

        INFO_DELETE: () => {},

        INIT_BACKEND: async () => {
            
        },

        INIT_LOCAL_STORAGE: state => {
            let notes = JSON.parse(localStorage.getItem('school-notes'))
            
            if (notes)
                state.notes = notes.notes
        },

        SYNC_NOTES_LOCAL: state => {
            localStorage.setItem('school-notes', JSON.stringify({notes: state.notes}))
        },

        SYNC_NOTES_API: () => {},

        SIGN_IN: (state, userdata) => {
            state.account.username = userdata.username
            state.account.jwt = userdata.jwt
        }
    },
    actions: {
        noteAdd ({ commit }, note) {
            commit('NOTE_ADD', note)
            commit('SYNC_NOTES_LOCAL')
        },

        noteUpdate ({ commit }, note) {
            commit('NOTE_UPDATE', note)
            commit('SYNC_NOTES_LOCAL')
        },

        notesDelete ({ commit }, list) {
            commit('NOTES_DELETE', list)
            commit('SYNC_NOTES_LOCAL')
        },

        async init({ state, commit }) {
            state.backend.baseUrl = process.env.VUE_APP_BACKEND_URL || ''
            try {
                let r = await axios({method: 'GET', url: '', baseURL: state.backend.baseUrl})
                if (r.status === 200 && r.data.type === 'school-notes-backend'){
                    state.backend.version = r.data.version.toString()
                    commit('INIT_BACKEND')
                }
                else {
                    state.backend.version = 'Connection lost'
                    commit('ERROR_ADD', 1)
                }
                commit('INIT_BACKEND')
            }
            catch (e) {
                state.backend.version = state.backend.baseUrl//'Connection lost'
                commit('ERROR_ADD', 1)
            }
            finally{
                commit('INIT_LOCAL_STORAGE')
            }
        },

        signIn ({ commit }, userdata) {
            commit('SIGN_IN', userdata)
        }
    },
    getters: {
        getNotes: state => {
            return state.notes
        },

        errors: state => state.notifications.errors,
        warnings: state => state.notifications.warnings,
        infos: state => state.notifications.infos,
        notificationsTemplates: state => state.notifications.templates
    },
    modules: {
    }
})
