<template>
    <div>
        <v-container
            v-if="notes != 'Failed'"
            fluid
            fill-height
            tag="div"
            justify-center
            align-start            
        > 
            <Note
                
                v-for="note in notes" 
                :key="note._id"

                :note="note"
                :noteEdited="note"
                :shared="true"

            />
        </v-container>
    </div>
</template>

<script>
import Note from "@/components/Note.vue"

export default {

    data () {
        return {
            notes: []
        }
    },
    methods: {
        async shared() {
            try {
                let r = await this.$axios({method: 'GET', url: `/share?_id=${new URLSearchParams(window.location.search).get('_id')}`, baseURL: this.$store.state.backend.baseUrl})
                this.notes = r.data.notes
            }
            catch (error) {
                this.notes = 'Failed'
            }
        }
    },
    created() {
        this.shared()
    },

    components: {
        Note,
    }
}
</script>

<style>

</style>