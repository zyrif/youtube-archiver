<template>
    <v-container fill-height>
        <v-row
            align="self-end"
            dense
        >
            <v-col>
                <v-text-field
                    label="Youtube Playlist URL" 
                    outlined
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row
            align="self-start"
            dense
        >
            <v-spacer></v-spacer>
            <v-col
                style="text-align: center"
            >
                <v-btn
                    outlined 
                >
                    Check
                </v-btn>
            </v-col>
            <v-spacer></v-spacer>
        </v-row>
    </v-container>
</template>

<script>
export default {
    
}
</script>