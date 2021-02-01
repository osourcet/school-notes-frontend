<template>
    <v-dialog
      v-model="$store.state.show_account"
      persistent
      max-width="600px"
    >

        <!-- Sign in -->
        <v-card v-if="$store.state.account.jwt == '' && !$store.state.show_account_registration">
            <v-form ref="signIn" v-model="signInValid">
                <v-card-title class="headline grey lighten-4">
                    <v-icon class="mr-2">mdi-login</v-icon>
                    Anmelden
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-alert
                                    v-if="errors.invalidUser"
                                    border="left"
                                    colored-border
                                    type="error"
                                    elevation="2"
                                >
                                    Falscher Benutzername oder falsches Passwort
                                </v-alert>
                                <v-text-field
                                    v-model="username"
                                    label="Email oder Benutzername"
                                    prepend-inner-icon="mdi-account"
                                    :rules="[rules.required]"
                                ></v-text-field>
                                <v-text-field
                                    v-model="passwordSignIn"
                                    :append-icon="showPasswordSignIn ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="showPasswordSignIn ? 'text' : 'password'"
                                    label="Passwort"
                                    prepend-inner-icon="mdi-key-variant"
                                    :rules="[rules.required]"
                                    @click:append="showPasswordSignIn = !showPasswordSignIn"
                                ></v-text-field>
                                <v-checkbox
                                    v-model="remember_login"
                                    label="Angemeldet bleiben"
                                    color="blue"
                                    hide-details
                                    disabled
                                ></v-checkbox>
                            </v-col>
                            <v-col cols="12">
                                <v-btn
                                    class="mt-2"
                                    color=""
                                    text
                                    @click="$refs.signIn.reset(); $store.state.show_show_account_registration = true"
                                >
                                    Passwort vergessen
                                </v-btn>
                                <v-btn
                                    class="mt-2"
                                    color=""
                                    text
                                    @click="$refs.signIn.reset(); $store.state.show_account_registration = true"
                                >
                                    Zum Registrieren
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color=""
                        text
                        @click="$refs.signIn.reset(); $store.state.show_account = false"
                    >
                        Abbrechen
                    </v-btn>
                    
                    
                    <v-btn
                        color="primary"
                        text
                        @click="signIn"
                    >
                        Anmelden
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>

        <v-card v-if="!$store.state.account.jwt == '' && showWelcome">
            <v-card-title class="headline white"></v-card-title>
            <v-card-text>
                <v-container
                    fill-height
                    fluid
                >
                    <v-row 
                        align="center" 
                        justify="center"
                        style="text-align: center"
                    >   
                        <v-col cols="12">
                            <v-avatar
                                color="primary lighten-3"
                                size="77"
                            >
                                <v-icon
                                    size="60"
                                    color="primary"
                                >
                                    mdi-check
                                </v-icon>
                            </v-avatar>

                        </v-col>
                        <v-col cols="12">
                            <div>Angemeldet als "{{ $store.state.account.username }}".</div>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color=""
                    text
                >
                    Einstellungen
                </v-btn>
                <v-btn
                    color="primary"
                    text
                    @click="$store.state.show_account = false; showWelcome = false;"
                >
                    Weiter
                </v-btn>
            </v-card-actions>
        </v-card>

        <!-- Registration -->
        <v-card v-if="!$store.state.signed_in && $store.state.show_account_registration">
            <v-form ref="signUp" v-model="signUpValid">
                <v-card-title class="headline grey lighten-4">
                    <v-icon class="mr-2">mdi-account-plus</v-icon>
                    Registrieren
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="username"
                                    label="Email oder Benutzername"
                                    :prepend-inner-icon="usernameIsEmail ? 'mdi-at' : 'mdi-account'"
                                    :rules="[rules.required]"
                                >
                                    <template v-slot:append-outer>
                                        <v-tooltip
                                            bottom
                                        >
                                            <template v-slot:activator="{ on }">
                                            <v-icon v-on="on">
                                                mdi-help-circle-outline
                                            </v-icon>
                                            </template>
                                            <section>
                                                Mit Hilfe der Email Adresse können Sie Ihr Passwort, falls Sie es vergessen haben, wiederherstellen.<br>
                                                Wenn sie keine Email Adresse eingeben, können Sie Konto nicht wiederherstellen.
                                            </section>
                                        </v-tooltip>
                                    </template>
                                </v-text-field>
                                <v-text-field
                                    v-model="passwordSignUp"
                                    :append-icon="showPasswordSignUp ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="showPasswordSignUp ? 'text' : 'password'"
                                    label="Passwort"
                                    prepend-inner-icon="mdi-key-variant"
                                    counter
                                    :rules="[
                                        rules.required,
                                        rules.min,
                                        rules.upperCase,
                                        rules.lowerCase,
                                    ]"
                                    @click:append="showPasswordSignUp = !showPasswordSignUp"
                                ></v-text-field>
                                <v-text-field
                                    v-model="passwordSignUpConfirm"
                                    :append-icon="showPasswordSignUp ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="showPasswordSignUp ? 'text' : 'password'"
                                    label="Passwort bestätigen"
                                    prepend-inner-icon="mdi-key-variant"
                                    counter
                                    :rules="[
                                        rules.required,
                                        rules.min,
                                        rules.upperCase,
                                        rules.lowerCase,
                                        () => passwordSignUp == passwordSignUpConfirm || 'Die Passwörter müssen übereinstimmen!'
                                    ]"
                                    @click:append="showPasswordSignUp = !showPasswordSignUp"
                                ></v-text-field>
                                <v-checkbox
                                    v-model="checkDataProtection"
                                    color="blue"
                                    hide-details
                                    :rules="[
                                        rules.required,
                                    ]"
                                    
                                >
                                    <template v-slot:label>
                                        <div>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                <a
                                                    target="_blank"
                                                    href="#"
                                                    @click.stop
                                                    v-on="on"
                                                >
                                                    Datenschutzerklärung
                                                </a>
                                                </template>
                                                Datenschutzerklärung öffnen
                                            </v-tooltip>
                                            zustimmen
                                        </div>
                                    </template>
                                </v-checkbox>
                            </v-col>
                            <v-col cols="12">
                                <v-btn
                                    color=""
                                    text
                                    @click="$refs.signUp.reset(); $store.state.show_account_registration = false"
                                >
                                    Zur Anmeldung
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color=""
                        text
                        @click="$refs.signUp.reset(); $store.state.show_account = false"
                    >
                        Abbrechen
                    </v-btn>
                    
                    <v-btn
                        color="blue darken-1"
                        text
                        @click="signUp"
                    >
                        Registrieren
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>

