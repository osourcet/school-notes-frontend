<template>
    <v-dialog
      v-model="$store.state.show_account"
      persistent
      max-width="600px"
    >

        <!-- Sign in -->
        <v-card v-if="!$store.state.signed_in && !$store.state.show_account_registration">
            <v-card-title class="headline grey lighten-4">
                <v-icon class="mr-2">mdi-login</v-icon>
                Anmelden
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                v-model="email"
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
                        </v-col>
                        <v-col cols="12">
                            <v-checkbox
                                v-model="remember_login"
                                label="Angemeldet bleiben"
                                color="blue"
                                hide-details
                            ></v-checkbox>
                        </v-col>
                        <v-col cols="12">
                            <v-btn
                                class="mt-2"
                                color=""
                                text
                                @click="$store.state.show_show_account_registration = true"
                            >
                                Passwort vergessen
                            </v-btn>
                            <v-btn
                                class="mt-2"
                                color=""
                                text
                                @click="$store.state.show_account_registration = true"
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
                    @click="$store.state.show_account = false"
                >
                    Abbrechen
                </v-btn>
                
                
                <v-btn
                    color="blue darken-1"
                    text
                    @click="$store.state.show_account = false"
                >
                    Anmelden
                </v-btn>
            </v-card-actions>
        </v-card>

        <!-- Registration -->
        <v-card v-if="!$store.state.signed_in && $store.state.show_account_registration">
            <v-card-title class="headline grey lighten-4">
                <v-icon class="mr-2">mdi-account-plus</v-icon>
                Registrieren
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                v-model="email"
                                label="Email oder Benutzername"
                                prepend-inner-icon="mdi-account"
                                :rules="[rules.required]"
                            ></v-text-field>
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
                        </v-col>
                        <v-col cols="12">
                            <v-btn
                                color=""
                                text
                                @click="$store.state.show_account_registration = false"
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
                    @click="$store.state.show_account = false"
                >
                    Abbrechen
                </v-btn>
                
                <v-btn
                    color="blue darken-1"
                    text
                    @click="$store.state.show_account = false"
                >
                    Registrieren
                </v-btn>
            </v-card-actions>
        </v-card>

        <!-- Usersettings -->
        <v-card v-if="$store.state.signed_in">
            <v-card-title class="headline grey lighten-4">
                <v-icon class="mr-2">mdi-account-settings</v-icon>
                Benutzereinstellungen
            </v-card-title>
            <v-card-text>
                <v-container>
                    
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color=""
                    text
                    @click="$store.state.show_account = false"
                >
                    Schließen
                </v-btn>
                <v-btn
                    color="red darken-1"
                    text
                    @click="$store.state.show_account = false"
                >
                    Abmelden
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>

<script>
export default {
    data() {
        return {
            email: '',
            passwordSignIn: '',
            passwordSignUp: '',
            passwordSignUpConfirm: '',
            remember_login: false,
            showPasswordSignIn: false,
            showPasswordSignUp: false,
            rules: {
                required: v => !!v || 'Dieses Feld muss ausgefüllt werden!',
                min: v => v.length >= 8 || 'Das Passwort muss mehr als 7 Buchstaben haben!',
                upperCase: v => /[A-Z]/.test(v) || 'Das Passwort mindestens einen Großbuchstaben enthalten!',
                lowerCase: v => /[A-Z]/.test(v) || 'Das Passwort mindestens einen Kleinbuchstaben enthalten!',
            
            }
        }
    },
    methods:{
        login() {
            console.log(`to Server: ${this.email} ${this.username} `);
        },
        register() {

        },
        changePassword(){

        },
        logout() {

        }
    }
}
</script>