</template>

<script>
export default {
    data() {
        return {
            signInValid: false,
            signUpValid: false,
            username: '',
            passwordSignIn: '',
            passwordSignUp: '',
            passwordSignUpConfirm: '',
            remember_login: false,
            showPasswordSignIn: false,
            showPasswordSignUp: false,
            showWelcome: false,
            checkDataProtection: true,
            rules: {
                required: v => !!v || 'Dieses Feld muss ausgefüllt werden!',
                min: v => (v && v.length && v.length >= 8) || 'Das Passwort muss mehr als 7 Buchstaben haben!',
                upperCase: v => /[A-Z]/.test(v) || 'Das Passwort mindestens einen Großbuchstaben enthalten!',
                lowerCase: v => /[A-Z]/.test(v) || 'Das Passwort mindestens einen Kleinbuchstaben enthalten!',
            },
            errors: {
                invalidUser: false
            }
        }
    },
    methods:{
        async signIn() {
            this.$refs.signIn.validate()
            
            if (!this.signInValid)
                return;

            try {
                let r = await this.$axios({
                    method: 'POST', 
                    url: `/user`, 
                    baseURL: this.$store.state.backend.baseUrl,
                    data: {
                        user: {
                            username: this.username,
                            password: this.passwordSignIn,
                        },
                    }
                })

                console.log(r)

                this.showWelcome = true
                this.$store.dispatch('signIn', r.data)

                this.$refs.signIn.reset()
            }
            catch (error){
                if (error.response.status == 404)
                    this.errors.invalidUser = true
            }
        },
        async signUp() {
            this.$refs.signUp.validate()
            
            if (!this.signUpValid)
                return;

            try {
                let r = await this.$axios({
                    method: 'PUT', 
                    url: `/user`, 
                    baseURL: this.$store.state.backend.baseUrl,
                    data: {
                        user: {
                            username: this.username,
                            password: this.passwordSignUp,
                        },
                    }
                })

                console.log(r)

                this.$refs.signUp.reset()
            }
            catch (error){
                if (error.response.status == 404)
                    this.errors.invalidUser = true
            }
        },
        changePassword(){

        },
        logout() {

        }
    },

    computed: {
        usernameIsEmail() {
            return /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/.test(this.username)
        }
    }
}
</script>